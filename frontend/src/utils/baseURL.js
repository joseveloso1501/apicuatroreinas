const envApiUrl = import.meta.env.VITE_API_URL || '';

// Determina si esta en un entorno de desarrolllo local
const isLocal = !envApiUrl ||
  envApiUrl.includes('localhost') ||
  envApiUrl.includes('127.0.0.1') ||
  envApiUrl.includes('0.0.0.0');

/**
* URL base de la API.
* En el desarrollo local, se usan rutas relativas (cadena vacía) para que todas las solicitudes a la API
* pasen por el proxy del servidor de desarrollo de Vite, lo que garantiza que ngrok y los dispositivos externos funcionen correctamente.
* En producción, se utiliza la variable de entorno proporcionada (VITE_API_URL).
*/

export const baseURL = isLocal ? '' : envApiUrl;

/**
* Devuelve la URL correcta para un recurso de imagen/medios.
* Si el recurso es local (localhost, contenedor backend, etc.), devuelve una ruta relativa
* para pasar por el proxy Vite (lo que permite que los túneles ngrok funcionen correctamente).
* En producción, recurre a Google Cloud Storage o a la URL original.

*
 * @param {string} pathOrUrl La ruta original o la URL (ej '/media/galeria/apiario.jpg' o URL absoluta de la API)
 * @returns {string} La URL formateada
 */
export const getMediaUrl = (pathOrUrl) => {
  if (!pathOrUrl) return '';

  // 1. Si se trata de una URL absoluta local (contiene localhost, 127.0.0.1, 0.0.0.0, backend o host de Docker),
  // elimina el dominio para convertirlo en relativo y que pase por el proxy de Vite.

  if (
    pathOrUrl.includes('localhost') ||
    pathOrUrl.includes('127.0.0.1') ||
    pathOrUrl.includes('0.0.0.0') ||
    pathOrUrl.includes('backend:8000') ||
    pathOrUrl.includes('host.docker.internal')
  ) {
    return pathOrUrl.replace(/^https?:\/\/[^/]+/, '');
  }

  // 2. Si ya es una URL absoluta externa (por ej Google Cloud Storage o una API externa), se devuelve tal cual.
  
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  // 3. Para rutas relativas (por ej '/media/galeria/apiario.jpg' or 'media/...')
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;

  if (isLocal) {
    // En desarrollo local, usa la ruta relativa para que el proxy de Vite la maneje
    return cleanPath;
  } else {
    // En producción, usa Google Cloud Storage
    return `https://storage.googleapis.com/bucket4reinas${cleanPath}`;
  }
};
