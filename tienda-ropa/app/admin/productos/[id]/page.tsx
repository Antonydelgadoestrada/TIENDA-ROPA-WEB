'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'

interface Producto {
  id: string
  nombre: string
  precio: number
  descripcion: string
  imagen_url: string
  categoria: string
  activo: boolean
  created_at: string
}

interface ProductoTalla {
  id: string
  talla: {
    nombre: string
  }
  stock: number
}

export default function EditarProductoPage() {
  const params = useParams()
  const router = useRouter()
  const productoId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [producto, setProducto] = useState<Producto | null>(null)
  const [tallasStock, setTallasStock] = useState<ProductoTalla[]>([])
  const [previewImage, setPreviewImage] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [editingStock, setEditingStock] = useState<string | null>(null)
  const [stockModif, setStockModif] = useState<{ [key: string]: { cantidad: string; razon: string } }>({})

  // Actualizar stock de una talla
  const handleUpdateStockDirecto = async (productoTallaId: string, nuevoStock: number) => {
    const pt = tallasStock.find(t => t.id === productoTallaId)
    if (!pt) return

    try {
      const cantidadChange = nuevoStock - pt.stock
      const response = await fetch('/api/inventario/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id: productoId,
          talla_id: pt.id.split('-')[2], // Extraer talla_id
          tipo: cantidadChange > 0 ? 'entrada' : 'salida',
          cantidad: Math.abs(cantidadChange),
          razon: stockModif[productoTallaId]?.razon || 'Ajuste manual',
          referencia: 'Edición de producto',
        }),
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Error')

      setAlert({ type: 'success', message: 'Stock actualizado ✓' })
      setEditingStock(null)
      fetchProducto()
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al actualizar stock' })
    }
  }

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    descripcion: '',
    categoria: '',
    activo: true,
    descuento: 0,
  })

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Cargar producto
  useEffect(() => {
    fetchProducto()
  }, [productoId])

  const fetchProducto = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: prodData, error: prodError } = await supabase
        .from('productos')
        .select('*')
        .eq('id', productoId)
        .single()

      if (prodError) throw prodError

      setProducto(prodData)
      setPreviewImage(prodData.imagen_url || '')
      setFormData({
        nombre: prodData.nombre,
        precio: prodData.precio,
        descripcion: prodData.descripcion,
        categoria: prodData.categoria || '',
        activo: prodData.activo,
        descuento: 0,
      })

      // Cargar stock por talla
      const { data: tallasData, error: tallasError } = await supabase
        .from('producto_tallas')
        .select('id, talla:tallas(nombre), stock')
        .eq('producto_id', productoId)

      if (tallasError) throw tallasError
      setTallasStock((tallasData as unknown as ProductoTalla[]) || [])
    } catch (err) {
      console.error('Error:', err)
      setAlert({ type: 'error', message: 'Error al cargar producto' })
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const uploadImage = async () => {
    if (!imageFile) return null

    try {
      const formData = new FormData()
      formData.append('producto_id', productoId)
      formData.append('imagen', imageFile)

      const response = await fetch('/api/productos/imagen', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Error al subir imagen')

      const data = await response.json()
      return data.imagen_url
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al subir imagen' })
      return null
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // Actualizar imagen si cambió
      if (imageFile) {
        const newImageUrl = await uploadImage()
        if (!newImageUrl && imageFile) {
          setSaving(false)
          return
        }
      }

      // Actualizar datos del producto
      const response = await fetch('/api/productos/actualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productoId,
          nombre: formData.nombre,
          precio: parseFloat(formData.precio.toString()),
          descripcion: formData.descripcion,
        }),
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Error al guardar')

      setAlert({ type: 'success', message: '✓ Producto actualizado correctamente' })
      setImageFile(null)

      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1500)
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar cambios' })
    } finally {
      setSaving(false)
    }
  }

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

  if (!producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-gray-600">Producto no encontrado</p>
      </div>
    )
  }

  const precioConDescuento = formData.precio * (1 - formData.descuento / 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm mb-2 block">
              ← Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            ✕ Cerrar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              alert.type === 'success'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : 'bg-red-50 border-red-500 text-red-700'
            }`}
          >
            {alert.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda - Imagen */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">📸 Imagen del Producto</h2>
              </div>

              <div className="p-6">
                {/* Preview */}
                <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt={formData.nombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span className="text-2xl">📷 Sin imagen</span>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <label className="block">
                  <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="text-sm font-semibold text-gray-700 mb-2">🖼️ Cambiar imagen</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP (máx 5MB)</p>
                  </div>
                </label>

                {imageFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-700">
                      ✓ Nueva imagen lista: <strong>{imageFile.name}</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stock por Talla - Editable */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">📦 Stock por Talla - Editable</h2>
              </div>

              <div className="p-6 space-y-3">
                {tallasStock.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">Sin tallas asignadas</p>
                ) : (
                  tallasStock.map(talla => (
                    <div key={talla.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {editingStock === talla.id ? (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-900">
                              {typeof talla.talla === 'object' ? talla.talla.nombre : 'N/A'}
                            </span>
                            <span className="text-sm text-gray-600">Stock actual: {talla.stock}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <input
                              type="number"
                              placeholder="Nuevo stock"
                              defaultValue={talla.stock}
                              onChange={(e) =>
                                setStockModif(prev => ({
                                  ...prev,
                                  [talla.id]: { ...prev[talla.id], cantidad: e.target.value },
                                }))
                              }
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <select
                              onChange={(e) =>
                                setStockModif(prev => ({
                                  ...prev,
                                  [talla.id]: { ...prev[talla.id], razon: e.target.value },
                                }))
                              }
                              defaultValue=""
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                            >
                              <option value="">Razón del cambio</option>
                              <option value="Ajuste física">Ajuste físico</option>
                              <option value="Compra">Compra a proveedor</option>
                              <option value="Devolución">Devolución cliente</option>
                              <option value="Merma">Merma/Daño</option>
                            </select>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleUpdateStockDirecto(talla.id, parseInt(stockModif[talla.id]?.cantidad || talla.stock.toString()))
                              }
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
                            >
                              ✓ Guardar
                            </button>
                            <button
                              onClick={() => {
                                setEditingStock(null)
                                setStockModif(prev => {
                                  const newModif = { ...prev }
                                  delete newModif[talla.id]
                                  return newModif
                                })
                              }}
                              className="px-3 py-1 bg-gray-400 text-white rounded text-sm font-semibold hover:bg-gray-500"
                            >
                              ✕ Cancelar
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 min-w-12">
                            {typeof talla.talla === 'object' ? talla.talla.nombre : 'N/A'}
                          </span>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold ${
                                talla.stock > 10
                                  ? 'bg-green-100 text-green-700'
                                  : talla.stock > 0
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {talla.stock} unidades
                            </span>
                            <button
                              onClick={() => setEditingStock(talla.id)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold hover:bg-blue-200"
                            >
                              ✏️ Editar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha - Datos */}
          <div className="space-y-6">
            {/* Datos Básicos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">📝 Información Básica</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.nombre.length}/100 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="hombres">👕 Hombres</option>
                    <option value="mujeres">👚 Mujeres</option>
                    <option value="ninos">👶 Niños</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Precio Base (S/.)</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descuento (%)</label>
                    <input
                      type="number"
                      name="descuento"
                      value={formData.descuento}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {formData.descuento > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm text-gray-600">
                      Precio Final: <span className="font-bold text-emerald-600">S/. {precioConDescuento.toFixed(2)}</span>
                      <span className="ml-2 text-xs text-red-600">
                        ({formData.descuento}% OFF)
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">📄 Descripción</h2>
              </div>

              <div className="p-6">
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={6}
                  maxLength={500}
                  placeholder="Describe el producto en detalle. Incluye materiales, tallas disponibles, instrucciones de cuidado, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">{formData.descripcion.length}/500 caracteres</p>
              </div>
            </div>

            {/* Estado */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">⚙️ Estado</h2>
              </div>

              <div className="p-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-700">
                    {formData.activo ? '✓ Producto Activo' : '✗ Producto Inactivo'}
                  </span>
                </label>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-70"
              >
                {saving ? '💾 Guardando...' : '💾 Guardar Cambios'}
              </button>

              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-400 transition"
              >
                ✕ Cancelar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
