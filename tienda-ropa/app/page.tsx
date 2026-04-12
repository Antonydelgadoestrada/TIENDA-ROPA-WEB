export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col">
      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Tienda Ropa
              </h1>
              <div className="hidden md:flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Productos
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Categorías
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-3xl text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <span className="text-emerald-400 text-sm font-semibold">
                ✨ Bienvenido a Tienda Ropa
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Moda de Calidad para Todos
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
              Descubre nuestra colección exclusiva de prendas elegantes y cómodas.
              Cada pieza seleccionada con dedicación.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a
              href="/catalogo"
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center"
            >
              Explorar Catálogo
            </a>
            <button className="px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-lg hover:border-gray-400 transition-all">
              Más Información
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            {[
              {
                icon: '🎨',
                title: 'Diseño Elegante',
                desc: 'Prendas seleccionadas con buen gusto y estilo',
              },
              {
                icon: '✅',
                title: 'Calidad Premium',
                desc: 'Materiales de primera calidad y acabados perfectos',
              },
              {
                icon: '🚚',
                title: 'Envío Rápido',
                desc: 'Entrega segura y en el menor tiempo posible',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-gray-800/40 backdrop-blur border border-gray-700 rounded-xl hover:border-emerald-500/50 transition"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {[
              {
                title: 'Empresa',
                links: ['Nosotros', 'Blog', 'Prensa'],
              },
              {
                title: 'Producción',
                links: ['Catálogo', 'Envíos', 'Cambios'],
              },
              {
                title: 'Legal',
                links: ['Privacidad', 'Términos', 'Cookies'],
              },
              {
                title: 'Social',
                links: ['Instagram', 'Facebook', 'Twitter'],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Tienda Ropa. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {['📧 Email', '📱 Teléfono', '📍 Ubicación'].map((contact, i) => (
                <span key={i} className="text-gray-400 text-sm">
                  {contact}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
