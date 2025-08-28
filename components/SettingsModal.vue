<template>
  <div
    class="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Configuración</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Configuración del Editor -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Editor</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Tamaño de fuente</label>
              <select
                v-model="settings.fontSize"
                class="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
                <option value="20">20px</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Tema</label>
              <select
                v-model="settings.theme"
                class="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="vs-dark">Oscuro</option>
                <option value="vs-light">Claro</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Mostrar minimap</label>
              <input
                v-model="settings.minimap"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Ajuste de línea</label>
              <input
                v-model="settings.wordWrap"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
            </div>
          </div>
        </div>

        <!-- Configuración de Ejecución -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Ejecución</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Timeout (segundos)</label>
              <input
                v-model.number="settings.timeout"
                type="number"
                min="1"
                max="60"
                class="w-20 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Auto-guardar</label>
              <input
                v-model="settings.autoSave"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
          Cancelar
        </button>
        <button
          @click="saveSettings"
          class="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Settings {
  theme: string;
  fontSize: number;
  timeout: number;
  [key: string]: unknown;
}

interface Emits {
  (e: "close"): void;
  (e: "settings-changed", settings: Settings): void;
}

const emit = defineEmits<Emits>();

// Configuración por defecto
const settings = ref({
  fontSize: 14,
  theme: "vs-dark",
  minimap: false,
  wordWrap: true,
  timeout: 10,
  autoSave: true,
});

// Cargar configuración guardada
onMounted(() => {
  if (process.client) {
    const savedSettings = localStorage.getItem("live-js-editor-settings");
    if (savedSettings) {
      try {
        Object.assign(settings.value, JSON.parse(savedSettings));
      } catch (e) {
        console.warn("Error al cargar configuración:", e);
      }
    }
  }
});

const saveSettings = () => {
  if (process.client) {
    localStorage.setItem(
      "live-js-editor-settings",
      JSON.stringify(settings.value)
    );
  }

  emit("settings-changed", settings.value);
  emit("close");
};
</script>

<style scoped>
/* Estilos del modal */
</style>
