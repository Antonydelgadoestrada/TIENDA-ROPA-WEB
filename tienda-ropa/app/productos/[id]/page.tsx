'use client'

import { useState } from 'react'
import { FaHeart, FaRegHeart, FaTruck, FaUndo, FaShoppingCart } from 'react-icons/fa'
import { Producto } from '@/lib/types'
import HeaderPremium from '@/app/components/HeaderPremium'
import FooterPremium from '@/app/components/FooterPremium'

// Mock producto - en futuro vendría de Supabase
const PRODUCTO_MOCK: Producto = {
  id: '1',
  nombre: 'Camiseta Premium Blanca',
  descripcion: 'Camiseta 100% algodón premium',
  precio: 89.90,
  precio_original: 129.90,
  descuento: 30,
  imagen_url: 'https://via.placeholder.com/600x700?text=Camiseta+Frente',
  imagenes: [
    'https://via.placeholder.com/600x700?text=Camiseta+Frente',
    'https://via.placeholder.com/600x700?text=Camiseta+Espalda',
    'https://via.placeholder.com/600x700?text=Detalle',
    'https://via.placeholder.com/600x700?text=Modelo',
  ],
  color: 'Blanco',
  talla: 'M',
  stock: 15,
  tallas_disponibles: ['XS', 'S', 'M', 'L', 'XL'],
  colores_disponibles: [
    { nombre: 'Blanco', codigo_hex: '#fff', imagen_url: 'https://via.placeholder.com/600x700?text=Blanco' },
    { nombre: 'Negro', codigo_hex: '#000', imagen_url: 'https://via.placeholder.com/600x700?text=Negro' },
    { nombre: 'Azul', codigo_hex: '#3b82f6', imagen_url: 'https://via.placeholder.com/600x700?text=Azul' },
  ],
  categoria: 'casual',
  tipo: 'Camisetas',
  genero: 'unisex',
  temporada: 'verano',
  material: '100% Algodón',
  cuidados: ['Lavar en agua fría', 'No secar a máquina', 'No usar blanqueador', 'Secar al aire'],
  es_nuevo: true,
  es_oferta: true,
  vendidos: 124,
  calificacion: 4.8,
  total_resenas: 45,
  medidas: [
    { talla: 'XS', pecho: 84, cintura: 84, largo: 65 },
    { talla: 'S', pecho: 88, cintura: 88, largo: 67 },
    { talla: 'M', pecho: 92, cintura: 92, largo: 69 },
    { talla: 'L', pecho: 100, cintura: 100, largo: 72 },
    { talla: 'XL', pecho: 108, cintura: 108, largo: 74 },
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export default function DetallePage({ params }: { params: { id: string } }) {
  const [producto] = useState<Producto>(PRODUCTO_MOCK)
  const [imagenPrincipal, setImagenPrincipal] = useState(producto.imagen_url)
  const [tallaSel, setTallaSel] = useState(producto.talla)
  const [colorSel, setColorSel] = useState(producto.color)
  const [cantidad, setCantidad] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [expandidos, setExpandidos] = useState({ descripcion: true, medidas: false, cuidados: false })

  const precioFinal = producto.precio * (1 - (producto.descuento || 0) / 100)
  const ahorro = producto.precio - precioFinal

  const agregarAlCarrito = () => {
    // Guardar en localStorage o estado global
    const carrito = localStorage.getItem('carrito') ? JSON.parse(localStorage.getItem('carrito')!) : []
    carrito.push({
      producto_id: producto.id,
      talla: tallaSel,
      color: colorSel,
      cantidad,
      precio: precioFinal,
    })
    localStorage.setItem('carrito', JSON.stringify(carrito))
    window.dispatchEvent(new Event('carrito-actualizado'))
    alert('¡Agregado al carrito!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <HeaderPremium />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-600 mb-8 flex gap-2">
          <a href="/" className="hover:text-blue-600">Inicio</a>
          <span>/</span>
          <a href="/productos" className="hover:text-blue-600">Tienda</a>
          <span>/</span>
          <span>{producto.nombre}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="bg-white rounded-lg overflow-hidden relative h-96 md:h-[600px]">
              <img src={imagenPrincipal} alt={producto.nombre} className="w-full h-full object-cover" />
              {producto.descuento && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  -{producto.descuento}%
                </div>
              )}
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-3">
              {producto.imagenes?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagenPrincipal(img)}
                  className={`h-20 rounded-lg overflow-hidden border-2 transition ${
                    imagenPrincipal === img ? 'border-blue-600' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt={`Imagen ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-blue-600 font-semibold">{producto.tipo}</span>
                  <h1 className="text-3xl font-bold text-slate-900 mt-2">{producto.nombre}</h1>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="text-3xl hover:scale-110 transition"
                >
                  {isFavorite ? <FaHeart className="text-red-600" /> : <FaRegHeart className="text-slate-400" />}
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.round(producto.calificacion!) ? 'text-yellow-400' : 'text-slate-300'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  {producto.calificacion} ({producto.total_resenas} reseñas)
                </span>
              </div>
            </div>

            {/* Precio */}
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-blue-600">S/ {precioFinal.toFixed(2)}</span>
                {producto.descuento && (
                  <>
                    <span className="text-xl line-through text-slate-500">S/ {producto.precio.toFixed(2)}</span>
                    <span className="text-lg font-bold text-red-600">-{producto.descuento}%</span>
                  </>
                )}
              </div>
              <p className="text-green-600 font-semibold">
                Ahorras S/ {ahorro.toFixed(2)}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                ✓ {producto.vendidos} vendidos • {producto.stock <= 3 ? `⚠ Solo ${producto.stock} units` : '✓ En stock'}
              </p>
            </div>

            {/* Selector de Color */}
            <div>
              <label className="block font-semibold text-slate-900 mb-3">Color: <span className="text-blue-600">{colorSel}</span></label>
              <div className="grid grid-cols-4 gap-3">
                {producto.colores_disponibles.map(color => (
                  <button
                    key={color.nombre}
                    onClick={() => setColorSel(color.nombre)}
                    className={`h-14 rounded-lg border-3 transition flex items-center justify-center font-semibold text-sm ${
                      colorSel === color.nombre
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                    style={{ backgroundColor: color.codigo_hex }}
                  >
                    {colorSel === color.nombre && '✓'}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Talla */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-slate-900">Talla: <span className="text-blue-600">{tallaSel}</span></label>
                <button className="text-xs text-blue-600 hover:underline">Guía de tallas</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {producto.tallas_disponibles.map(talla => (
                  <button
                    key={talla}
                    onClick={() => setTallaSel(talla)}
                    className={`h-12 rounded-lg border-2 font-bold transition ${
                      tallaSel === talla
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 hover:border-slate-400 text-slate-900'
                    }`}
                  >
                    {talla}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <label className="block font-semibold text-slate-900 mb-3">Cantidad</label>
              <div className="flex items-center gap-4 bg-slate-100 w-fit rounded-lg p-2">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="text-xl font-bold text-slate-600 hover:text-slate-900 transition px-4"
                >
                  −
                </button>
                <span className="text-xl font-bold text-slate-900 w-8 text-center">{cantidad}</span>
                <button
                  onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                  className="text-xl font-bold text-slate-600 hover:text-slate-900 transition px-4"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones principales */}
            <div className="space-y-3">
              <button
                onClick={agregarAlCarrito}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Agregar al Carrito (S/ {(precioFinal * cantidad).toFixed(2)})
              </button>
              <button className="w-full border-2 border-slate-300 text-slate-900 py-4 rounded-lg font-bold text-lg hover:bg-slate-50 transition">
                Compra Ahora
              </button>
            </div>

            {/* Beneficios */}
            <div className="space-y-3 bg-slate-50 p-6 rounded-lg">
              <div className="flex gap-3">
                <FaTruck className="text-2xl text-blue-600 flex-shrink-0" />
                <div className="text-sm text-slate-700">
                  <strong>Envío gratis</strong> a partir de S/ 100. Llega en 24-48 horas.
                </div>
              </div>
              <div className="flex gap-3">
                <FaUndo className="text-2xl text-green-600 flex-shrink-0" />
                <div className="text-sm text-slate-700">
                  <strong>Devolución fácil</strong> en 30 días sin preguntas.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles expandibles */}
        <div className="mt-16 space-y-4">
          {/* Descripción */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpandidos(p => ({ ...p, descripcion: !p.descripcion }))}
              className="w-full p-4 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition"
            >
              Descripción del Producto
              <span className={`transition ${expandidos.descripcion ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandidos.descripcion && (
              <div className="p-4 border-t border-slate-200 text-slate-700">
                <p>{producto.descripcion}</p>
                <div className="mt-4">
                  <strong>Material:</strong> {producto.material}
                </div>
              </div>
            )}
          </div>

          {/* Tabla de medidas */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpandidos(p => ({ ...p, medidas: !p.medidas }))}
              className="w-full p-4 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition"
            >
              Tabla de Medidas
              <span className={`transition ${expandidos.medidas ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandidos.medidas && (
              <div className="p-4 border-t border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 font-bold">Talla</th>
                      <th className="py-2 font-bold">Pecho (cm)</th>
                      <th className="py-2 font-bold">Cintura (cm)</th>
                      <th className="py-2 font-bold">Largo (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {producto.medidas.map(m => (
                      <tr key={m.talla} className="border-b">
                        <td className="py-2 font-semibold">{m.talla}</td>
                        <td className="py-2">{m.pecho}</td>
                        <td className="py-2">{m.cintura}</td>
                        <td className="py-2">{m.largo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Cuidados */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpandidos(p => ({ ...p, cuidados: !p.cuidados }))}
              className="w-full p-4 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition"
            >
              Instrucciones de Cuidado
              <span className={`transition ${expandidos.cuidados ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandidos.cuidados && (
              <div className="p-4 border-t border-slate-200">
                <ul className="space-y-2">
                  {producto.cuidados.map((cuidado, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>{cuidado}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <FooterPremium />
    </div>
  )
}
