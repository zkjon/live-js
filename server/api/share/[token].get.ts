import { getStoredCode } from '../save.post'

export default defineEventHandler(async (event) => {
  try {
    const token = getRouterParam(event, 'token')
    
    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token de compartir requerido'
      })
    }

    // Buscar el código en el almacenamiento
    const storedCode = getStoredCode(token)
    
    if (!storedCode) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Código no encontrado o expirado'
      })
    }

    return {
      success: true,
      id: storedCode.id,
      code: storedCode.code,
      title: storedCode.title,
      created_at: storedCode.created_at
    }
    
  } catch (error: any) {
    console.error('Error en /api/share/[token]:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al cargar el código compartido'
    })
  }
})