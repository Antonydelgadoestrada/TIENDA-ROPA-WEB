'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Único']

type AlertType = 'success' | 'error' | 'info'

interface Alert {
  type: AlertType
  message: string
}

export default function AgregarProducto() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<Alert | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: '',
  })

  const [imagen, setImagen] = useState<File | null>(null)
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(TALLAS.map((t) => [t, 0]))
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagen(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStockChange = (talla: string, value: string) => {
    setStocks((prev) => ({
      ...prev,
      [talla]: Math.max(0, parseInt(value) || 0),
    }))
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)

    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        setAlert({
          type: 'error',
          message: 'Ingrese el nombre del producto',
        })
        setLoading(false)
        return
      }

      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        setAlert({
          type: 'error',
          message: 'Ingrese un precio válido',
        })
        setLoading(false)
        return
      }

      const totalStock = Object.values(stocks).reduce((a, b) => a + b, 0)
      if (totalStock === 0) {
        setAlert({
          type: 'error',
          message: 'Ingrese stock para al menos una talla',
        })
        setLoading(false)
        return
      }

      // Enviar datos
      const formDataToSend = new FormData()
      formDataToSend.append('nombre', formData.nombre)
      formDataToSend.append('precio', formData.precio)
      formDataToSend.append('descripcion', formData.descripcion)
      formDataToSend.append('categoria', formData.categoria)
      formDataToSend.append('stocks', JSON.stringify(stocks))

      if (imagen) {
        formDataToSend.append('imagen', imagen)
      }

      const response = await fetch('/api/productos/agregar', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar el producto')
      }

      setAlert({
        type: 'success',
        message: '¡Prenda agregada exitosamente!',
      })

      // Reset form
      setFormData({
        nombre: '',
        precio: '',
        descripcion: '',
        categoria: '',
      })
      setImagen(null)
      setImagePreview(null)
      setStocks(Object.fromEntries(TALLAS.map((t) => [t, 0])))

      // Redirect después de 2 segundos
      setTimeout(() => {
        router.push('/admin/agregar')
      }, 2000)
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tienda Ropa</h1>
            <p className="text-sm text-gray-600">Panel de Administración</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alerts */}
        {alert && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              alert.type === 'success'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : alert.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-700'
                : 'bg-blue-50 border-blue-500 text-blue-700'
            }`}
          >
            <p className="font-medium">{alert.message}</p>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-8">
            <h2 className="text-3xl font-bold text-white">Agregar Nueva Prenda</h2>
            <p className="text-emerald-100 mt-2">Complete el formulario para registrar un nuevo producto</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la Prenda *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleFormChange}
                    placeholder="Ej: Chamarra Denim Premium"
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors disabled:bg-gray-50"
                    required
                  />
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio (COP) *
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors disabled:bg-gray-50"
                    required
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleFormChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors disabled:bg-gray-50"
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="hombres">Hombres</option>
                    <option value="mujeres">Mujeres</option>
                    <option value="ninos">Niños</option>
                    <option value="accesorios">Accesorios</option>
                  </select>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleFormChange}
                    placeholder="Describa los detalles, materiales, cuidados, etc."
                    disabled={loading}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors disabled:bg-gray-50 resize-none"
                  />
                </div>

                {/* Imagen */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Imagen del Producto
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 disabled:bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
                </div>
              </div>

              {/* Right Column - Preview & Stock */}
              <div className="space-y-6">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Stock por Talla */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Stock por Talla *
                  </label>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg">
                    {TALLAS.map((talla) => (
                      <div key={talla} className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 min-w-fit">{talla}</span>
                        <input
                          type="number"
                          min="0"
                          value={stocks[talla]}
                          onChange={(e) => handleStockChange(talla, e.target.value)}
                          disabled={loading}
                          className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-white"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">Total stock:</span>{' '}
                      {Object.values(stocks).reduce((a, b) => a + b, 0)} unidades
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Guardar Prenda
                  </>
                )}
              </button>
              <button
                type="reset"
                disabled={loading}
                onClick={() => {
                  setFormData({
                    nombre: '',
                    precio: '',
                    descripcion: '',
                    categoria: '',
                  })
                  setImagen(null)
                  setImagePreview(null)
                  setStocks(Object.fromEntries(TALLAS.map((t) => [t, 0])))
                }}
                className="px-8 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-70"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>

        {/* Tips Card */}
        <div className="mt-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <h3 className="font-semibold text-emerald-900 mb-2">💡 Consejos para mejores resultados</h3>
          <ul className="text-sm text-emerald-800 space-y-1">
            <li>• Usa imágenes de alta calidad en formato horizontal</li>
            <li>• Incluye descripciones detalladas sobre material y cuidados</li>
            <li>• Asegúrate de tener stock en al menos una talla</li>
            <li>• Verifica los precios antes de guardar</li>
          </ul>
        </div>
      </main>
    </div>
  )
}