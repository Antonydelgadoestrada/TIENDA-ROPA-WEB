'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export default function ConfiguracionPage() {
  const [config, setConfig] = useState({
    nombre_tienda: '',
    email_contacto: '',
    telefono: '',
    direccion: '',
    logo_url: '',
    moneda: 'PEN',
    modo_mantenimiento: false,
    metodos_pago: {
      tarjeta: true,
      transferencia: true,
      efectivo: false,
    },
    tiempo_entrega_dias: 3,
    costo_envio: 0,
  })

  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('configuracion_tienda')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setConfig(data)
      }
    } catch (error) {
      console.error('Error cargando configuración:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setGuardando(true)

      const { data: existingConfig } = await supabase
        .from('configuracion_tienda')
        .select('*')
        .single()

      if (existingConfig) {
        const { error } = await supabase
          .from('configuracion_tienda')
          .update(config)
          .eq('id', existingConfig.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('configuracion_tienda')
          .insert([config])

        if (error) throw error
      }

      setMensaje({ tipo: 'success', text: '✅ Configuración guardada correctamente' })
      setTimeout(() => setMensaje(null), 3000)
    } catch (error: any) {
      setMensaje({ tipo: 'error', text: `❌ Error: ${error.message}` })
      setTimeout(() => setMensaje(null), 3000)
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-slate-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">⚙️ Configuración General</h1>
          <p className="text-slate-600 mt-1">Administra los ajustes de tu tienda</p>
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

      {/* Formulario */}
      <form onSubmit={handleGuardar} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">📋 Información Básica</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de la Tienda</label>
              <input
                type="text"
                value={config.nombre_tienda}
                onChange={(e) => setConfig({ ...config, nombre_tienda: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email de Contacto</label>
                <input
                  type="email"
                  value={config.email_contacto}
                  onChange={(e) => setConfig({ ...config, email_contacto: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={config.telefono}
                  onChange={(e) => setConfig({ ...config, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Dirección</label>
              <textarea
                value={config.direccion}
                onChange={(e) => setConfig({ ...config, direccion: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">URL del Logo</label>
              <input
                type="url"
                value={config.logo_url}
                onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>
          </div>
        </div>

        {/* Operaciones */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🚚 Operaciones</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tiempo de Entrega (días)</label>
                <input
                  type="number"
                  min="1"
                  value={config.tiempo_entrega_dias}
                  onChange={(e) => setConfig({ ...config, tiempo_entrega_dias: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Costo de Envío (S/.)</label>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={config.costo_envio}
                  onChange={(e) => setConfig({ ...config, costo_envio: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">💳 Métodos de Pago</h2>
          <div className="space-y-3">
            {Object.entries(config.metodos_pago).map(([metodo, activo]) => (
              <label key={metodo} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      metodos_pago: {
                        ...config.metodos_pago,
                        [metodo]: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 rounded border-slate-300 text-blue-600"
                />
                <span className="text-slate-700 font-semibold capitalize">
                  {metodo === 'tarjeta' && '💳 Tarjeta de Crédito/Débito'}
                  {metodo === 'transferencia' && '🏦 Transferencia Bancaria'}
                  {metodo === 'efectivo' && '💵 Efectivo Contraentrega'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Modo Mantenimiento */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">🔧 Modo Mantenimiento</h2>
              <p className="text-slate-600 text-sm mt-1">Desactiva la tienda temporalmente para realizar mantenimiento</p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.modo_mantenimiento}
                onChange={(e) => setConfig({ ...config, modo_mantenimiento: e.target.checked })}
                className="w-6 h-6 rounded border-slate-300 text-orange-600"
              />
              <span className="text-sm font-semibold text-slate-700">
                {config.modo_mantenimiento ? '✅ Activado' : '❌ Desactivado'}
              </span>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={guardando}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {guardando ? '⏳ Guardando...' : '✅ Guardar Cambios'}
          </button>
          <Link
            href="/admin"
            className="px-8 py-3 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition text-center"
          >
            ← Volver
          </Link>
        </div>
      </form>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">ℹ️ Información</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Los cambios se guardarán en la base de datos de Supabase</li>
          <li>• El modo mantenimiento ocultará la tienda a los clientes</li>
          <li>• Asegúrate de completar toda la información básica antes de activar la tienda</li>
        </ul>
      </div>
    </div>
  )
}

