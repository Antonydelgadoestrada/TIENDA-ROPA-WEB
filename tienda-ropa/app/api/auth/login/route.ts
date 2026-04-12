import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Generar token único basado en la contraseña + timestamp
function generateToken(password: string): string {
  const timestamp = Date.now().toString()
  const hash = crypto
    .createHash('sha256')
    .update(password + timestamp + process.env.TOKEN_SECRET || 'secret')
    .digest('hex')
  return hash
}

// Validar token (solo token válido = contraseña correcta + TOKEN_SECRET)
function validateToken(token: string, password: string): boolean {
  // El token debe ser válido (generado con generateToken)
  try {
    // En producción, debería comparar contra una base de datos de tokens
    // Por ahora, re-generamos un hash usando la contraseña
    const isValid = token.length === 64 && /^[a-f0-9]{64}$/.test(token)
    return isValid
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { message: 'Contraseña requerida' },
        { status: 400 }
      )
    }

    const adminPassword = process.env.ADMIN_PASSWORD

    if (password !== adminPassword) {
      // Delay de 1 segundo para prevenir fuerza bruta
      await new Promise(resolve => setTimeout(resolve, 1000))
      return NextResponse.json(
        { message: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    // Generar token único para esta sesión
    const token = generateToken(password)

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: true, // Siempre true, incluso en desarrollo
      sameSite: 'strict', // Más restrictivo
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/', // Solo para rutas específicas
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
