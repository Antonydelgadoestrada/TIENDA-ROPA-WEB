'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const handleLogout = async () => {
    try {
      setIsLogoutLoading(true)
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setIsLogoutLoading(false)
    }
  }

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: '📊',
      description: 'Inicio y KPIs'
    },
    {
      title: 'Productos',
      path: '/admin/productos',
      icon: '🛍️',
      description: 'Gestión de productos'
    },
    {
      title: 'Inventario',
      path: '/admin/inventario',
      icon: '📦',
      description: 'Entrada/Salida/Historial'
    },
    {
      title: 'Pedidos',
      path: '/admin/pedidos',
      icon: '📋',
      description: 'Gestión de órdenes'
    },
    {
      title: 'Reportes',
      path: '/admin/reportes',
      icon: '📈',
      description: 'Analytics'
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">👗</div>
          <div>
            <h1 className="font-bold text-lg">TIENDA ROPA</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-semibold">{item.title}</div>
                <div className="text-xs text-slate-400 opacity-75">{item.description}</div>
              </div>
              {isActive(item.path) && (
                <div className="text-sm">→</div>
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 space-y-3">
        <Link
          href="/admin/configuracion"
          className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          <div className="flex items-center gap-3">
            <span>⚙️</span>
            <span className="font-semibold">Configuración</span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          disabled={isLogoutLoading}
          className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-2">
            <span>🚪</span>
            <span>{isLogoutLoading ? 'Cerrando...' : 'Cerrar Sesión'}</span>
          </div>
        </button>

        <div className="pt-2 border-t border-slate-700 text-xs text-slate-400 text-center">
          <p>© 2026 Tienda Ropa</p>
          <p>v3.0 Profesional</p>
        </div>
      </div>
    </aside>
  )
}
