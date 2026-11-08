// Funciones compartidas de presentación, seguridad de texto y mensajes de interfaz.
import { CONFIG } from '../config.js';
import { getFavorites } from './store.js';
import { getCategoryName, INITIAL_PRODUCTS } from '../data/products.js';

/** Convierte texto externo a una cadena segura para insertar en HTML. */
export function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

/** Acepta rutas de assets o URL HTTP(S), y reemplaza rutas no permitidas. */
export function safeImageUrl(value) {
  const raw = String(value || '');
  if (raw.startsWith('assets/') || raw.startsWith('./assets/') || raw.startsWith('../assets/')) {
    return raw;
  }

  try {
    const url = new URL(raw, location.href);
    if (['https:', 'http:'].includes(url.protocol)) return url.href;
  } catch (error) {
    // Si el valor no es una URL válida, se utiliza la imagen de respaldo.
  }

  return INITIAL_PRODUCTS[0]?.image || 'assets/images/brand/logo-mark.svg';
}

/** Formatea importes usando la moneda establecida en la configuración. */
export function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CONFIG.currency,
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

/** Muestra una notificación accesible y oculta el mensaje tras unos segundos. */
export function showToast(message, type = 'success') {
  const toast = document.querySelector('#app-toast');
  if (!toast) return;

  const text = toast.querySelector('[data-toast-message]');
  const icon = toast.querySelector('[data-toast-icon]');
  if (text) text.textContent = message;
  if (icon) {
    icon.className = type === 'error'
      ? 'fa-solid fa-circle-exclamation'
      : 'fa-solid fa-circle-check';
  }

  toast.setAttribute('aria-hidden', 'false');
  toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.setAttribute('aria-hidden', 'true');
  }, 2600);
}

/** Abre el diálogo compartido con título y texto personalizados. */
export function openModal(title, message, actionLabel = 'Entendido') {
  const dialog = document.querySelector('#app-modal');
  if (!dialog) {
    alert(message);
    return;
  }

  dialog.querySelector('[data-modal-title]').textContent = title;
  dialog.querySelector('[data-modal-message]').textContent = message;
  const action = dialog.querySelector('.modal-panel > .button[data-modal-close]');
  if (action) action.textContent = actionLabel;

  if (dialog.showModal) dialog.showModal();
  else dialog.setAttribute('open', '');
}

/** Construye la tarjeta de un producto con datos escapados y estado favorito. */
export function renderProductCard(product) {
  const active = getFavorites().includes(product.id);
  const image = safeImageUrl(product.image);

  return `
    <article class="product-card">
      <div class="product-card__media">
        <a class="product-card__image-link" href="producto.html?id=${encodeURIComponent(product.id)}" aria-label="Ver ${escapeHTML(product.name)}">
          <img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" loading="lazy" width="600" height="360">
        </a>
        ${product.featured ? '<span class="product-card__badge">Destacado</span>' : ''}
        <button class="icon-button product-card__favorite ${active ? 'is-active' : ''}" type="button" data-favorite="${escapeHTML(product.id)}" aria-label="${active ? 'Quitar de favoritos' : 'Añadir a favoritos'}" aria-pressed="${active}">
          <i class="${active ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i>
        </button>
      </div>
      <div class="product-card__body">
        <span class="eyebrow">${escapeHTML(getCategoryName(product.category))} · ${escapeHTML(product.brand)}</span>
        <h3><a href="producto.html?id=${encodeURIComponent(product.id)}">${escapeHTML(product.name)}</a></h3>
        <div class="product-card__meta">
          <strong>${money(product.price)}</strong>
          <span class="rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${Number(product.rating || 0).toFixed(1)}</span>
        </div>
      </div>
    </article>`;
}

/** Renderiza una colección de tarjetas o el estado vacío correspondiente. */
export function renderProducts(items, container, emptyText = 'No hay productos para mostrar.') {
  if (!container) return;

  container.innerHTML = items.length
    ? items.map(renderProductCard).join('')
    : `<div class="empty-state"><i class="fa-solid fa-shoe-prints" aria-hidden="true"></i><h3>Sin resultados</h3><p>${escapeHTML(emptyText)}</p></div>`;
}

/** Actualiza título, descripción y URL canónica de la página activa. */
export function setPageMeta(title, description, canonical) {
  document.title = title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  const canonicalTag = document.querySelector('link[rel="canonical"]');
  const openGraphTitle = document.querySelector('meta[property="og:title"]');
  const openGraphDescription = document.querySelector('meta[property="og:description"]');
  const openGraphUrl = document.querySelector('meta[property="og:url"]');

  if (descriptionTag) descriptionTag.content = description;
  if (canonicalTag && canonical) canonicalTag.href = canonical;
  if (openGraphTitle) openGraphTitle.content = title;
  if (openGraphDescription) openGraphDescription.content = description;
  if (openGraphUrl && canonical) openGraphUrl.content = canonical;
}
