'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaTrash, FaShoppingCart } from 'react-icons/fa'
import { CarritoItem, Carrito } from '@/lib/types'

export default function CarritoPage() {
  const [carrito, setCarrito] = useState<Carrito>({
    items: [],
    subtotal: 0,
    envio: 0,
    descuento: 0,
    total: 0,
  })
  const [codigoDescuento, setCodigoDescuento] = useState('')

  useEffect(() => {
    cargarCarrito()
  }, [])

  const cargarCarrito = () => {
    const items = localStorage.getItem('carrito')
    if (items) {
      const parsedItems = JSON.parse(items)
      calcularTotales(parsedItems)
    }
  }

  const calcularTotales = (items: any[]) => {
    const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
    const envio = subtotal >= 100 ? 0 : 15.00
    const descuentoFaltante = subtotal >= 100 ? 0 : 100 - subtotal

    setCarrito({
      items,
      subtotal,
      envio,
      descuento: 0,
      total: subtotal + envio,
      descuento_falta_para_gratis: descuentoFaltante,
    })
  }

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    const nuevosItems = [...carrito.items]
    if (nuevaCantidad <= 0) {
      nuevosItems.splice(index, 1)
    } else {
      nuevosItems[index].cantidad = nuevaCantidad
    }
    localStorage.setItem('carrito', JSON.stringify(nuevosItems))
    calcularTotales(nuevosItems)
  }

  const eliminarItem = (index: number) => {
    const nuevosItems = carrito.items.filter((_, i) => i !== index)
    localStorage.setItem('carrito', JSON.stringify(nuevosItems))
    calcularTotales(nuevosItems)
  }

  const aplicarDescuento = () => {
    // Simulación de validación de código
    if (codigoDescuento === 'SAVE10') {
      const descuento = carrito.subtotal * 0.1
      setCarrito(prev => ({
        ...prev,
        descuento,
        total: prev.subtotal + prev.envio - descuento,
      }))
      alert('Descuento aplicado: -10%')
    } else {
      alert('Código de descuento inválido')
    }
  }

  if (carrito.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <FaShoppingCart className="text-8xl text-slate-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Tu carrito está vacío</h1>
            <p className="text-slate-600 mb-8">¡Comienza a comprar y descubre nuestras mejores prendas!</p>
            <Link
              href="/productos"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Items del Carrito */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {carrito.items.map((item, i) => (
                <div key={i} className="border-b border-slate-200 p-6 flex gap-6 hover:bg-slate-50 transition">
                  {/* Imagen */}
                  <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.producto.imagen_url}
                      alt={item.producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{item.producto.nombre}</h3>
                    <div className="text-sm text-slate-600 mt-1">
                      <p>Talla: <span className="font-semibold">{item.talla}</span></p>
                      <p>Color: <span className="font-semibold">{item.color}</span></p>
                    </div>

                    {/* Cantidad y Precio */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 bg-slate-100 rounded-lg">
                        <button
                          onClick={() => actualizarCantidad(i, item.cantidad - 1)}
                          className="px-3 py-1 text-slate-600 hover:text-slate-900"
                        >
                          −
                        </button>
                        <span className="px-3 font-bold">{item.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidad(i, item.cantidad + 1)}
                          className="px-3 py-1 text-slate-600 hover:text-slate-900"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">
                          S/ {(item.precio_unitario * item.cantidad).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-600">
                          S/ {item.precio_unitario.toFixed(2)} c/u
                        </p>
                      </div>

                      <button
                        onClick={() => eliminarItem(i)}
                        className="text-red-600 hover:text-red-700 transition p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de continuar comprando */}
            <div className="text-right">
              <Link
                href="/productos"
                className="text-blue-600 font-semibold hover:underline"
              >
                ← Continuar Comprando
              </Link>
            </div>
          </div>

          {/* Resumen y Checkout */}
          <div className="space-y-4">
            {/* Código de Descuento */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Código de Descuento
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codigoDescuento}
                  onChange={e => setCodigoDescuento(e.target.value.toUpperCase())}
                  placeholder="SAVE10"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={aplicarDescuento}
                  className="px-4 py-2 bg-slate-200 text-slate-900 font-bold rounded-lg hover:bg-slate-300 transition"
                >
                  Aplicar
                </button>
              </div>
            </div>

            {/* Envío Gratis */}
            {carrito.descuento_falta_para_gratis && carrito.descuento_falta_para_gratis > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-sm text-orange-800">
                  <strong>¡Te falta S/ {carrito.descuento_falta_para_gratis.toFixed(2)}</strong> para envío gratis
                </p>
                <div className="mt-2 h-2 bg-orange-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all"
                    style={{
                      width: `${Math.min(100, (carrito.subtotal / 100) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Resumen */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-3 border-2 border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">Resumen</h3>

              <div className="space-y-2 text-sm border-b border-slate-200 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold">S/ {carrito.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Envío:</span>
                  <span className="font-semibold">
                    {carrito.envio === 0 ? (
                      <span className="text-green-600">¡Gratis!</span>
                    ) : (
                      `S/ ${carrito.envio.toFixed(2)}`
                    )}
                  </span>
                </div>
                {carrito.descuento > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span className="font-semibold">-S/ {carrito.descuento.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xl font-bold text-slate-900 pt-3">
                <span>Total:</span>
                <span className="text-blue-600">S/ {carrito.total.toFixed(2)}</span>
              </div>

              <button className="w-full mt-6 bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition">
                Ir al Checkout
              </button>

              <button className="w-full border border-slate-300 text-slate-900 py-4 rounded-lg font-bold hover:bg-slate-50 transition">
                Comprar como invitado
              </button>

              {/* Métodos de pago */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-600 mb-3">MÉTODOS DE PAGO</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">💳 Tarjeta</span>
                  <span className="text-sm">🏦 Transferencia</span>
                  <span className="text-sm">📦 Contra Entrega</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
