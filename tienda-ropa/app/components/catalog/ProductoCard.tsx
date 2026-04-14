'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { Producto } from '@/lib/types'

interface ProductoCardProps {
  producto: Producto
  vista?: 'grid' | 'lista'
}

export default function ProductoCard({ producto, vista = 'grid' }: ProductoCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageHovered, setImageHovered] = useState(false)

  const precioFinal = producto.precio * (1 - (producto.descuento || 0) / 100)
  const ahorro = producto.precio - precioFinal

  const toggleFavorito = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
    // Aquí guardaría en localStorage o BD
  }

  if (vista === 'lista') {
    return (
      <Link href={`/productos/${producto.id}`}>
        <div className="flex gap-6 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-lg transition">
          {/* Imagen */}
          <div className="w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </div>

          {/* Contenido */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 line-clamp-2">{producto.nombre}</h3>
              <p className="text-sm text-slate-600 mt-1">{producto.descripcion}</p>
              <div className="flex gap-2 mt-2">
                {producto.tallas_disponibles.slice(0, 3).map(talla => (
                  <span key={talla} className="text-xs px-2 py-1 bg-slate-100 rounded">
                    {talla}
                  </span>
                ))}
              </div>
            </div>

            {/* Precio y botones */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-600">S/ {precioFinal.toFixed(2)}</span>
                {producto.descuento && (
                  <>
                    <span className="text-sm line-through text-slate-500">S/ {producto.precio.toFixed(2)}</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                      -{producto.descuento}%
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={toggleFavorito}
                className="text-xl hover:text-red-600 transition"
              >
                {isFavorite ? <FaHeart className="text-red-600" /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/productos/${producto.id}`}>
      <div className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-xl transition group cursor-pointer">
        {/* Imagen */}
        <div
          className="relative h-72 bg-slate-100 overflow-hidden"
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
        >
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />

          {/* Badges */}
          <div className="absolute top-4 right-4 space-y-2">
            {producto.es_nuevo && (
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                Nuevo
              </div>
            )}
            {producto.descuento && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                -{producto.descuento}%
              </div>
            )}
            {producto.stock <= 3 && producto.stock > 0 && (
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ¡Agotándose!
              </div>
            )}
          </div>

          {/* Logo favorito */}
          <button
            onClick={toggleFavorito}
            className="absolute top-4 left-4 text-2xl hover:scale-110 transition"
          >
            {isFavorite ? <FaHeart className="text-red-600" /> : <FaRegHeart className="text-white drop-shadow-lg" />}
          </button>

          {/* Tallas rápidas */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex gap-2 flex-wrap">
            {producto.tallas_disponibles.slice(0, 6).map(talla => (
              <button
                key={talla}
                className="bg-white/20 hover:bg-white/40 text-white text-xs font-semibold px-2 py-1 rounded transition"
              >
                {talla}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition">
              {producto.nombre}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{producto.tipo}</p>
          </div>

          {/* Rating */}
          {producto.calificacion && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.round(producto.calificacion!) ? 'text-yellow-400' : 'text-slate-300'}`}>
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-xs text-slate-600">({producto.total_resenas})</span>
            </div>
          )}

          {/* Precio */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">S/ {precioFinal.toFixed(2)}</span>
              {producto.descuento && (
                <span className="text-xs line-through text-slate-500">S/ {producto.precio.toFixed(2)}</span>
              )}
            </div>
            {producto.descuento && (
              <p className="text-xs text-green-600 font-semibold">
                Ahorras: S/ {ahorro.toFixed(2)}
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="text-xs font-semibold">
            {producto.stock > 3 ? (
              <span className="text-green-600">✓ En stock</span>
            ) : producto.stock > 0 ? (
              <span className="text-orange-600">Solo {producto.stock} unidades</span>
            ) : (
              <span className="text-red-600">Agotado</span>
            )}
          </div>

          {/* Botón */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Ver Detalles
          </button>
        </div>
      </div>
    </Link>
  )
}
