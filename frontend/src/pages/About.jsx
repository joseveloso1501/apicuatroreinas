import React, { useState, useEffect, useRef } from 'react'

const baseURL = import.meta.env.VITE_API_URL || '';

const imgCajones = `${baseURL}/media/galeria/cajones_gemini.png`
const imgPilares = `${baseURL}/media/galeria/IMG_1153.JPG`
const imgPanales = `${baseURL}/media/galeria/panales_miel_gemini.png`
const imgMiel = `${baseURL}/media/galeria/miel_gemini.png`
const imgCaballetes = `${baseURL}/media/galeria/caballetes_gemini.png`
const imgPropoleo = `${baseURL}/media/galeria/propoleo_gemini.png`

const GALERIA = [
  { id: 1, image: imgPanales, caption: 'Trabajando en el apiario de Cuatro Reinas 🐝🍯 #apicultura #organico', likes: 124, comments: 12 },
  { id: 2, image: imgCajones, caption: 'Nuestros cajones en plena producción de primavera 🌸 #abejas #colmenas', likes: 98, comments: 8 },
  { id: 3, image: imgMiel, caption: 'Miel 100% pura extraída con mínima intervención. ¡Pide la tuya! 🍯✨', likes: 156, comments: 18 },
  { id: 4, image: imgCaballetes, caption: 'Preparando la colmena para la temporada de invierno ❄️🐝', likes: 85, comments: 5 },
  { id: 5, image: imgPropoleo, caption: 'Propóleo natural: el mejor escudo protector de la colmena 🛡️', likes: 112, comments: 9 },
]

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)

  const [pilaresVisible, setPilaresVisible] = useState(false)
  const pilaresRef = useRef(null)

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
            <h3 className="text-xl font-bold text-gray-900">Galería de Imágenes</h3>
            <a
              href="https://www.instagram.com/api4reinas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-extrabold text-amber hover:text-amber-600 flex items-center gap-1 hover:underline"
            >
              @api4reinas 📸
            </a>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-amber/30 scrollbar-track-transparent">
            {GALERIA.map(post => (
              console.log("Imagen:", post.image),
              <a
                key={post.id}
                href="https://www.instagram.com/api4reinas/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-64 h-80 flex-shrink-0 relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100/50 bg-gray-50 snap-start block"
              >
                {/* Imagen de fondo */}
                <img
                  src={post.image}
                  alt="Post de Instagram"
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

                {/* Icono de Instagram en Hover */}
                <div className="absolute inset-0 bg-black/45 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="text-white text-3xl font-extrabold drop-shadow">📸</span>
                </div>
              </a>
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
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Quiénes Somos</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                En <strong>Apícola Cuatro Reinas</strong> somos un apiario emergente que nace con un profundo entusiasmo y un compromiso desde el momento cero. Nos mueve el respeto por la naturaleza, la preocupación por los detalles y la convicción de que las cosas se pueden hacer de una manera diferente. Combinamos la sabiduría de la apicultura tradicional con el respaldo de la ciencia y la tecnología para ofrecer lo mejor de la colmena al mundo.
              </p>
            </div>

            {/* Misión y Visión (Dos Columnas con efecto deslizante) */}
            <div
              ref={containerRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden py-1"
            >
              {/* Misión */}
              <div
                className={`bg-yellow-50/20 border border-yellow-100 rounded-2xl p-6 shadow-xs space-y-3 transition-all duration-1000 ease-out transform ${isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-16'
                  }`}
              >
                <div className="flex items-center gap-2 text-amber-600">
                  <span className="text-xl select-none">🎯</span>
                  <h4 className="font-bold text-sm uppercase tracking-wider">Nuestra Misión</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Entregar productos apícolas de la más alta calidad, bajo una premisa fundamental: la mínima intervención posible. Nos esforzamos en cada etapa del proceso para que cada producto conserve intactas sus propiedades naturales, su pureza y su calidad de origen, llevando de la colmena a tu mesa un alimento vivo, auténtico y respetuoso.
                </p>
              </div>

              {/* Visión */}
              <div
                className={`bg-amber/5 border border-amber/10 rounded-2xl p-6 shadow-xs space-y-3 transition-all duration-1000 ease-out delay-200 transform ${isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-16'
                  }`}
              >
                <div className="flex items-center gap-2 text-amber-600">
                  <span className="text-xl select-none">👁️‍🗨️</span>
                  <h4 className="font-bold text-sm uppercase tracking-wider">Nuestra Visión</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Miramos al futuro con un objetivo claro: la protección de las abejas. Buscamos ser un aporte al mantenimiento del equilibrio ecosistémico y el cuidado del medio ambiente. No nos quedamos solo en la observación, aspiramos a ser agentes de cambio mediante el desarrollo de tecnologías innovadoras que potencien el bienestar, la salud y la preservación de las abejas.
                </p>
              </div>
            </div>



          </div>

          {/* Columna Derecha: El Contexto de la Apicultura */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md space-y-4">
              <h4 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center gap-2 select-none">
                El Valor de la Apicultura
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                La apicultura es la ciencia y el arte de mantener colmenas de abejas con fines ecológicos y productivos. Los apicultores cuidan a las abejas, les proporcionan colmenas seguras y manejan su alimentación y salud, logrando obtener productos como miel, cera, propóleos, jalea real y polen.
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
            Nuestros Pilares Fundamentales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilar 1 */}
            <div
              className={`flex items-start gap-4 p-6 rounded-2xl border border-white/10 bg-stone-900/80 hover:bg-stone-900/95 hover:border-white/25 transition-all duration-1000 ease-out transform ${pilaresVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-16'
                }`}
            >
              <span className="text-3xl p-3 bg-amber/20 border border-amber/30 rounded-2xl select-none flex items-center justify-center shrink-0 shadow-inner">
                🌱
              </span>
              <div className="space-y-2">
                <h5 className="font-extrabold text-base text-white">Buenas Prácticas desde el Origen</h5>
                <p className="text-xs text-yellow-50/80 leading-relaxed">
                  Implementamos manejos éticos y responsables en el apiario desde el primer día, priorizando siempre la salud de la colmena sobre la producción masiva.
                </p>
              </div>
            </div>

            {/* Pilar 2 */}
            <div
              className={`flex items-start gap-4 p-6 rounded-2xl border border-white/10 bg-stone-900/80 hover:bg-stone-900/95 hover:border-white/25 transition-all duration-1000 ease-out delay-200 transform ${pilaresVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-16'
                }`}
            >
              <span className="text-3xl p-3 bg-amber/20 border border-amber/30 rounded-2xl select-none flex items-center justify-center shrink-0 shadow-inner">
                🔬
              </span>
              <div className="space-y-2">
                <h5 className="font-extrabold text-base text-white">Ciencia y Tecnología Aplicada</h5>
                <p className="text-xs text-yellow-50/80 leading-relaxed">
                  Nos apoyamos en herramientas científicas y tecnológicas para monitorear, entender y proteger a nuestras abejas de manera más eficiente y menos invasiva.
                </p>
              </div>
            </div>

            {/* Pilar 3 */}
            <div
              className={`flex items-start gap-4 p-6 rounded-2xl border border-white/10 bg-stone-900/80 hover:bg-stone-900/95 hover:border-white/25 transition-all duration-1000 ease-out delay-400 transform ${pilaresVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-16'
                }`}
            >
              <span className="text-3xl p-3 bg-amber/20 border border-amber/30 rounded-2xl select-none flex items-center justify-center shrink-0 shadow-inner">
                💖
              </span>
              <div className="space-y-2">
                <h5 className="font-extrabold text-base text-white">Pasión por el Detalle</h5>
                <p className="text-xs text-yellow-50/80 leading-relaxed">
                  Como equipo joven y dinámico, ponemos nuestro corazón en cada proceso, asegurando que la delicadeza y el rigor técnico se reflejen en la excelencia de nuestros productos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
