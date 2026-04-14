'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

interface Cliente {
  id: string
  nombre: string
  email: string
  telefono?: string
  total_gastado?: number
  cantidad_pedidos?: number
  created_at?: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setClientes(data || [])
    } catch (error) {
      console.error('Error cargando clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  let clientesFiltrados = clientes

  // Aplicar búsqueda
  if (busqueda) {
    clientesFiltrados = clientesFiltrados.filter(
      (c) =>
        c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.email?.toLowerCase().includes(busqueda.toLowerCase())
    )
  }

  // Aplicar filtro
  if (filtro === 'activos') {
    clientesFiltrados = clientesFiltrados.filter((c) => c.total_gastado && c.total_gastado > 0)
  } else if (filtro === 'inactivos') {
    clientesFiltrados = clientesFiltrados.filter((c) => !c.total_gastado)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">👥 Gestión de Clientes</h1>
          <p className="text-slate-600 mt-1">Administra y consulta información de tus clientes</p>
        </div>
        <Link
          href="/admin"
          className="px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
        >
          ← Volver al Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow p-6 text-white">
          <p className="text-blue-100 text-sm font-medium">Total Clientes</p>
          <h3 className="text-4xl font-bold mt-2">{clientes.length}</h3>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow p-6 text-white">
          <p className="text-green-100 text-sm font-medium">Clientes Activos</p>
          <h3 className="text-4xl font-bold mt-2">{clientes.filter((c) => c.total_gastado && c.total_gastado > 0).length}</h3>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow p-6 text-white">
          <p className="text-purple-100 text-sm font-medium">Ingresos Totales</p>
          <h3 className="text-2xl font-bold mt-2">
            S/. {clientes.reduce((sum, c) => sum + (c.total_gastado || 0), 0).toFixed(2)}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow p-6 text-white">
          <p className="text-orange-100 text-sm font-medium">Ticket Promedio</p>
          <h3 className="text-2xl font-bold mt-2">
            S/. {clientes.length > 0 ? (clientes.reduce((sum, c) => sum + (c.total_gastado || 0), 0) / clientes.length).toFixed(2) : '0.00'}
          </h3>
        </div>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {[
              { label: 'Todos', value: 'todos' },
              { label: 'Activos', value: 'activos' },
              { label: 'Inactivos', value: 'inactivos' },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFiltro(btn.value)}
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
        <div className="text-sm text-slate-600">
          Mostrando {clientesFiltrados.length} de {clientes.length} clientes
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-4xl animate-spin mb-4">⏳</div>
            <p className="text-slate-600">Cargando clientes...</p>
          </div>
        </div>
      )}

      {/* Tabla */}
      {!loading && clientesFiltrados.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Teléfono</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Pedidos</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Total Gastado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Fecha Registro</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{cliente.nombre}</td>
                    <td className="px-6 py-4 text-slate-600">{cliente.email}</td>
                    <td className="px-6 py-4 text-slate-600">{cliente.telefono || '-'}</td>
                    <td className="px-6 py-4 text-right font-semibold">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {cliente.cantidad_pedidos || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      S/. {(cliente.total_gastado || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">
                      {cliente.created_at ? new Date(cliente.created_at).toLocaleDateString('es-PE') : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && clientesFiltrados.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-slate-600 text-lg">No hay clientes para mostrar</p>
        </div>
      )}
    </div>
  )
}
