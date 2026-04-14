'use client'

import Link from 'next/link'
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import { MdEmail, MdPhone } from 'react-icons/md'

export default function FooterPremium() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-2xl">👗</span> La Tienda
            </h4>
            <p className="text-slate-400 text-sm">
              Tienda de moda online con las mejores prendas seleccionadas para ti.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-xl hover:text-blue-400 transition">
                <FaFacebook />
              </a>
              <a href="#" className="text-xl hover:text-pink-400 transition">
                <FaInstagram />
              </a>
              <a href="#" className="text-xl hover:text-green-400 transition">
                <FaWhatsapp />
              </a>
              <a href="#" className="text-xl hover:text-slate-400 transition">
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* Compras */}
          <div>
            <h4 className="font-bold text-lg mb-4">Compras</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-slate-400 hover:text-white transition text-sm">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-slate-400 hover:text-white transition text-sm">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/nuevas-colecciones" className="text-slate-400 hover:text-white transition text-sm">
                  Nuevas Colecciones
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-slate-400 hover:text-white transition text-sm">
                  Mi Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-bold text-lg mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/quienes-somos" className="text-slate-400 hover:text-white transition text-sm">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="text-slate-400 hover:text-white transition text-sm">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-slate-400 hover:text-white transition text-sm">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/politica-devolucion" className="text-slate-400 hover:text-white transition text-sm">
                  Política de Devolución
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MdPhone /> +51 999 888 777
              </li>
              <li className="flex items-center gap-2">
                <MdEmail /> contacto@tienda.com
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp /> Chat WhatsApp
              </li>
              <li className="text-slate-400">
                Lun-Sab 09:00-18:00
                <br />
                Domingo Cerrado
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Métodos de Pago */}
            <div>
              <p className="text-xs font-bold text-slate-400 mb-3">MÉTODOS DE PAGO</p>
              <div className="flex gap-4 text-2xl">
                <span title="Visa">💳</span>
                <span title="Mastercard">💳</span>
                <span title="PayPal">PP</span>
                <span title="Transferencia">🏦</span>
                <span title="Contra Entrega">📦</span>
              </div>
            </div>

            {/* Certificados */}
            <div>
              <p className="text-xs font-bold text-slate-400 mb-3">SEGURIDAD</p>
              <div className="flex gap-4 text-2xl">
                <span title="SSL Certificado">🔒</span>
                <span title="Compra Segura">✓</span>
                <span title="Datos Protegidos">🛡️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>
            &copy; {currentYear} La Tienda. Todos los derechos reservados.
            <br />
            Diseñado y desarrollado con ✨ para ti.
          </p>
        </div>
      </div>
    </footer>
  )
}
