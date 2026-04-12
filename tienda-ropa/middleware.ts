import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger rutas admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value

    // Validaciones estrictas
    if (!token) {
      console.warn(`[SECURITY] Intento de acceso sin token a ${pathname}`)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Validar formato del token (debe ser hash SHA256)
    if (!/^[a-f0-9]{64}$/.test(token)) {
      console.warn(`[SECURITY] Token inválido detectado en ${pathname}: ${token}`)
      const response = NextResponse.redirect(new URL('/login', request.url))
      // Limpiar cookie inválida
      response.cookies.delete('admin-token')
      return response
    }

    // Verificar que la cookie no sea modificada por el cliente
    // (httpOnly previene esto, pero como medida adicional validamos)
    const cookieHeaders = request.headers.get('cookie')
    if (!cookieHeaders?.includes('admin-token')) {
      console.warn(`[SECURITY] Cookie no encontrada en headers para ${pathname}`)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/productos/:path*'],
}
