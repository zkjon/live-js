interface ExecutionState {
	isExecuting: boolean
	output: string
	error: string
	executionTime: number
}

export const useInteractiveExecution = () => {
	// Estado reactivo (sin WebSocket)
	const state = reactive<ExecutionState>({
		isExecuting: false,
		output: '',
		error: '',
		executionTime: 0,
	})

	// Ejecutar código con API REST
	const executeCode = async (code: string, timeout = 30) => {
		// Limpiar estado anterior
		state.output = ''
		state.error = ''
		state.isExecuting = true
		state.executionTime = 0

		try {
			const response = await $fetch<{
				success: boolean
				output?: string
				error?: string
				executionTime: number
			}>('/api/execute', {
				method: 'POST',
				body: {
					code,
					timeout,
				},
			})

			if (response.success) {
				state.output = response.output || ''
				state.error = ''
			} else {
				state.output = ''
				state.error = response.error || 'Error desconocido'
			}

			state.isExecuting = false
			state.executionTime = response.executionTime || 0
		} catch (error: unknown) {
			const err = error as Error
			state.error = err.message || 'Error de ejecución'
			state.isExecuting = false
		}
	}

	// Limpiar output
	const clearOutput = () => {
		state.output = ''
		state.error = ''
		state.executionTime = 0
	}

	return {
		// Estado
		...toRefs(state),

		// Métodos
		executeCode,
		clearOutput,
	}
}
