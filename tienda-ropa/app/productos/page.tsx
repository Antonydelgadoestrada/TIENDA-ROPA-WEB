'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaSearch, FaShoppingCart } from 'react-icons/fa'
import HeaderPremium from '@/app/components/HeaderPremium'
import FooterPremium from '@/app/components/FooterPremium'

interface Producto {
  id: string
  nombre: string
  precio: number
  imagen_url?: string
  descripcion?: string
  tipo?: string
  stock?: number
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [filtrados, setFiltrados] = useState<Producto[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [tipoFiltro, setTipoFiltro] = useState('todos')

  const PRODUCTOS_EJEMPLO: Producto[] = [
    {
      id: '1',
      nombre: 'Camiseta Premium Blanca',
      precio: 89.90,
      tipo: 'Camisetas',
      imagen_url: 'https://via.placeholder.com/300x400?text=Camiseta+Blanca',
      descripcion: 'Camiseta 100% algodón premium',
      stock: 15,
    },
    {
      id: '2',
      nombre: 'Pantalón Azul Oscuro',
      precio: 149.90,
      tipo: 'Pantalones',
      imagen_url: 'https://via.placeholder.com/300x400?text=Pantalon+Azul',
      descripcion: 'Pantalón denim resistente',
      stock: 8,
    },
    {
      id: '3',
      nombre: 'Zapatillas Deportivas Negro',
      precio: 249.90,
      tipo: 'Zapatillas',
      imagen_url: 'https://via.placeholder.com/300x400?text=Zapatillas',
      descripcion: 'Zapatillas cómodas para deporte',
      stock: 12,
    },
    {
      id: '4',
      nombre: 'Campera de Invierno',
      precio: 199.90,
      tipo: 'Camperas',
      imagen_url: 'https://via.placeholder.com/300x400?text=Campera',
      descripcion: 'Campera abrigada de invierno',
      stock: 5,
    },
  ]

  useEffect(() => {
    setProductos(PRODUCTOS_EJEMPLO)
    setLoading(false)
  }, [])

  useEffect(() => {
    let resultado = productos
    if (tipoFiltro !== 'todos') {
      resultado = resultado.filter(p => p.tipo === tipoFiltro)
    }
    if (busqueda.trim()) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      )
    }
    setFiltrados(resultado)
  }, [busqueda, tipoFiltro, productos])

  const tipos = ['todos', ...new Set(productos.map(p => p.tipo).filter(Boolean))]

  const agregarAlCarrito = (producto: Producto) => {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]')
    const existe = carrito.findIndex((item: any) => item.producto_id === producto.id)

    if (existe >= 0) {
      carrito[existe].cantidad += 1
    } else {
      carrito.push({
        producto_id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen_url,
        cantidad: 1,
        talla: 'M',
        color: 'Negro',
      })
    }

    localStorage.setItem('carrito', JSON.stringify(carrito))
    window.dispatchEvent(new Event('carrito-actualizado'))
    alert('✓ Producto agregado al carrito')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <HeaderPremium />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Catálogo de Productos</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {tipos.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo === 'todos' ? 'Todos los productos' : tipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👕</div>
            <p className="text-slate-600">Cargando productos...</p>
          </div>
        ) : filtrados.length > 0 ? (
          <>
            <p className="text-slate-600 mb-6">
              Mostrando <strong>{filtrados.length}</strong> de <strong>{productos.length}</strong> productos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtrados.map(producto => (
                <div key={producto.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group">
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
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-blue-600 font-semibold">{producto.tipo || 'Producto'}</p>
                    <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[3.5rem]">
                      {producto.nombre}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        S/. {producto.precio.toFixed(2)}
                      </span>
                      {producto.stock && producto.stock > 0 ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {producto.stock} en stock
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Sin stock
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/productos/${producto.id}`}
                        className="flex-1 bg-slate-200 text-slate-900 py-2 rounded font-semibold hover:bg-slate-300 transition text-center text-sm"
                      >
                        Ver Detalles
                      </Link>
                      <button
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={!producto.stock || producto.stock === 0}
                        className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                      >
                        <FaShoppingCart className="text-sm" />
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-lg">
            <p className="text-slate-600 text-lg">
              No se encontraron productos que coincidan con tu búsqueda
            </p>
            <button
              onClick={() => {
                setBusqueda('')
                setTipoFiltro('todos')
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </main>

      <FooterPremium />
    </div>
  )
}
