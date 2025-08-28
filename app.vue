<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Global application configuration
useHead({
	htmlAttrs: {
		lang: 'en',
	},
	meta: [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ name: 'format-detection', content: 'telephone=no' },
	],
})

// SEO por defecto
useSeoMeta({
	title: 'Live JS - Editor de código JavaScript en línea',
	description:
		'Editor de código JavaScript en tiempo real con ejecución instantánea. Escribe, ejecuta y comparte código JavaScript directamente en tu navegador.',
	ogTitle: 'Live JS - Editor de código JavaScript en línea',
	ogDescription:
		'Editor de código JavaScript en tiempo real con ejecución instantánea. Escribe, ejecuta y comparte código JavaScript directamente en tu navegador.',
	ogImage: '/og-image.png',
	ogType: 'website',
	twitterCard: 'summary_large_image',
	twitterTitle: 'Live JS - Editor de código JavaScript en línea',
	twitterDescription: 'Editor de código JavaScript en tiempo real con ejecución instantánea.',
	twitterImage: 'https://live-javascript.vercel.app/og-image.png',
})

// Configuración de tema por defecto
onMounted(() => {
	// Cargar configuración guardada del usuario
	const savedSettings = localStorage.getItem('live-js-settings')
	if (savedSettings) {
		try {
			const settings = JSON.parse(savedSettings)

			// Aplicar tema
			if (settings.theme === 'dark') {
				document.documentElement.classList.add('dark')
			} else {
				document.documentElement.classList.remove('dark')
			}

			// Aplicar otras configuraciones globales si es necesario
		} catch (error) {
			console.error('Error al cargar configuración:', error)
		}
	}

	// Detectar preferencia de tema del sistema si no hay configuración guardada
	if (!savedSettings) {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
		if (prefersDark) {
			document.documentElement.classList.add('dark')
		}
	}
})
</script>

<style>
@reference "tailwindcss";

/* Estilos globales adicionales */
#app {
  min-height: 100vh;
}

/* Scrollbar personalizada para toda la aplicación */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Modo oscuro para scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Transiciones suaves para cambios de tema */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Estilos para elementos de carga */
.loading-spinner {
  @apply rounded-full border-2 border-gray-300 border-t-green-600;
  animation: var(--animate-spin);
}

/* Estilos para notificaciones toast (si se implementan) */
.toast {
  @apply fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg;
}

.toast-success {
  @apply bg-green-100 border border-green-200 text-green-800;
}

.toast-error {
  @apply bg-red-100 border border-red-200 text-red-800;
}

.toast-warning {
  @apply bg-yellow-100 border border-yellow-200 text-yellow-800;
}

.toast-info {
  @apply bg-blue-100 border border-blue-200 text-blue-800;
}

/* Estilos para elementos de enfoque accesibles */
.focus-visible {
  @apply outline-none ring-2 ring-green-500 ring-offset-2;
}

/* Estilos para elementos deshabilitados */
.disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Animaciones personalizadas */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Responsive utilities adicionales */
@media (max-width: 640px) {
  .mobile-hidden {
    display: none;
  }
}

@media (min-width: 641px) {
  .mobile-only {
    display: none;
  }
}
</style>