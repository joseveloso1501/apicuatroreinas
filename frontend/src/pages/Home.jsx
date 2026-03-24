import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section className="bg-yellow-50 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-darkbee">Productos de la colmena, directo a tu casa</h1>
          <p className="mt-4 text-gray-700">Miel, cera, propóleo y más. Aprende sobre la producción y apoya a las colmenas locales.</p>
          <div className="mt-6 flex gap-4">
            <Link to="/productos" className="btn-primary">Ver productos</Link>
            <Link to="/sobre" className="px-4 py-2 rounded-full border border-amber-400">Aprender</Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full h-64 bg-gradient-to-br from-honey to-amber rounded-xl flex items-center justify-center text-darkbee text-lg">
            Imagen / Mockup
          </div>
        </div>
      </div>
    </section>
  )
}
