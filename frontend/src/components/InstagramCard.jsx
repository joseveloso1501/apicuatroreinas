import React, { useState, useEffect } from 'react'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const mediaBaseURL = (baseURL.includes('localhost') || baseURL.includes('127.0.0.1') || baseURL.includes('0.0.0.0'))
  ? `${baseURL}/media`
  : 'https://storage.googleapis.com/bucket4reinas/media';

const FALLBACK_POSTS = [
  { id: 1, imagen: `${mediaBaseURL}/galeria/envasesMiel.JPG`, likes: 98, comments: 8, link: 'https://www.instagram.com/api4reinas/' },
  { id: 2, imagen: `${mediaBaseURL}/galeria/yoSostengoMarco.jpg`, likes: 156, comments: 12, link: 'https://www.instagram.com/api4reinas/' },
  { id: 3, imagen: `${mediaBaseURL}/galeria/envasesMiel.JPG`, likes: 124, comments: 8, link: 'https://www.instagram.com/api4reinas/' },
  { id: 4, imagen: `${mediaBaseURL}/galeria/mielMano.jpg`, likes: 133, comments: 5, link: 'https://www.instagram.com/api4reinas/' },
  { id: 5, imagen: `${mediaBaseURL}/galeria/sombrero.jpg`, likes: 210, comments: 14, link: 'https://www.instagram.com/api4reinas/' },
  { id: 6, imagen: `${mediaBaseURL}/galeria/barbaAbejas.jpg`, likes: 93, comments: 8, link: 'https://www.instagram.com/api4reinas/' },
]

export default function InstagramCard() {
  const [isFollowing, setIsFollowing] = useState(false)
  const [logoUrl, setLogoUrl] = useState()
  const [followersCount, setFollowersCount] = useState(10)
  const [posts, setPosts] = useState([])
  const profileUrl = 'https://www.instagram.com/api4reinas/'

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false)
      setFollowersCount(prev => prev - 1)
    } else {
      setIsFollowing(true)
      setFollowersCount(prev => prev + 1)
    }
    window.open(profileUrl, '_blank')
  }

  useEffect(() => {
    axios.get(`${baseURL}/api/galeria/`)
      .then(response => {
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        console.log("InstagramCard: Datos obtenidos de /api/galeria/:", data);
        
        // Buscamos el elemento que contenga la imagen de perfil por su nombre de archivo
        const fotoPerfil = data.find(item => item.imagen && item.imagen.includes('imagenPerfilInstagramCard'));
        if (fotoPerfil) {
          console.log("InstagramCard: URL de la foto de perfil encontrada:", fotoPerfil.imagen);
          setLogoUrl(fotoPerfil.imagen);
        }
        
        // Filtramos la foto de perfil para la grilla
        const gridItems = data.filter(item => item.imagen && !item.imagen.includes('imagenPerfilInstagramCard'));
        console.log("InstagramCard: Posts filtrados para la grilla:", gridItems);
        if (gridItems.length > 0) {
          setPosts(gridItems);
        }
      })
      .catch(error => {
        console.error("InstagramCard: Error al obtener imágenes de galería:", error);
      });
  }, []);

  useEffect(() => {
    console.log("InstagramCard: Estado 'posts' actualizado:", posts);
    console.log("InstagramCard: URL de las imágenes a renderizar:", 
      (posts.length > 0 ? posts : FALLBACK_POSTS).slice(0, 9).map(p => ({ id: p.id, imagen: p.imagen }))
    );
  }, [posts]);

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
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>

          <button
            //onClick={() => window.open(profileUrl, '_blank')}

            onClick={handleFollowToggle}
            className={`w-full py-1.5 px-4 rounded-lg font-semibold text-xs transition-all duration-200 active:scale-95 ${isFollowing
              ? 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
              : 'bg-amber text-white hover:bg-amber-600 shadow-sm'
              }`}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {<div className="grid grid-cols-3 text-center border-t border-b border-gray-100 py-3 mb-4">
        <div>
          <span className="block font-bold text-gray-900 text-sm">10</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Posts</span>
        </div>
        <div>
          <span className="block font-bold text-gray-900 text-sm">
            {followersCount.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Seguidores</span>
        </div>
        <div>
          <span className="block font-bold text-gray-900 text-sm">3</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Seguidos</span>
        </div>
      </div>}

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
      <div className="grid grid-cols-3 gap-2">
        {(posts.length > 0 ? posts : FALLBACK_POSTS).slice(0, 9).map((post) => (
          <a
            key={post.id}
            href={post.link || profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-square overflow-hidden bg-gray-50 relative group rounded-md shadow-sm"
          >
            {/* Imagen del Post */}
            <img 
              src={post.imagen} 
              alt={post.caption || "Publicación de Instagram"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              //loading="lazy"
            />
            
            {/* Overlay interactivo en Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white font-semibold text-xs">
              <span className="flex items-center gap-1 select-none">
                ❤️ <span className="text-white">{/*post.likes*/}</span>
              </span>
              <span className="flex items-center gap-1 select-none">
                💬 <span className="text-white">{/*post.comments*/}</span>
              </span>
            </div>
          </a>
        ))}
      </div>
        
      {/* Grilla de publicaciones */}
      {/* {<iframe
        src="//lightwidget.com/widgets/4d28b0d4574e53e09ae0187176624cab.html"
        allowtransparency="true"
        className="lightwidget-widget w-full border-0 overflow-hidden rounded-md aspect-[3/3]"
      />} */}

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
