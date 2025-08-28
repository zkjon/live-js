export default defineNuxtPlugin(() => {
	// Inicializar tema lo antes posible para evitar flash
	const initThemeEarly = () => {
		try {
			const savedTheme = localStorage.getItem('theme') || 'auto'

			const getSystemTheme = () => {
				if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
					return 'dark'
				}
				return 'light'
			}

			const effectiveTheme = savedTheme === 'auto' ? getSystemTheme() : savedTheme

			if (effectiveTheme === 'dark') {
				document.documentElement.classList.add('dark')
			} else {
				document.documentElement.classList.remove('dark')
			}

			// Establecer meta theme-color
			const metaThemeColor = document.querySelector('meta[name="theme-color"]')
			const color = effectiveTheme === 'dark' ? '#111827' : '#ffffff'

			if (metaThemeColor) {
				metaThemeColor.setAttribute('content', color)
			} else {
				const meta = document.createElement('meta')
				meta.name = 'theme-color'
				meta.content = color
				document.head.appendChild(meta)
			}
		} catch (error) {
			console.warn('Error al inicializar tema:', error)
			// Fallback a tema claro
			document.documentElement.classList.remove('dark')
		}
	}

	// Ejecutar inmediatamente
	initThemeEarly()

	// Prevenir flash de contenido sin estilo
	const style = document.createElement('style')
	style.textContent = `
    * {
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    }
    
    /* Ocultar contenido hasta que el tema esté listo */
    .theme-loading {
      visibility: hidden;
    }
  `
	document.head.appendChild(style)

	// Remover clase de carga después de un breve delay
	setTimeout(() => {
		document.body.classList.remove('theme-loading')
	}, 50)
})
