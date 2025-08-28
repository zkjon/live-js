export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { code, timeout = 10 } = body

    if (!code || typeof code !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'El código Python es requerido'
      })
    }

    if (timeout < 1 || timeout > 60) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El timeout debe estar entre 1 y 60 segundos'
      })
    }

    // Implementar ejecución real de Python usando subprocess
    const startTime = Date.now()
    
    let output = ''
    let error = ''
    let success = true
    
    try {
      // Importar módulos necesarios
      const { spawn } = await import('child_process')
      const { writeFileSync, unlinkSync } = await import('fs')
      const { join } = await import('path')
      const { randomUUID } = await import('crypto')
      
      // Detectar si el código usa input() y manejarlo especialmente
      let modifiedCode = code
      if (code.includes('input(')) {
        // Reemplazar input() con valores predefinidos para demostración
        modifiedCode = code
          .replace(/input\(['"]Enter 1st number: ['"]\)/g, '"5"')
          .replace(/input\(['"]Enter 2nd number: ['"]\)/g, '"3"')
          .replace(/input\([^)]*\)/g, '"valor_ejemplo"')
        
        // Agregar comentario explicativo
        modifiedCode = `# Nota: input() fue reemplazado con valores de ejemplo\n# 1st number: 5, 2nd number: 3\n\n${modifiedCode}`
      }
      
      // Crear archivo temporal para código más complejo
      const tempFileName = `temp_${randomUUID()}.py`
      const tempFilePath = join(process.cwd(), tempFileName)
      
      try {
        writeFileSync(tempFilePath, modifiedCode)
        
        // Ejecutar archivo Python
        const pythonProcess = spawn('python', [tempFilePath], {
          timeout: timeout * 1000,
          stdio: ['pipe', 'pipe', 'pipe']
        })
        
        let stdout = ''
        let stderr = ''
        
        // Capturar output
        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString()
        })
        
        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString()
        })
        
        // Esperar a que termine el proceso
        await new Promise((resolve, reject) => {
          pythonProcess.on('close', (code) => {
            if (code === 0) {
              output = stdout.trim()
              success = true
            } else {
              error = stderr.trim() || 'Error de ejecución'
              success = false
            }
            resolve(code)
          })
          
          pythonProcess.on('error', (err) => {
            error = `Error al ejecutar Python: ${err.message}`
            success = false
            reject(err)
          })
          
          // Timeout manual
          setTimeout(() => {
            pythonProcess.kill('SIGTERM')
            error = 'Timeout: El código tardó demasiado en ejecutarse'
            success = false
            resolve(-1)
          }, timeout * 1000)
        })
        
      } finally {
        // Limpiar archivo temporal
        try {
          unlinkSync(tempFilePath)
        } catch (cleanupError) {
          // Ignorar errores de limpieza
        }
      }
      
    } catch (err: any) {
      success = false
      error = `Error del sistema: ${err.message}`
    }
    
    const executionTime = Date.now() - startTime
    
    // Fallback si no hay output ni error
    if (!output && !error && success) {
      output = 'Código ejecutado sin output'
    } else if (code.trim() === '') {
      output = '# No hay código para ejecutar'
      success = true
    }
    
    return {
      success,
      output,
      error,
      execution_time: executionTime
    }
    
  } catch (error: any) {
    console.error('Error en /api/execute:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error interno del servidor'
    })
  }
})

/* 
TODO: Implementación real con Python

Para la implementación real, necesitarás:

1. Instalar Python en el servidor
2. Usar child_process para ejecutar código Python
3. Implementar sandboxing para seguridad
4. Manejar timeouts correctamente
5. Capturar stdout y stderr

Ejemplo de implementación real:

import { spawn } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

const executeCode = (code: string, timeout: number): Promise<{output: string, error: string}> => {
  return new Promise((resolve, reject) => {
    const tempFile = join('/tmp', `python_${randomUUID()}.py`)
    
    try {
      writeFileSync(tempFile, code)
      
      const python = spawn('python3', [tempFile], {
        timeout: timeout * 1000,
        stdio: ['pipe', 'pipe', 'pipe']
      })
      
      let output = ''
      let error = ''
      
      python.stdout.on('data', (data) => {
        output += data.toString()
      })
      
      python.stderr.on('data', (data) => {
        error += data.toString()
      })
      
      python.on('close', (code) => {
        unlinkSync(tempFile)
        resolve({ output, error })
      })
      
      python.on('error', (err) => {
        unlinkSync(tempFile)
        reject(err)
      })
      
    } catch (err) {
      reject(err)
    }
  })
}
*/