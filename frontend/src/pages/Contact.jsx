import React, { useState } from 'react'
import InstagramCard from '../components/InstagramCard'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    // Aquí se podría conectar con la API de backend para enviar mensajes
    setSent(true)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-yellow-50/50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Columna izquierda: Tarjeta de Instagram y Call to Action */}
          <div className="lg:col-span-5 space-y-6 flex flex-col items-center">
            <div className="w-full text-center lg:text-left px-2">
              <span className="inline-block px-3 py-1 bg-amber/10 text-amber-600 rounded-full text-xs font-semibold mb-2">
                Nuestra Comunidad 🌸
              </span>
              <p className="text-sm text-gray-600">
                ¡Síguenos en Instagram para enterarte de nuestras cosechas de miel en tiempo real y aprender sobre el cuidado de las abejas!
              </p>
            </div>
            
            <div className="w-full">
              <InstagramCard />
            </div>
          </div>

          {/* Columna derecha: Formulario e Información de Contacto */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-darkbee tracking-tight mb-2">Contacto</h2>
              <p className="text-gray-600">
                ¿Tienes dudas, sugerencias o quieres hacer un pedido especial? Escríbenos y te responderemos lo antes posible.
              </p>
            </div>

            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-3">
                <span className="text-3xl select-none">🐝✨</span>
                <p className="text-green-800 font-medium">¡Mensaje enviado con éxito!</p>
                <p className="text-sm text-green-700">Muchas gracias por escribirnos. Nuestro equipo se pondrá en contacto contigo pronto.</p>
                <button 
                  onClick={() => {
                    setSent(false)
                    setName('')
                    setEmail('')
                    setMessage('')
                  }}
                  className="mt-2 text-xs font-semibold text-green-800 underline hover:text-green-900"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Nombre
                    </label>
                    <input 
                      id="name"
                      type="text"
                      required
                      className="w-full p-3.5 bg-yellow-50/20 border border-gray-200 rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm" 
                      placeholder="Tu nombre completo" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Correo Electrónico
                    </label>
                    <input 
                      id="email"
                      type="email"
                      required
                      className="w-full p-3.5 bg-yellow-50/20 border border-gray-200 rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm" 
                      placeholder="ejemplo@correo.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mensaje
                  </label>
                  <textarea 
                    id="message"
                    required
                    rows="4"
                    className="w-full p-3.5 bg-yellow-50/20 border border-gray-200 rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm min-h-[140px] resize-y" 
                    placeholder="Cuéntanos cómo podemos ayudarte..." 
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-amber text-white font-semibold rounded-full hover:bg-amber-600 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enviar Mensaje</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </form>
            )}

            {/* Datos de Contacto Directo */}
            <div className="border-t border-gray-100 pt-8 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Información de contacto 
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-yellow-50/30 rounded-xl border border-yellow-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] text-gray-400 uppercase font-semibold">Email</span>
                    <a href="mailto:contacto@apicuatroreinas.cl" className="text-xs font-semibold text-gray-700 hover:text-amber truncate block">
                      contacto@apicuatroreinas.cl
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50/30 rounded-xl border border-yellow-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] text-gray-400 uppercase font-semibold">Teléfono</span>
                    <a href="tel:+56912345678" className="text-xs font-semibold text-gray-700 hover:text-amber truncate block">
                      +56 9 5611 0251
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50/30 rounded-xl border border-yellow-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] text-gray-400 uppercase font-semibold">Ubicación</span>
                    <span className="text-xs font-semibold text-gray-700 truncate block">
                      Ruta 5 Sur Km 521, Los Angeles, Chile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

