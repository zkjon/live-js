<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Compartir Código</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      
      <div class="p-6">
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-3">
            Tu código ha sido guardado y está listo para compartir. Copia el enlace de abajo:
          </p>
          
          <div class="flex items-center gap-2">
            <input 
              ref="urlInput"
              :value="shareUrl"
              readonly
              class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
            <button 
              @click="copyToClipboard"
              class="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center gap-2"
              :class="{ 'bg-green-700': copied }"
            >
              <ClipboardIcon v-if="!copied" class="w-4 h-4" />
              <CheckIcon v-else class="w-4 h-4" />
              {{ copied ? 'Copiado!' : 'Copiar' }}
            </button>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <div class="flex items-start gap-2">
            <InformationCircleIcon class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-blue-700">
              <p class="font-medium mb-1">Información importante:</p>
              <ul class="list-disc list-inside space-y-1 text-xs">
                <li>El enlace es público y cualquiera puede acceder al código</li>
                <li>El código se guarda de forma permanente</li>
                <li>Puedes compartir este enlace por cualquier medio</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Opciones de compartir rápido -->
        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-700">Compartir rápidamente:</p>
          <div class="flex gap-2">
            <button 
              @click="shareViaEmail"
              class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors flex items-center justify-center gap-2"
            >
              <EnvelopeIcon class="w-4 h-4" />
              Email
            </button>
            <button 
              @click="shareViaTwitter"
              class="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
	shareUrl: string
}

type Emits = (e: 'close') => void

const props = defineProps<Props>()
const _emit = defineEmits<Emits>()

const urlInput = ref<HTMLInputElement>()
const copied = ref(false)

const _copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(props.shareUrl)
		copied.value = true

		// Resetear el estado después de 2 segundos
		setTimeout(() => {
			copied.value = false
		}, 2000)
	} catch (err) {
		console.error('Error al copiar al portapapeles:', err)

		// Fallback: seleccionar el texto
		if (urlInput.value) {
			urlInput.value.select()
			urlInput.value.setSelectionRange(0, 99999) // Para móviles
		}
	}
}

const _shareViaEmail = () => {
	const subject = encodeURIComponent('Código JavaScript compartido')
	const body = encodeURIComponent(
		`Hola,\n\nTe comparto este código JavaScript:\n\n${props.shareUrl}\n\n¡Échale un vistazo!`
	)
	return `mailto:?subject=${subject}&body=${body}`
}

const getTwitterUrl = () => {
	const text = encodeURIComponent(`Echa un vistazo a este código JavaScript que estoy trabajando:`)
	const url = encodeURIComponent(props.shareUrl)
	return `https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
}

// Auto-seleccionar la URL cuando se abre el modal
onMounted(() => {
	nextTick(() => {
		if (urlInput.value) {
			urlInput.value.select()
		}
	})
})
</script>

<style scoped>
/* Estilos del modal */
</style>