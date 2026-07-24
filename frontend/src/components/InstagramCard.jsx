import React, { useState, useEffect } from 'react'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const mediaBaseURL = (baseURL.includes('localhost') || baseURL.includes('127.0.0.1') || baseURL.includes('0.0.0.0'))
  ? `${baseURL}/media`
  : 'https://storage.googleapis.com/bucket4reinas/media';

export default function InstagramCard() {
  //   ESTADOS Y PROPIEDADES  
  const [isFollowing, setIsFollowing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: 'api4reinas',
    nombre: 'Apícola Cuatro Reinas',
    biografia: 'Productos de nuestra colmena directo a tu hogar 🐝\nMiel 100% pura y orgánica de Quillay y multifloral 🌸, propóleo natural y más 🍯✨',
    cantidad_posts: 10,
    cantidad_seguidores: 59,
    cantidad_seguidos: 55,
    imagen_perfil_url: '',
    posts: []
  })

  const profileUrl = profileData.username
    ? `https://www.instagram.com/${profileData.username}/`
    : 'https://www.instagram.com/api4reinas/'

  const logoUrl = profileData.imagen_perfil_url

  //   CLASES DE ESTILO ENCAPSULADAS  
  const cardContainerClass = "bg-white rounded-2xl border border-gray-100 shadow-md p-6 max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300"
  const statsLabelClass = "text-[10px] uppercase tracking-wider text-gray-400"
  const statsValueClass = "block font-bold text-gray-900 text-sm"
  const gridItemClass = "block aspect-square overflow-hidden bg-gray-50 relative group rounded-md shadow-sm"
  const overlayHoverClass = "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white font-semibold text-xs"

  const followBtnClass = (following) =>
    `w-full py-1.5 px-4 rounded-lg font-semibold text-xs transition-all duration-200 active:scale-95 ${following
      ? 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
      : 'bg-amber text-white hover:bg-amber-600 shadow-sm'
    }`

  //   MANEJADORES DE EVENTOS  
  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false)
      setProfileData(prev => ({
        ...prev,
        cantidad_seguidores: prev.cantidad_seguidores - 1
      }))
    } else {
      setIsFollowing(true)
      setProfileData(prev => ({
        ...prev,
        cantidad_seguidores: prev.cantidad_seguidores + 1
      }))
    }
    window.open(profileUrl, '_blank')
  }

  //   EFECTOS (API CALLS)  
  useEffect(() => {
    axios.get(`${baseURL}/api/instagram-perfil/1/`)
      .then(response => {
        console.log("InstagramCard: Datos obtenidos de perfil:", response.data);

        let perfil = null;
        if (response.data && typeof response.data === 'object') {
          // Si es un objeto directo (ej. al consultar /api/instagram-perfil/1/)
          perfil = response.data;
        }

        if (perfil) {
          setProfileData({
            username: perfil.username,
            nombre: perfil.nombre,
            biografia: perfil.biografia,
            cantidad_posts: perfil.cantidad_posts,
            cantidad_seguidores: perfil.cantidad_seguidores,
            cantidad_seguidos: perfil.cantidad_seguidos,
            imagen_perfil_url: perfil.imagen_perfil_url,
            posts: perfil.posts || []
          });
        }
      })
      .catch(error => {
        console.error("InstagramCard: Error al obtener datos de perfil de Instagram:", error);
      });
  }, []);

  const displayPosts = profileData.posts
    ? [...profileData.posts].slice(-9).reverse()
    : [];

  //   RENDERIZADO DEL COMPONENTE  
  return (
    <div className={cardContainerClass}>
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
            <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-3xl shadow-inner select-none overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-amber-700">🐝</span>
              )}
            </div>
          </div>
        </a>

        {/* Info y Botón Seguir */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gray-900 hover:text-amber-600 transition-colors truncate text-base"
            >
              {profileData.username}
            </a>
            {/* Badge de verificado */}
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <div className="text-[13px] text-gray-500 mb-2 truncate">
            {profileData.nombre}
          </div>

          <button
            onClick={handleFollowToggle}
            className={followBtnClass(isFollowing)}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 text-center border-t border-b border-gray-100 py-3 mb-4">
        <div>
          <span className={statsValueClass}>{profileData.cantidad_posts}</span>
          <span className={statsLabelClass}>Posts</span>
        </div>
        <div>
          <span className={statsValueClass}>
            {profileData.cantidad_seguidores.toLocaleString()}
          </span>
          <span className={statsLabelClass}>Seguidores</span>
        </div>
        <div>
          <span className={statsValueClass}>{profileData.cantidad_seguidos}</span>
          <span className={statsLabelClass}>Seguidos</span>
        </div>
      </div>

      {/* Biografía */}
      <div className="text-sm text-gray-700 space-y-1 mb-5">
        {profileData.biografia && profileData.biografia.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      {/* Navegación Falsa de Grid */}
      <div className="grid grid-cols-3 gap-2">
        {displayPosts.slice(0, 9).map((post) => (
          <a
            key={post.id}
            href={post.link || profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={gridItemClass}
          >
            {/* Imagen del Post */}
            <img
              src={post.imagen}
              alt={post.caption || "Publicación de Instagram"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay interactivo en Hover */}
            <div className={overlayHoverClass}>
              <span className="flex items-center gap-1 select-none">
                ❤️ <span className="text-white">{post.likes !== undefined ? post.likes : 0}</span>
              </span>
              <span className="flex items-center gap-1 select-none">
                💬 <span className="text-white">{post.comments !== undefined ? post.comments : 0}</span>
              </span>
            </div>
          </a>
        ))}
      </div>

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
