'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

interface Cupon {
  id: string
  codigo: string
  tipo: 'porcentaje' | 'fijo'
  valor: number
  minimo_compra?: number
  aplicable_a?: string
  veces_usado?: number
  fecha_expiracion?: string
  activo: boolean
  created_at: string
}

export default function CuponesPage() {
  const [cupones, setCupones] = useState<Cupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    codigo: '',
    tipo: 'porcentaje',
    valor: 0,
    minimo_compra: 0,
    aplicable_a: 'todos',
    fecha_expiracion: '',
  })
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadCupones()
  }, [])

  const loadCupones = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cupones')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCupones(data || [])
    } catch (error) {
      console.error('Error cargando cupones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrearCupon = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await supabase
        .from('cupones')
        .insert([
          {
            codigo: formData.codigo.toUpperCase(),
            tipo: formData.tipo,
            valor: parseFloat(formData.valor.toString()),
            minimo_compra: parseFloat(formData.minimo_compra.toString()),
            aplicable_a: formData.aplicable_a,
            fecha_expiracion: formData.fecha_expiracion || null,
            activo: true,
          },
        ])

      if (error) throw error

      setMensaje({ tipo: 'success', text: '✅ Cupón creado exitosamente' })
      setFormData({
        codigo: '',
        tipo: 'porcentaje',
        valor: 0,
        minimo_compra: 0,
        aplicable_a: 'todos',
        fecha_expiracion: '',
      })
      setShowForm(false)
      loadCupones()
      setTimeout(() => setMensaje(null), 3000)
    } catch (error: any) {
      setMensaje({ tipo: 'error', text: `❌ Error: ${error.message}` })
      setTimeout(() => setMensaje(null), 3000)
    }
  }

  const handleDesactivar = async (id: string, activo: boolean) => {
    try {
      const { error } = await supabase
        .from('cupones')
        .update({ activo: !activo })
        .eq('id', id)

      if (error) throw error

      setMensaje({
        tipo: 'success',
        text: activo ? '✅ Cupón desactivado' : '✅ Cupón activado',
      })
      loadCupones()
      setTimeout(() => setMensaje(null), 3000)
    } catch (error: any) {
      setMensaje({ tipo: 'error', text: `❌ Error: ${error.message}` })
      setTimeout(() => setMensaje(null), 3000)
    }
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cupón?')) return

    try {
      const { error } = await supabase.from('cupones').delete().eq('id', id)

      if (error) throw error

      setMensaje({ tipo: 'success', text: '✅ Cupón eliminado' })
      loadCupones()
      setTimeout(() => setMensaje(null), 3000)
    } catch (error: any) {
      setMensaje({ tipo: 'error', text: `❌ Error: ${error.message}` })
      setTimeout(() => setMensaje(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">🎟️ Cupones y Descuentos</h1>
          <p className="text-slate-600 mt-1">Crea y administra códigos de descuento</p>
        </div>
        <Link
          href="/admin"
          className="px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
        >
          ← Volver al Dashboard
        </Link>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div
          className={`px-6 py-4 rounded-lg font-semibold ${
            mensaje.tipo === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {mensaje.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow p-6 text-white">
          <p className="text-blue-100 text-sm font-medium">Total Cupones</p>
          <h3 className="text-4xl font-bold mt-2">{cupones.length}</h3>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow p-6 text-white">
          <p className="text-green-100 text-sm font-medium">Cupones Activos</p>
          <h3 className="text-4xl font-bold mt-2">{cupones.filter((c) => c.activo).length}</h3>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow p-6 text-white">
          <p className="text-purple-100 text-sm font-medium">Usos Totales</p>
          <h3 className="text-4xl font-bold mt-2">{cupones.reduce((sum, c) => sum + (c.veces_usado || 0), 0)}</h3>
        </div>
      </div>

      {/* Botón Crear */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          + Crear Nuevo Cupón
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold text-slate-900 mb-4">📝 Nuevo Cupón</h2>
          <form onSubmit={handleCrearCupon} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Código */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Código *</label>
                <input
                  type="text"
                  required
                  placeholder="ej: DESCUENTO20"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="porcentaje">Porcentaje (%)</option>
                  <option value="fijo">Monto Fijo (S/.)</option>
                </select>
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Valor {formData.tipo === 'porcentaje' ? '(%)' : '(S/.)'}  *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step={formData.tipo === 'porcentaje' ? '1' : '0.50'}
                  placeholder="0"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Compra Mínima */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Compra Mínima (S/.)</label>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  placeholder="0"
                  value={formData.minimo_compra}
                  onChange={(e) => setFormData({ ...formData, minimo_compra: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Aplicable a */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Aplicable a</label>
                <select
                  value={formData.aplicable_a}
                  onChange={(e) => setFormData({ ...formData, aplicable_a: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos los Productos</option>
                  <option value="primero">Primer Compra</option>
                  <option value="categoria">Categoría Específica</option>
                </select>
              </div>

              {/* Fecha Expiración */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha Expiración</label>
                <input
                  type="date"
                  value={formData.fecha_expiracion}
                  onChange={(e) => setFormData({ ...formData, fecha_expiracion: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                ✅ Crear Cupón
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-4xl animate-spin mb-4">⏳</div>
            <p className="text-slate-600">Cargando cupones...</p>
          </div>
        </div>
      )}

      {/* Tabla */}
      {!loading && cupones.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Código</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tipo</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Valor</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Compra Mín.</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Usos</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Expira</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cupones.map((cupon) => (
                  <tr key={cupon.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{cupon.codigo}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cupon.tipo === 'porcentaje'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {cupon.tipo === 'porcentaje' ? `${cupon.valor}%` : `S/. ${cupon.valor}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {cupon.tipo === 'porcentaje' ? `${cupon.valor}%` : `S/. ${cupon.valor.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      S/. {(cupon.minimo_compra || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {cupon.veces_usado || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">
                      {cupon.fecha_expiracion
                        ? new Date(cupon.fecha_expiracion).toLocaleDateString('es-PE')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cupon.activo
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {cupon.activo ? '✅ Activo' : '❌ Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-y-2">
                      <button
                        onClick={() => handleDesactivar(cupon.id, cupon.activo)}
                        className={`w-full px-2 py-1 text-xs rounded font-semibold transition ${
                          cupon.activo
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {cupon.activo ? '🔒 Desactivar' : '🔓 Activar'}
                      </button>
                      <button
                        onClick={() => handleEliminar(cupon.id)}
                        className="w-full px-2 py-1 text-xs bg-red-100 text-red-700 rounded font-semibold hover:bg-red-200 transition"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && cupones.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-slate-600 text-lg mb-4">No hay cupones disponibles</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Crear el Primer Cupón
          </button>
        </div>
      )}
    </div>
  )
}
