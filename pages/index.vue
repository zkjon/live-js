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
        <InteractiveConsole 
          :output="output"
          :error="error"
          :is-executing="isExecuting"
          :is-waiting-for-input="isWaitingForInput"
          :input-prompt="inputPrompt"
          :execution-time="executionTime"
          @user-input="handleUserInput"
          @clear="clearOutput"
        />
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
// Importar el composable interactivo
const { isExecuting, connect, executeCode, sendUserInput, clearOutput } = useInteractiveExecution()

// Code and theme state
const code = ref(`# Welcome to Live Python Coding!
# Write your Python code here and press "Run"
# Now you can use input() and it will be fully interactive!

def sum_numbers(a, b):
    return (a + b)

a = int(input('Enter 1st number: '))
b = int(input('Enter 2nd number: '))

print(f'Sum of {a} and {b} is {sum_numbers(a, b)}')

# Other examples:
print("Hello, world!")
print("This is a minimalist Python editor")

# Calculation example
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"The sum of {numbers} is: {total}")
`)

const isDark = ref(false)
const _codeEditor = ref()

// Connect to WebSocket on mount
onMounted(() => {
	connect()
})

// Handlers
const handleExecute = async () => {
	if (isExecuting.value) return
	executeCode(code.value, 30)
}

const _handleClear = () => {
	code.value = ''
	clearOutput()
}

const _handleUserInput = (input: string) => {
	sendUserInput(input)
}

const _handleCodeChange = (_newCode: string) => {
	// v-model already handles the update automatically
	// This handler is available for additional logic if needed
}

const _toggleTheme = () => {
	isDark.value = !isDark.value
	if (isDark.value) {
		document.documentElement.classList.add('dark')
	} else {
		document.documentElement.classList.remove('dark')
	}
}

// SEO
useHead({
	title: 'Live Python Coding - Minimalist Editor',
	meta: [
		{
			name: 'description',
			content: 'Minimalist platform for writing and executing Python code in real time',
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