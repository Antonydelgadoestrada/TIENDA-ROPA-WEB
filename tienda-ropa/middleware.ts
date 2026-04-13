import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger rutas admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      console.log(`[AUTH] Sin token en ${pathname}, redirigiendo a login`)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Validar formato del token (debe ser hash SHA256: 64 caracteres hex)
    if (!/^[a-f0-9]{64}$/.test(token)) {
      console.log(`[AUTH] Token con formato inválido en ${pathname}`)
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('admin-token')
      return response
    }

    console.log(`[AUTH] Token válido, acceso permitido a ${pathname}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/productos/:path*'],
}
