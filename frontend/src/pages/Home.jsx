import React from 'react'
import { Link } from 'react-router-dom'
import ImageCarousel from '../components/ImageCarousel'

export default function Home(){
  return (
    <section className="bg-yellow-50 relative">
      <ImageCarousel />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight select-none">
              Productos de nuestra colmena,<br className="hidden md:inline"/> directamente a tu hogar
            </h1>
            <p className="mt-4 text-base md:text-xl text-yellow-50/90 max-w-2xl mx-auto select-none">
              Miel, propóleo y más. Descubre lo que las abejas pueden hacer para ti con las flores de nuestra tierra. 🐝🍯
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/productos" 
                className="w-full sm:w-auto px-8 py-3.5 bg-amber text-white text-lg font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-amber-600 flex items-center justify-center cursor-pointer"
              >
                Ver productos
              </Link>
              <Link 
                to="/contacto" 
                className="w-full sm:w-auto px-8 py-3.5 border-2 border-white text-white text-lg font-bold rounded-full hover:bg-yellow-50/50 hover:text-amber hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-xl flex items-center justify-center backdrop-blur-xs cursor-pointer"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
