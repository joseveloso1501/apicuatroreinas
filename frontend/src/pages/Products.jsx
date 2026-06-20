import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'

export default function Products(){
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const { addToCart } = useCart()

  useEffect(()=>{
    // Detectar la URL del backend dinámicamente o usar variable de entorno
    const protocol = window.location.protocol; // http: o https:
    const hostname = window.location.hostname; // localhost, 127.0.0.1, IP, etc.
    
    // Si existe VITE_API_URL en el entorno de Vite se prioriza (útil para túneles)
    const baseURL = import.meta.env.VITE_API_URL || `${protocol}//${hostname}:8000`;
    
    console.log("Conectando a API en:", baseURL);

    const startTime = Date.now();

    axios
      .get(`${baseURL}/api/productos/`)
      .then(res => {
        console.log("Respuesta API:", res.data);
        
        // Django REST Framework devuelve los datos paginados en 'results'
        let data = Array.isArray(res.data) ? res.data : res.data.results || [];
        
        console.log("=== PRODUCTOS CARGADOS ===");
        data.forEach(p => {
          console.log(`ID: ${p.id}, Nombre: ${p.nombre}, Imagen: ${p.imagen}`);
        });
        
        if (data.length > 0) {
          setProductos(data);
        } else {
          console.warn("No hay productos en la API");
        }
      })
      .catch(err => {
        console.error("Error cargando API:", err.response?.status, err.message);
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 2000 - elapsed);
        setTimeout(() => setLoading(false), remaining);
      });
  },[])

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Productos</h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Spinner de fondo */}
              <div className="absolute inset-0 rounded-full border-4 border-amber/10 border-t-amber animate-spin"></div>
              {/* Abeja giratoria en el centro */}
              <span className="text-3xl animate-bounce inline-block select-none">🐝</span>
            </div>
            <p className="text-gray-500 font-bold text-xs animate-pulse tracking-widest uppercase">
              Buscando en la colmena...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map(p => (
              <article key={p.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
                <div 
                  className="group h-40 bg-yellow-100 rounded-md flex items-center justify-center text-gray-400 mb-3 bg-cover bg-center relative overflow-hidden"
                  style={p.imagen ? {
                    backgroundImage: `url('${p.imagen}')`
                  } : {}}
                >
                  {!p.imagen ? (
                    <span>Sin imagen</span>
                  ) : (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => setSelectedImage(p.imagen)}
                        className="px-4 py-2 bg-amber hover:bg-amber-600 text-white font-bold rounded-full text-xs transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                      >
                        Ver producto
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-darkbee">{p.nombre}</h3>
                <p className="text-sm text-gray-600 flex-1">{p.descripcion}</p>
                <div className="mt-3 flex items-center justify-between">
                  <strong className="text-amber-600">
                    ${Math.round(Number(p.precio)).toLocaleString('es-CL')}
                  </strong>
                  <button 
                    onClick={() => p.stock > 0 && addToCart(p)}
                    disabled={p.stock <= 0}
                    className={`px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-bold shadow-xs ${
                      p.stock <= 0 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-honey hover:bg-amber hover:text-white hover:scale-105 active:scale-95 text-darkbee cursor-pointer'
                    }`}
                  >
                    {p.stock <= 0 ? 'Agotado' : 'Agregar al carrito'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Vista Expandida de la Imagen */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Botón de cierre */}
          <button 
            className="absolute top-6 right-6 text-white text-3xl font-extrabold cursor-pointer hover:text-amber transition-colors select-none"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
          
          {/* Contenedor flotante de la imagen */}
          <div 
            className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Vista del producto" 
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  )
}
