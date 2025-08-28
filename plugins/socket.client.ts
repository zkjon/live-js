import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
	// Solo en el cliente
	if (process.client) {
		// Configurar Socket.IO globalmente
		const socket = io({
			path: '/api/websocket',
			transports: ['websocket', 'polling'],
			timeout: 10000,
			autoConnect: false,
		})

		// Hacer disponible globalmente
		return {
			provide: {
				socket,
			},
		}
	}
})