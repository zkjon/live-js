import { randomUUID } from 'crypto'

// Simulación de base de datos en memoria
// En producción, usar una base de datos real como MongoDB, PostgreSQL, etc.
const codeStorage = new Map<
	string,
	{
		id: string
		code: string
		title?: string
		created_at: Date
		updated_at: Date
	}
>()

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)
		const { code, title } = body

		if (!code || typeof code !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'El código Python es requerido',
			})
		}

		if (code.length > 50000) {
			throw createError({
				statusCode: 400,
				statusMessage: 'El código es demasiado largo (máximo 50,000 caracteres)',
			})
		}

		// Generar ID único
		const id = randomUUID()
		const now = new Date()

		// Guardar en "base de datos"
		const savedCode = {
			id,
			code,
			title: title || `Código Python - ${now.toLocaleDateString()}`,
			created_at: now,
			updated_at: now,
		}

		codeStorage.set(id, savedCode)

		// Generar URL para compartir
		const baseUrl = getHeader(event, 'host') || 'localhost:3000'
		const protocol = getHeader(event, 'x-forwarded-proto') || 'http'
		const shareUrl = `${protocol}://${baseUrl}/shared/${id}`

		return {
			success: true,
			id,
			share_url: shareUrl,
			title: savedCode.title,
			created_at: savedCode.created_at,
		}
	} catch (error: any) {
		console.error('Error en /api/save:', error)

		throw createError({
			statusCode: error.statusCode || 500,
			statusMessage: error.statusMessage || 'Error al guardar el código',
		})
	}
})

// Función auxiliar para obtener código guardado (usado por otras APIs)
export const getStoredCode = (id: string) => {
	return codeStorage.get(id)
}

/* 
TODO: Implementación con base de datos real

Para producción, reemplazar el Map con una base de datos:

1. MongoDB con Mongoose:
   const CodeSchema = new mongoose.Schema({
     code: { type: String, required: true },
     title: { type: String, default: '' },
     created_at: { type: Date, default: Date.now },
     updated_at: { type: Date, default: Date.now }
   })

2. PostgreSQL con Prisma:
   model Code {
     id         String   @id @default(uuid())
     code       String
     title      String?
     created_at DateTime @default(now())
     updated_at DateTime @updatedAt
   }

3. Supabase:
   const { data, error } = await supabase
     .from('codes')
     .insert({ code, title })
     .select()

4. Agregar validación adicional:
   - Sanitización de código
   - Rate limiting
   - Autenticación (opcional)
   - Expiración automática
   - Compresión para códigos largos
*/
