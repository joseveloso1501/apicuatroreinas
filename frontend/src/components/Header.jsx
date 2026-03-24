import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  const [open, setOpen] = useState(false)
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-honey flex items-center justify-center text-darkbee font-bold">🐝</div>
          <span className="brand text-xl">Api Cuatro Reinas Store</span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-amber-600">Inicio</Link>
          <Link to="/productos" className="text-gray-700 hover:text-amber-600">Productos</Link>
          <Link to="/sobre" className="text-gray-700 hover:text-amber-600">Sobre la apicultura</Link>
          <Link to="/contacto" className="text-gray-700 hover:text-amber-600">Contacto</Link>
          <Link to="/productos" className="btn-primary">Tienda</Link>
        </nav>

        <div className="md:hidden">
          <button onClick={()=>setOpen(!open)} className="p-2 rounded-md bg-yellow-100">
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={()=>setOpen(false)} className="text-gray-700">Inicio</Link>
            <Link to="/productos" onClick={()=>setOpen(false)} className="text-gray-700">Productos</Link>
            <Link to="/sobre" onClick={()=>setOpen(false)} className="text-gray-700">Sobre la apicultura</Link>
            <Link to="/contacto" onClick={()=>setOpen(false)} className="text-gray-700">Contacto</Link>
          </div>
        </div>
      )}
    </header>
  )
}
