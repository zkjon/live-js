export interface ExecutionResult {
	success: boolean
	output: string
	error: string
	execution_time: number
}

export interface CodeSnippet {
	id?: string
	title: string
	code: string
	share_token?: string
}

export const useCodeExecution = () => {
	const isExecuting = ref(false)
	const output = ref('')
	const error = ref('')
	const executionTime = ref<number | null>(null)

	// Ejecutar código JavaScript
	const executeCode = async (code: string, timeout: number = 10): Promise<ExecutionResult> => {
		if (!code.trim()) {
			throw new Error('No hay código para ejecutar')
		}

		isExecuting.value = true
		output.value = ''
		error.value = ''
		executionTime.value = null

		try {
			const response = await $fetch<ExecutionResult>('/api/execute', {
				method: 'POST',
				body: {
					code,
					timeout,
				},
			})

			output.value = response.output
			error.value = response.error
			executionTime.value = response.execution_time

			return response
		} catch (err: unknown) {
			const error = err as Error & { data?: { message?: string } }
			const errorMessage =
				error.data?.message || error.message || 'Error desconocido al ejecutar el código'
			error.value = errorMessage as string

			return {
				success: false,
				output: '',
				error: errorMessage,
				execution_time: 0,
			}
		} finally {
			isExecuting.value = false
		}
	}

	// Guardar código
	const saveCode = async (
		code: string,
		title: string = 'Untitled'
	): Promise<{ id: string; share_url: string }> => {
		try {
			const response = await $fetch<{ id: string; share_url: string }>('/api/save', {
				method: 'POST',
				body: {
					code,
					title,
				},
			})

			return response
		} catch (err: unknown) {
			const error = err as Error & { data?: { message?: string } }
			throw new Error(error.data?.message || error.message || 'Error al guardar el código')
		}
	}

	// Cargar código compartido
	const loadSharedCode = async (shareToken: string): Promise<CodeSnippet> => {
		try {
			const response = await $fetch<CodeSnippet>(`/api/share/${shareToken}`)
			return response
		} catch (err: unknown) {
			const error = err as Error & { data?: { message?: string } }
			throw new Error(
				error.data?.message || error.message || 'Error al cargar el código compartido'
			)
		}
	}

	// Limpiar output
	const clearOutput = () => {
		output.value = ''
		error.value = ''
		executionTime.value = null
	}

	// WebSocket para ejecución en tiempo real (para futuras implementaciones)
	const connectWebSocket = () => {
		// TODO: Implementar WebSocket para ejecución en tiempo real
		// const ws = new WebSocket('ws://localhost:3000/ws/execute')
		// return ws
	}

	return {
		// Estado reactivo
		isExecuting: readonly(isExecuting),
		output: readonly(output),
		error: readonly(error),
		executionTime: readonly(executionTime),

		// Métodos
		executeCode,
		saveCode,
		loadSharedCode,
		clearOutput,
		connectWebSocket,
	}
}
