'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaExclamationTriangle, FaArrowUp, FaChartBar, FaEye } from 'react-icons/fa'
import Link from 'next/link'

interface Pedido {
  id: string
  numero_pedido: string
  total: number
  estado: string
  created_at: string
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    ventasHoy: 0,
    pedidosNuevos: 0,
    clientesNuevos: 0,
    ingresoMes: 0,
    productosAgorados: 0,
    productosPublicados: 0,
  })

  const [pedidosRecientes, setPedidosRecientes] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const mesActualInicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

      let pedidosHoy: any[] = []
      let pedidosPendientes: any[] = []
      let clientesNuevos = 0
      let pedidosMes: any[] = []
      let productos: any[] = []
      let ultimosPedidos: any[] = []

      try {
        // Cargar pedidos de hoy
        const result1 = await supabase
          .from('pedidos')
          .select('total')
          .gte('created_at', today)
        if (result1.data) pedidosHoy = result1.data
      } catch (e) {
        console.error('Error cargando pedidos hoy:', e)
      }

      try {
        // Cargar pedidos pendientes
        const result2 = await supabase
          .from('pedidos')
          .select('*')
          .eq('estado', 'pendiente')
          .limit(100)
        if (result2.data) pedidosPendientes = result2.data
      } catch (e) {
        console.error('Error cargando pedidos pendientes:', e)
      }

      try {
        // Cargar clientes nuevos
        const result3 = await supabase
          .from('usuarios')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today)
        if (result3.count) clientesNuevos = result3.count
      } catch (e) {
        console.error('Error cargando clientes nuevos:', e)
      }

      try {
        // Cargar ingresos del mes
        const result4 = await supabase
          .from('pedidos')
          .select('total')
          .gte('created_at', mesActualInicio)
        if (result4.data) pedidosMes = result4.data
      } catch (e) {
        console.error('Error cargando ingresos del mes:', e)
      }

      try {
        // Cargar todos los productos
        const result5 = await supabase
          .from('productos')
          .select('*')
        if (result5.data) productos = result5.data
      } catch (e) {
        console.error('Error cargando productos:', e)
      }

      try {
        // Cargar últimos pedidos
        const result6 = await supabase
          .from('pedidos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        if (result6.data) ultimosPedidos = result6.data
      } catch (e) {
        console.error('Error cargando últimos pedidos:', e)
      }


      setMetrics({
        ventasHoy: pedidosHoy.reduce((sum, p) => sum + (p.total || 0), 0),
        pedidosNuevos: pedidosPendientes.length,
        clientesNuevos: clientesNuevos,
        ingresoMes: pedidosMes.reduce((sum, p) => sum + (p.total || 0), 0),
        productosAgorados: productos.filter((p: any) => p.estado === 'agotado' || p.stock_total === 0).length,
        productosPublicados: productos.filter((p: any) => !p.estado || p.estado === 'publicado' || p.estado === 'activo').length,
      })

      setPedidosRecientes(ultimosPedidos || [])
    } catch (error) {
      console.error('Error cargando dashboard:', error)
      // Valores por defecto si hay error
      setMetrics({
        ventasHoy: 0,
        pedidosNuevos: 0,
        clientesNuevos: 0,
        ingresoMes: 0,
        productosAgorados: 0,
        productosPublicados: 0,
      })
      setPedidosRecientes([])
    } finally {
      setLoading(false)
    }
  }

  const metricCards = [
    { title: 'Ventas Hoy', value: `S/. ${metrics.ventasHoy.toFixed(2)}`, icon: FaDollarSign, color: 'from-green-400 to-green-600' },
    { title: 'Pedidos Nuevos', value: metrics.pedidosNuevos, icon: FaShoppingCart, color: 'from-blue-400 to-blue-600' },
    { title: 'Clientes Nuevos', value: metrics.clientesNuevos, icon: FaUsers, color: 'from-purple-400 to-purple-600' },
    { title: 'Ingreso Mes', value: `S/. ${metrics.ingresoMes.toFixed(2)}`, icon: FaChartBar, color: 'from-orange-400 to-orange-600' },
    { title: 'Productos Activos', value: metrics.productosPublicados, icon: FaBox, color: 'from-indigo-400 to-indigo-600' },
    { title: 'Productos Agotados', value: metrics.productosAgorados, icon: FaExclamationTriangle, color: 'from-red-400 to-red-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">📊 Dashboard</h1>
        <p className="text-slate-600 mt-2">Bienvenido al panel administrativo</p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${metric.color} rounded-lg shadow-lg p-6 text-white`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{metric.title}</p>
                <h3 className="text-4xl font-bold mt-2">{metric.value}</h3>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <metric.icon className="text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Últimos Pedidos */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              📦 Últimos Pedidos
            </h2>
            <Link href="/admin/pedidos" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              Ver todos →
            </Link>
          </div>
          {loading ? (
            <div className="p-6 text-center text-slate-500">Cargando...</div>
          ) : pedidosRecientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">Pedido</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosRecientes.map((pedido) => (
                    <tr key={pedido.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">#{pedido.numero_pedido}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">S/. {pedido.total?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          pedido.estado === 'entregado' ? 'bg-green-100 text-green-700' :
                          pedido.estado === 'cancelado' ? 'bg-red-100 text-red-700' :
                          pedido.estado === 'enviado' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(pedido.created_at).toLocaleDateString('es-PE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500">Sin pedidos recientes</div>
          )}
        </div>

        {/* Accesos Rápidos */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-slate-900 mb-4">⚡ Accesos Rápidos</h3>
            <div className="space-y-2">
              <Link href="/admin/productos/nuevo" className="block bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition text-center text-sm">
                ➕ Nuevo Producto
              </Link>
              <Link href="/admin/pedidos?estado=pendiente" className="block bg-orange-600 text-white rounded-lg p-3 font-semibold hover:bg-orange-700 transition text-center text-sm">
                📋 Pedidos Pendientes
              </Link>
              <Link href="/admin/clientes" className="block bg-purple-600 text-white rounded-lg p-3 font-semibold hover:bg-purple-700 transition text-center text-sm">
                👥 Ver Clientes
              </Link>
              <Link href="/admin/configuracion" className="block bg-slate-600 text-white rounded-lg p-3 font-semibold hover:bg-slate-700 transition text-center text-sm">
                ⚙️ Configuración
              </Link>
            </div>
          </div>

          {/* Módulos Disponibles */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Módulos Disponibles</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-slate-700">Dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-slate-700">Productos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-slate-700">Pedidos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-slate-700">Clientes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-slate-700">Cupones</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-slate-700">Configuración</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
