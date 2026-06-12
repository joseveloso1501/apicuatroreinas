import React from 'react'
import { Link } from 'react-router-dom'
import ImageCarousel from '../components/ImageCarousel'

export default function Home(){
  return (
    <section className="bg-yellow-50 relative">
      <ImageCarousel />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">Productos de la colmena, directo a tu casa</h1>
            <p className="mt-4 text-white">Miel, cera, propóleo y más. Aprende sobre la producción y apoya a las colmenas locales.</p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link to="/productos" className="btn-primary">Ver productos</Link>
              <Link to="/sobre" className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-amber-400">Aprender</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
