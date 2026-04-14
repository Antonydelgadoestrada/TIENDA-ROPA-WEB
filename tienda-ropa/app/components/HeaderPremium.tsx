'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok, FaShoppingCart, FaSearch, FaUser, FaHeart, FaChevronDown, FaSignOutAlt, FaLock } from 'react-icons/fa'
import { MdEmail, MdPhone, MdMenu, MdClose } from 'react-icons/md'
import { createClient } from '@supabase/supabase-js'
import { Configuracion } from '@/lib/types'
import MiniCarrito from './MiniCarrito'

export default function HeaderPremium() {
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [miniCarritoOpen, setMiniCarritoOpen] = useState(false)
  const [userLogged, setUserLogged] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [userName, setUserName] = useState('')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('tienda_configuracion').select('*').single()
      if (data) setConfig(data)
    }
    fetchConfig()

    // Verificar si el usuario está loggeado (token en localStorage)
    const token = localStorage.getItem('auth_token')
    const nombre = localStorage.getItem('user_nombre')
    setUserLogged(!!token)
    if (nombre) setUserName(nombre)

    // Cargar contador del carrito desde localStorage
    const carrito = localStorage.getItem('carrito')
    if (carrito) {
      const items = JSON.parse(carrito)
      setCartCount(items.length)
    }

    // Escuchar cambios en carrito
    const handleCartUpdate = () => {
      const carrito = localStorage.getItem('carrito')
      if (carrito) {
        const items = JSON.parse(carrito)
        setCartCount(items.length)
      }
    }

    window.addEventListener('carrito-actualizado', handleCartUpdate)
    window.addEventListener('auth-changed', () => {
      const token = localStorage.getItem('auth_token')
      const nombre = localStorage.getItem('user_nombre')
      setUserLogged(!!token)
      if (nombre) setUserName(nombre)
      else setUserName('')
    })

    return () => {
      window.removeEventListener('carrito-actualizado', handleCartUpdate)
      window.removeEventListener('auth-changed', () => {})
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_nombre')
    setUserLogged(false)
    setUserName('')
    setAccountMenuOpen(false)
    window.dispatchEvent(new Event('auth-changed'))
  }

  return (
    <>
      <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* Top bar: SSL, métodos pago, contacto */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FaLock className="text-green-400" /> SSL Certificado
            </span>
            <span>✓ Pago Seguro</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {config?.email && (
              <a href={`mailto:${config.email}`} className="flex items-center gap-1 hover:text-blue-300 transition">
                <MdEmail /> {config.email}
              </a>
            )}
            {config?.telefono && (
              <a href={`tel:${config.telefono}`} className="flex items-center gap-1 hover:text-blue-300 transition">
                <MdPhone /> {config.telefono}
              </a>
            )}
            {config?.whatsapp && (
              <a href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-1 hover:text-green-300 transition">
                <FaWhatsapp /> Chat
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo y Nombre */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-4xl">👗</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                {config?.nombre_tienda || 'Tienda Ropa'}
              </h1>
              <p className="text-xs text-slate-500">Moda Premium</p>
            </div>
          </Link>

          {/* Buscador */}
          <div className="hidden md:flex flex-1 mx-8 max-w-md">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Buscar ropa, color, talla..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute right-3 top-3.5 text-slate-400" />
            </div>
          </div>

          {/* Botones Derechos */}
          <div className="flex items-center gap-6">
            {/* Favoritos */}
            <Link href="/favoritos" className="relative hover:text-blue-600 transition text-xl">
              <FaHeart />
              {favoriteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {/* Cuenta / Login */}
            {userLogged ? (
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-1 hover:text-blue-600 transition text-xl"
                >
                  <FaUser />
                  <FaChevronDown className="text-xs" />
                </button>

                {/* Menu Dropdown */}
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-200 bg-blue-50">
                      <p className="text-sm font-semibold text-slate-900">{userName}</p>
                    </div>
                    <Link
                      href="/cuenta"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition text-sm"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      Mi Cuenta
                    </Link>
                    <Link
                      href="/cuenta?tab=pedidos"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition text-sm"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      Mis Pedidos
                    </Link>
                    <Link
                      href="/cuenta?tab=favoritos"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition text-sm"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      Mis Favoritos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm border-t border-slate-200 flex items-center gap-2"
                    >
                      <FaSignOutAlt className="text-xs" /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="hover:text-blue-600 transition text-xl" title="Iniciar Sesión">
                <FaUser />
              </Link>
            )}

            {/* Carrito */}
            <button
              onClick={() => setMiniCarritoOpen(!miniCarritoOpen)}
              className="relative hover:text-blue-600 transition text-xl"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Menu Mobile */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className={`mt-4 ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row gap-8 md:gap-12">
            <li>
              <Link href="/" className="text-slate-700 hover:text-blue-600 font-semibold transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/productos" className="text-slate-700 hover:text-blue-600 font-semibold transition">
                Tienda
              </Link>
            </li>
            <li>
              <Link href="/productos?tipo=hombre" className="text-slate-700 hover:text-blue-600 font-semibold transition">
                Hombre
              </Link>
            </li>
            <li>
              <Link href="/productos?tipo=mujer" className="text-slate-700 hover:text-blue-600 font-semibold transition">
                Mujer
              </Link>
            </li>
            <li>
              <Link href="/productos?es_oferta=true" className="text-slate-700 hover:text-blue-600 font-semibold transition flex items-center gap-2">
                <span className="text-red-600">Ofertas</span>
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="text-slate-700 hover:text-blue-600 font-semibold transition">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      </header>
      {/* Mini Carrito Lateral */}
      <MiniCarrito isOpen={miniCarritoOpen} onClose={() => setMiniCarritoOpen(false)} />
      </>
  )
}
