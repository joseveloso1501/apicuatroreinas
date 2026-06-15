import React, { useState, useEffect } from 'react'

export default function ImageCarousel() {
  const [currentImage, setCurrentImage] = useState(0)

  // Imágenes provisorias
  const images = [
    '/src/assets/carousel/flores-abejas.jpg',
    '/src/assets/productosGemini/miel_gemini.png',
    '/src/assets/carousel/comportamientos_De_las_Abejas_1ok.jpg',
    '/src/assets/productosGemini/panales_miel_gemini.png',
    '/src/assets/productosGemini/quillay3.jpg',
    '/src/assets/productosGemini/propoleo_gemini.png',
  ]

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hero-slide" >
      {/* Imágenes con transición de difuminado */}
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Carousel slide ${index + 1}`}
          className={`transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Indicadores de posición */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentImage ? 'bg-white w-6' : 'bg-white/50 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
