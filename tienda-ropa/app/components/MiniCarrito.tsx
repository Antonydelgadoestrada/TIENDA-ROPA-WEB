'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaShoppingCart, FaTrash, FaTimes } from 'react-icons/fa'

interface MiniCarritoItem {
  producto_id: string
  nombre?: string
  talla: string
  color: string
  cantidad: number
  precio: number
  imagen?: string
}

interface MiniCarritoProps {
  isOpen: boolean
  onClose: () => void
}

export default function MiniCarrito({ isOpen, onClose }: MiniCarritoProps) {
  const [items, setItems] = useState<MiniCarritoItem[]>([])

  useEffect(() => {
    cargarCarrito()
    // Escuchar cambios
    window.addEventListener('carrito-actualizado', cargarCarrito)
    return () => window.removeEventListener('carrito-actualizado', cargarCarrito)
  }, [])

  const cargarCarrito = () => {
    const carrito = localStorage.getItem('carrito')
    if (carrito) {
      try {
        const parsed = JSON.parse(carrito)
        setItems(parsed)
      } catch {
        setItems([])
      }
    }
  }

  const eliminarItem = (index: number) => {
    const nuevoCarrito = items.filter((_, i) => i !== index)
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito))
    setItems(nuevoCarrito)
    window.dispatchEvent(new Event('carrito-actualizado'))
  }

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const envio = subtotal >= 100 ? 0 : 15
  const total = subtotal + envio

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Panel Lateral */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-2xl" />
            <h2 className="text-2xl font-bold">Tu Carrito</h2>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:text-blue-100 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex flex-col h-full overflow-hidden">
          {items.length === 0 ? (
            // Carrito Vacío
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <FaShoppingCart className="text-6xl text-slate-300 mb-4" />
              <p className="text-slate-600 text-center px-4">
                Tu carrito está vacío
              </p>
              <Link
                href="/productos"
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Seguir Comprando
              </Link>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 pb-4 border-b border-slate-200"
                  >
                    {/* Imagen placeholder */}
                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaShoppingCart className="text-slate-400 text-2xl" />
                    </div>

                    {/* Detalles */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        Producto
                      </p>
                      <p className="text-xs text-slate-600">
                        {item.talla} • {item.color}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-bold text-slate-900">
                          x{item.cantidad}
                        </span>
                        <span className="font-bold text-blue-600">
                          S/ {(item.precio * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => eliminarItem(i)}
                      className="text-red-600 hover:text-red-700 transition pt-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              {/* Resumen y Botones */}
              <div className="border-t border-slate-200 p-6 space-y-4">
                {/* Info Envío */}
                {subtotal < 100 && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                    <p className="text-xs text-orange-800">
                      <strong>¡Te faltan S/ {(100 - subtotal).toFixed(2)}</strong> para envío gratis
                    </p>
                  </div>
                )}

                {/* Totales */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Envío:</span>
                    <span className={envio === 0 ? 'text-green-600 font-bold' : ''}>
                      {envio === 0 ? '¡Gratis!' : `S/ ${envio.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botones */}
                <Link
                  href="/carrito"
                  onClick={onClose}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition text-center"
                >
                  Ver Carrito Completo
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition text-center"
                >
                  Ir al Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
