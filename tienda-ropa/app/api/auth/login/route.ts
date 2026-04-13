import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Generar token consistente basado en la contraseña
function generateToken(password: string): string {
  const secret = process.env.TOKEN_SECRET || 'admin-secret-key'
  const hash = crypto
    .createHash('sha256')
    .update(password + secret)
    .digest('hex')
  return hash
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

    // Generar token consistente para esta sesión
    const token = generateToken(password)

    console.log('[AUTH] Login exitoso, token:', token.substring(0, 8) + '...')

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false en desarrollo
      sameSite: 'lax', // menos restrictivo
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
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
