<template>
  <div class="code-editor-container h-full">
    <div ref="editorContainer" class="h-full w-full rounded-lg overflow-hidden"></div>
  </div>
</template>

<script setup lang="ts">
// Import Monaco Editor only on client
let monaco: any = null
if (process.client) {
	monaco = await import('monaco-editor')
}

interface Props {
	modelValue: string
	language?: string
	theme?: string
	readonly?: boolean
}

interface Emits {
	(e: 'update:modelValue', value: string): void
	(e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
	language: 'python',
	theme: 'vs-dark',
	readonly: false,
})

const emit = defineEmits<Emits>()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(async () => {
	if (!editorContainer.value || !process.client) return

	// Load Monaco Editor if not available
	if (!monaco) {
		monaco = await import('monaco-editor')
	}

	// Configure Monaco Editor
	editor = monaco.editor.create(editorContainer.value, {
		value: props.modelValue,
		language: props.language,
		theme: props.theme,
		automaticLayout: true,
		fontSize: 14,
		fontFamily: 'Consolas, Monaco, monospace',
		lineNumbers: 'on',
		minimap: { enabled: false },
		scrollBeyondLastLine: false,
		wordWrap: 'on',
		readOnly: props.readonly,
		tabSize: 4,
		insertSpaces: true,
		renderWhitespace: 'selection',
		cursorBlinking: 'smooth',
		smoothScrolling: true,
		contextmenu: false,
		selectOnLineNumbers: true,
		roundedSelection: false,
		renderLineHighlight: 'line',
		bracketPairColorization: {
			enabled: true,
		},
		// Additional configurations to fix cursor
		fontLigatures: false,
		letterSpacing: 0,
		lineHeight: 0,
		cursorStyle: 'line',
		cursorWidth: 1,
		disableLayerHinting: true,
		fontWeight: 'normal',
		renderFinalNewline: false,
	})

	// Listen to editor changes
	editor.onDidChangeModelContent(() => {
		if (editor) {
			const value = editor.getValue()
			emit('update:modelValue', value)
			emit('change', value)
		}
	})

	// Force resize to fix cursor alignment
	nextTick(() => {
		if (editor) {
			editor.layout()
			// Additional layout fix with delay
			setTimeout(() => {
				if (editor) {
					editor.layout()
					editor.focus()
				}
			}, 100)
		}
	})
})

onUnmounted(() => {
	if (editor) {
		editor.dispose()
	}
})

// Update editor value when prop changes
watch(
	() => props.modelValue,
	(newValue) => {
		if (editor && editor.getValue() !== newValue) {
			editor.setValue(newValue)
		}
	}
)

// Update theme when it changes
watch(
	() => props.theme,
	(newTheme) => {
		if (editor && monaco) {
			monaco.editor.setTheme(newTheme)
		}
	}
)

// Expose editor methods
defineExpose({
	focus: () => editor?.focus(),
	getSelection: () => editor?.getSelection(),
	setSelection: (selection: any) => editor?.setSelection(selection),
	insertText: (text: string) => {
		if (editor) {
			const selection = editor.getSelection()
			if (selection) {
				editor.executeEdits('', [
					{
						range: selection,
						text: text,
					},
				])
			}
		}
	},
})
</script>

<style scoped>
.code-editor-container {
  border: 1px solid #374151;
  position: relative;
  overflow: hidden;
}

/* Ensure Monaco Editor has correct size */
.code-editor-container :deep(.monaco-editor) {
  width: 100% !important;
  height: 100% !important;
  font-family: 'Consolas', 'Monaco', monospace !important;
}

/* Fix cursor alignment */
.code-editor-container :deep(.monaco-editor .view-lines) {
  font-feature-settings: normal !important;
  font-variant-ligatures: none !important;
}

.code-editor-container :deep(.monaco-editor .cursor) {
  background-color: #ffffff !important;
}

/* Ensure proper text rendering */
.code-editor-container :deep(.monaco-editor .view-line) {
  font-feature-settings: normal !important;
  font-variant-ligatures: none !important;
  font-family: 'Consolas', 'Monaco', monospace !important;
}
</style>