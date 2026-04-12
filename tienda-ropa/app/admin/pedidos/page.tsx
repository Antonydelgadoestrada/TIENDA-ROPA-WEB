'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Pedido {
  id: string
  numero: number
  cliente_nombre: string
  cliente_email: string
  total: number
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado'
  items_count: number
  created_at: string
  updated_at: string
}

export default function PedidosPage() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todos' | 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado'>('pendiente')

  useEffect(() => {
    // TODO: Fetch desde API real cuando tabla exista
    // Por ahora, mostrar data de ejemplo
    setPedidos([
      {
        id: '1',
        numero: 1001,
        cliente_nombre: 'Juan García',
        cliente_email: 'juan@email.com',
        total: 250.50,
        estado: 'procesando',
        items_count: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        numero: 1002,
        cliente_nombre: 'María López',
        cliente_email: 'maria@email.com',
        total: 180.00,
        estado: 'pendiente',
        items_count: 2,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ])
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleCambiarEstado = (pedidoId: string, nuevoEstado: string) => {
    setPedidos(prev =>
      prev.map(p => (p.id === pedidoId ? { ...p, estado: nuevoEstado as any } : p))
    )
    // TODO: Llamar API para persistir cambio
  }

  const filtrados = pedidos.filter(p => {
    if (filtro === 'todos') return true
    return p.estado === filtro
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700'
      case 'procesando':
        return 'bg-blue-100 text-blue-700'
      case 'enviado':
        return 'bg-indigo-100 text-indigo-700'
      case 'entregado':
        return 'bg-green-100 text-green-700'
      case 'cancelado':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return '⏳'
      case 'procesando':
        return '⚙️'
      case 'enviado':
        return '🚚'
      case 'entregado':
        return '✓'
      case 'cancelado':
        return '✗'
      default:
        return '?'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm mb-2 block">
              ← Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">📋 Gestión de Pedidos</h1>
            <p className="text-sm text-gray-600">Control de órdenes y entregas</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold">Total Pedidos</p>
            <p className="text-2xl font-bold text-gray-900">{pedidos.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{pedidos.filter(p => p.estado === 'pendiente').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold">Procesando</p>
            <p className="text-2xl font-bold text-blue-600">{pedidos.filter(p => p.estado === 'procesando').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold">Enviados</p>
            <p className="text-2xl font-bold text-indigo-600">{pedidos.filter(p => p.estado === 'enviado').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold">Total Ventas</p>
            <p className="text-2xl font-bold text-emerald-600">
              S/. {pedidos.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'todos', label: '📋 Todos' },
              { value: 'pendiente', label: '⏳ Pendientes' },
              { value: 'procesando', label: '⚙️ Procesando' },
              { value: 'enviado', label: '🚚 Enviados' },
              { value: 'entregado', label: '✓ Entregados' },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFiltro(f.value as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filtro === f.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Pedidos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-600 to-teal-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Pedido #</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                      Sin pedidos en este estado
                    </td>
                  </tr>
                ) : (
                  filtrados.map(pedido => (
                    <tr key={pedido.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-bold text-lg text-gray-900">#{pedido.numero}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{pedido.cliente_nombre}</p>
                          <p className="text-xs text-gray-600">{pedido.cliente_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                          {pedido.items_count} items
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-emerald-600">S/. {pedido.total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getEstadoColor(pedido.estado)}`}>
                          {getEstadoIcon(pedido.estado)} {pedido.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={pedido.estado}
                          onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm font-semibold focus:outline-none focus:border-emerald-500"
                        >
                          <option value="pendiente">⏳ Pendiente</option>
                          <option value="procesando">⚙️ Procesando</option>
                          <option value="enviado">🚚 Enviado</option>
                          <option value="entregado">✓ Entregado</option>
                          <option value="cancelado">✗ Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nota */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            📝 <strong>Nota:</strong> Esta sección mostrará pedidos reales cuando integres un carrito de compras. Por ahora, son datos de ejemplo.
          </p>
        </div>
      </main>
    </div>
  )
}
