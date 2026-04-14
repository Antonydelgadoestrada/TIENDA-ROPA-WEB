'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Aquí puedes enviar el email usando un servicio como SendGrid, Resend, etc.
      // Por ahora solo mostramos un mensaje de éxito
      console.log('Mensaje enviado:', formData)
      setSuccess(true)
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })

      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition mb-6">
            <FaArrowLeft /> Volver a la tienda
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">Contacto</h1>
          <p className="text-slate-600 mt-2">¿Tienes preguntas? Nos encantaría escucharte</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Información de Contacto</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <FaEnvelope className="text-blue-600 text-xl mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <a href="mailto:info@tienda.com" className="text-blue-600 hover:underline">
                      info@tienda.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <FaPhone className="text-blue-600 text-xl mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Teléfono</p>
                    <a href="tel:+51999999999" className="text-blue-600 hover:underline">
                      +51 999 999 999
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <FaWhatsapp className="text-green-600 text-xl mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">WhatsApp</p>
                    <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      Chatear por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-bold text-slate-900 mb-2">Horario de Atención</h4>
              <p className="text-slate-600 text-sm">
                Lunes a Viernes: 9:00 AM - 6:00 PM<br/>
                Sábado: 10:00 AM - 4:00 PM<br/>
                Domingo: Cerrado
              </p>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded text-sm">
                ✓ Mensaje enviado correctamente. Nos pondremos en contacto pronto.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono (Opcional)</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+51 999 999 999"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Asunto</label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
                placeholder="¿Cuál es tu pregunta?"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mensaje</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                placeholder="Escribe tu mensaje aquí..."
                rows={5}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-disabled"
            >
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
