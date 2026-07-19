import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ImageCarousel from '../components/ImageCarousel'

const BEES = [
  { id: 1, duration: '12s', delay: '0s', size: 'text-2xl' },
  { id: 2, duration: '15s', delay: '3s', size: 'text-3xl' },
  { id: 3, duration: '10s', delay: '6s', size: 'text-xl' },
  { id: 4, duration: '18s', delay: '1.5s', size: 'text-4xl' },
  { id: 5, duration: '14s', delay: '9s', size: 'text-2xl' },
]

export default function Home() {
  const line1 = "Desde el corazón de nuestra colmena, directamente a tu hogar"
  const line2 = "" //"directamente a tu hogar"
  const btnBaseClass = "w-full sm:w-auto px-8 py-3.5 text-lg font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-xl flex items-center justify-center cursor-pointer"
  const fadeInUpClass = "transition-all duration-1000 transform"
  const fadeInUpStateClass = (active) => active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  const [typedLine1, setTypedLine1] = useState("")
  const [typedLine2, setTypedLine2] = useState("")
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let index1 = 0
    let index2 = 0

    const interval1 = setInterval(() => {
      setTypedLine1(line1.slice(0, index1 + 1))
      index1++
      if (index1 >= line1.length) {
        clearInterval(interval1)

        setTimeout(() => {
          const interval2 = setInterval(() => {
            setTypedLine2(line2.slice(0, index2 + 1))
            index2++
            if (index2 >= line2.length) {
              clearInterval(interval2)
              setIsDone(true)
            }
          }, 45)
        }, 150)
      }
    }, 45)

    return () => {
      clearInterval(interval1)
    }
  }, [])

  return (
    <section className="bg-yellow-50 relative overflow-hidden">
      <ImageCarousel />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center relative z-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight select-none min-h-[5rem] sm:min-h-[7rem] md:min-h-[8rem] lg:min-h-[9rem]">
              {typedLine1}
              <br className="hidden md:inline" />
              {typedLine2}
              {/* {!isDone && <span className="animate-pulse text-amber-400">|</span>} */}
            </h1>
            <p className={`mt-4 text-base md:text-xl text-yellow-50/90 max-w-2xl mx-auto select-none ${fadeInUpClass} ${fadeInUpStateClass(isDone)}`}>
              Descubre lo que nuestras abejas son capaces de hacer por ti con las flores de su tierra.
            </p>
            <div className={`mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center ${fadeInUpClass} delay-300 ${fadeInUpStateClass(isDone)}`}>
              <Link
                to="/productos"
                className={`${btnBaseClass} bg-amber text-white shadow-lg hover:bg-amber-600`}
              >
                Ver productos
              </Link>
              <Link
                to="/contacto"
                className={`${btnBaseClass} border-2 border-white text-white hover:bg-yellow-50/50 hover:text-amber backdrop-blur-xs`}
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animación de Abejas Volando */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes flyBee {
            0% {
              transform: translate(110vw, 105vh) scale(0.5) rotate(10deg);
              opacity: 0;
            }
            5% {
              opacity: 0.9;
            }
            25% {
              transform: translate(80vw, 75vh) scale(0.65) rotate(5deg) translateY(-25px);
            }
            50% {
              transform: translate(50vw, 45vh) scale(0.8) rotate(15deg) translateY(25px);
            }
            75% {
              transform: translate(20vw, 20vh) scale(0.95) rotate(0deg) translateY(-20px);
            }
            95% {
              opacity: 0.9;
            }
            100% {
              transform: translate(-10vw, -10vh) scale(1.1) rotate(10deg);
              opacity: 0;
            }
          }
        `}} />
        {BEES.map(bee => (
          <span
            key={bee.id}
            className={`absolute select-none inline-block ${bee.size}`}
            style={{
              animation: `flyBee ${bee.duration} linear infinite`,
              animationDelay: bee.delay,
              left: 0,
              top: 0,
              transform: 'translate(110vw, 105vh)'
            }}
          >
            🐝
          </span>
        ))}
      </div>
    </section>
  )
}
