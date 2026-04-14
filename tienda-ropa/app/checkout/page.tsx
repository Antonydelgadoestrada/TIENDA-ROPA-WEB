'use client'

import { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'

export default function CheckoutPage() {
  const [paso, setPaso] = useState(1)
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
  })
  const [datosEnvio, setDatosEnvio] = useState({
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    referencia: '',
  })
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [datosTargeta, setDatosTargeta] = useState({
    numero: '',
    nombres: '',
    mes: '',
    año: '',
    cvv: '',
  })

  const subtotal = 179.80
  const envio = 15.00
  const total = subtotal + envio

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

        {/* Barra de progreso */}
        <div className="mb-12">
          <div className="flex justify-between mb-6">
            {[
              { num: 1, titulo: 'Datos Personales' },
              { num: 2, titulo: 'Envío' },
              { num: 3, titulo: 'Pago' },
            ].map(p => (
              <div key={p.num} className="flex-1">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition ${
                      paso >= p.num
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {paso > p.num ? <FaCheckCircle /> : p.num}
                  </div>
                  {p.num < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition ${
                        paso > p.num ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    ></div>
                  )}
                </div>
                <p className="text-sm text-center mt-2 text-slate-600">{p.titulo}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="md:col-span-2">
            {/* PASO 1: Datos Personales */}
            {paso === 1 && (
              <div className="bg-white rounded-lg p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Información Personal</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={datosPersonales.nombre}
                      onChange={e => setDatosPersonales({ ...datosPersonales, nombre: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Juan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Apellido</label>
                    <input
                      type="text"
                      value={datosPersonales.apellido}
                      onChange={e => setDatosPersonales({ ...datosPersonales, apellido: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={datosPersonales.email}
                    onChange={e => setDatosPersonales({ ...datosPersonales, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={datosPersonales.telefono}
                    onChange={e => setDatosPersonales({ ...datosPersonales, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+51 999 999 999"
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => window.history.back()}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg font-bold hover:bg-slate-50 transition"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => setPaso(2)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Continuar → Envío
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: Envío */}
            {paso === 2 && (
              <div className="bg-white rounded-lg p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Dirección de Envío</h2>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={datosEnvio.direccion}
                    onChange={e => setDatosEnvio({ ...datosEnvio, direccion: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Av. Principal 123, Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ciudad</label>
                    <select
                      value={datosEnvio.ciudad}
                      onChange={e => setDatosEnvio({ ...datosEnvio, ciudad: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar ciudad</option>
                      <option value="Lima">Lima</option>
                      <option value="Arequipa">Arequipa</option>
                      <option value="Cusco">Cusco</option>
                      <option value="Trujillo">Trujillo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Código Postal</label>
                    <input
                      type="text"
                      value={datosEnvio.codigoPostal}
                      onChange={e => setDatosEnvio({ ...datosEnvio, codigoPostal: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="15001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Referencia (opcional)</label>
                  <textarea
                    value={datosEnvio.referencia}
                    onChange={e => setDatosEnvio({ ...datosEnvio, referencia: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Puerta de color rojo, frente al parque..."
                    rows={3}
                  />
                </div>

                {/* Opciones de envío */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                  <p className="font-bold text-slate-900">Opciones de Envío</p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="envio" value="24h" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-semibold text-slate-900">Envío Rápido (24-48h)</p>
                      <p className="text-sm text-slate-600">S/ 15.00</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="envio" value="5d" className="w-4 h-4" />
                    <div>
                      <p className="font-semibold text-slate-900">Envío Estándar (3-5 días)</p>
                      <p className="text-sm text-slate-600">S/ 8.00</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="envio" value="pickup" className="w-4 h-4" />
                    <div>
                      <p className="font-semibold text-slate-900">Retirar en Tienda</p>
                      <p className="text-sm text-slate-600">¡Gratis!</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setPaso(1)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg font-bold hover:bg-slate-50 transition"
                  >
                    ← Atrás
                  </button>
                  <button
                    onClick={() => setPaso(3)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Continuar → Pago
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: Pago */}
            {paso === 3 && (
              <div className="bg-white rounded-lg p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Método de Pago</h2>

                {/* Opciones de pago */}
                <div className="space-y-3">
                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    metodoPago === 'tarjeta' ? 'border-blue-600 bg-blue-50' : 'border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="pago"
                      value="tarjeta"
                      checked={metodoPago === 'tarjeta'}
                      onChange={e => setMetodoPago(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-bold text-slate-900">💳 Tarjeta de Crédito/Débito</span>
                  </label>

                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    metodoPago === 'transferencia' ? 'border-blue-600 bg-blue-50' : 'border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="pago"
                      value="transferencia"
                      checked={metodoPago === 'transferencia'}
                      onChange={e => setMetodoPago(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-bold text-slate-900">🏦 Transferencia Bancaria</span>
                  </label>

                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    metodoPago === 'contra_entrega' ? 'border-blue-600 bg-blue-50' : 'border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="pago"
                      value="contra_entrega"
                      checked={metodoPago === 'contra_entrega'}
                      onChange={e => setMetodoPago(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-bold text-slate-900">📦 Contra Entrega</span>
                  </label>
                </div>

                {/* Formulario de tarjeta */}
                {metodoPago === 'tarjeta' && (
                  <div className="space-y-4 p-6 bg-slate-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Número de Tarjeta</label>
                      <input
                        type="text"
                        value={datosTargeta.numero}
                        onChange={e => setDatosTargeta({ ...datosTargeta, numero: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Nombres en la Tarjeta</label>
                      <input
                        type="text"
                        value={datosTargeta.nombres}
                        onChange={e => setDatosTargeta({ ...datosTargeta, nombres: e.target.value })}
                        placeholder="Juan Pérez García"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Mes</label>
                        <select
                          value={datosTargeta.mes}
                          onChange={e => setDatosTargeta({ ...datosTargeta, mes: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">MM</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Año</label>
                        <select
                          value={datosTargeta.año}
                          onChange={e => setDatosTargeta({ ...datosTargeta, año: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">YY</option>
                          {[...Array(10)].map((_, i) => {
                            const year = new Date().getFullYear() + i
                            return (
                              <option key={i} value={String(year).slice(-2)}>
                                {String(year).slice(-2)}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={datosTargeta.cvv}
                          onChange={e => setDatosTargeta({ ...datosTargeta, cvv: e.target.value })}
                          placeholder="123"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setPaso(2)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg font-bold hover:bg-slate-50 transition"
                  >
                    ← Atrás
                  </button>
                  <button
                    onClick={() => alert('¡Pedido confirmado! Número: #123456')}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    ✓ Confirmar Compra
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen lateral */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Resumen del Pedido</h3>

              <div className="space-y-3 text-sm pb-4 border-b border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600">2x Camiseta Premium</span>
                  <span className="font-semibold">S/ 179.80</span>
                </div>
              </div>

              <div className="space-y-3 text-sm pb-4 border-b border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Envío:</span>
                  <span className="font-semibold">S/ {envio.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-slate-900 pt-4">
                <span>Total:</span>
                <span className="text-blue-600">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Beneficios */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-bold text-blue-900 mb-2">Beneficios:</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✓ Envío GRATIS (mayor a S/ 100)</li>
                <li>✓ 30 días devolución gratis</li>
                <li>✓ Soporte 24/7 por WhatsApp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
