'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaBox, FaHeart, FaHistory, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'

export default function CuentaPage() {
  const router = useRouter()
  const [seccionActiva, setSeccionActiva] = useState('pedidos')
  const [loading, setLoading] = useState(true)
  const [usuario] = useState({
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@ejemplo.com',
    telefono: '+51 999 888 777',
    puntos: 1250,
  })

  const [pedidos] = useState([
    {
      id: '1',
      numero: '#OPE-001234',
      fecha: '2024-04-10',
      total: 179.80,
      estado: 'entregado',
      items: 2,
      trackingUrl: '#',
    },
    {
      id: '2',
      numero: '#OPE-001235',
      fecha: '2024-04-08',
      total: 89.90,
      estado: 'enviado',
      items: 1,
      trackingUrl: '#',
    },
  ])

  const [favoritos] = useState([
    {
      id: '1',
      nombre: 'Polo Clásico Negro',
      precio: 79.90,
      imagen: 'https://via.placeholder.com/300x400?text=Polo',
    },
    {
      id: '2',
      nombre: 'Jean Azul Oscuro',
      precio: 129.90,
      imagen: 'https://via.placeholder.com/300x400?text=Jean',
    },
  ])

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/auth/login')
    } else {
      setLoading(false)
    }
  }, [router])

  // No mostrar nada mientras se verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👗</div>
          <h1 className="text-2xl font-bold text-slate-900">Cargando tu cuenta...</h1>
        </div>
      </div>
    )
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return 'text-green-600 bg-green-50'
      case 'enviado':
        return 'text-blue-600 bg-blue-50'
      case 'preparando':
        return 'text-yellow-600 bg-yellow-50'
      case 'cancelado':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-slate-600 bg-slate-50'
    }
  }

  const getEstadoTexto = (estado: string) => {
    const textos: { [key: string]: string } = {
      entregado: 'Entregado',
      enviado: 'Enviado',
      preparando: 'Preparando',
      cancelado: 'Cancelado',
      pendiente: 'Pendiente',
    }
    return textos[estado] || estado
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Mi Cuenta</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar de Navegación */}
          <div className="md:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
              {[
                { id: 'pedidos', icon: FaBox, label: 'Mis Pedidos', badge: pedidos.length },
                { id: 'favoritos', icon: FaHeart, label: 'Favoritos', badge: favoritos.length },
                { id: 'historial', icon: FaHistory, label: 'Historial' },
                { id: 'datos', icon: FaUser, label: 'Datos Personales' },
                { id: 'puntos', icon: FaCog, label: 'Puntos y Recompensas', badge: usuario.puntos },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSeccionActiva(item.id)}
                  className={`w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 hover:bg-slate-50 transition ${
                    seccionActiva === item.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="text-lg" />
                    <span className="font-semibold text-slate-900">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
              <button className="w-full px-6 py-4 flex items-center gap-3 text-red-600 hover:bg-red-50 transition border-t-2 border-slate-200">
                <FaSignOutAlt className="text-lg" />
                <span className="font-semibold">Cerrar Sesión</span>
              </button>
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="md:col-span-3">
            {/* MIS PEDIDOS */}
            {seccionActiva === 'pedidos' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Mis Pedidos</h2>
                  <p className="text-slate-600">Histórico y seguimiento de tus compras</p>
                </div>

                <div className="space-y-4">
                  {pedidos.map(pedido => (
                    <div key={pedido.id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-600 font-bold">NÚMERO</p>
                          <p className="font-bold text-slate-900">{pedido.numero}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-bold">FECHA</p>
                          <p className="font-bold text-slate-900">{new Date(pedido.fecha).toLocaleDateString('es-PE')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-bold">TOTAL</p>
                          <p className="font-bold text-blue-600 text-lg">S/ {pedido.total.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-bold">ESTADO</p>
                          <div className={`inline-block rounded-full px-3 py-1 font-semibold text-sm ${getEstadoColor(pedido.estado)}`}>
                            {getEstadoTexto(pedido.estado)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-slate-200">
                        <button className="text-blue-600 hover:underline font-semibold">Ver Detalles</button>
                        {pedido.estado === 'enviado' && (
                          <a href={pedido.trackingUrl} className="text-blue-600 hover:underline font-semibold">
                            Rastrear
                          </a>
                        )}
                        {pedido.estado === 'entregado' && (
                          <button className="text-blue-600 hover:underline font-semibold">Solicitar Cambio</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAVORITOS */}
            {seccionActiva === 'favoritos' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Mis Favoritos</h2>
                  <p className="text-slate-600">Prendas que agregaste a favoritos</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoritos.map(item => (
                    <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
                      <div className="h-48 bg-slate-200 overflow-hidden">
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover hover:scale-110 transition duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900">{item.nombre}</h3>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xl font-bold text-blue-600">S/ {item.precio.toFixed(2)}</span>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DATOS PERSONALES */}
            {seccionActiva === 'datos' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Datos Personales</h2>
                  <p className="text-slate-600">Información de tu perfil y dirección</p>
                </div>

                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        defaultValue={usuario.nombre}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Apellido</label>
                      <input
                        type="text"
                        defaultValue={usuario.apellido}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={usuario.email}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        defaultValue={usuario.telefono}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}

            {/* PUNTOS Y RECOMPENSAS */}
            {seccionActiva === 'puntos' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Puntos y Recompensas</h2>
                  <p className="text-slate-600">Acumula puntos en cada compra</p>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8">
                  <p className="text-sm opacity-90 mb-2">Saldo de Puntos</p>
                  <p className="text-5xl font-bold">{usuario.puntos.toLocaleString()}</p>
                  <p className="text-sm mt-4 opacity-90">Equivalente a: S/ {(usuario.puntos / 100).toFixed(2)} en descuento</p>
                </div>

                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 mb-4">Cómo funcionan los puntos</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">1.</span>
                      <div>
                        <p className="font-semibold text-slate-900">Compra = Puntos</p>
                        <p className="text-sm text-slate-600">Gana 1 punto por cada sol gastado</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">2.</span>
                      <div>
                        <p className="font-semibold text-slate-900">Acumula puntos</p>
                        <p className="text-sm text-slate-600">Canjea tus puntos por descuentos y ofertas exclusivas</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">3.</span>
                      <div>
                        <p className="font-semibold text-slate-900">Sé VIP</p>
                        <p className="text-sm text-slate-600">Obtén acceso a productos exclusivos y early access a nuevas colecciones</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
