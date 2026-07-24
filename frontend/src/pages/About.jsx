import React, { useState, useEffect, useRef } from 'react'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const mediaBaseURL = (baseURL.includes('localhost') || baseURL.includes('127.0.0.1') || baseURL.includes('0.0.0.0'))
  ? `${baseURL}/media`
  : 'https://storage.googleapis.com/bucket4reinas/media';

const imgCajones = `${mediaBaseURL}/galeria/apiario.jpg`
const imgPilares = `${mediaBaseURL}/galeria/panal.jpg`
const imgYo = `${mediaBaseURL}/galeria/yoSostengoMarco.jpg`
const imgMiel = `${mediaBaseURL}/galeria/envasesMiel.jpg`
const mielMano = `${mediaBaseURL}/galeria/mielMano.jpg`
const sombrero = `${mediaBaseURL}/galeria/sombrero.jpg`
const barbaAbejas = `${mediaBaseURL}/galeria/barbaAbejas.jpg`

const GALERIA = [
  { id: 1, image: imgMiel, caption: 'Miel 100% pura extraída con mínima intervención. ¡Pide la tuya! 🍯✨' },
  { id: 2, image: imgCajones, caption: 'Nuestros cajones en plena producción de primavera 🌸 #abejas #colmenas' },
  { id: 3, image: sombrero, caption: 'En ocasiones las abejas nos regalan un momento para observarlas y compartir de su magía 🎩' },
  { id: 4, image: mielMano, caption: 'Miel a horas de ser envasada, pureza en su maximo esplendor ✨' },
  { id: 5, image: imgYo, caption: 'Trabajando en el apiario de Cuatro Reinas 🐝🍯 #apicultura #organico' },
  { id: 6, image: barbaAbejas, caption: 'Es importante saber identificar el lenguaje de las abejas, ellas comunican y nosotros aprendemos día a día 📚🐝' },
]

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)

  const [pilaresVisible, setPilaresVisible] = useState(false)
  const pilaresRef = useRef(null)

  const [selectedImageIndex, setSelectedImageIndex] = useState(null)

  // Clases comunes para animación y layouts
  const slideInLeftStateClass = (visible) => visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'

  // Misión y Visión
  const visionCardBaseClass = "rounded-2xl p-6 shadow-xs space-y-3 transition-all duration-1000 ease-out transform"
  const visionHeaderClass = "flex items-center gap-2 text-amber-600"
  const visionTitleClass = "font-bold text-sm uppercase tracking-wider"
  const visionDescClass = "text-xs text-gray-600 leading-relaxed"

  // Pilares
  const pilarCardClass = "flex items-start gap-4 p-6 rounded-2xl border border-white/10 bg-stone-900/80 hover:bg-stone-900/95 hover:border-white/25 transition-all duration-1000 ease-out transform"
  const pilarIconClass = "text-3xl p-3 bg-amber/20 border border-amber/30 rounded-2xl select-none flex items-center justify-center shrink-0 shadow-inner"
  const pilarTitleClass = "font-extrabold text-base text-white"
  const pilarDescClass = "text-xs text-yellow-50/80 leading-relaxed"

  // Navegación Lightbox
  const navBtnBaseClass = "absolute top-1/2 -translate-y-1/2 z-50 bg-black/40 hover:bg-amber text-white w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md select-none border border-white/10"

  // Observer para Misión y Visión
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Observer para Pilares Fundamentales
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPilaresVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (pilaresRef.current) {
      observer.observe(pilaresRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Keyboard navigation listener for the image lightbox
  useEffect(() => {
    if (selectedImageIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev + 1) % GALERIA.length)
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev - 1 + GALERIA.length) % GALERIA.length)
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex])

  return (
    <section className="bg-white">

      {/* Cabecera Principal con Paralaje (Optimizada para móviles) */}
      <div
        className="relative bg-scroll md:bg-fixed bg-cover bg-center py-24 md:py-32 text-center"
        style={{ backgroundImage: `url(${imgCajones})` }}
      >
        {/* Capa de oscurecimiento para legibilidad del texto */}
        <div className="absolute inset-0 bg-black/55 z-0" />

        {/* Contenido */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-amber text-white rounded-full text-xs font-extrabold uppercase tracking-widest select-none shadow-sm">
            Nuestra Historia
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight select-none drop-shadow-md">
            Apícola Cuatro Reinas
          </h2>
          <p className="text-base md:text-lg text-yellow-100/95 font-semibold max-w-2xl mx-auto italic select-none drop-shadow-sm">
            Respeto ancestral y ciencia aplicada para proteger el corazón de nuestro ecosistema
          </p>
        </div>
      </div>

      {/* Galería de Instagram (Ancho Completo) */}
      <div className="max-w-6xl mx-auto px-6 pt-16">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-xl font-bold text-gray-900"> </h3>
            <a
              href="https://www.instagram.com/api4reinas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-extrabold text-amber hover:text-amber-600 flex items-center gap-1 hover:underline"
            >
              Siguenos en Instagram 👉 @api4reinas
            </a>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-amber/30 scrollbar-track-transparent">
            {GALERIA.map((post, index) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className="w-64 h-80 flex-shrink-0 relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100/50 bg-gray-50 snap-start block cursor-pointer text-left focus:outline-none"
              >
                {/* Imagen de fondo */}
                <img
                  src={post.image}
                  alt={post.caption || "Imagen de la galería"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Capa de oscurecimiento gradual de fondo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                {/* Contenido flotante */}
                <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex flex-col justify-end">
                  <p className="text-[10px] text-white/90 line-clamp-2 leading-relaxed mb-2 font-medium">
                    {post.caption}
                  </p>
                  <div className="flex items-center justify-between text-white/80 text-[10px] font-bold">
                    <span className="flex items-center gap-1">❤️ {post.likes}</span>
                    <span className="flex items-center gap-1">💬 {post.comments}</span>
                  </div>
                </div>

                {/* Icono de Lupa en Hover */}
                <div className="absolute inset-0 bg-black/45 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="text-white text-3xl font-extrabold drop-shadow">🔍</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Contenido Principal */}
      <div className="max-w-6xl mx-auto px-4 pb-16 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Columna Izquierda: Quiénes Somos, Misión, Visión */}
          <div className="lg:col-span-8 space-y-12">

            {/* Introducción */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Quiénes somos</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                En <strong>Apícola Cuatro Reinas</strong> somos un apiario emergente que nace con mucho entusiasmo y un compromiso desde el momento cero. Nos mueve el respeto por la naturaleza, la preocupación por los detalles y la convicción de que las cosas se pueden hacer de una manera diferente. Combinamos la sabiduría de la apicultura tradicional con el respaldo de la ciencia y la tecnología para ofrecer lo mejor de nuestra colmena al mundo.
              </p>
            </div>

            {/* Misión y Visión (Dos Columnas con efecto deslizante) */}
            <div
              ref={containerRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden py-1"
            >
              {/* Misión */}
              <div
                className={`bg-yellow-50/20 border border-yellow-100 ${visionCardBaseClass} ${slideInLeftStateClass(isVisible)}`}
              >
                <div className={visionHeaderClass}>
                  <span className="text-xl select-none">🎯</span>
                  <h4 className={visionTitleClass}>Nuestra misión</h4>
                </div>
                <p className={visionDescClass}>
                  Queremos entregar productos apícolas de la más alta calidad bajo una premisa fundamental: la mínima intervención posible. Nos esforzamos en cada etapa del proceso para que cada productoconserve intactas sus propiedades naturales, su pureza y su calidad de origen.
                </p>
              </div>

              {/* Visión */}
              <div
                className={`bg-amber/5 border border-amber/10 ${visionCardBaseClass} delay-200 ${slideInLeftStateClass(isVisible)}`}
              >
                <div className={visionHeaderClass}>
                  <span className="text-xl select-none">👁️‍🗨️</span>
                  <h4 className={visionTitleClass}>Nuestra visión</h4>
                </div>
                <p className={visionDescClass}>
                  Buscamos ser un aporte al mantenimiento del equilibrio ecosistémico y el cuidado del medio ambiente. Aspiramos a ser agentes de cambio mediante el desarrollo de tecnologías innovadoras que potencien el bienestar, la salud y la preservación de las abejas.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: El Contexto de la Apicultura */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md space-y-4">
              <h4 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center gap-2 select-none">
                El valor de la apicultura
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                La apicultura es ciencia y arte, su objetivo es mantener colmenas de abejas con fines ecológicos y productivos. Los apicultores cuidan a las abejas, les proporcionan colmenas seguras y manejan su alimentación y salud, logrando obtener productos como miel, cera, propóleos, jalea real y polen.
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Además, la apicultura es clave para la polinización de plantas y cultivos, lo que ayuda a la producción de alimentos y mantiene el equilibrio de los ecosistemas.
              </p>
              <div className="border-t border-gray-50 pt-4 text-center">
                <a
                  href="https://www.youtube.com/watch?v=9ipH_22W9uc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-600 hover:text-amber-700 font-extrabold uppercase tracking-wider inline-flex items-center gap-1 hover:underline transition-colors"
                >
                  🎥 Conoce más aquí
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Pilares con Paralaje (Optimizada para móviles) */}
      <div
        className="relative bg-scroll md:bg-fixed bg-cover bg-center py-20 md:py-24 text-white overflow-hidden"
        style={{ backgroundImage: `url(${imgPilares})` }}
      >
        {/* Capa de oscurecimiento */}
        <div className="absolute inset-0 bg-black/60 z-0" />

        {/* Contenido de Pilares */}
        <div ref={pilaresRef} className="relative z-10 max-w-6xl mx-auto px-4 space-y-10">
          <h3 className="text-3xl font-black text-white border-b border-white/20 pb-4 tracking-tight select-none text-center md:text-left">
            Nuestros pilares fundamentales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilar 1 */}
            <div
              className={`${pilarCardClass} ${slideInLeftStateClass(pilaresVisible)}`}
            >
              <span className={pilarIconClass}>
                🌱
              </span>
              <div className="space-y-2">
                <h5 className={pilarTitleClass}>Buenas prácticas</h5>
                <p className={pilarDescClass}>
                  Implementamos manejos éticos y responsables, priorizando siempre la salud de la colmena por sobre la producción masiva.
                </p>
              </div>
            </div>

            {/* Pilar 2 */}
            <div
              className={`${pilarCardClass} delay-200 ${slideInLeftStateClass(pilaresVisible)}`}
            >
              <span className={pilarIconClass}>
                🔬
              </span>
              <div className="space-y-2">
                <h5 className={pilarTitleClass}>Ciencia y tecnología aplicada</h5>
                <p className={pilarDescClass}>
                  Nos apoyamos en herramientas científicas y tecnológicas para monitorear, entender y proteger a nuestras abejas.
                </p>
              </div>
            </div>

            {/* Pilar 3 */}
            <div
              className={`${pilarCardClass} delay-400 ${slideInLeftStateClass(pilaresVisible)}`}
            >
              <span className={pilarIconClass}>
                💖
              </span>
              <div className="space-y-2">
                <h5 className={pilarTitleClass}>Pasión por el detalle</h5>
                <p className={pilarDescClass}>
                  Como equipo joven y dinámico, queremos que nuestra pasión se refleje en la excelencia de nuestros productos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Vista Expandida de la Imagen */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Botón de cierre */}
          <button
            className="absolute top-6 right-6 text-white text-3xl font-extrabold cursor-pointer hover:text-amber transition-colors select-none z-50"
            onClick={() => setSelectedImageIndex(null)}
          >
            ✕
          </button>

          {/* Botón Navegación Izquierda */}
          <button
            className={`${navBtnBaseClass} left-4 md:left-8`}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImageIndex((prev) => (prev - 1 + GALERIA.length) % GALERIA.length)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Botón Navegación Derecha */}
          <button
            className={`${navBtnBaseClass} right-4 md:right-8`}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImageIndex((prev) => (prev + 1) % GALERIA.length)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Contenedor flotante de la imagen */}
          <div
            className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALERIA[selectedImageIndex].image}
              alt="Vista de la galería"
              className="max-w-full max-h-[75vh] object-contain rounded-xl"
            />
            {/* Caption del post de la galería en el modal */}
            {GALERIA[selectedImageIndex].caption && (
              <p className="mt-2 text-xs text-gray-700 text-center font-medium max-w-md px-4 line-clamp-2 select-none">
                {GALERIA[selectedImageIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
