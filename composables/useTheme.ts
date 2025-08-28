export type Theme = 'light' | 'dark' | 'auto'

interface UseThemeReturn {
  theme: Ref<Theme>
  isDark: Ref<boolean>
  setTheme: (newTheme: Theme) => void
  toggleTheme: () => void
}

export const useTheme = (): UseThemeReturn => {
  // Estado reactivo del tema
  const theme = ref<Theme>('auto')
  const isDark = ref(false)
  
  // Detectar preferencia del sistema
  const getSystemTheme = (): 'light' | 'dark' => {
    if (process.client && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }
  
  // Aplicar tema al DOM
  const applyTheme = (targetTheme: 'light' | 'dark') => {
    if (process.client) {
      const html = document.documentElement
      
      if (targetTheme === 'dark') {
        html.classList.add('dark')
        isDark.value = true
      } else {
        html.classList.remove('dark')
        isDark.value = false
      }
      
      // Actualizar meta theme-color para móviles
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', targetTheme === 'dark' ? '#111827' : '#ffffff')
      } else {
        const meta = document.createElement('meta')
        meta.name = 'theme-color'
        meta.content = targetTheme === 'dark' ? '#111827' : '#ffffff'
        document.head.appendChild(meta)
      }
    }
  }
  
  // Determinar tema efectivo
  const getEffectiveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'auto') {
      return getSystemTheme()
    }
    return currentTheme
  }
  
  // Establecer tema
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    const effectiveTheme = getEffectiveTheme(newTheme)
    applyTheme(effectiveTheme)
    
    // Guardar en localStorage
    if (process.client) {
      localStorage.setItem('theme', newTheme)
    }
  }
  
  // Alternar entre claro y oscuro
  const toggleTheme = () => {
    if (theme.value === 'auto') {
      // Si está en auto, cambiar al opuesto del sistema
      const systemTheme = getSystemTheme()
      setTheme(systemTheme === 'dark' ? 'light' : 'dark')
    } else {
      // Alternar entre light y dark
      setTheme(theme.value === 'dark' ? 'light' : 'dark')
    }
  }
  
  // Inicializar tema
  const initTheme = () => {
    if (process.client) {
      // Cargar tema guardado o usar auto por defecto
      const savedTheme = localStorage.getItem('theme') as Theme || 'auto'
      theme.value = savedTheme
      
      const effectiveTheme = getEffectiveTheme(savedTheme)
      applyTheme(effectiveTheme)
      
      // Escuchar cambios en la preferencia del sistema
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        const handleSystemThemeChange = () => {
          if (theme.value === 'auto') {
            const newSystemTheme = getSystemTheme()
            applyTheme(newSystemTheme)
          }
        }
        
        // Usar addEventListener si está disponible, sino addListener
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleSystemThemeChange)
        } else {
          // Fallback para navegadores más antiguos
          mediaQuery.addListener(handleSystemThemeChange)
        }
        
        // Cleanup en unmount
        onUnmounted(() => {
          if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', handleSystemThemeChange)
          } else {
            mediaQuery.removeListener(handleSystemThemeChange)
          }
        })
      }
    }
  }
  
  // Watcher para cambios de tema
  watch(theme, (newTheme) => {
    const effectiveTheme = getEffectiveTheme(newTheme)
    applyTheme(effectiveTheme)
  })
  
  // Inicializar cuando se monta
  onMounted(() => {
    initTheme()
  })
  
  // También inicializar en el servidor para SSR
  if (process.server) {
    // En el servidor, usar tema claro por defecto
    isDark.value = false
  }
  
  return {
    theme: readonly(theme),
    isDark: readonly(isDark),
    setTheme,
    toggleTheme
  }
}

// Composable global para usar en toda la aplicación
let globalTheme: UseThemeReturn | null = null

export const useGlobalTheme = (): UseThemeReturn => {
  if (!globalTheme) {
    globalTheme = useTheme()
  }
  return globalTheme
}