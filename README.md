# Live Python - Editor de Código Python en Tiempo Real

Una aplicación web moderna para escribir, ejecutar y compartir código Python en tiempo real con una interfaz minimalista y elegante.

## 🚀 Características

### Editor de Código
- **Monaco Editor** con syntax highlighting completo para Python
- **Autocompletado** y sugerencias inteligentes
- **Detección de errores** en tiempo real
- **Atajos de teclado** (Ctrl+Enter para ejecutar, Ctrl+S para guardar)
- **Numeración de líneas** y minimapa opcional

### Ejecución en Tiempo Real
- **WebSockets** para ejecución instantánea
- **Salida en tiempo real** con streaming de resultados
- **Manejo de errores** con stack traces detallados
- **Cancelación de ejecución** para procesos largos
- **Timeout configurable** para prevenir ejecuciones infinitas

### Interfaz de Usuario
- **Diseño responsivo** que se adapta a cualquier pantalla
- **Panel dividido** (60% editor, 40% salida)
- **Temas oscuro/claro** con detección automática del sistema
- **Transiciones suaves** y animaciones elegantes
- **Interfaz minimalista** enfocada en la productividad

### Funcionalidades Avanzadas
- **Guardar y compartir** código con URLs únicas
- **Autoguardado** en localStorage
- **Configuración personalizable** (fuente, tema, timeout)
- **Historial de ejecuciones** con timestamps
- **Exportación** de código y resultados

## 🛠️ Tecnologías

### Frontend
- **Nuxt 3** - Framework Vue.js con SSR
- **Vue 3** - Framework reactivo con Composition API
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de utilidades CSS
- **Monaco Editor** - Editor de código de VS Code
- **VueUse** - Composables utilitarios para Vue

### Backend
- **Nitro** - Motor de servidor universal
- **Socket.io** - WebSockets para comunicación en tiempo real
- **Node.js** - Runtime de JavaScript
- **APIs RESTful** - Endpoints para guardar y compartir código

### Herramientas de Desarrollo
- **Bun** - Runtime y package manager ultrarrápido
- **Vite** - Build tool con HMR instantáneo
- **ESLint** - Linter para calidad de código
- **Prettier** - Formateador de código

## 📦 Instalación

### Prerrequisitos
- **Node.js** 18+ o **Bun** 1.0+
- **Python** 3.8+ (para ejecución de código)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/live-python.git
cd live-python
```

2. **Instalar dependencias**
```bash
bun install
# o
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
bun run dev
# o
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 🚀 Uso

### Escribir Código
1. Escribe tu código Python en el editor de la izquierda
2. Usa **Ctrl+Enter** para ejecutar o haz clic en "Ejecutar"
3. Ve los resultados en tiempo real en el panel de la derecha

### Guardar y Compartir
1. Haz clic en "Guardar" para generar un enlace único
2. Comparte el enlace con otros usuarios
3. El código se guarda automáticamente en localStorage

### Configuración
1. Haz clic en el ícono de configuración
2. Personaliza el tema, tamaño de fuente, timeout, etc.
3. Los cambios se guardan automáticamente

## 🎨 Temas y Personalización

### Temas Disponibles
- **Claro** - Tema minimalista con fondo blanco
- **Oscuro** - Tema elegante con fondo oscuro
- **Auto** - Detecta automáticamente la preferencia del sistema

### Colores del Sistema
- **Primario**: Azul (#3B82F6)
- **Secundario**: Gris (#6B7280)
- **Éxito**: Verde (#10B981)
- **Error**: Rojo (#EF4444)
- **Advertencia**: Amarillo (#F59E0B)

## 📱 Responsividad

La aplicación está optimizada para:
- **Desktop** (1024px+) - Panel dividido horizontal
- **Tablet** (768px-1023px) - Panel dividido vertical
- **Mobile** (320px-767px) - Pestañas intercambiables

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# Puerto del servidor
PORT=3000

# Timeout de ejecución (ms)
EXECUTION_TIMEOUT=30000

# Límite de memoria para Python (MB)
PYTHON_MEMORY_LIMIT=128

# Directorio temporal para archivos
TEMP_DIR=/tmp/live-python
```

### Configuración de Python
Por defecto, la aplicación usa el Python del sistema. Para usar un entorno virtual:

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependencias Python
pip install numpy pandas matplotlib
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
bun test

# Ejecutar tests e2e
bun test:e2e

# Cobertura de código
bun test:coverage
```

## 📈 Performance

### Métricas de Rendimiento
- **Tiempo de carga inicial**: < 2s
- **Tiempo de ejecución**: < 100ms (código simple)
- **Tamaño del bundle**: < 500KB (gzipped)
- **Lighthouse Score**: 95+ en todas las categorías

### Optimizaciones
- **Code splitting** automático
- **Lazy loading** de componentes
- **Tree shaking** para eliminar código no usado
- **Compresión gzip/brotli**
- **Caching** inteligente de assets

## 🔒 Seguridad

### Medidas de Seguridad
- **Sandboxing** de ejecución Python
- **Timeout** para prevenir bucles infinitos
- **Límites de memoria** y CPU
- **Sanitización** de entrada y salida
- **Rate limiting** en APIs
- **CORS** configurado correctamente

### Limitaciones
- No se permiten imports de módulos del sistema
- Acceso limitado al sistema de archivos
- Ejecución en entorno aislado

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación cuando sea necesario
- Usa commits descriptivos y claros

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Monaco Editor** por el excelente editor de código
- **Nuxt Team** por el increíble framework
- **Tailwind CSS** por las utilidades de estilo
- **Socket.io** por la comunicación en tiempo real
- **Comunidad Open Source** por las herramientas y librerías

## 📞 Soporte

¿Tienes preguntas o problemas?

- 📧 **Email**: soporte@live-python.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/live-python/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/live-python/discussions)
- 📖 **Documentación**: [Wiki](https://github.com/tu-usuario/live-python/wiki)

---

**¡Disfruta programando en Python! 🐍✨**