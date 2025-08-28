<template>
  <div class="toolbar">
    <div class="flex items-center gap-3">
      <!-- Botón Ejecutar -->
      <button 
        @click="$emit('execute')"
        :disabled="isExecuting"
        class="btn-primary flex items-center gap-2"
        :class="{ 'opacity-50 cursor-not-allowed': isExecuting }"
      >
        <PlayIcon v-if="!isExecuting" class="w-4 h-4" />
        <div v-else class="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full"></div>
        {{ isExecuting ? 'Ejecutando...' : 'Ejecutar' }}
      </button>
      
      <!-- Separador -->
      <div class="w-px h-6 bg-gray-300"></div>
      
      <!-- Botón Nuevo -->
      <button 
        @click="$emit('new')"
        class="btn-secondary flex items-center gap-2"
        title="Nuevo archivo"
      >
        <DocumentPlusIcon class="w-4 h-4" />
        Nuevo
      </button>
      
      <!-- Botón Limpiar -->
      <button 
        @click="$emit('clear')"
        class="btn-secondary flex items-center gap-2"
        title="Limpiar código"
      >
        <TrashIcon class="w-4 h-4" />
        Limpiar
      </button>
      
      <!-- Botón Guardar -->
      <button 
        @click="$emit('save')"
        class="btn-secondary flex items-center gap-2"
        title="Guardar código"
      >
        <BookmarkIcon class="w-4 h-4" />
        Guardar
      </button>
      
      <!-- Botón Compartir -->
      <button 
        @click="$emit('share')"
        class="btn-secondary flex items-center gap-2"
        title="Compartir código"
      >
        <ShareIcon class="w-4 h-4" />
        Compartir
      </button>
    </div>
    
    <div class="flex items-center gap-3">
      <!-- Selector de tema -->
      <select 
        :value="theme"
        @change="$emit('theme-change', ($event.target as HTMLSelectElement).value)"
        class="px-3 py-1 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="vs-dark">Tema Oscuro</option>
        <option value="vs-light">Tema Claro</option>
      </select>
      
      <!-- Botón Configuración -->
      <button 
        @click="$emit('settings')"
        class="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        title="Configuración"
      >
        <CogIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
	isExecuting?: boolean
	theme?: string
}

interface Emits {
	(e: 'execute'): void
	(e: 'new'): void
	(e: 'clear'): void
	(e: 'save'): void
	(e: 'share'): void
	(e: 'settings'): void
	(e: 'theme-change', theme: string): void
}

const _props = withDefaults(defineProps<Props>(), {
	isExecuting: false,
	theme: 'vs-dark',
})

const _emit = defineEmits<Emits>()
</script>

<style scoped>
.toolbar {
  @apply bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between;
}
</style>