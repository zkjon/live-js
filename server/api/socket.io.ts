import { Server } from 'socket.io'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

let io: Server
const activeProcesses = new Map<string, any>()
const tempFiles = new Map<string, string>()

export default defineEventHandler(async (event) => {
	if (!io) {
		// @ts-ignore
		io = new Server(event.node.res.socket?.server, {
			path: '/api/socket.io',
			cors: {
				origin: '*',
				methods: ['GET', 'POST'],
			},
		})

		io.on('connection', (socket) => {
			console.log('Client connected:', socket.id)

			socket.on('execute', async (data: { code: string; timeout?: number }) => {
				const { code, timeout = 30 } = data

				if (!code || typeof code !== 'string') {
					socket.emit('error', { message: 'No code to execute' })
					return
				}

				try {
					// Create temporary file
					const tempFileName = `temp_${randomUUID()}.py`
					const tempFilePath = join(process.cwd(), tempFileName)
					tempFiles.set(socket.id, tempFilePath)

					// Create modified Python code to handle interactive input
					const modifiedCode = `
import sys
import json

# Save reference to original input
original_input = input

# Replace built-in input
def input(prompt=''):
    print(f"__INPUT_REQUEST__{prompt}__INPUT_REQUEST__", flush=True)
    return original_input()

# User code
${code}
`

					writeFileSync(tempFilePath, modifiedCode)

					// Execute Python
					const pythonProcess = spawn('python', [tempFilePath], {
						stdio: ['pipe', 'pipe', 'pipe'],
					})

					activeProcesses.set(socket.id, pythonProcess)

					// Handle output
					pythonProcess.stdout.on('data', (data) => {
						const output = data.toString()

						// Detect input request
						if (output.includes('__INPUT_REQUEST__')) {
							const match = output.match(/__INPUT_REQUEST__(.*)__INPUT_REQUEST__/)
							if (match) {
								const prompt = match[1]
								socket.emit('input_request', { prompt })
								return
							}
						}

						// Send normal output
						socket.emit('output', { data: output })
					})

					// Handle errors
					pythonProcess.stderr.on('data', (data) => {
						socket.emit('error', { message: data.toString() })
					})

					// Handle completion
					pythonProcess.on('close', (code) => {
						socket.emit('execution_complete', {
							exitCode: code,
							success: code === 0,
							executionTime: Date.now(),
						})

						// Clean up
						activeProcesses.delete(socket.id)
						const tempFile = tempFiles.get(socket.id)
						if (tempFile) {
							try {
								unlinkSync(tempFile)
							} catch (e) {
								console.error('Error cleaning temp file:', e)
							}
							tempFiles.delete(socket.id)
						}
					})

					// Set timeout
					setTimeout(() => {
						if (activeProcesses.has(socket.id)) {
							pythonProcess.kill('SIGTERM')
							socket.emit('error', { message: 'Timeout: Code took too long to execute' })
						}
					}, timeout * 1000)
				} catch (error: unknown) {
					const err = error as Error
					socket.emit('error', { message: `System error: ${err.message}` })
				}
			})

			// Handle user input
			socket.on('user_input', (data: { value: string }) => {
				const process = activeProcesses.get(socket.id)
				if (process && process.stdin) {
					process.stdin.write(data.value + '\n')
				}
			})

			// Handle disconnect
			socket.on('disconnect', () => {
				console.log('Client disconnected:', socket.id)

				// Kill active process
				const process = activeProcesses.get(socket.id)
				if (process) {
					process.kill('SIGTERM')
					activeProcesses.delete(socket.id)
				}

				// Clean up temp file
				const tempFile = tempFiles.get(socket.id)
				if (tempFile) {
					try {
						unlinkSync(tempFile)
					} catch (e) {
						console.error('Error cleaning temp file on disconnect:', e)
					}
					tempFiles.delete(socket.id)
				}
			})
		})
	}

	return 'Socket.IO server initialized'
})