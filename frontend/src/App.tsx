import { useEffect, useState } from "react";
import axios from "axios";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
}

export default function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/productos/")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      <h1 className="text-4xl font-bold text-yellow-900 mb-6 text-center">
        🐝 E-commerce Apícola
      </h1>

      {cargando ? (
        <p className="text-center text-gray-600">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay productos disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((p) => (
            <div key={p.id} className="bg-white shadow-md rounded-2xl p-4">
              <h2 className="text-xl font-semibold text-yellow-800">
                {p.nombre}
              </h2>
              <p className="text-gray-700">{p.descripcion}</p>
              <p className="mt-2 font-bold text-yellow-900">
                ${p.precio.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
