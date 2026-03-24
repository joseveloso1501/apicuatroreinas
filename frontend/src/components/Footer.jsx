import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="bg-darkbee text-yellow-50 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold">Api Cuatro Reinas Store</h3>
          <p className="text-sm">Productos de la colmena, directos a tu casa.</p>
        </div>
        <div>
          <h4 className="font-semibold">Enlaces</h4>
          <ul className="mt-2 text-sm">
            <li><Link to="/" className="hover:underline">Inicio</Link></li>
            <li><Link to="/productos" className="hover:underline">Productos</Link></li>
            <li><Link to="/sobre" className="hover:underline">Sobre</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Redes</h4>
          <div className="flex gap-3 mt-2">
            <a href="#" aria-label="facebook">FB</a>
            <a href="#" aria-label="instagram">IG</a>
            <a href="#" aria-label="twitter">X</a>
          </div>
        </div>
      </div>
      <div className="bg-black/20 text-center py-3 text-sm">© {new Date().getFullYear()} Api Cuatro Reinas Store</div>
    </footer>
  )
}
