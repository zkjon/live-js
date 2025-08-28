<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Toolbar Simplificado -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-center gap-3">
        <button 
          @click="handleExecute"
          :disabled="isExecuting"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          :class="{ 'opacity-50 cursor-not-allowed': isExecuting }"
        >
          {{ isExecuting ? 'Running...' : 'Run' }}
        </button>
        
        <button 
          @click="handleClear"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Clear
        </button>
        
        <button 
          @click="toggleTheme"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {{ isDark ? 'Light Theme' : 'Dark Theme' }}
        </button>
      </div>
    </div>
    
    <!-- Editor Principal -->
    <div class="flex h-[calc(100vh-73px)]">
      <!-- Panel del Editor (60%) -->
      <div class="w-3/5 p-4">
        <div class="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <CodeEditor 
            ref="codeEditor"
            v-model="code"
            :theme="isDark ? 'vs-dark' : 'vs-light'"
            language="python"
            @change="handleCodeChange"
          />
        </div>
      </div>
      
      <!-- Panel de Output (40%) -->
      <div class="w-2/5 p-4 pl-0">
        <div class="h-full bg-black rounded-lg p-4 overflow-auto font-mono text-sm">
          <!-- Output del código -->
          <div class="output-content whitespace-pre-wrap">
            <!-- Output normal -->
            <div v-if="output" class="text-green-400">{{ output }}</div>
            
            <!-- Errores -->
            <div v-if="error" class="text-red-400">{{ error }}</div>
            
            <!-- Execution indicator -->
            <div v-if="isExecuting" class="text-yellow-400 flex items-center gap-2">
              <div class="animate-spin w-3 h-3 border border-yellow-400 border-t-transparent rounded-full"></div>
              Executing code...
            </div>
            
            <!-- Initial state -->
            <div v-if="!output && !error && !isExecuting" class="text-gray-500">
              Press 'Run' to see the results
            </div>
          </div>
          
          <!-- Execution information -->
          <div v-if="executionTime > 0" class="text-gray-400 text-xs mt-4 pt-2 border-t border-gray-700">
            Execution time: {{ executionTime }}ms
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modales deshabilitados temporalmente -->
    <!-- 
    <SettingsModal 
      v-if="showSettings"
      @close="showSettings = false"
    />
    
    <ShareModal 
      v-if="showShareModal"
      :share-url="shareUrl"
      @close="showShareModal = false"
    />
    -->
  </div>
</template>

<script setup lang="ts">
// Importar el composable simplificado (solo API REST)
const {
	isExecuting,
	output,
	error,
	executionTime,
	executeCode,
	clearOutput,
} = useInteractiveExecution()

// Code and theme state
const code = ref(`// ¡Bienvenido a Live JavaScript Coding!
// Escribe tu código JavaScript aquí y presiona "Run"
// Editor de JavaScript simple y rápido

// Ejemplo básico
console.log("¡Hola mundo!");

// Cálculos
const numbers = [1, 2, 3, 4, 5];
const total = numbers.reduce((sum, num) => sum + num, 0);
console.log('La suma de [' + numbers.join(', ') + '] es: ' + total);

// Bucles
console.log("\nConteo regresivo:");
for (let i = 5; i > 0; i--) {
    console.log('Número: ' + i);
}
console.log("¡Listo!");

// Funciones
function saludar(nombre) {
    return '¡Hola ' + nombre + '!';
}

const resultado = saludar("Usuario");
console.log('\n' + resultado);
`)

const isDark = ref(false)
const _codeEditor = ref()

// Handlers
const handleExecute = async () => {
	if (isExecuting.value) return
	executeCode(code.value, 30)
}

const handleClear = () => {
	code.value = ''
	clearOutput()
}

const handleCodeChange = (_newCode: string) => {
	// v-model already handles the update automatically
	// This handler is available for additional logic if needed
}

const toggleTheme = () => {
	isDark.value = !isDark.value
	if (isDark.value) {
		document.documentElement.classList.add('dark')
	} else {
		document.documentElement.classList.remove('dark')
	}
}

// SEO
useHead({
	title: 'Live JavaScript Coding - Minimalist Editor',
	meta: [
		{
			name: 'description',
			content: 'Minimalist platform for writing and executing JavaScript code in real time',
		},
	],
})

// Inicializar tema
onMounted(() => {
	const savedTheme = localStorage.getItem('theme')
	if (
		savedTheme === 'dark' ||
		(!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
	) {
		isDark.value = true
		document.documentElement.classList.add('dark')
	}
})

// Guardar tema
watch(isDark, (newValue) => {
	localStorage.setItem('theme', newValue ? 'dark' : 'light')
})

// Atajos de teclado
onMounted(() => {
	const handleKeydown = (e: KeyboardEvent) => {
		// Ctrl/Cmd + Enter para ejecutar
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			e.preventDefault()
			handleExecute()
		}
	}

	document.addEventListener('keydown', handleKeydown)

	onUnmounted(() => {
		document.removeEventListener('keydown', handleKeydown)
	})
})
</script>

<style scoped>
/* Estilos específicos de la página */
.editor-panel {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>