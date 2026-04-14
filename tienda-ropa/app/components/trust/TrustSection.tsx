'use client'

import { FaLock, FaCreditCard, FaShieldAlt, FaBox } from 'react-icons/fa'
import { SiVisa, SiMastercard } from 'react-icons/si'

export default function TrustSection() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Métodos de pago seguros */}
        <div className="text-center space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Pago Seguro Garantizado</h2>
            <p className="text-slate-600 text-lg">Todos tus datos protegidos con encriptación SSL</p>
          </div>

          {/* Iconos de pago */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <div className="text-5xl text-blue-600">
                <SiVisa />
              </div>
              <span className="text-sm text-slate-600">Visa</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-5xl text-red-600">
                <SiMastercard />
              </div>
              <span className="text-sm text-slate-600">Mastercard</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                PP
              </div>
              <span className="text-sm text-slate-600">PayPal</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                TRF
              </div>
              <span className="text-sm text-slate-600">Transferencia</span>
            </div>
          </div>

          {/* Sello SSL */}
          <div className="flex justify-center gap-4">
            <div className="flex flex-col items-center gap-2 bg-green-50 p-4 rounded-lg">
              <FaLock className="text-4xl text-green-600" />
              <span className="text-sm font-semibold text-green-700">SSL Certificado</span>
              <span className="text-xs text-green-600">Conexión Segura</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-blue-50 p-4 rounded-lg">
              <FaShieldAlt className="text-4xl text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Datos Protegidos</span>
              <span className="text-xs text-blue-600">Encriptación 256-bit</span>
            </div>
          </div>
        </div>

        {/* Por qué comprarnos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🚚</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Envío Gratis</h3>
            <p className="text-slate-600">A partir de S/ 100 en compras dentro de Lima</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>✓ Envío 24-48 horas</li>
              <li>✓ Tracking en tiempo real</li>
              <li>✓ Empaque premium</li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔄</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Devolución Fácil</h3>
            <p className="text-slate-600">30 días de garantía sin preguntas</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>✓ Cambio gratis por otro</li>
              <li>✓ Reembolso completo</li>
              <li>✓ Retiro a domicilio</li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Soporte 24/7</h3>
            <p className="text-slate-600">Atención al cliente disponible siempre</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>✓ Chat en vivo</li>
              <li>✓ WhatsApp directo</li>
              <li>✓ Respuesta en minutos</li>
            </ul>
          </div>
        </div>

        {/* Testimonios/Reviews */}
        <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-8 rounded-lg border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Lo que dicen nuestros clientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { titulo: 'Calidad excepcional', rating: 5, autor: 'María G.' },
              { titulo: 'Envío súper rápido', rating: 5, autor: 'Carlos P.' },
              { titulo: 'Muy satisfecho', rating: 5, autor: 'Ana M.' },
            ].map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex gap-1 mb-2">
                  {[...Array(review.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="font-semibold text-slate-900">{review.titulo}</p>
                <p className="text-sm text-slate-500">— {review.autor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Política de devolución en 3 pasos */}
        <div className="bg-slate-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Devolución en 3 Pasos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-bold text-slate-900">Solicita cambio</h4>
              </div>
              <p className="text-slate-600 text-sm ml-14">
                Accede a tu cuenta y selecciona el producto que deseas devolver. Es rápido y sin complicaciones.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-bold text-slate-900">Retiramos</h4>
              </div>
              <p className="text-slate-600 text-sm ml-14">
                Pasamos a recoger tu devolución a domicilio. No te cuesta nada, nosotros corremos con los gastos.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-bold text-slate-900">Listo 💰</h4>
              </div>
              <p className="text-slate-600 text-sm ml-14">
                Reembolso o cambio por tu nueva prenda. El dinero de vuelta en 3-5 días hábiles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
