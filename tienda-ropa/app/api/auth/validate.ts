import { NextRequest, NextResponse } from 'next/server'

/**
 * Función para validar token de autenticación en endpoints
 * @param request - La solicitud HTTP
 * @returns { isValid: boolean, error: NextResponse | null }
 */
export function validateAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value

  // Validar que el token exista
  if (!token) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'No autorizado: Token de sesión no encontrado' },
        { status: 401 }
      ),
    }
  }

  // Validar formato del token (debe ser SHA256 hash)
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'No autorizado: Token inválido' },
        { status: 401 }
      ),
    }
  }

  return { isValid: true, error: null }
}
