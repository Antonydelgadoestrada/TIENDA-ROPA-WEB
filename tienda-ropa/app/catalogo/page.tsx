'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

interface Producto {
  id: string
  nombre: string
  precio: number
  descripcion: string
  imagen_url: string
  created_at: string
}

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error: supabaseError } = await supabase
          .from('productos')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) throw supabaseError
        setProductos(data || [])
      } catch (err) {
        console.error('Error fetching productos:', err)
        setError('Error al cargar el catálogo')
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Tienda Ropa
            </Link>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Productos
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Categorías
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
          <p className="text-lg text-gray-600">
            Descubre nuestra colección exclusiva de prendas de calidad
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="ml-4 text-gray-600 font-medium">Cargando catálogo...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && productos.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin productos disponibles</h2>
            <p className="text-gray-600 mb-6">
              El catálogo está vacío. Vuelve pronto para ver nuestras nuevas prendas
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && productos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                  {producto.imagen_url ? (
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-6xl">👕</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {producto.nombre}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {producto.descripcion || 'Producto de calidad premium'}
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-emerald-600">
                      S/. {producto.precio.toLocaleString('es-PE')}
                    </span>
                  </div>

                  {/* Button */}
                  <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
