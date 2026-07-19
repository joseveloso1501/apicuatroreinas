import React, { useState, useEffect } from 'react'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const mediaBaseURL = (baseURL.includes('localhost') || baseURL.includes('127.0.0.1') || baseURL.includes('0.0.0.0'))
  ? `${baseURL}/media`
  : 'https://storage.googleapis.com/bucket4reinas/media';

export default function ImageCarousel() {
  const [currentImage, setCurrentImage] = useState(0)

  const images = [
    `${mediaBaseURL}/galeria/abejaEnCerezo.jpg`,
    `${mediaBaseURL}/galeria/envasesMiel.JPG`,
    `${mediaBaseURL}/galeria/lavanda.jpg`,
    `${mediaBaseURL}/galeria/apiario.jpg`,
    `${mediaBaseURL}/galeria/magnolio.HEIC`,
    `${mediaBaseURL}/galeria/quillay3.jpg`,
    `${mediaBaseURL}/galeria/perritos.jpg`,
    `${mediaBaseURL}/galeria/avellano.jpg`,
    //`${mediaBaseURL}/galeria/comportamientos_De_las_Abejas_1ok.jpg`,
    //`${mediaBaseURL}/galeria/miel_gemini.png`,
    //`${mediaBaseURL}/galeria/panales_miel_gemini.png`,
    //`${mediaBaseURL}/galeria/quillay3.jpg`,
    //`${mediaBaseURL}/galeria/propoleo_gemini.png`,
    //`${mediaBaseURL}/galeria/flores-abejas.jpg`,
  ]

  // Cambiar imagen cada n segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000) //n
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
          className={`transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ))}

      {/* Indicadores de posición */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 rounded-full transition-all ${index === currentImage ? 'bg-white w-6' : 'bg-white/50 w-2'
              }`}
          />
        ))}
      </div> */}
    </div>
  )
}
