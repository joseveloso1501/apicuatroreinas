import React, { useEffect, useState } from 'react'
import axios from 'axios'

// const SAMPLE = [
//   { id:1, nombre:'Miel Multifloral 500g', descripcion:'Miel artesanal de', precio:2500 },
//   { id:2, nombre:'Miel Multifloral 1000g', descripcion:'Extracto natural', precio:6500 },
//   { id:3, nombre:'Cera Pura 250g', descripcion:'Cera para cosmética y velas', precio:4500 },
//   { id:4, nombre:'Polen 200g', descripcion:'Polen recolectado en trampas', precio:7200 },
//   { id:5, nombre:'Jabón de miel', descripcion:'Jabón artesano con miel', precio:9900 },
// ]
0
export default function Products(){
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    // Define la URL base con fallback por si VITE_API_URL no está definida
    const baseURL = import.meta.env.VITE_API_URL || "http://0.0.0.0:8000";

    axios
      .get(`${baseURL}/api/productos/`)
      .then(res => {
        console.log(res);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProductos(res.data);
        } else {
          console.warn("Respuesta de API no válida, usando muestras locales.");
          setProductos(SAMPLE);
        }
      })
      .catch(err => {
        console.warn("No se pudo cargar API, usando muestras locales.", err.message);
        setProductos(SAMPLE);
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
                <div className="h-40 bg-yellow-100 rounded-md flex items-center justify-center text-gray-400 mb-3">Foto</div>
                <h3 className="font-semibold text-lg text-darkbee">{p.nombre}</h3>
                <p className="text-sm text-gray-600 flex-1">{p.descripcion}</p>
                <div className="mt-3 flex items-center justify-between">
                  <strong className="text-amber-600">${p.precio.toLocaleString()}</strong>
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
