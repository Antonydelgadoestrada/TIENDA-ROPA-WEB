'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'
import CryptoJS from 'crypto-js'
import { createClient } from '@supabase/supabase-js'
import { Usuario } from '@/lib/types'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'registro'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Registro
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('')
  const [regNombre, setRegNombre] = useState('')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // SHA256 - Usar siempre la misma función
  const generateToken = (email: string, password: string) => {
    const hashedPassword = CryptoJS.SHA256(password).toString()
    return CryptoJS.SHA256(`${email}:${hashedPassword}`).toString()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!loginEmail || !loginPassword) {
        throw new Error('Por favor completa todos los campos')
      }

      // Buscar usuario en Supabase
      const { data: user, error: queryError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', loginEmail.toLowerCase())
        .single()

      if (queryError || !user) {
        throw new Error('Usuario o contraseña incorrecta')
      }

      // Verificar contraseña
      const token = generateToken(loginEmail.toLowerCase(), loginPassword)
      if (token !== user.token) {
        throw new Error('Usuario o contraseña incorrecta')
      }

      // Guardar token en localStorage
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_id', user.id)
      localStorage.setItem('user_email', user.email)
      localStorage.setItem('user_nombre', user.nombre)

      // Disparar evento de autenticación
      window.dispatchEvent(new Event('auth-changed'))

      // Redirigir a home
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!regEmail || !regPassword || !regPasswordConfirm || !regNombre) {
        throw new Error('Por favor completa todos los campos')
      }

      if (regPassword !== regPasswordConfirm) {
        throw new Error('Las contraseñas no coinciden')
      }

      if (regPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

      // Verificar si el email ya existe
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', regEmail.toLowerCase())

      if (existingUser && existingUser.length > 0) {
        throw new Error('Este email ya está registrado')
      }

      // Generar token
      const token = generateToken(regEmail.toLowerCase(), regPassword)

      // Crear usuario en Supabase
      const { data: newUser, error: insertError } = await supabase
        .from('usuarios')
        .insert({
          email: regEmail.toLowerCase(),
          nombre: regNombre,
          token: token,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        throw new Error(insertError.message || 'Error al crear la cuenta')
      }

      if (!newUser) {
        throw new Error('No se pudo crear la cuenta')
      }

      // Guardar token en localStorage
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_id', newUser.id)
      localStorage.setItem('user_email', newUser.email)
      localStorage.setItem('user_nombre', newUser.nombre)

      // Disparar evento de autenticación
      window.dispatchEvent(new Event('auth-changed'))

      // Redirigir a home
      router.push('/')
    } catch (err: any) {
      console.error('Error al registrarse:', err)
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition mb-6">
            <FaArrowLeft /> Volver a la tienda
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Acceso a tu cuenta</h1>
          <p className="text-slate-600 mt-2">Inicia sesión o crea una cuenta</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 font-semibold transition ${
              tab === 'login'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setTab('registro')}
            className={`flex-1 py-3 font-semibold transition ${
              tab === 'registro'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-700">
                <input type="checkbox" className="rounded" />
                Recuérdame
              </label>
              <Link href="#" className="text-blue-600 hover:text-blue-700">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            {/* Social Login */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-600">O continúa con</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full border border-slate-300 bg-white text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Google
            </button>
          </form>
        )}

        {/* REGISTRO FORM */}
        {tab === 'registro' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                value={regNombre}
                onChange={(e) => setRegNombre(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-slate-700 text-sm">
              <input type="checkbox" className="mt-1" required />
              <span>
                Acepto los <Link href="#" className="text-blue-600 hover:underline">Términos y Condiciones</Link> y la{' '}
                <Link href="#" className="text-blue-600 hover:underline">Política de Privacidad</Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>

            {/* Social Signup */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-600">O regístrate con</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full border border-slate-300 bg-white text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Google
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-600 text-sm">
          {tab === 'login' ? (
            <>
              ¿No tienes cuenta?{' '}
              <button onClick={() => setTab('registro')} className="text-blue-600 hover:underline font-semibold">
                Registrate aquí
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => setTab('login')} className="text-blue-600 hover:underline font-semibold">
                Inicia sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
