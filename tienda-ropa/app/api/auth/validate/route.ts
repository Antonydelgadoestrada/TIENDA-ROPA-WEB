import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value

    // Validar que el token exista
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado: Token no encontrado' },
        { status: 401 }
      )
    }

    // Validar formato del token (debe ser SHA256 hash)
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json(
        { error: 'No autorizado: Token inválido' },
        { status: 401 }
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { error: 'Error al validar token' },
      { status: 500 }
    )
  }
}
