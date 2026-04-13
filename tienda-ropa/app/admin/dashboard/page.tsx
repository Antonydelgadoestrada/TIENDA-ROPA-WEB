'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

interface Producto {
  id: string
  nombre: string
  precio: number
  descuento: number
  created_at: string
}

interface Resumen {
  totalProductos: number
  productosActivos: number
  ingresosPotenciales: number
  sinStock: number
  stockBajo: number
  stockTotal: number
}

export default function Dashboard() {
  const [resumen, setResumen] = useState<Resumen>({
    totalProductos: 0,
    productosActivos: 0,
    ingresosPotenciales: 0,
    sinStock: 0,
    stockBajo: 0,
    stockTotal: 0,
  })
  const [loading, setLoading] = useState(true)
  const [productosRecientes, setProductosRecientes] = useState<Producto[]>([])

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchResumen()
  }, [])

  const fetchResumen = async () => {
    try {
      setLoading(true)

      // Obtener productos
      const { data: productos, error: err1 } = await supabase
        .from('productos')
        .select('*')

      if (err1) throw err1

      // Obtener stock total
      const { data: stocks, error: err2 } = await supabase
        .from('producto_tallas')
        .select('stock, producto_id')

      if (err2) throw err2

      // Calcular resumen
      const totalProductos = productos?.length || 0
      const productosActivos = productos?.filter(p => p.activo).length || 0
      const ingresosPotenciales = productos?.reduce((sum, p) => sum + p.precio, 0) || 0

      let sinStock = 0
      let stockBajo = 0

      if (productos && stocks) {
        for (const producto of productos) {
          const stockProducto = stocks
            .filter(s => s.producto_id === producto.id)
            .reduce((sum, s) => sum + s.stock, 0)

          if (stockProducto === 0) sinStock++
          if (stockProducto > 0 && stockProducto < 5) stockBajo++
        }
      }

      const stockTotal = stocks?.reduce((sum, s) => sum + s.stock, 0) || 0

      setResumen({
        totalProductos,
        productosActivos,
        ingresosPotenciales,
        sinStock,
        stockBajo,
        stockTotal,
      })

      // Obtener últimos 3 productos
      if (productos) {
        setProductosRecientes(
          productos
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3)
        )
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">📊 Dashboard</h1>
        <p className="text-slate-600 mt-2">Bienvenido al panel administrativo de tu tienda</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-4xl animate-spin mb-4">⏳</div>
            <p className="text-slate-600">Cargando resumen...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* KPIs - 4 Tarjetas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Productos */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-blue-600 text-sm font-semibold">📊 Total Productos</p>
                  <p className="text-4xl font-bold text-blue-700 mt-3">{resumen.totalProductos}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    ✅ {resumen.productosActivos} activos
                  </p>
                </div>
              </div>
            </div>

            {/* Stock Total */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-green-600 text-sm font-semibold">📦 Stock Total</p>
                  <p className="text-4xl font-bold text-green-700 mt-3">{resumen.stockTotal}</p>
                  <p className="text-xs text-green-600 mt-2">Unidades disponibles</p>
                </div>
              </div>
            </div>

            {/* Sin Stock */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-red-600 text-sm font-semibold">⚠️ Sin Stock</p>
                  <p className="text-4xl font-bold text-red-700 mt-3">{resumen.sinStock}</p>
                  <p className="text-xs text-red-600 mt-2">Requiere reorden</p>
                </div>
              </div>
            </div>

            {/* Stock Bajo */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-yellow-600 text-sm font-semibold">📦 Stock Bajo</p>
                  <p className="text-4xl font-bold text-yellow-700 mt-3">{resumen.stockBajo}</p>
                  <p className="text-xs text-yellow-600 mt-2">Menor a 5 unidades</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">🚀 Accesos Rápidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Inventario */}
              <Link href="/admin/inventario">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-slate-200 p-6 cursor-pointer group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    📦
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Inventario</h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Gestiona entrada, salida y ajustes de stock
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Ir →
                  </div>
                </div>
              </Link>

              {/* Pedidos */}
              <Link href="/admin/pedidos">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-slate-200 p-6 cursor-pointer group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    📋
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Pedidos</h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Ver y gestionar órdenes de clientes
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Ir →
                  </div>
                </div>
              </Link>

              {/* Reportes */}
              <Link href="/admin/reportes">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-slate-200 p-6 cursor-pointer group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Reportes</h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Analytics y estadísticas del negocio
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Ir →
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Productos Recientes */}
          {productosRecientes.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">🆕 Productos Recientes</h2>
                <Link
                  href="/admin/productos"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Ver todos →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {productosRecientes.map((producto) => (
                  <Link key={producto.id} href={`/admin/productos/${producto.id}`}>
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-slate-200 p-4 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 line-clamp-1">
                          {producto.nombre}
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Nuevo
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-slate-900">
                          S/. {producto.precio.toFixed(2)}
                        </p>
                        {producto.descuento > 0 && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                            -{producto.descuento}%
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Acciones Rápidas */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">⚡ ¿Qué necesitas hacer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/agregar"
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                ➕ Crear Nuevo Producto
              </Link>
              <Link
                href="/admin/productos"
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                📝 Ver Todos los Productos
              </Link>
              <Link
                href="/admin/inventario"
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                📦 Registrar Movimiento de Stock
              </Link>
              <Link
                href="/admin/reportes"
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                📊 Ver Análisis
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
