'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProductoStock {
  id: string
  nombre: string
  precio: number
  stock_total: number
  valor_total: number
}

interface ReporteData {
  resumen: {
    total_productos: number
    total_stock: number
    valor_inventario: string
    stock_bajo: number
    sin_stock: number
  }
  productos: ProductoStock[]
}

export default function ReportesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ReporteData | null>(null)
  const [tab, setTab] = useState<'inventario' | 'ventas' | 'productos'>('inventario')

  useEffect(() => {
    fetchReportes()
  }, [])

  const fetchReportes = async () => {
    try {
      const response = await fetch('/api/reportes/inventario', {
        credentials: 'include',
      })

      const reporteData = await response.json()
      setData(reporteData)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando reportes...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">📊 Reportes y Analytics</h1>
            <p className="text-sm text-gray-600">Análisis de tu negocio</p>
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
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border-b border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'inventario', label: '📦 Inventario', icon: '📊' },
              { id: 'ventas', label: '💰 Ventas (Próximamente)', icon: '💵' },
              { id: 'productos', label: '🏷️ Productos Top', icon: '⭐' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                disabled={t.id !== 'inventario'}
                className={`flex-1 px-6 py-4 font-semibold transition border-b-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  tab === t.id
                    ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab: Inventario */}
        {tab === 'inventario' && data && (
          <div className="space-y-6">
            {/* Resumen de Inventario */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg shadow-sm border border-emerald-200">
                <p className="text-emerald-600 text-sm font-semibold">Total Productos</p>
                <p className="text-4xl font-bold text-emerald-700 mt-2">{data.resumen.total_productos}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200">
                <p className="text-blue-600 text-sm font-semibold">Stock Total</p>
                <p className="text-4xl font-bold text-blue-700 mt-2">{data.resumen.total_stock}</p>
                <p className="text-xs text-blue-600 mt-1">unidades</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm border border-purple-200">
                <p className="text-purple-600 text-sm font-semibold">Valor Inventario</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">S/. {data.resumen.valor_inventario}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-sm border border-yellow-200">
                <p className="text-yellow-600 text-sm font-semibold">Stock Bajo</p>
                <p className="text-4xl font-bold text-yellow-700 mt-2">{data.resumen.stock_bajo}</p>
                <p className="text-xs text-yellow-600 mt-1">&lt; 5 unidades</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-sm border border-red-200">
                <p className="text-red-600 text-sm font-semibold">Sin Stock</p>
                <p className="text-4xl font-bold text-red-700 mt-2">{data.resumen.sin_stock}</p>
                <p className="text-xs text-red-600 mt-1">Agotado</p>
              </div>
            </div>

            {/* Productos con Stock Bajo */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white">⚠️ Productos con Stock Bajo</h3>
                <p className="text-emerald-100 text-sm">Primeros 10 productos que necesitan reorden</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio Unit.</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Valor Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.productos.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                          ✓ Todos los productos tienen stock saludable
                        </td>
                      </tr>
                    ) : (
                      data.productos.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{p.nombre}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold ${
                                p.stock_total === 0
                                  ? 'bg-red-100 text-red-700'
                                  : p.stock_total < 5
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {p.stock_total}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">S/. {p.precio.toFixed(2)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-emerald-600">S/. {p.valor_total.toFixed(2)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/admin/inventario`}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
                            >
                              Reordenar
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Ventas (Próximamente) */}
        {tab === 'ventas' && (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <p className="text-2xl text-gray-600 mb-2">💰 Reportes de Ventas</p>
            <p className="text-gray-500">
              Esta sección mostrará tus ventas totales, productos más vendidos, ingresos mensuales y más, cuando integres el carrito de compras.
            </p>
          </div>
        )}

        {/* Tab: Productos */}
        {tab === 'productos' && (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <p className="text-2xl text-gray-600 mb-2">⭐ Productos Más Vendidos</p>
            <p className="text-gray-500">
              Próximamente: Ranking de productos más vendidos, productos con mayor margen, tendencias.
            </p>
          </div>
        )}

        {/* Resumen Inferior */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-bold text-blue-900 mb-2">💡 Recomendaciones</h4>
          {data && data.resumen.sin_stock > 0 && (
            <p className="text-blue-800 mb-2">
              ⚠️ Tienes <strong>{data.resumen.sin_stock} productos</strong> sin stock. Considera reordenar con tus proveedores.
            </p>
          )}
          {data && data.resumen.stock_bajo > 0 && (
            <p className="text-blue-800 mb-2">
              📦 <strong>{data.resumen.stock_bajo} productos</strong> tienen stock bajo (&lt; 5). Revisa el inventario regularmente.
            </p>
          )}
          <p className="text-blue-800">
            💰 Tu inventario tiene un valor total de <strong>S/. {data?.resumen.valor_inventario}</strong>. Mantén este valor actualizado.
          </p>
        </div>
      </main>
    </div>
  )
}
