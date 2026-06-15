import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header(){
  const [open, setOpen] = useState(false)

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
          <NavLink to="/productos" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>Productos</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-amber transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </>
            )}
          </NavLink>
          <NavLink to="/sobre" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>Sobre la apicultura</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-amber transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </>
            )}
          </NavLink>
          <NavLink to="/contacto" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>Contacto</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-amber transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </>
            )}
          </NavLink>
          
          <Link 
            to="/productos" 
            className="btn-primary transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md flex items-center justify-center"
          >
            Tienda
          </Link>
        </nav>

        {/* Botón menú Móvil */}
        <div className="md:hidden">
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
            <NavLink to="/sobre" onClick={()=>setOpen(false)} className={mobileNavLinkClass}>Sobre la apicultura</NavLink>
            <NavLink to="/contacto" onClick={()=>setOpen(false)} className={mobileNavLinkClass}>Contacto</NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
