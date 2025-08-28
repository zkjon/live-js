import { io, type Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

interface ExecutionResult {
	type: 'result' | 'error' | 'output' | 'complete'
	data: string
	executionTime?: number
	sessionId: string
}

interface UseWebSocketReturn {
	isConnected: Ref<boolean>
	isExecuting: Ref<boolean>
	executeCode: (code: string) => Promise<{ output: string; error: string; executionTime: number }>
	cancelExecution: () => void
	connect: () => void
	disconnect: () => void
}

export const useWebSocket = (): UseWebSocketReturn => {
	const socket = ref<Socket | null>(null)
	const isConnected = ref(false)
	const isExecuting = ref(false)
	const currentSessionId = ref<string | null>(null)

	// Resultados de ejecución
	const executionOutput = ref('')
	const executionError = ref('')
	const executionTime = ref(0)

	// Promesa para manejar la ejecución asíncrona
	let executionResolver:
		| ((result: { output: string; error: string; executionTime: number }) => void)
		| null = null
	let executionRejecter: ((error: Error) => void) | null = null

	const connect = () => {
		if (socket.value?.connected) return

		try {
			// Crear conexión Socket.IO
			socket.value = io({
				path: '/api/websocket',
				transports: ['websocket', 'polling'],
				upgrade: true,
				rememberUpgrade: true,
			})

			// Manejar conexión exitosa
			socket.value.on('connect', () => {
				console.log('WebSocket conectado')
				isConnected.value = true
			})

			// Manejar desconexión
			socket.value.on('disconnect', (reason) => {
				console.log('WebSocket desconectado:', reason)
				isConnected.value = false
				isExecuting.value = false

				// Rechazar ejecución pendiente si existe
				if (executionRejecter) {
					executionRejecter(new Error('Conexión perdida'))
					executionRejecter = null
					executionResolver = null
				}
			})

			// Manejar resultados de ejecución
			socket.value.on('result', (result: ExecutionResult) => {
				if (result.sessionId !== currentSessionId.value) return

				switch (result.type) {
					case 'output':
						executionOutput.value += result.data
						break

					case 'error':
						executionError.value += result.data
						break

					case 'complete':
						isExecuting.value = false

						if (executionResolver) {
							executionResolver({
								output: executionOutput.value,
								error: executionError.value,
								executionTime: result.executionTime || 0,
							})
							executionResolver = null
							executionRejecter = null
						}
						break
				}
			})

			// Manejar errores de conexión
			socket.value.on('connect_error', (error) => {
				console.error('Error de conexión WebSocket:', error)
				isConnected.value = false

				if (executionRejecter) {
					executionRejecter(new Error(`Error de conexión: ${error.message}`))
					executionRejecter = null
					executionResolver = null
				}
			})
		} catch (error) {
			console.error('Error al crear conexión WebSocket:', error)
		}
	}

	const disconnect = () => {
		if (socket.value) {
			socket.value.disconnect()
			socket.value = null
		}
		isConnected.value = false
		isExecuting.value = false
	}

	const executeCode = (
		code: string
	): Promise<{ output: string; error: string; executionTime: number }> => {
		return new Promise((resolve, reject) => {
			if (!socket.value?.connected) {
				reject(new Error('WebSocket no está conectado'))
				return
			}

			if (isExecuting.value) {
				reject(new Error('Ya hay una ejecución en progreso'))
				return
			}

			// Limpiar resultados anteriores
			executionOutput.value = ''
			executionError.value = ''
			executionTime.value = 0

			// Configurar estado de ejecución
			isExecuting.value = true
			currentSessionId.value = uuidv4()

			// Configurar resolvers
			executionResolver = resolve
			executionRejecter = reject

			// Enviar código para ejecutar
			socket.value.emit('execute', {
				type: 'execute',
				code,
				sessionId: currentSessionId.value,
			})

			// Timeout de seguridad (35 segundos)
			setTimeout(() => {
				if (isExecuting.value && executionRejecter) {
					isExecuting.value = false
					executionRejecter(new Error('Timeout: La ejecución tardó demasiado'))
					executionRejecter = null
					executionResolver = null
				}
			}, 35000)
		})
	}

	const cancelExecution = () => {
		if (socket.value?.connected && currentSessionId.value && isExecuting.value) {
			socket.value.emit('cancel', currentSessionId.value)
			isExecuting.value = false

			if (executionRejecter) {
				executionRejecter(new Error('Ejecución cancelada'))
				executionRejecter = null
				executionResolver = null
			}
		}
	}

	// Auto-conectar cuando se monta el composable
	onMounted(() => {
		connect()
	})

	// Desconectar cuando se desmonta
	onUnmounted(() => {
		disconnect()
	})

	// Reconectar automáticamente si se pierde la conexión
	watch(isConnected, (connected) => {
		if (!connected && process.client) {
			setTimeout(() => {
				if (!isConnected.value) {
					console.log('Intentando reconectar WebSocket...')
					connect()
				}
			}, 3000)
		}
	})

	return {
		isConnected: readonly(isConnected),
		isExecuting: readonly(isExecuting),
		executeCode,
		cancelExecution,
		connect,
		disconnect,
	}
}
