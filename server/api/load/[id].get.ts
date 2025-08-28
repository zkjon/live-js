import { getStoredCode } from '../save.post'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id || typeof id !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de código requerido'
      })
    }
    
    // Validar formato de UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de ID inválido'
      })
    }
    
    // Buscar código en almacenamiento
    const storedCode = getStoredCode(id)
    
    if (!storedCode) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Código no encontrado'
      })
    }
    
    return {
      success: true,
      id: storedCode.id,
      code: storedCode.code,
      title: storedCode.title,
      created_at: storedCode.created_at,
      updated_at: storedCode.updated_at
    }
    
  } catch (error: any) {
    console.error('Error en /api/load/[id]:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al cargar el código'
    })
  }
})

/* 
TODO: Mejoras para producción

1. Caché con Redis:
   const cachedCode = await redis.get(`code:${id}`)
   if (cachedCode) {
     return JSON.parse(cachedCode)
   }

2. Analytics y métricas:
   - Contar visualizaciones
   - Tracking de accesos
   - Estadísticas de uso

3. Seguridad adicional:
   - Rate limiting por IP
   - Validación de referrer
   - Protección contra scraping

4. Optimizaciones:
   - Compresión de respuesta
   - ETags para caché del navegador
   - CDN para contenido estático

5. Metadatos adicionales:
   - Información del autor
   - Tags/categorías
   - Versiones del código
   - Comentarios/descripción
*/