// Lista de productos que el cliente ha guardado en favoritos.
import { getFavorites, getProducts } from '../core/store.js';
import { renderProducts } from '../core/ui.js';

/** Pinta únicamente los productos cuyo identificador está en favoritos. */
export function initFavorites() {
  const favoriteIds = getFavorites();
  const favorites = getProducts().filter((product) => favoriteIds.includes(product.id));

  renderProducts(
    favorites,
    document.querySelector('#favorite-products'),
    'Todavía no has guardado productos. Explora el catálogo y toca el corazón para añadir favoritos.'
  );
}
