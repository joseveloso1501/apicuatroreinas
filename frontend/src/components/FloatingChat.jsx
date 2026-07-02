import React, { useState, useEffect } from 'react'

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('Hola, quisiera atención personalizada')
  const [showTooltip, setShowTooltip] = useState(false)

  // Mostrar un tooltip de atención después de 3 segundos para motivar el click
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    // URL de WhatsApp de Apícola Cuatro Reinas con el mensaje personalizado url-encoded
    const whatsappUrl = `https://wa.me/56956110251?text=${encodeURIComponent(message)}`
    
    // Abrir en una pestaña nueva
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Tooltip de atención inicial (se puede cerrar o se oculta al abrir el chat) */}
      {showTooltip && !isOpen && (
        <div className="absolute right-0 bottom-16 mb-2 w-48 bg-white text-gray-800 text-xs py-2 px-3.5 rounded-xl shadow-xl border border-gray-100 animate-bounce flex items-center justify-between">
          <span>💬 ¿Necesitas ayuda?</span>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setShowTooltip(false)
            }}
            className="ml-2 text-gray-400 hover:text-gray-600 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* Cuadro de Chat Expandible */}
      <div 
        className={`absolute right-0 bottom-16 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Cabecera del Chat */}
        <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl shadow-inner select-none">
              🐝
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-emerald-600 rounded-full"></span>
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-tight">Apícola Cuatro Reinas</h4>
              <span className="text-[10px] text-emerald-100 flex items-center gap-1">
                Normalmente responde en 1 min
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-6 h-6 rounded-full hover:bg-emerald-700/50 flex items-center justify-center text-white font-bold transition-colors cursor-pointer"
            aria-label="Cerrar chat"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del Chat (Mensajes simulados) */}
        <div className="p-4 bg-gray-50/50 max-h-60 overflow-y-auto space-y-3.5">
          <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 text-xs text-gray-700 max-w-[85%] shadow-sm">
            ¡Hola! 👋 Gracias por visitarnos. ¿Cómo podemos ayudarte hoy?
          </div>
        </div>

        {/* Formulario de entrada */}
        <form onSubmit={handleSend} className="p-3.5 border-t border-gray-100 bg-white space-y-3">
          <textarea
            required
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-xs text-gray-800 resize-none min-h-[50px]"
          />
          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            {/* Icono de enviar */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
            <span>Iniciar Chat de WhatsApp</span>
          </button>
        </form>
      </div>

      {/* Botón Flotante Circular */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setShowTooltip(false)
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer text-white relative ${
          isOpen 
            ? 'bg-gray-800 rotate-90' 
            : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-emerald-500/20 hover:shadow-2xl'
        }`}
        aria-label="Abrir chat de soporte"
      >
        {isOpen ? (
          // Icono X si está abierto
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          // Icono de WhatsApp oficial
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.022-.014-.508-.25-1.587-.749-.51-.237-.878-.351-1.248-.002-.37.35-.747.75-.916.945-.169.196-.339.22-.619.082-.28-.137-1.182-.436-2.251-1.393-.83-.74-1.391-1.654-1.554-1.93-.163-.28-.018-.431.122-.571.125-.127.28-.331.419-.497.14-.166.185-.28.278-.466.092-.186.046-.35-.022-.49-.068-.139-.588-1.418-.804-1.944-.213-.513-.427-.44-.619-.45-.183-.008-.393-.01-.603-.01-.21 0-.553.079-.842.395-.29.317-1.109 1.084-1.109 2.642 0 1.558 1.134 3.064 1.293 3.28.158.217 2.23 3.402 5.4 4.773.754.327 1.344.521 1.803.668.757.241 1.446.207 1.99.127.608-.09 1.587-.64 1.811-1.258.224-.617.224-1.15.157-1.258-.069-.11-.253-.166-.533-.306zm-5.466 7.42h-.015c-2.011 0-3.987-.542-5.717-1.565L5 21.01l1.58-1.517c-1.086-1.688-1.66-3.666-1.658-5.7.004-6.06 4.947-10.993 11.012-10.993 2.937 0 5.699 1.144 7.777 3.224a10.92 10.92 0 0 1 3.218 7.783c-.004 6.06-4.947 10.993-11.012 10.993zM12 .003C5.38.003 0 5.38 0 12c0 2.112.551 4.17 1.597 5.978L0 24l6.195-1.624A11.95 11.95 0 0 0 12 23.994c6.62 0 12-5.38 12-12 .002-3.207-1.248-6.222-3.518-8.492C18.223 1.233 15.207.003 12 .003z" />
          </svg>
        )}
      </button>

    </div>
  )
}
