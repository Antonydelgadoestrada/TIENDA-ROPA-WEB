'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

interface Configuracion {
  nombre_tienda: string
  instagram?: string
  facebook?: string
  tiktok?: string
  whatsapp?: string
}

export default function Header() {
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await supabase
          .from('tienda_configuracion')
          .select('nombre_tienda, instagram, facebook, tiktok, whatsapp')
          .single()

        if (data) {
          setConfig(data)
        }
      } catch (error) {
        console.error('Error cargando config:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo y Nombre */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-3xl">👗</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition">
              {config?.nombre_tienda || 'Tienda Ropa'}
            </h1>
            <p className="text-xs text-slate-500">Tienda Online</p>
          </div>
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-slate-700 hover:text-blue-600 font-semibold transition">
            Inicio
          </Link>
          <Link href="/productos" className="text-slate-700 hover:text-blue-600 font-semibold transition">
            Productos
          </Link>
          <Link href="/contacto" className="text-slate-700 hover:text-blue-600 font-semibold transition">
            Contacto
          </Link>
        </nav>

        {/* Redes Sociales */}
        <div className="flex gap-4 items-center">
          {config?.whatsapp && (
            <a
              href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 text-xl transition"
              title="WhatsApp"
            >
              💬
            </a>
          )}
          {config?.instagram && (
            <a
              href={`https://instagram.com/${config.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 text-xl transition"
              title="Instagram"
            >
              📷
            </a>
          )}
          {config?.facebook && (
            <a
              href={`https://facebook.com/${config.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-xl transition"
              title="Facebook"
            >
              👤
            </a>
          )}
          {config?.tiktok && (
            <a
              href={`https://tiktok.com/@${config.tiktok.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-900 hover:text-slate-700 text-xl transition"
              title="TikTok"
            >
              🎵
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
