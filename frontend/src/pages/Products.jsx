import React, { useEffect, useState } from 'react'
import axios from 'axios'

// const SAMPLE = [
//   { id:1, nombre:'Miel Multifloral 500g', descripcion:'Miel artesanal de', precio:2500 },
//   { id:2, nombre:'Miel Multifloral 1000g', descripcion:'Extracto natural', precio:6500 },
//   { id:3, nombre:'Cera Pura 250g', descripcion:'Cera para cosmética y velas', precio:4500 },
//   { id:4, nombre:'Polen 200g', descripcion:'Polen recolectado en trampas', precio:7200 },
//   { id:5, nombre:'Jabón de miel', descripcion:'Jabón artesano con miel', precio:9900 },
// ]

export default function Products(){
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    // Detectar la URL del backend dinámicamente o usar variable de entorno
    const protocol = window.location.protocol; // http: o https:
    const hostname = window.location.hostname; // localhost, 127.0.0.1, IP, etc.
    
    // Si existe VITE_API_URL en el entorno de Vite se prioriza (útil para túneles)
    const baseURL = import.meta.env.VITE_API_URL || `${protocol}//${hostname}:8000`;
    
    console.log("Conectando a API en:", baseURL);

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
      .finally(() => setLoading(false));
  },[])

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Productos</h2>
        {loading ? <p>Cargando productos...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map(p => (
              <article key={p.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
                <div 
                  className="h-40 bg-yellow-100 rounded-md flex items-center justify-center text-gray-400 mb-3 bg-cover bg-center relative"
                  style={p.imagen ? {
                    backgroundImage: `url('${p.imagen}')`
                  } : {}}
                >
                  {!p.imagen && <span>Sin imagen</span>}
                  {/* <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                    {p.imagen ? p.imagen.split('/').pop() : "Sin imagen"}
                  </div> */}
                </div>
                <h3 className="font-semibold text-lg text-darkbee">{p.nombre}</h3>
                <p className="text-sm text-gray-600 flex-1">{p.descripcion}</p>
                <div className="mt-3 flex items-center justify-between">
                  <strong className="text-amber-600">
                    ${Math.round(Number(p.precio)).toLocaleString('es-CL')}
                  </strong>
                  <button className="px-3 py-1 rounded-full bg-honey">Agregar al carrito</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
