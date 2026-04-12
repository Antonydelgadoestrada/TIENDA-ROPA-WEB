'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Producto {
  id: string
  nombre: string
  precio: number
  descripcion: string
  imagen_url: string
  activo: boolean
  created_at: string
}

interface ProductoTalla {
  id: string
  producto_id: string
  talla_id: string
  stock: number
  talla: {
    nombre: string
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stockModal, setStockModal] = useState<string | null>(null)
  const [tallasProducto, setTallasProducto] = useState<ProductoTalla[]>([])
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Cargar productos
  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error: supabaseError } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError
      setProductos(data || [])
    } catch (err) {
      console.error('Error:', err)
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  // Auto-cerrar alertas después de 4 segundos
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleEdit = (productoId: string) => {
    router.push(`/admin/productos/${productoId}`)
  }

  const handleDelete = async (id: string, producto: Producto) => {
    if (!confirm(`¿Desactivar "${producto.nombre}"?`)) return

    try {
      const response = await fetch('/api/productos/eliminar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, desactivar: true }),
      })

      if (!response.ok) throw new Error('Error')

      setAlert({ type: 'success', message: 'Producto desactivado ✓' })
      fetchProductos()
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al desactivar' })
    }
  }

  const handleOpenStock = async (productoId: string) => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error: err } = await supabase
        .from('producto_tallas')
        .select('id, producto_id, talla_id, stock, talla:tallas(nombre)')
        .eq('producto_id', productoId)

      if (err) throw err
      setTallasProducto(data || [])
      setStockModal(productoId)
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al cargar tallas' })
    }
  }

  const handleUpdateStock = async (productoTallaId: string, nuevoStock: number) => {
    try {
      const pt = tallasProducto.find(t => t.id === productoTallaId)
      if (!pt) return

      const response = await fetch('/api/productos/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id: pt.producto_id,
          talla_id: pt.talla_id,
          stock: nuevoStock,
        }),
      })

      if (!response.ok) throw new Error('Error')

      setTallasProducto(prev =>
        prev.map(t =>
          t.id === productoTallaId ? { ...t, stock: nuevoStock } : t
        )
      )
      setAlert({ type: 'success', message: 'Stock actualizado ✓' })
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al actualizar stock' })
    }
  }

  const filtrados = productos.filter(p => {
    // Filtro por estado
    if (filtro === 'activos' && !p.activo) return false
    if (filtro === 'inactivos' && p.activo) return false

    // Filtro por búsqueda
    if (busqueda.toLowerCase()) {
      const searchLower = busqueda.toLowerCase()
      const matchNombre = p.nombre.toLowerCase().includes(searchLower)
      const matchDescripcion = p.descripcion.toLowerCase().includes(searchLower)
      return matchNombre || matchDescripcion
    }

    return true
  })

  const totalStock = (productoId: string) => {
    return tallasProducto
      .filter(t => t.producto_id === productoId)
      .reduce((sum, t) => sum + t.stock, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">🏪 Tienda Ropa</h1>
            <p className="text-sm text-gray-600">Panel Administrativo Profesional</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/agregar"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              ➕ Nuevo Producto
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        {alert && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              alert.type === 'success'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : 'bg-red-50 border-red-500 text-red-700'
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg shadow-sm border border-emerald-200">
            <p className="text-emerald-600 text-sm font-semibold">📊 Total Productos</p>
            <p className="text-4xl font-bold text-emerald-700 mt-2">{productos.length}</p>
            <p className="text-xs text-emerald-600 mt-2">{productos.filter(p => p.activo).length} activos</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200">
            <p className="text-blue-600 text-sm font-semibold">💰 Ingresos Potenciales</p>
            <p className="text-4xl font-bold text-blue-700 mt-2">
              S/. {productos.reduce((sum, p) => sum + p.precio, 0).toFixed(0)}
            </p>
            <p className="text-xs text-blue-600 mt-2">Valor en inventario</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-sm border border-red-200">
            <p className="text-red-600 text-sm font-semibold">⚠️ Sin Stock</p>
            <p className="text-4xl font-bold text-red-700 mt-2">0</p>
            <p className="text-xs text-red-600 mt-2">Requiere reorden</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-sm border border-yellow-200">
            <p className="text-yellow-600 text-sm font-semibold">📦 Stock Bajo</p>
            <p className="text-4xl font-bold text-yellow-700 mt-2">0</p>
            <p className="text-xs text-yellow-600 mt-2">Menor a 5 unidades</p>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/inventario"
            className="group relative p-6 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-lg transition hover:border-emerald-500"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📦</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600">Inventario</h3>
                <p className="text-sm text-gray-600">Entrada/Salida de productos</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/pedidos"
            className="group relative p-6 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-lg transition hover:border-emerald-500"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📋</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600">Pedidos</h3>
                <p className="text-sm text-gray-600">Gestión de órdenes</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/reportes"
            className="group relative p-6 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-lg transition hover:border-emerald-500"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📊</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600">Reportes</h3>
                <p className="text-sm text-gray-600">Analytics y ventas</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'todos', label: '📋 Todos' },
              { value: 'activos', label: '✅ Activos' },
              { value: 'inactivos', label: '❌ Inactivos' },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFiltro(f.value)}
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

          <input
            type="text"
            placeholder="🔍 Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {filtrados.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              <p className="text-lg font-semibold">No se encontraron productos</p>
              <p className="text-sm mt-2">Intenta modificar los filtros o búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Producto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtrados.map(producto => (
                    <tr key={producto.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900">{producto.nombre}</p>
                          <p className="text-xs text-gray-500 truncate">{producto.descripcion}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-emerald-600">
                          S/. {producto.precio.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenStock(producto.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-semibold hover:bg-blue-200 text-sm"
                        >
                          📦 Ver Stock
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            producto.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {producto.activo ? '✓ Activo' : '✗ Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(producto.id)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-semibold hover:bg-yellow-600"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(producto.id, producto)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600"
                          >
                            🗑️ Desactivar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Stock */}
      {stockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Gestión de Stock</h3>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {tallasProducto.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Sin tallas disponibles</p>
              ) : (
                <div className="space-y-3">
                  {tallasProducto.map(talla => (
                    <div key={talla.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900 w-16">
                        {typeof talla.talla === 'object' ? talla.talla.nombre : 'Talla'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStock(talla.id, talla.stock - 1)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-bold text-lg text-gray-900">
                          {talla.stock}
                        </span>
                        <button
                          onClick={() => handleUpdateStock(talla.id, talla.stock + 1)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setStockModal(null)}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
