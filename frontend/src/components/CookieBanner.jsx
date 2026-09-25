import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCookieBite, FaShieldAlt } from 'react-icons/fa'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Mostrar con pequeño retraso para animación suave
      const timer = setTimeout(() => setIsVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'all')
    setIsVisible(false)
  }

  const handleAcceptEssential = () => {
    localStorage.setItem('cookie_consent', 'essential')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-fade-in font-sans">
      <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-amber-100/80 text-gray-800 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
            <FaCookieBite size={20} />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm tracking-tight text-gray-900 flex items-center gap-1.5">
              <span>Uso de Cookies y Privacidad</span>
              <FaShieldAlt className="text-amber-500 text-xs" />
            </h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Utilizamos cookies esenciales para el funcionamiento de la tienda y cookies de preferencia para mejorar tu experiencia conforme a la Ley N° 21.683 de Protección de Datos de Chile.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer text-center active:scale-95"
          >
            Aceptar Todas
          </button>
          <button
            onClick={handleAcceptEssential}
            className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
          >
            Solo Esenciales
          </button>
        </div>

        <div className="text-[10px] text-gray-500 text-center pt-1 border-t border-gray-100">
          Puedes revisar detalles en nuestra{' '}
          <Link to="/privacidad" className="text-amber-700 font-bold underline hover:text-amber-800">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </div>
  )
}
