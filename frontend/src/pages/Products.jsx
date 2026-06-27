import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useSearchParams } from 'react-router-dom'

export default function Products(){
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const { addToCart, cart } = useCart()

  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaSeleccionada = searchParams.get('categoria') || 'Todos'
  const [sortOrder, setSortOrder] = useState('destacados')

  useEffect(()=>{
    // Obtiene la URL del backend dinámicamente desde la variable de entorno
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

  const handleCategoryChange = (cat) => {
    if (cat === 'Todos') {
      searchParams.delete('categoria')
    } else {
      searchParams.set('categoria', cat)
    }
    setSearchParams(searchParams)
  }

  const handleSortChange = (e) => {
    setSortOrder(e.target.value)
  }

  // Filtrado y ordenamiento en el cliente
  const filteredAndSortedProductos = useMemo(() => {
    let list = [...productos]

    // 1. Filtrar por categoría
    if (categoriaSeleccionada !== 'Todos') {
      list = list.filter(p => {
        const catNombre = p.categoria?.nombre || ''
        return catNombre.toLowerCase() === categoriaSeleccionada.toLowerCase()
      })
    }
    // 2. Ordenar por criterio seleccionado
    if (sortOrder === 'destacados') {
      list.sort((a, b) => {
        // Disponibles primero (stock > 0)
        const aAvailable = a.stock > 0 ? 1 : 0
        const bAvailable = b.stock > 0 ? 1 : 0
        if (aAvailable !== bAvailable) {
          return bAvailable - aAvailable
        }

        // Miel primero
        const aIsMiel = a.nombre.toLowerCase().includes('miel') ? 1 : 0
        const bIsMiel = b.nombre.toLowerCase().includes('miel') ? 1 : 0
        if (aIsMiel !== bIsMiel) {
          return bIsMiel - aIsMiel
        }

        // Precio de menor a mayor
        //return Number(a.precio) - Number(b.precio)
      })
    } else if (sortOrder === 'asc') {
      list.sort((a, b) => Number(a.precio) - Number(b.precio))
    } else if (sortOrder === 'desc') {
      list.sort((a, b) => Number(b.precio) - Number(a.precio))
    }

    return list
  }, [productos, categoriaSeleccionada, sortOrder])

  return (
    <section className="py-12 bg-gradient-to-b from-yellow-50/20 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-darkbee tracking-tight mb-2">Productos</h2>
        <p className="text-gray-500 text-sm mb-8">Explora los mejores productos de la colmena directos a tu mesa.</p>

        {/* Panel de Filtros Premium */}
        {!loading && (
          <div className="bg-white/80 backdrop-blur-md border border-yellow-100 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all duration-300">
            {/* Filtro de Categoría (Pills) */}
            <div className="flex flex-wrap gap-2 items-center">
              {['Todos', 'Alimentos', 'Medicinas', 'Insumos'].map(cat => {
                const isSelected = categoriaSeleccionada.toLowerCase() === cat.toLowerCase() || (cat === 'Todos' && categoriaSeleccionada === 'Todos');
                const icons = {
                  Todos: '🐝',
                  Alimentos: '🍯',
                  Medicinas: '💊',
                  Insumos: '🛠️'
                };
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 transform active:scale-95 cursor-pointer shadow-xs border ${
                      isSelected
                        ? 'bg-gradient-to-r from-honey to-amber text-darkbee border-transparent shadow-md scale-105'
                        : 'bg-white hover:bg-yellow-50/40 text-gray-650 hover:text-amber-600 border-gray-100'
                    }`}
                  >
                    <span className="mr-1.5">{icons[cat]}</span>
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Ordenamiento por Precio */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort-order" className="text-[10px] font-extrabold text-gray-450 uppercase tracking-wider select-none">
                Ordenar por:
              </label>
              <div className="relative">
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="appearance-none bg-white border border-gray-150 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-700 outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 cursor-pointer shadow-xs transition-all"
                >
                  <option value="destacados">Destacados</option>
                  <option value="asc">Precio: Bajo a Alto</option>
                  <option value="desc">Precio: Alto a Bajo</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen del conteo de resultados */}
        {!loading && (
          <div className="flex justify-between items-center mb-6 px-1">
            <p className="text-xs font-bold text-gray-500">
              Mostrando <span className="text-amber-600 font-extrabold">{filteredAndSortedProductos.length}</span> {filteredAndSortedProductos.length === 1 ? 'producto' : 'productos'}
            </p>
            {categoriaSeleccionada !== 'Todos' && (
              <button
                onClick={() => handleCategoryChange('Todos')}
                className="text-xs font-extrabold text-amber hover:text-amber-600 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                Limpiar filtros ✕
              </button>
            )}
          </div>
        )}

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
        ) : filteredAndSortedProductos.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-yellow-50/50 rounded-full flex items-center justify-center text-4xl animate-pulse">
              🔍
            </div>
            <div>
              <h3 className="text-lg font-black text-darkbee">No se encontraron productos</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                No hay productos cargados en la categoría "{categoriaSeleccionada}" en este momento.
              </p>
            </div>
            <button
              onClick={() => {
                handleCategoryChange('Todos');
                setSortOrder('destacados');
              }}
              className="px-6 py-2.5 bg-honey hover:bg-amber text-darkbee hover:text-white font-extrabold rounded-full text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProductos.map(p => {
              const cartItem = cart.find(item => item.id === p.id)
              const availableStock = p.stock - (cartItem ? cartItem.cantidad : 0)
              
              return (
                <article key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                  <div
                    className="group h-40 bg-yellow-100/30 rounded-xl flex items-center justify-center text-gray-400 mb-3 bg-cover bg-center relative overflow-hidden"
                    style={p.imagen ? {
                      backgroundImage: `url('${p.imagen}')`
                    } : {}}
                  >
                    {!p.imagen ? (
                      <span className="text-xs font-bold text-gray-450">Sin imagen</span>
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
                  {/* Categoría Badge */}
                  {p.categoria?.nombre && (
                    <span className="self-start px-2 py-0.5 bg-yellow-100/50 text-amber-700 font-extrabold text-[9px] rounded-md uppercase tracking-wider mb-1.5">
                      {p.categoria.nombre}
                    </span>
                  )}
                  <h3 className="font-semibold text-lg text-darkbee">{p.nombre}</h3>
                  <p className="text-sm text-gray-600 flex-1 mb-2">{p.descripcion}</p>
                  
                  {/* Alerta de Stock Bajo */}
                  {availableStock > 0 && availableStock <= 5 && (
                    <div className="mb-3 text-rose-600 font-extrabold text-[11px] select-none flex items-center gap-1.5 bg-rose-50/50 py-1 px-2.5 rounded-lg w-max border border-rose-100/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block"></span>
                      ¡Últimas {availableStock} unidades disponibles!
                    </div>
                  )}
                  
                  <div className="mt-auto flex items-center justify-between">
                    <strong className="text-amber-600">
                      ${Math.round(Number(p.precio)).toLocaleString('es-CL')}
                    </strong>
                    <button
                      onClick={() => availableStock > 0 && addToCart(p)}
                      disabled={availableStock <= 0}
                      className={`px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-bold shadow-xs ${
                        availableStock <= 0 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-honey hover:bg-amber hover:text-white hover:scale-105 active:scale-95 text-darkbee cursor-pointer'
                        }`}
                    >
                      {availableStock <= 0 ? 'Agotado' : 'Agregar al carrito'}
                    </button>
                  </div>
                </article>
              )
            })}
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
