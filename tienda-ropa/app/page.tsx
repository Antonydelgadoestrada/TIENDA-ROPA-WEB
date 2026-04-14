'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import HeaderPremium from '@/app/components/HeaderPremium'
import FooterPremium from '@/app/components/FooterPremium'

interface Configuracion {
  nombre_tienda: string
  descripcion: string
  email?: string
  telefono?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  whatsapp?: string
}

interface Producto {
  id: string
  nombre: string
  precio: number
  descuento: number
  imagen_url: string
  descripcion: string
}

export default function Home() {
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener configuración
        const { data: configData } = await supabase
          .from('tienda_configuracion')
          .select('*')
          .single()

        if (configData) setConfig(configData)

        // Obtener productos activos
        const { data: productosData } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true)
          .limit(6)

        if (productosData) setProductos(productosData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header Premium con Login/Cuenta */}
      <HeaderPremium />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h2 className="text-5xl font-bold">{config?.nombre_tienda || 'Tienda Ropa'}</h2>
          <p className="text-xl text-blue-100">{config?.descripcion || 'Tienda de ropa online'}</p>
          <Link
            href="/productos"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
          >
            Ver Catálogo →
          </Link>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <h3 className="text-4xl font-bold text-slate-900 mb-12 text-center">✨ Productos Destacados</h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse h-80"></div>
            ))}
          </div>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productos.map(producto => {
              const precioFinal = producto.precio * (1 - producto.descuento / 100)
              return (
                <Link key={producto.id} href={`/productos/${producto.id}`}>
                  <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group cursor-pointer">
                    {/* Imagen */}
                    <div className="relative h-64 bg-slate-200 overflow-hidden">
                      {producto.imagen_url ? (
                        <img
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">👕</div>
                      )}
                      {producto.descuento > 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{producto.descuento}%
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4 space-y-3">
                      <h4 className="font-bold text-slate-900 line-clamp-2">{producto.nombre}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2">{producto.descripcion}</p>

                      {/* Precio */}
                      <div className="flex gap-2 items-center">
                        {producto.descuento > 0 ? (
                          <>
                            <span className="text-xl font-bold text-blue-600">
                              S/. {precioFinal.toFixed(2)}
                            </span>
                            <span className="text-sm text-slate-500 line-through">
                              S/. {producto.precio.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-blue-600">
                            S/. {producto.precio.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Botón */}
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Ver Detalles →
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No hay productos disponibles</p>
          </div>
        )}
      </section>

      {/* Footer */}
      {/* Footer Premium */}
      <FooterPremium />
    </div>
  )
}
