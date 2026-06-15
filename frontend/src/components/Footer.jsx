import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
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
          <ul className="mt-2 text-sm">
            <li><Link to="/" className="hover:underline">Inicio</Link></li>
            <li><Link to="/productos" className="hover:underline">Productos</Link></li>
            <li><Link to="/sobre" className="hover:underline">Nosotros</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Redes</h4>
          <div className="flex gap-3">
            <a 
              href="https://wa.me/56956110251" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 text-yellow-50 shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.63 2.028 14.154.999 11.53.999c-5.442 0-9.87 4.372-9.874 9.802-.001 1.83.486 3.62 1.411 5.187l-.965 3.525 3.619-.949zm11.367-7.404c-.332-.165-1.961-.958-2.265-1.069-.304-.11-.525-.165-.745.165-.22.33-.852 1.069-1.043 1.288-.19.22-.382.247-.714.082-1.892-.948-3.136-1.657-4.38-3.79-.328-.564.328-.524.94-1.745.102-.206.051-.385-.026-.55-.076-.165-.625-1.484-.856-2.03-.225-.539-.453-.466-.625-.475-.162-.008-.348-.01-.533-.01-.186 0-.488.069-.743.344-.256.275-.978.945-.978 2.302s.999 2.668 1.139 2.852c.139.186 1.966 2.977 4.76 4.17 1.632.695 2.268.809 3.085.69.516-.075 1.583-.64 1.804-1.258.222-.619.222-1.15.155-1.258-.066-.11-.247-.165-.58-.33z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/api4reinas/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 text-yellow-50 shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a 
              href="mailto:contacto@apicuatroreinas.cl" 
              aria-label="Gmail"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 text-yellow-50 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="bg-black/20 text-center py-3 text-sm">© {new Date().getFullYear()} Apícola
       Cuatro Reinas </div>
    </footer>
  )
}
