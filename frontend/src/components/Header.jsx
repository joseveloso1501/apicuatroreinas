import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'

export default function Header(){
  const [open, setOpen] = useState(false)
  const { cartCount, setIsCartOpen } = useCart()

  // Clases dinámicas para los enlaces de escritorio
  const navLinkClass = ({ isActive }) => 
    `relative py-1.5 text-sm font-semibold transition-colors duration-200 group select-none ${
      isActive ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'
    }`

  // Clases dinámicas para los enlaces en móvil
  const mobileNavLinkClass = ({ isActive }) => 
    `px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
      isActive 
        ? 'bg-amber/10 text-amber-600 border-l-4 border-amber pl-3' 
        : 'text-gray-600 hover:bg-yellow-50/50 hover:text-amber-600'
    }`

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full bg-honey flex items-center justify-center text-darkbee font-bold">🐝</div>
          <span className="brand text-xl">Apícola Cuatro Reinas</span>
        </Link>

        {/* Menú de Escritorio */}
        <nav className="hidden md:flex gap-8 items-center">
          <NavLink to="/" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>Inicio</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-amber transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </>
            )}
          </NavLink>
          <div className="relative group">
            <NavLink to="/productos" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-1">
                    Productos
                    {/* Flecha de menú desplegable */}
                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-amber transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </>
              )}
            </NavLink>
            
            {/* Menú Desplegable de Escritorio */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100">
              <Link to="/productos" className="block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-yellow-50/50 hover:text-amber-600 transition-colors">
                🍯  Alimentos
              </Link>
              <Link to="/productos" className="block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-yellow-50/50 hover:text-amber-600 transition-colors">
                💊  Medicinas
              </Link>
              <Link to="/productos" className="block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-yellow-50/50 hover:text-amber-600 transition-colors">
                🕯️  Subproductos
              </Link>
              <Link to="/productos" className="block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-yellow-50/50 hover:text-amber-600 transition-colors">
                👑  Material biológico
              </Link>
            </div>
          </div>
          <NavLink to="/sobre" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>Nosotros</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-amber transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </>
            )}
          </NavLink>
          <div className="relative group">
            <NavLink to="/contacto" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-1">
                    Contacto
                    {/* Flecha de menú desplegable */}
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-amber transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </>
              )}
            </NavLink>
            
            {/* Menú Desplegable Contacto */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100">
              <Link to="/contacto" className="block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-yellow-50/50 hover:text-amber-600 transition-colors">
                📬 Contáctanos aquí
              </Link>
              <a 
                href="https://wa.me/56956110251" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-yellow-50/50 hover:text-amber-600 transition-colors"
              >
                💬 Whatsapp
              </a>
              <a 
                href="https://www.instagram.com/api4reinas/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-yellow-50/50 hover:text-amber-600 transition-colors"
              >
                📸 Instagram
              </a>
            </div>
          </div>

          {/* Botón Carrito de Compras (Escritorio) */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-2 text-gray-600 hover:text-amber-600 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Abrir carrito"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
          
          <Link 
            to="/productos" 
            className="btn-primary transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md flex items-center justify-center"
          >
            Tienda
          </Link>
        </nav>

        {/* Controles para Móvil */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Botón Carrito (Móvil) */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-2 text-gray-600 hover:text-amber-600 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Abrir carrito"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Botón Menú Hambuguesa */}
          <button 
            onClick={()=>setOpen(!open)} 
            className="p-2 rounded-md bg-yellow-100/50 hover:bg-yellow-100 text-darkbee active:scale-95 transition-all"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menú desplegable Móvil */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="px-4 py-3 flex flex-col gap-2">
            <NavLink to="/" onClick={()=>setOpen(false)} className={mobileNavLinkClass}>Inicio</NavLink>
            <NavLink to="/productos" onClick={()=>setOpen(false)} className={mobileNavLinkClass}>Productos</NavLink>
            {/* Sub-items del menú en Móvil */}
            <div className="pl-6 flex flex-col gap-2 -mt-1 mb-2">
              <Link to="/productos" onClick={()=>setOpen(false)} className="text-xs font-bold text-gray-500 hover:text-amber flex items-center gap-1.5 py-1">
                🍯 Alimentos
              </Link>
              <Link to="/productos" onClick={()=>setOpen(false)} className="text-xs font-bold text-gray-500 hover:text-amber flex items-center gap-1.5 py-1">
                💊 Medicinas
              </Link>
              <Link to="/productos" onClick={()=>setOpen(false)} className="text-xs font-bold text-gray-500 hover:text-amber flex items-center gap-1.5 py-1">
                🕯️ Subproductos
              </Link>
              <Link to="/productos" onClick={()=>setOpen(false)} className="text-xs font-bold text-gray-500 hover:text-amber flex items-center gap-1.5 py-1">
                👑 Material biológico
              </Link>
            </div>
            <NavLink to="/sobre" onClick={()=>setOpen(false)} className={mobileNavLinkClass}>Sobre la apicultura</NavLink>
            <NavLink to="/contacto" onClick={()=>setOpen(false)} className={mobileNavLinkClass}>Contacto</NavLink>
            {/* Sub-items del menú Contacto en Móvil */}
            <div className="pl-6 flex flex-col gap-2 -mt-1 mb-2">
              <Link to="/contacto" onClick={()=>setOpen(false)} className="text-xs font-bold text-gray-500 hover:text-amber flex items-center gap-1.5 py-1">
                📬 Contáctanos aquí
              </Link>
              <a 
                href="https://wa.me/56956110251" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={()=>setOpen(false)} 
                className="text-xs font-bold text-gray-500 hover:text-amber flex items-center gap-1.5 py-1"
              >
                💬 Whatsapp
              </a>
              <a 
                href="https://www.instagram.com/api4reinas/" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={()=>setOpen(false)} 
                className="text-xs font-bold text-gray-500 hover:text-amber flex items-center gap-1.5 py-1"
              >
                📸 Instagram
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Cajón lateral del Carrito */}
      <CartDrawer />
    </header>
  )
}
