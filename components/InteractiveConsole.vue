<template>
  <div class="interactive-console h-full bg-black rounded-lg p-4 overflow-auto font-mono text-sm">
    <!-- Output del código -->
    <div class="output-content whitespace-pre-wrap">
      <!-- Output normal -->
      <div v-if="output" class="text-green-400">{{ output }}</div>
      
      <!-- Errores -->
      <div v-if="error" class="text-red-400">{{ error }}</div>
      
      <!-- Execution indicator -->
      <div v-if="isExecuting && !isWaitingForInput" class="text-yellow-400 flex items-center gap-2">
        <div class="animate-spin w-3 h-3 border border-yellow-400 border-t-transparent rounded-full"></div>
        Executing code...
      </div>
      
      <!-- Input request -->
      <div v-if="isWaitingForInput" class="text-blue-400">
        <div class="mb-2">{{ inputPrompt }}</div>
        <div class="flex items-center gap-2">
          <span class="text-blue-400">></span>
          <input 
            ref="inputField"
            v-model="userInput"
            @keyup.enter="handleSubmitInput"
            @keyup.escape="handleCancelInput"
            class="bg-transparent border-none outline-none text-white flex-1 font-mono"
            placeholder="Type your answer and press Enter..."
            autocomplete="off"
          />
        </div>
        <div class="text-gray-500 text-xs mt-1">
          Press Enter to send, Escape to cancel
        </div>
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
</template>

<script setup lang="ts">
interface Props {
  output: string
  error: string
  isExecuting: boolean
  isWaitingForInput: boolean
  inputPrompt: string
  executionTime: number
}

interface Emits {
  (e: 'user-input', value: string): void
  (e: 'clear'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userInput = ref('')
const inputField = ref<HTMLInputElement>()

// Focus input field when input is requested
watch(() => props.isWaitingForInput, (isWaiting) => {
  if (isWaiting) {
    nextTick(() => {
      inputField.value?.focus()
    })
  }
})

// Handle input submission
const handleSubmitInput = () => {
  if (userInput.value.trim()) {
    emit('user-input', userInput.value.trim())
    userInput.value = ''
  }
}

// Handle input cancellation
const handleCancelInput = () => {
  userInput.value = ''
  // Could emit a cancellation event if needed
}

// Auto-scroll to bottom when there's new content
const consoleElement = ref<HTMLElement>()

watch([() => props.output, () => props.error, () => props.isWaitingForInput], () => {
  nextTick(() => {
    if (consoleElement.value) {
      consoleElement.value.scrollTop = consoleElement.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.interactive-console {
  /* Custom scrollbar for console */
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #1a202c;
}

.interactive-console::-webkit-scrollbar {
  width: 8px;
}

.interactive-console::-webkit-scrollbar-track {
  background: #1a202c;
}

.interactive-console::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 4px;
}

.interactive-console::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Animation for blinking cursor */
.input-cursor::after {
  content: '|';
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>