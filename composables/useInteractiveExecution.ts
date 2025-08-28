import { io, type Socket } from 'socket.io-client'

interface ExecutionState {
	isExecuting: boolean
	output: string
	error: string
	isWaitingForInput: boolean
	inputPrompt: string
	executionTime: number
}

export const useInteractiveExecution = () => {
	const socket = ref<Socket | null>(null)
	const state = reactive<ExecutionState>({
		isExecuting: false,
		output: '',
		error: '',
		isWaitingForInput: false,
		inputPrompt: '',
		executionTime: 0,
	})

	// Detectar si estamos en producción (Vercel)
	const isProduction = process.env.NODE_ENV === 'production'
	const supportsWebSockets = !isProduction

	// Conectar al WebSocket (solo en desarrollo)
	const connect = () => {
		if (!supportsWebSockets) {
			console.warn('WebSockets not supported in production. Using fallback API.')
			return
		}

		if (socket.value?.connected) return

		try {
			socket.value = io({
				path: '/api/websocket',
				transports: ['websocket'],
				timeout: 5000,
				forceNew: true,
			})

			// Manejar conexión
			socket.value.on('connect', () => {
				console.log('Connected to WebSocket')
			})

			// Manejar error de conexión
			socket.value.on('connect_error', (error) => {
				console.error('WebSocket connection failed:', error)
				state.error = 'WebSocket connection failed. Using fallback mode.'
			})
		} catch (error) {
			console.error('Failed to initialize WebSocket:', error)
		}

		// Manejar output
		socket.value.on('output', (data: { data: string }) => {
			state.output += data.data
		})

		// Manejar errores
		socket.value.on('error', (data: { message: string }) => {
			state.error += data.message + '\n'
			state.isExecuting = false
			state.isWaitingForInput = false
		})

		// Manejar solicitud de input
		socket.value.on('input_request', (data: { prompt: string }) => {
			state.isWaitingForInput = true
			state.inputPrompt = data.prompt
		})

		// Manejar finalización
		socket.value.on(
			'execution_complete',
			(data: { exitCode: number; success: boolean; executionTime: number }) => {
				state.isExecuting = false
				state.isWaitingForInput = false
				state.executionTime = data.executionTime

				if (!data.success && data.exitCode !== 0) {
					state.error += `\nProcess terminated with exit code: ${data.exitCode}`
				}
			}
		)

		// Manejar desconexión
		socket.value.on('disconnect', () => {
			console.log('Disconnected from WebSocket')
			state.isExecuting = false
			state.isWaitingForInput = false
		})
	}

	// Ejecutar código usando API REST (fallback)
	const executeCodeWithAPI = async (code: string, timeout = 30) => {
		try {
			const response = await $fetch('/api/execute', {
				method: 'POST',
				body: {
					code,
					timeout: timeout, // Keep in seconds for API
				},
			})

			if (response.output) {
				state.output = response.output
			}
			if (response.error) {
				state.error = response.error
			}

			state.isExecuting = false
			state.executionTime = response.executionTime || 0
		} catch (error: any) {
			state.error = error.message || 'Execution failed'
			state.isExecuting = false
		}
	}

	// Ejecutar código
	const executeCode = (code: string, timeout = 30) => {
		// Limpiar estado anterior
		state.output = ''
		state.error = ''
		state.isExecuting = true
		state.isWaitingForInput = false
		state.inputPrompt = ''
		state.executionTime = 0

		if (supportsWebSockets) {
			// Usar WebSockets en desarrollo
			if (!socket.value?.connected) {
				connect()
			}

			socket.value?.emit('execute', {
				type: 'execute',
				code,
				timeout,
			})
		} else {
			// Usar API REST en producción
			executeCodeWithAPI(code, timeout)
		}
	}

	// Enviar input del usuario
	const sendUserInput = (input: string) => {
		if (supportsWebSockets && socket.value?.connected && state.isWaitingForInput) {
			socket.value.emit('user_input', {
				type: 'input',
				value: input,
			})

			// Agregar el input al output para mostrarlo
			state.output += input + '\n'
			state.isWaitingForInput = false
			state.inputPrompt = ''
		} else if (!supportsWebSockets) {
			// En producción, mostrar mensaje informativo
			state.output += `Input: ${input}\n`
			state.output += 'Note: Interactive input() is not supported in production deployment.\n'
			state.isWaitingForInput = false
			state.inputPrompt = ''
		}
	}

	// Limpiar output
	const clearOutput = () => {
		state.output = ''
		state.error = ''
		state.executionTime = 0
	}

	// Desconectar
	const disconnect = () => {
		if (socket.value?.connected) {
			socket.value.disconnect()
		}
		socket.value = null
	}

	// Limpiar al desmontar
	onUnmounted(() => {
		disconnect()
	})

	return {
		// Estado
		isExecuting: readonly(toRef(state, 'isExecuting')),
		output: readonly(toRef(state, 'output')),
		error: readonly(toRef(state, 'error')),
		isWaitingForInput: readonly(toRef(state, 'isWaitingForInput')),
		inputPrompt: readonly(toRef(state, 'inputPrompt')),
		executionTime: readonly(toRef(state, 'executionTime')),

		// Métodos
		connect,
		executeCode,
		sendUserInput,
		clearOutput,
		disconnect,
	}
}
