'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Contraseña incorrecta')
        setLoading(false)
        return
      }

      router.push('/admin/agregar')
    } catch (err) {
      setError('Error al conectar con el servidor')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-12">
            <h1 className="text-3xl font-bold text-white text-center">Tienda Ropa</h1>
            <p className="text-emerald-100 text-center mt-2">Panel Administrativo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 py-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Contraseña de Acceso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors disabled:bg-gray-50"
                required
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Acceder'}
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Acceso restringido a personal autorizado
        </p>
      </div>
    </div>
  )
}
