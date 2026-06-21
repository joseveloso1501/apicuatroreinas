import React, { useState } from 'react'

import imgLogo from '../assets/productosGemini/miel1.jpeg'

export default function InstagramCard() {
  const [isFollowing, setIsFollowing] = useState(false)
  // const [followersCount, setFollowersCount] = useState(150)

  const handleFollowToggle = () => {
    // if (isFollowing) {
    //   setIsFollowing(false)
    //   setFollowersCount(prev => prev - 1)
    // } else {
    //   setIsFollowing(true)
    //   setFollowersCount(prev => prev + 1)
    // }
    window.open(profileUrl, '_blank')
  }

  const profileUrl = 'https://www.instagram.com/api4reinas/'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300">
      {/* Cabecera del perfil */}
      <div className="flex items-center gap-4 mb-5">
        {/* Avatar con gradiente estilo Story */}
        <a 
          href={profileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative block w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 active:scale-95 transition-transform"
        >
          <div className="w-full h-full rounded-full bg-white p-[2.5px]">
            <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-3xl shadow-inner select-none">
              <img src={imgLogo} alt="Logo" className="w-16 h-16 rounded-full" />
            </div>
          </div>
        </a>

        {/* Info y Botón Seguir */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <a 
              href={profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-gray-900 hover:text-amber-600 transition-colors truncate text-base"
            >
              api4reinas
            </a>
            {/* Badge de verificado */}
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>

          <button
            //onClick={() => window.open(profileUrl, '_blank')}

            onClick={handleFollowToggle}
            className={`w-full py-1.5 px-4 rounded-lg font-semibold text-xs transition-all duration-200 active:scale-95 ${
              isFollowing 
                ? 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200' 
                : 'bg-amber text-white hover:bg-amber-600 shadow-sm'
            }`}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {/* <div className="grid grid-cols-3 text-center border-t border-b border-gray-100 py-3 mb-4">
        <div>
          <span className="block font-bold text-gray-900 text-sm">6</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Posts</span>
        </div>
        <div>
          <span className="block font-bold text-gray-900 text-sm">
            {followersCount.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Seguidores</span>
        </div>
        <div>
          <span className="block font-bold text-gray-900 text-sm">67</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Seguidos</span>
        </div>
      </div> */}

      {/* Biografía */}
      <div className="text-sm text-gray-700 space-y-1 mb-5">
        <h4 className="font-bold text-gray-950">Apícola Cuatro Reinas</h4>
        <p>Productos de la colmena directos a tu casa 🍯🐝</p>
        <p>Miel 100% pura y orgánica de Quillay y multifloral 🌸, miel en panal, propóleo natural y más 🍯✨</p>
        <a 
          href={profileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block text-blue-600 hover:underline font-medium text-xs mt-1"
        >
          linktr.ee/api4reinas
        </a>
      </div>

      {/* Navegación Falsa de Grid */}
      <div className="flex justify-around border-t border-gray-100 pt-2 pb-3 text-gray-400">
        <button className="text-amber-500" aria-label="Ver publicaciones">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
          </svg>
        </button>
        <button className="hover:text-gray-600 transition-colors" aria-label="Ver Reels">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </button>
        <button className="hover:text-gray-600 transition-colors" aria-label="Ver etiquetados">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
      </div>

      {/* Grilla de publicaciones */}
      <iframe 
        src="//lightwidget.com/widgets/4d28b0d4574e53e09ae0187176624cab.html" 
        allowtransparency="true" 
        class="lightwidget-widget"
        className="w-full border-0 overflow-hidden rounded-md aspect-[3/3]"
      /> 

      {/* Botón final para ir al perfil */}
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center mt-5 text-xs text-amber font-semibold hover:text-amber-600 hover:underline transition-colors"
      >
        Ver perfil en Instagram
      </a>
    </div>
  )
}
