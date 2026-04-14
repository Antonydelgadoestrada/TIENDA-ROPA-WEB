'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Producto {
  id: string
  nombre: string
  precio: number
  descripcion: string
  imagen_url: string
  created_at: string
  activo: boolean
}

interface ProductoTalla {
  id: string
  talla_id: string
  stock: number
  talla: {
    nombre: string
  }
}

export default function ProductoDetalle() {
  const params = useParams()
  const productoId = params.id as string

  const [producto, setProducto] = useState<Producto | null>(null)
  const [tallas, setTallas] = useState<ProductoTalla[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Obtener producto
        const { data: productoData, error: productoError } = await supabase
          .from('productos')
          .select('*')
          .eq('id', productoId)
          .single()

        if (productoError) throw productoError
        setProducto(productoData)

        // Obtener tallas con stock
        const { data: tallasData, error: tallasError } = await supabase
          .from('producto_tallas')
          .select('id, talla_id, stock, talla:tallas(nombre)')
          .eq('producto_id', productoId)

        if (!tallasError && tallasData) {
          setTallas(tallasData as unknown as ProductoTalla[])
          if (tallasData.length > 0) {
            setTallaSeleccionada(tallasData[0].talla_id)
          }
        }
      } catch (err) {
        console.error('Error fetching producto:', err)
        setError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()
  }, [productoId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <nav className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Tienda Ropa
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error || 'Producto no encontrado'}</p>
            <Link href="/catalogo" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700 font-semibold">
              ← Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalStock = tallas.reduce((sum, t) => sum + t.stock, 0)
  const tallasDisponibles = tallas.filter(t => t.stock > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Tienda Ropa
            </Link>
            <Link href="/catalogo" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              ← Volver al catálogo
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '1 / 1' }}>
              {producto.imagen_url ? (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-9xl">👕</div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{producto.nombre}</h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold text-emerald-600">
                  S/. {producto.precio.toLocaleString('es-PE')}
                </span>
                {totalStock > 0 && (
                  <div className="mt-3 inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    ✓ En stock ({totalStock} {totalStock === 1 ? 'unidad' : 'unidades'})
                  </div>
                )}
                {totalStock === 0 && (
                  <div className="mt-3 inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    Agotado
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {producto.descripcion || 'Producto de calidad premium. Confeccionado con los mejores materiales para tu comodidad.'}
                </p>
              </div>

              {/* Sizes */}
              {tallas.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Talla</h2>
                  <div className="grid grid-cols-4 gap-3">
                    {tallas.map((t) => {
                      const isAvailable = t.stock > 0
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTallaSeleccionada(t.talla_id)}
                          disabled={!isAvailable}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                            tallaSeleccionada === t.talla_id
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                              : isAvailable
                              ? 'border-gray-300 text-gray-700 hover:border-emerald-600'
                              : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {typeof t.talla === 'object' ? t.talla.nombre : 'Talla'}
                          {!isAvailable && <span className="block text-xs mt-1">Agotado</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              {totalStock > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Cantidad</h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-emerald-600 transition-colors flex items-center justify-center font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-gray-900 w-12 text-center">{cantidad}</span>
                    <button
                      onClick={() => setCantidad(cantidad + 1)}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-emerald-600 transition-colors flex items-center justify-center font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              {totalStock > 0 ? (
                <>
                  <button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <span>🛒</span>
                    Agregar al carrito
                  </button>
                  <button className="flex-1 border-2 border-emerald-600 text-emerald-600 font-semibold py-4 rounded-lg hover:bg-emerald-50 transition-colors">
                    ❤️ Favorito
                  </button>
                </>
              ) : (
                <button disabled className="flex-1 bg-gray-400 text-white font-semibold py-4 rounded-lg cursor-not-allowed opacity-60">
                  Agotado
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-2 gap-4 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl mb-2">🚚</div>
                <p className="text-sm text-gray-600 font-semibold">Envío rápido</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-sm text-gray-600 font-semibold">Garantía de calidad</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔄</div>
                <p className="text-sm text-gray-600 font-semibold">Cambios fáciles</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💳</div>
                <p className="text-sm text-gray-600 font-semibold">Pago seguro</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {[
              {
                title: 'Empresa',
                links: ['Nosotros', 'Blog', 'Prensa'],
              },
              {
                title: 'Productos',
                links: ['Hombres', 'Mujeres', 'Niños'],
              },
              {
                title: 'Legal',
                links: ['Privacidad', 'Términos', 'Cookies'],
              },
              {
                title: 'Contacto',
                links: ['Email', 'Teléfono', 'Ubicación'],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-gray-900 font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-600 hover:text-emerald-600 transition text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Tienda Ropa. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {['Facebook', 'Instagram', 'Twitter'].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-600 hover:text-emerald-600 transition text-sm"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
