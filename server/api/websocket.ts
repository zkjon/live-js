import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Server } from 'socket.io'

// Interfaz para los mensajes de WebSocket
interface ExecutionMessage {
	type: 'execute'
	code: string
	timeout?: number
}

interface InputMessage {
	type: 'input'
	value: string
}

// Mapa para almacenar procesos activos por socket
const activeProcesses = new Map<string, any>()
const tempFiles = new Map<string, string>()

export default defineEventHandler(async (event) => {
	// Verificar si es una solicitud de WebSocket
	if (event.node.req.method === 'GET') {
		return { status: 'WebSocket server ready', path: '/api/websocket' }
	}

	// Solo manejar conexiones WebSocket
	if (!event.node.req.headers.upgrade) {
		return { error: 'WebSocket connection required' }
	}

	// Configurar Socket.IO server
	const io = new Server(event.node.res.socket?.server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
		path: '/api/websocket',
	})

	io.on('connection', (socket) => {
		console.log('Cliente conectado:', socket.id)

		// Manejar ejecución de código
		socket.on('execute', async (message: ExecutionMessage) => {
			const { code, timeout = 30 } = message
			const startTime = Date.now()

			try {
				// Limpiar proceso anterior si existe
				if (activeProcesses.has(socket.id)) {
					const oldProcess = activeProcesses.get(socket.id)
					if (oldProcess && !oldProcess.killed) {
						oldProcess.kill('SIGTERM')
					}
					activeProcesses.delete(socket.id)
				}

				// Limpiar archivo temporal anterior
				if (tempFiles.has(socket.id)) {
					const oldFile = tempFiles.get(socket.id)
					try {
						unlinkSync(oldFile)
					} catch (_e) {
						// Ignorar errores de limpieza
					}
					tempFiles.delete(socket.id)
				}

				// Validate code
				if (!code || code.trim().length === 0) {
					socket.emit('error', {
						message: 'No code to execute',
					})
					return
				}

				// Create temporary file
				const tempFileName = `temp_${randomUUID()}.py`
				const tempFilePath = join(process.cwd(), tempFileName)
				tempFiles.set(socket.id, tempFilePath)

				// Create modified Python code to handle interactive input
				const interactiveCode = `
import sys
import json
import builtins

# Save reference to original input
original_input = builtins.input

def interactive_input(prompt=""):
    print(f"__INPUT_REQUEST__{json.dumps({"prompt": prompt})}__INPUT_REQUEST__", flush=True)
    return original_input()

# Replace built-in input
builtins.input = interactive_input

# User code
${code}
`

				writeFileSync(tempFilePath, interactiveCode)

				// Execute Python
				const pythonProcess = spawn('python', ['-u', tempFilePath], {
					stdio: ['pipe', 'pipe', 'pipe'],
				})

				activeProcesses.set(socket.id, pythonProcess)

				let outputBuffer = ''

				// Handle output
				pythonProcess.stdout.on('data', (data: Buffer) => {
					const output = data.toString()
					outputBuffer += output

					// Detect input request
					const inputRequestMatch = output.match(/__INPUT_REQUEST__(.+?)__INPUT_REQUEST__/)
					if (inputRequestMatch) {
						try {
							const requestData = JSON.parse(inputRequestMatch[1])
							socket.emit('input_request', { prompt: requestData.prompt })
							// Clean the marker from output
							outputBuffer = outputBuffer.replace(/__INPUT_REQUEST__.+?__INPUT_REQUEST__/, '')
						} catch (e) {
							console.error('Error parsing input request:', e)
						}
					} else {
						// Send normal output
						socket.emit('output', { data: output })
					}
				})

				// Handle errors
				pythonProcess.stderr.on('data', (data: Buffer) => {
					socket.emit('error', { message: data.toString() })
				})

				// Handle completion
				pythonProcess.on('close', (code: number) => {
					const executionTime = Date.now() - startTime
					socket.emit('execution_complete', {
						exitCode: code,
						success: code === 0,
						executionTime,
					})

					// Clean up
					activeProcesses.delete(socket.id)
					if (tempFiles.has(socket.id)) {
						const tempFile = tempFiles.get(socket.id)
						try {
							unlinkSync(tempFile!)
						} catch (e) {
							console.error('Error cleaning temp file:', e)
						}
						tempFiles.delete(socket.id)
					}
				})

				// Timeout
				setTimeout(() => {
					if (activeProcesses.has(socket.id)) {
						const process = activeProcesses.get(socket.id)
						if (process && !process.killed) {
							process.kill('SIGTERM')
							socket.emit('error', { message: 'Timeout: Code took too long to execute' })
						}
					}
				}, timeout * 1000)
			} catch (error: any) {
				socket.emit('error', { message: `System error: ${error.message}` })
			}
		})

		// Handle user input
		socket.on('user_input', (data: InputMessage) => {
			if (activeProcesses.has(socket.id)) {
				const process = activeProcesses.get(socket.id)
				if (process?.stdin && !process.killed) {
					process.stdin.write(`${data.value}\n`)
				}
			}
		})

		// Handle disconnection
		socket.on('disconnect', () => {
			console.log('Client disconnected:', socket.id)

			// Clean up process if exists
			if (activeProcesses.has(socket.id)) {
				const process = activeProcesses.get(socket.id)
				if (process && !process.killed) {
					process.kill('SIGTERM')
				}
				activeProcesses.delete(socket.id)
			}

			// Clean up temporary file
			if (tempFiles.has(socket.id)) {
				const tempFile = tempFiles.get(socket.id)
				try {
					unlinkSync(tempFile!)
				} catch (e) {
					console.error('Error cleaning temp file on disconnect:', e)
				}
				tempFiles.delete(socket.id)
			}
		})
	})

	return { message: 'WebSocket server initialized' }
})
