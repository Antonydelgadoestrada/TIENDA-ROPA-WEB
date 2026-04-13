'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Producto {
  id: string
  nombre: string
  precio: number
  descuento: number
  descripcion: string
  imagen_url: string
  categoria_id: string
  activo: boolean
  created_at: string
  categoria?: {
    nombre: string
  }
}

interface ProductoTalla {
  talla: {
    nombre: string
  }
  stock: number
}

export default function ProductosPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<'todos' | 'activos' | 'inactivos'>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [stockPorProducto, setStockPorProducto] = useState<Record<string, number>>({})

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Cargar productos
  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('productos')
        .select('*, categoria:categorias(nombre)')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Cargar stock para cada producto
      const productosConStock: Record<string, number> = {}
      for (const prod of data) {
        const { data: tallasData } = await supabase
          .from('producto_tallas')
          .select('stock')
          .eq('producto_id', prod.id)

        if (tallasData) {
          productosConStock[prod.id] = tallasData.reduce((sum: number, t: ProductoTalla) => sum + t.stock, 0)
        }
      }

      setStockPorProducto(productosConStock)
      setProductos(data || [])
    } catch (err) {
      console.error('Error:', err)
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleDesactivar = async (id: string, activo: boolean) => {
    try {
      const { error } = await supabase
        .from('productos')
        .update({ activo: !activo })
        .eq('id', id)

      if (error) throw error

      setAlert({
        type: 'success',
        message: activo ? 'Producto desactivado' : 'Producto activado',
      })

      fetchProductos()
      setTimeout(() => setAlert(null), 3000)
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al actualizar producto' })
    }
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

    try {
      // Eliminar producto_tallas primero
      await supabase.from('producto_tallas').delete().eq('producto_id', id)

      // Eliminar producto
      const { error } = await supabase.from('productos').delete().eq('id', id)

      if (error) throw error

      setAlert({ type: 'success', message: 'Producto eliminado correctamente' })
      fetchProductos()
      setTimeout(() => setAlert(null), 3000)
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al eliminar producto' })
    }
  }

  // Filtrar productos
  let productosFiltered = productos
  if (filtro === 'activos') {
    productosFiltered = productosFiltered.filter((p) => p.activo)
  } else if (filtro === 'inactivos') {
    productosFiltered = productosFiltered.filter((p) => !p.activo)
  }

  if (busqueda) {
    productosFiltered = productosFiltered.filter(
      (p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">🛍️ Productos</h1>
          <p className="text-slate-600 mt-1">Gestiona tu catálogo de ropa</p>
        </div>
        <Link
          href="/admin/agregar"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          + Nuevo Producto
        </Link>
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={`px-6 py-4 rounded-lg font-semibold ${
            alert.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtros de Estado */}
          <div className="flex gap-2">
            {[
              { label: '📋 Todos', value: 'todos' },
              { label: '✅ Activos', value: 'activos' },
              { label: '⛔ Inactivos', value: 'inactivos' },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFiltro(btn.value as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filtro === btn.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contador */}
        <div className="text-sm text-slate-600">
          Mostrando {productosFiltered.length} de {productos.length} productos
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-4xl animate-spin mb-4">⏳</div>
            <p className="text-slate-600">Cargando productos...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabla de Productos */}
      {!loading && productosFiltered.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Producto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Categoría</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Precio</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Descuento</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Stock Total</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltered.map((producto, index) => {
                  const precioFinal =
                    producto.precio * (1 - producto.descuento / 100)
                  const totalStock = stockPorProducto[producto.id] || 0

                  return (
                    <tr
                      key={producto.id}
                      className={`border-b border-slate-200 hover:bg-slate-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      }`}
                    >
                      {/* Nombre */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {producto.imagen_url && (
                            <img
                              src={producto.imagen_url}
                              alt={producto.nombre}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">
                              {producto.nombre}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {producto.descripcion}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {producto.categoria?.nombre || '-'}
                      </td>

                      {/* Precio */}
                      <td className="px-6 py-4 text-right font-semibold text-slate-900">
                        S/. {producto.precio.toFixed(2)}
                      </td>

                      {/* Descuento */}
                      <td className="px-6 py-4 text-right">
                        {producto.descuento > 0 ? (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                            -{producto.descuento}%
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            totalStock === 0
                              ? 'bg-red-100 text-red-800'
                              : totalStock < 5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {totalStock} {totalStock === 1 ? 'unidad' : 'unidades'}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            producto.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {producto.activo ? '✅ Activo' : '⛔ Inactivo'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/admin/productos/${producto.id}`}
                            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-all"
                            title="Editar producto"
                          >
                            ✏️
                          </Link>

                          <button
                            onClick={() =>
                              handleDesactivar(producto.id, producto.activo)
                            }
                            className={`px-3 py-2 rounded font-semibold transition-all ${
                              producto.activo
                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            title={
                              producto.activo
                                ? 'Desactivar'
                                : 'Activar'
                            }
                          >
                            {producto.activo ? '⛔' : '✅'}
                          </button>

                          <button
                            onClick={() => handleEliminar(producto.id)}
                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition-all"
                            title="Eliminar producto"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sin Productos */}
      {!loading && productosFiltered.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Sin productos
          </h3>
          <p className="text-slate-600 mb-6">
            {busqueda || filtro !== 'todos'
              ? 'No hay productos que coincidan con tu búsqueda'
              : 'No tienes productos aún. ¡Crea uno ahora!'}
          </p>
          <Link
            href="/admin/agregar"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all inline-block"
          >
            + Crear Primer Producto
          </Link>
        </div>
      )}
    </div>
  )
}
