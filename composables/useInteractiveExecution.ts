import { io, Socket } from 'socket.io-client'

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
    executionTime: 0
  })

  // Conectar al WebSocket
  const connect = () => {
    if (socket.value?.connected) return

    socket.value = io({
      path: '/api/websocket',
      transports: ['websocket']
    })

    // Manejar conexión
    socket.value.on('connect', () => {
      console.log('Conectado al WebSocket')
    })

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
    socket.value.on('execution_complete', (data: { exitCode: number, success: boolean, executionTime: number }) => {
      state.isExecuting = false
      state.isWaitingForInput = false
      state.executionTime = data.executionTime
      
      if (!data.success && data.exitCode !== 0) {
        state.error += `\nProceso terminado con código de salida: ${data.exitCode}`
      }
    })

    // Manejar desconexión
    socket.value.on('disconnect', () => {
      console.log('Desconectado del WebSocket')
      state.isExecuting = false
      state.isWaitingForInput = false
    })
  }

  // Ejecutar código
  const executeCode = (code: string, timeout = 30) => {
    if (!socket.value?.connected) {
      connect()
    }

    // Limpiar estado anterior
    state.output = ''
    state.error = ''
    state.isExecuting = true
    state.isWaitingForInput = false
    state.inputPrompt = ''
    state.executionTime = 0

    // Enviar código para ejecutar
    socket.value?.emit('execute', {
      type: 'execute',
      code,
      timeout
    })
  }

  // Enviar input del usuario
  const sendUserInput = (input: string) => {
    if (socket.value?.connected && state.isWaitingForInput) {
      socket.value.emit('user_input', {
        type: 'input',
        value: input
      })
      
      // Agregar el input al output para mostrarlo
      state.output += input + '\n'
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
    disconnect
  }
}