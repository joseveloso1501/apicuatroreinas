import React from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  // CLASES DE ESTILO ENCAPSULADAS
  const socialBtnBaseClass = "w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 text-yellow-50 shadow-sm"
  const linkClass = "hover:underline"

  // RENDERIZADO DEL COMPONENTE
  return (
    <footer className="bg-darkbee text-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold">Apícola Cuatro Reinas</h3>
          <p className="text-sm">Colmenares artesanales de calidad superior.</p>
          <p className="text-sm">Los Ángeles, Chile.</p>
        </div>
        <div>
          <h4 className="font-semibold">Enlaces</h4>
          <ul className="mt-2 text-sm space-y-1">
            <li><Link to="/" className={linkClass}>Inicio</Link></li>
            <li><Link to="/productos" className={linkClass}>Productos</Link></li>
            <li><Link to="/sobre" className={linkClass}>Nosotros</Link></li>
            <li><Link to="/contacto" className={linkClass}>Contacto</Link></li>
            <li><Link to="/profile" className={linkClass}>Mi cuenta</Link></li>
            <li><Link to="/terminos" className={linkClass}>Términos y Condiciones</Link></li>
            <li><Link to="/privacidad" className={linkClass}>Política de Privacidad</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Redes</h4>
          <div className="flex gap-3">
            <a
              href="https://wa.me/56993788049"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={`${socialBtnBaseClass} hover:bg-emerald-600 hover:text-white`}
            >
              <FaWhatsapp size={22} />
            </a>
            <a
              href="https://www.instagram.com/api4reinas/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={`${socialBtnBaseClass} hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white`}
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="mailto:apicuatroreinas@gmail.com"
              aria-label="Gmail"
              className={`${socialBtnBaseClass} hover:bg-rose-600 hover:text-white`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="bg-black/20 text-center py-3 text-sm">© {new Date().getFullYear()} Apícola
        Cuatro Reinas por José Veloso</div>
    </footer>
  )
}
