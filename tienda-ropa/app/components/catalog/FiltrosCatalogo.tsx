'use client'

import { useState } from 'react'
import { FaChevronDown, FaFilter } from 'react-icons/fa'

interface FiltrosProps {
  onApplyFiltros: (filtros: any) => void
}

export default function FiltrosCatalogo({ onApplyFiltros }: FiltrosProps) {
  const [expanded, setExpanded] = useState({
    talla: true,
    color: false,
    precio: false,
    tipo: false,
    genero: false,
  })

  const [filtros, setFiltros] = useState({
    talla: [] as string[],
    color: [] as string[],
    precio: { min: 0, max: 500 },
    tipo: [] as string[],
    genero: [] as string[],
  })

  const toggleFilter = (category: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const handleFiltroChange = (tipo: string, valor: any) => {
    setFiltros(prev => {
      const updated = { ...prev }
      if (Array.isArray(prev[tipo as keyof typeof filtros])) {
        const arr = prev[tipo as keyof typeof filtros] as any[]
        const index = arr.indexOf(valor)
        if (index > -1) {
          arr.splice(index, 1)
        } else {
          arr.push(valor)
        }
      }
      return updated
    })
  }

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg p-6 h-fit sticky top-20">
      <div className="flex items-center gap-2 mb-6">
        <FaFilter className="text-blue-600" />
        <h3 className="text-lg font-bold text-slate-900">Filtrar</h3>
      </div>

      {/* Filtro Talla */}
      <div className="mb-6 border-b pb-4">
        <button
          onClick={() => toggleFilter('talla')}
          className="flex justify-between items-center w-full mb-3 font-semibold text-slate-900 hover:text-blue-600 transition"
        >
          Talla
          <FaChevronDown className={`transition ${expanded.talla ? 'rotate-180' : ''}`} />
        </button>
        {expanded.talla && (
          <div className="grid grid-cols-3 gap-2">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(talla => (
              <label key={talla} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => handleFiltroChange('talla', talla)}
                  className="rounded"
                />
                <span className="text-sm text-slate-600">{talla}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Filtro Color */}
      <div className="mb-6 border-b pb-4">
        <button
          onClick={() => toggleFilter('color')}
          className="flex justify-between items-center w-full mb-3 font-semibold text-slate-900 hover:text-blue-600 transition"
        >
          Color
          <FaChevronDown className={`transition ${expanded.color ? 'rotate-180' : ''}`} />
        </button>
        {expanded.color && (
          <div className="grid grid-cols-5 gap-2">
            {[
              { nombre: 'Negro', hex: '#000' },
              { nombre: 'Blanco', hex: '#fff' },
              { nombre: 'Azul', hex: '#3b82f6' },
              { nombre: 'Rojo', hex: '#ef4444' },
              { nombre: 'Verde', hex: '#22c55e' },
              { nombre: 'Gris', hex: '#9ca3af' },
              { nombre: 'Rosa', hex: '#ec4899' },
              { nombre: 'Amarillo', hex: '#eab308' },
            ].map(color => (
              <label key={color.nombre} className="cursor-pointer group" title={color.nombre}>
                <input type="checkbox" className="hidden" onChange={() => handleFiltroChange('color', color.nombre)} />
                <div
                  className="w-8 h-8 rounded-full border-2 border-slate-300 hover:border-blue-600 transition group-hover:ring-2 ring-blue-300"
                  style={{ backgroundColor: color.hex }}
                ></div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Filtro Precio */}
      <div className="mb-6 border-b pb-4">
        <button
          onClick={() => toggleFilter('precio')}
          className="flex justify-between items-center w-full mb-3 font-semibold text-slate-900 hover:text-blue-600 transition"
        >
          Precio
          <FaChevronDown className={`transition ${expanded.precio ? 'rotate-180' : ''}`} />
        </button>
        {expanded.precio && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Desde: S/ {filtros.precio.min}</label>
              <input
                type="range"
                min="0"
                max="500"
                value={filtros.precio.min}
                onChange={e => setFiltros(prev => ({ ...prev, precio: { ...prev.precio, min: parseInt(e.target.value) } }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Hasta: S/ {filtros.precio.max}</label>
              <input
                type="range"
                min="0"
                max="500"
                value={filtros.precio.max}
                onChange={e => setFiltros(prev => ({ ...prev, precio: { ...prev.precio, max: parseInt(e.target.value) } }))}
                className="w-full"
              />
            </div>
            <div className="text-sm text-slate-600 font-semibold">
              S/ {filtros.precio.min} - S/ {filtros.precio.max}
            </div>
          </div>
        )}
      </div>

      {/* Filtro Tipo */}
      <div className="mb-6 border-b pb-4">
        <button
          onClick={() => toggleFilter('tipo')}
          className="flex justify-between items-center w-full mb-3 font-semibold text-slate-900 hover:text-blue-600 transition"
        >
          Tipo de Prenda
          <FaChevronDown className={`transition ${expanded.tipo ? 'rotate-180' : ''}`} />
        </button>
        {expanded.tipo && (
          <div className="space-y-2">
            {['Camisetas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Accesorios'].map(tipo => (
              <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => handleFiltroChange('tipo', tipo)}
                  className="rounded"
                />
                <span className="text-sm text-slate-600">{tipo}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Filtro Género */}
      <div className="mb-6">
        <button
          onClick={() => toggleFilter('genero')}
          className="flex justify-between items-center w-full mb-3 font-semibold text-slate-900 hover:text-blue-600 transition"
        >
          Género
          <FaChevronDown className={`transition ${expanded.genero ? 'rotate-180' : ''}`} />
        </button>
        {expanded.genero && (
          <div className="space-y-2">
            {['Hombre', 'Mujer', 'Unisex'].map(genero => (
              <label key={genero} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => handleFiltroChange('genero', genero)}
                  className="rounded"
                />
                <span className="text-sm text-slate-600">{genero}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="space-y-2">
        <button
          onClick={() => onApplyFiltros(filtros)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={() => {
            setFiltros({
              talla: [],
              color: [],
              precio: { min: 0, max: 500 },
              tipo: [],
              genero: [],
            })
          }}
          className="w-full border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
        >
          Limpiar
        </button>
      </div>
    </aside>
  )
}
