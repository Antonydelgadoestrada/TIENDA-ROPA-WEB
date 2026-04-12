import { NextRequest, NextResponse } from 'next/server'

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
      return NextResponse.json(
        { message: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-token', process.env.ADMIN_PASSWORD!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
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
