<template>
  <div class="output-panel h-full flex flex-col">
    <div class="flex items-center justify-between p-3 border-b border-gray-700">
      <h3 class="text-sm font-medium text-gray-300">Output</h3>
      <div class="flex items-center gap-2">
        <div v-if="isExecuting" class="flex items-center gap-2 text-yellow-400">
          <div class="animate-spin w-3 h-3 border border-yellow-400 border-t-transparent rounded-full"></div>
          <span class="text-xs">Ejecutando...</span>
        </div>
        <button 
          @click="clearOutput" 
          class="text-gray-400 hover:text-gray-200 transition-colors"
          title="Limpiar output"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div class="flex-1 overflow-auto p-4 font-code text-sm">
      <div v-if="!output && !error && !isExecuting" class="text-gray-500 italic">
        Presiona "Ejecutar" para ver los resultados aquí...
      </div>
      
      <div v-if="output" class="whitespace-pre-wrap text-green-400">
        {{ output }}
      </div>
      
      <div v-if="error" class="whitespace-pre-wrap text-red-400 mt-2">
        <div class="font-semibold mb-1">Error:</div>
        {{ error }}
      </div>
      
      <div v-if="executionTime !== null" class="text-gray-400 text-xs mt-3 pt-2 border-t border-gray-700">
        Tiempo de ejecución: {{ executionTime }}ms
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'

interface Props {
	output?: string
	error?: string
	isExecuting?: boolean
	executionTime?: number | null
}

type Emits = (e: 'clear') => void

const props = withDefaults(defineProps<Props>(), {
	output: '',
	error: '',
	isExecuting: false,
	executionTime: null,
})

const emit = defineEmits<Emits>()

const clearOutput = () => {
	emit('clear')
}

// Auto-scroll al final cuando hay nuevo output
const outputContainer = ref<HTMLElement>()

watch([() => props.output, () => props.error], () => {
	nextTick(() => {
		if (outputContainer.value) {
			outputContainer.value.scrollTop = outputContainer.value.scrollHeight
		}
	})
})
</script>

<style scoped>
.output-panel {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  border: 1px solid #374151;
}

/* Scrollbar personalizado para el output */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #1f2937;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>