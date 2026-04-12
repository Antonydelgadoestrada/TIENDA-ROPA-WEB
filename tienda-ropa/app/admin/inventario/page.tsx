'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

interface Movimiento {
  id: string
  producto_id: string
  talla_id: string
  tipo: 'entrada' | 'salida' | 'ajuste'
  cantidad_movida: number
  stock_anterior: number
  stock_nuevo: number
  razon: string
  referencia: string | null
  created_at: string
  producto?: { nombre: string }
  talla?: { nombre: string }
}

interface Producto {
  id: string
  nombre: string
}

interface Talla {
  id: string
  nombre: string
}

export default function InventarioPage() {
  const [tab, setTab] = useState<'entrada' | 'salida' | 'historial'>('entrada')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Datos para los selects
  const [productos, setProductos] = useState<Producto[]>([])
  const [tallas, setTallas] = useState<Talla[]>([])

  // Movimientos
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])

  // Form state
  const [formData, setFormData] = useState({
    producto_id: '',
    talla_id: '',
    cantidad: '',
    razon: '',
    referencia: '',
  })

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    fetchProductos()
    fetchTallas()
    fetchMovimientos()
  }, [])

  const fetchProductos = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('productos')
        .select('id, nombre')
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      setProductos(data || [])
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchTallas = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('tallas')
        .select('id, nombre')
        .order('orden')

      if (error) throw error
      setTallas(data || [])
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchMovimientos = async () => {
    try {
      const response = await fetch('/api/inventario/movimientos?limite=100', {
        credentials: 'include',
      })
      const data = await response.json()
      setMovimientos(data.movimientos || [])
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent, tipo: 'entrada' | 'salida' | 'ajuste') => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!formData.producto_id || !formData.talla_id || !formData.cantidad) {
        setAlert({ type: 'error', message: 'Completa todos los campos requeridos' })
        setSaving(false)
        return
      }

      const response = await fetch('/api/inventario/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id: formData.producto_id,
          talla_id: formData.talla_id,
          tipo,
          cantidad: parseInt(formData.cantidad),
          razon: formData.razon || (tipo === 'entrada' ? 'Compra a proveedor' : 'Venta'),
          referencia: formData.referencia || null,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      setAlert({
        type: 'success',
        message: `✓ ${tipo === 'entrada' ? 'Entrada' : tipo === 'salida' ? 'Salida' : 'Ajuste'} registrado correctamente`,
      })

      // Limpiar form
      setFormData({ producto_id: '', talla_id: '', cantidad: '', razon: '', referencia: '' })

      // Refresca historial
      setTimeout(() => {
        fetchMovimientos()
      }, 500)
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Error al registrar movimiento' })
    } finally {
      setSaving(false)
    }
  }

  const getRazonesSugeridas = (tipo: 'entrada' | 'salida' | 'ajuste') => {
    if (tipo === 'entrada') {
      return ['Compra a proveedor', 'Devolución de cliente', 'Consignación', 'Ajuste de inventario']
    }
    if (tipo === 'salida') {
      return ['Venta online', 'Venta en tienda', 'Deovolución a proveedor', 'Dañado/Pérdida']
    }
    return ['Corrección manual', 'Auditoria', 'Inventario físico']
  }

  const getTipoColor = (tipo: string) => {
    if (tipo === 'entrada') return 'bg-green-100 text-green-700'
    if (tipo === 'salida') return 'bg-red-100 text-red-700'
    return 'bg-blue-100 text-blue-700'
  }

  const getTipoIcon = (tipo: string) => {
    if (tipo === 'entrada') return '📥'
    if (tipo === 'salida') return '📤'
    return '🔧'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin/dashboard" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm mb-2 block">
            ← Volver al Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">📦 Gestión de Inventario</h1>
          <p className="text-sm text-gray-600">Entrada, salida y ajuste de productos</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border-b border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'entrada', label: '📥 Entrada de Producto', icon: '✓' },
              { id: 'salida', label: '📤 Salida de Producto', icon: '✗' },
              { id: 'historial', label: '📋 Historial', icon: '📊' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex-1 px-6 py-4 font-semibold transition border-b-2 ${
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

        {/* Contenido Tabs */}
        {tab !== 'historial' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={(e) => handleSubmit(e, tab as 'entrada' | 'salida')}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Producto */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Producto *
                  </label>
                  <select
                    name="producto_id"
                    value={formData.producto_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Seleccionar producto...</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Talla */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Talla *
                  </label>
                  <select
                    name="talla_id"
                    value={formData.talla_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Seleccionar talla...</option>
                    {tallas.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cantidad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                    min="1"
                    required
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Referencia */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Referencia
                  </label>
                  <input
                    type="text"
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleInputChange}
                    placeholder="Ej: OC-2024-001, PED-12345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Razón */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Razón *
                  </label>
                  <select
                    name="razon"
                    value={formData.razon}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 mb-2"
                  >
                    <option value="">Seleccionar razón...</option>
                    {getRazonesSugeridas(tab as 'entrada' | 'salida').map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="O escribe una razón personalizada..."
                    value={formData.razon}
                    onChange={handleInputChange}
                    name="razon"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              {/* Botón Submit */}
              <div className="mt-6 flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-70"
                >
                  {saving ? '⏳ Registrando...' : `✓ Registrar ${tab === 'entrada' ? 'Entrada' : 'Salida'}`}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ producto_id: '', talla_id: '', cantidad: '', razon: '', referencia: '' })}
                  className="px-6 py-3 bg-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-400 transition"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Historial */}
        {tab === 'historial' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Tipo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Producto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Talla</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Cantidad</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Razón</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Referencia</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {movimientos.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-600">
                        Sin movimientos registrados
                      </td>
                    </tr>
                  ) : (
                    movimientos.map((mov) => (
                      <tr key={mov.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getTipoColor(mov.tipo)}`}>
                            {getTipoIcon(mov.tipo)} {mov.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {mov.producto?.nombre || 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-700 font-medium">
                            {mov.talla?.nombre || 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-lg">
                            {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad_movida}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-600">Anterior: {mov.stock_anterior}</p>
                            <p className="font-bold text-emerald-600">Nuevo: {mov.stock_nuevo}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{mov.razon}</p>
                        </td>
                        <td className="px-6 py-4">
                          {mov.referencia ? (
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {mov.referencia}
                            </code>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(mov.created_at).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
