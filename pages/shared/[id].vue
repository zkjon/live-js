<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando código compartido...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md mx-4">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Código no encontrado</h1>
        <p class="text-gray-600 mb-6">{{ error.statusMessage || 'El código que buscas no existe o ha sido eliminado.' }}</p>
        <NuxtLink 
          to="/"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver al editor
        </NuxtLink>
      </div>
    </div>
    
    <!-- Success State -->
    <div v-else-if="data" class="min-h-screen">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-4 py-3">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span class="font-medium">Live JS</span>
            </NuxtLink>
            <div class="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 class="font-semibold text-gray-900">{{ data.title }}</h1>
              <p class="text-sm text-gray-500">
                Compartido el {{ formatDate(data.created_at) }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              @click="copyCode"
              class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center gap-2 text-sm"
              :class="{ 'bg-green-100 text-green-700': copied }"
            >
              <ClipboardDocumentIcon v-if="!copied" class="w-4 h-4" />
              <CheckIcon v-else class="w-4 h-4" />
              {{ copied ? 'Copiado!' : 'Copiar código' }}
            </button>
            
            <button 
              @click="openInEditor"
              class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2 text-sm"
            >
              <PencilIcon class="w-4 h-4" />
              Abrir en editor
            </button>
          </div>
        </div>
      </header>
      
      <!-- Code Display -->
      <main class="max-w-7xl mx-auto p-4">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="ml-2 text-sm text-gray-600 font-mono">main.py</span>
            </div>
            <div class="text-sm text-gray-500">
              {{ data.code.split('\n').length }} líneas
            </div>
          </div>
          
          <div class="relative">
            <pre class="p-4 text-sm font-mono text-gray-800 overflow-x-auto bg-white"><code>{{ data.code }}</code></pre>
            
            <!-- Copy button overlay -->
            <button 
              @click="copyCode"
              class="absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-75 hover:bg-opacity-90 text-white rounded transition-all opacity-0 hover:opacity-100 focus:opacity-100"
              title="Copiar código"
            >
              <ClipboardDocumentIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="mt-6 flex items-center justify-center gap-4">
          <button 
            @click="openInEditor"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <PencilIcon class="w-5 h-5" />
            Editar este código
          </button>
          
          <NuxtLink 
            to="/"
            class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <PlusIcon class="w-5 h-5" />
            Crear nuevo código
          </NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Obtener ID de la ruta
const route = useRoute()
const id = route.params.id as string

// Cargar datos del código
const { data, error } = await useFetch(`/api/load/${id}`)

// Estado reactivo
const copied = ref(false)

// Meta tags dinámicos
if (data.value) {
	useSeoMeta({
		title: `${data.value.title} - Live JS`,
		description: `Código JavaScript compartido: ${data.value.title}`,
		ogTitle: `${data.value.title} - Live JS`,
		ogDescription: `Código JavaScript compartido: ${data.value.title}`,
		ogType: 'article',
		twitterCard: 'summary',
	})
}

// Formatear fecha
const _formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

// Copiar código al portapapeles
const _copyCode = async () => {
	if (!data.value) return

	try {
		await navigator.clipboard.writeText(data.value.code)
		copied.value = true

		setTimeout(() => {
			copied.value = false
		}, 2000)
	} catch (error) {
		console.error('Error al copiar código:', error)
	}
}

// Abrir en el editor principal
const _openInEditor = () => {
	if (!data.value) return

	// Guardar código en localStorage para que el editor principal lo cargue
	localStorage.setItem(
		'shared_code',
		JSON.stringify({
			code: data.value.code,
			title: data.value.title,
			shared_id: data.value.id,
		})
	)

	// Navegar al editor principal
	navigateTo('/')
}

// Manejar errores 404
if (error.value?.statusCode === 404) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Código no encontrado',
	})
}
</script>

<style scoped>
/* Estilos para el código */
pre {
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
  line-height: 1.5;
}

/* Hover effect para el botón de copiar */
.relative:hover .absolute {
  opacity: 1;
}
</style>