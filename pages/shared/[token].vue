<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Toolbar simplificado para código compartido -->
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="text-lg font-semibold text-gray-900">
          {{ sharedCode?.title || 'Código Compartido' }}
        </h1>
        <span class="text-sm text-gray-500">
          Compartido el {{ formatDate(sharedCode?.created_at) }}
        </span>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="copyCode"
          class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center gap-2"
          :class="{ 'bg-green-700': copied }"
        >
          <ClipboardIcon v-if="!copied" class="w-4 h-4" />
          <CheckIcon v-else class="w-4 h-4" />
          {{ copied ? 'Copiado!' : 'Copiar Código' }}
        </button>
        
        <NuxtLink 
          to="/"
          class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          Crear Nuevo
        </NuxtLink>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div class="p-4">
      <div v-if="pending" class="flex items-center justify-center h-64">
        <div class="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full"></div>
        <span class="ml-3 text-gray-600">Cargando código...</span>
      </div>
      
      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Código no encontrado</h2>
        <p class="text-gray-600 mb-6">El código que buscas no existe o ha expirado.</p>
        <NuxtLink 
          to="/"
          class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Ir al Editor
        </NuxtLink>
      </div>
      
      <div v-else-if="sharedCode" class="h-[calc(100vh-140px)]">
        <CodeEditor 
          :model-value="sharedCode.code"
          :readonly="true"
          theme="vs-dark"
          language="python"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuración de la página
useHead({
	title: 'Código Compartido - Live JavaScript Coding',
		meta: [{ name: 'description', content: 'Visualiza código JavaScript compartido' }],
})

// Obtener el token de la URL
const route = useRoute()
const token = route.params.token as string

// Estado reactivo
const copied = ref(false)

// Cargar código compartido
const { data: sharedCode, error } = await useFetch(`/api/share/${token}`, {
	server: false,
})

// Métodos
const _copyCode = async () => {
	if (!sharedCode.value?.code) return

	try {
		await navigator.clipboard.writeText(sharedCode.value.code)
		copied.value = true

		setTimeout(() => {
			copied.value = false
		}, 2000)
	} catch (err) {
		console.error('Error al copiar código:', err)
	}
}

const _formatDate = (dateString: string | undefined) => {
	if (!dateString) return ''

	try {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	} catch {
		return dateString
	}
}

// Manejar errores 404
if (error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Código no encontrado',
	})
}
</script>

<style scoped>
/* Estilos específicos para la página de código compartido */
</style>