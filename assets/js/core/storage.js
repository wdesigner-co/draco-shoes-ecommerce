/**
 * Lee un dato JSON del almacenamiento local y devuelve un valor alternativo
 * cuando la clave no existe o el navegador no permite acceder al storage.
 */
export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.warn(`No se pudo leer ${key}.`, error);
    return fallback;
  }
}

/** Serializa y guarda un valor en localStorage sin interrumpir la aplicación. */
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`No se pudo guardar ${key}.`, error);
    return false;
  }
}

/** Elimina una clave local y tolera errores del navegador. */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`No se pudo eliminar ${key}.`, error);
  }
}
