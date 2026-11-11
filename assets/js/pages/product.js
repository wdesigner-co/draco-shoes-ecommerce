// Ficha de producto: galerías por variante, visor ampliado, tallas y compra.
import { CONFIG } from '../config.js';
import { getCategoryName } from '../data/products.js';
import {
  getProduct,
  getProducts,
  addToCart,
  toggleFavorite,
  getFavorites
} from '../core/store.js';
import {
  money,
  safeImageUrl,
  escapeHTML,
  renderProducts,
  showToast,
  setPageMeta
} from '../core/ui.js';

const VIEW_LABELS = [
  { key: 'side', label: 'Vista lateral' },
  { key: 'front', label: 'Vista frontal' },
  { key: 'pair', label: 'Vista del par' }
];
const PLACEHOLDER_IMAGES = {
  front: 'assets/images/products/view-front-placeholder.svg',
  pair: 'assets/images/products/view-pair-placeholder.svg'
};

/** Normaliza variantes antiguas que solo tenían nombre y tono. */
function getProductVariants(product) {
  const colors = (Array.isArray(product.colors) && product.colors.length
    ? product.colors
    : ['Negro / Naranja', 'Blanco / Gris', 'Azul / Blanco']).filter(Boolean).slice(0, 3);
  const hexes = ['#292d35', '#e7e4dd', '#315c9a'];
  return colors.map((name, index) => {
    const stored = product.colorVariants?.[index] || {};
    const colorHex = stored.colorHex || product.colorHexes?.[index] || hexes[index];
    const defaultImages = index === 0
      ? { side: product.image, front: product.imageFront || PLACEHOLDER_IMAGES.front, pair: product.imagePair || PLACEHOLDER_IMAGES.pair }
      : { side: '', front: '', pair: '' };
    return {
      id: stored.id || product.id + '-color-' + (index + 1),
      name: stored.name || name,
      colorHex: /^#[0-9a-f]{6}$/i.test(colorHex) ? colorHex : hexes[index],
      images: { ...defaultImages, ...(stored.images || {}) }
    };
  });
}

/** Obtiene tres imágenes válidas; las variantes pendientes conservan la galería base. */
function getVariantGallery(product, variant) {
  const images = variant.images || {};
  const complete = VIEW_LABELS.every((view) => String(images[view.key] || '').trim());
  const hasCustomGallery = complete && variant !== null;
  const source = hasCustomGallery
    ? images
    : { side: product.image, front: product.imageFront || PLACEHOLDER_IMAGES.front, pair: product.imagePair || PLACEHOLDER_IMAGES.pair };
  return {
    hasCustomGallery,
    views: VIEW_LABELS.map((view) => ({
      src: safeImageUrl(source[view.key]),
      label: view.label
    }))
  };
}

/** Crea el visor de imagen una sola vez y lo agrega al documento. */
function createLightbox() {
  let dialog = document.querySelector('#product-lightbox');
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.id = 'product-lightbox';
  dialog.className = 'product-lightbox';
  dialog.setAttribute('aria-label', 'Visor de imágenes del producto');
  dialog.innerHTML = `
    <div class="product-lightbox__content">
      <div class="product-lightbox__top" data-lightbox-counter aria-live="polite"></div>
      <button class="product-lightbox__close" type="button" data-lightbox-close aria-label="Cerrar imagen"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      <button class="product-lightbox__nav product-lightbox__nav--prev" type="button" data-lightbox-prev aria-label="Imagen anterior"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
      <figure class="product-lightbox__image-wrap"><img data-lightbox-image alt=""></figure>
      <button class="product-lightbox__nav product-lightbox__nav--next" type="button" data-lightbox-next aria-label="Imagen siguiente"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
    </div>`;
  document.body.append(dialog);
  return dialog;
}

/** Inicializa ficha, navegación de la galería, colores y acciones de compra. */
export function initProduct() {
  const params = new URLSearchParams(location.search);
  const product = getProduct(params.get('id')) || getProducts()[0];
  const root = document.querySelector('#product-detail');
  if (!root || !product) return;

  const variants = getProductVariants(product);
  const initialColorIndex = Math.max(0, variants.findIndex((variant) => variant.name === product.color));
  let selectedVariantIndex = initialColorIndex;
  let selectedVariant = variants[selectedVariantIndex];
  let galleryState = getVariantGallery(product, selectedVariant);
  let galleryViews = galleryState.views;
  let activeGalleryIndex = 0;
  const sizes = product.sizes || [36, 37, 38, 39, 40, 41, 42, 43, 44];
  const favorite = getFavorites().includes(product.id);

  const galleryMarkup = () => `
    <div class="product-gallery__track" data-gallery-track tabindex="0" aria-label="Galería de imágenes de ${escapeHTML(product.name)}">
      ${galleryViews.map((view, index) => `
        <figure class="product-gallery__slide product-gallery__slide--${index + 1}" data-gallery-slide="${index}">
          <button class="product-gallery__image-button" type="button" data-gallery-open="${index}" aria-label="Ampliar ${escapeHTML(view.label)}">
            <img src="${escapeHTML(view.src)}" alt="${escapeHTML(product.name)} · ${escapeHTML(view.label)}" width="1200" height="900" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
          </button>
        </figure>`).join('')}
    </div>
    <button class="product-gallery__nav product-gallery__nav--prev" type="button" data-gallery-prev aria-label="Imagen anterior"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
    <button class="product-gallery__nav product-gallery__nav--next" type="button" data-gallery-next aria-label="Imagen siguiente"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
    <div class="product-gallery__pagination" role="group" aria-label="Seleccionar imagen del producto">
      ${galleryViews.map((view, index) => `
        <button class="gallery-dot ${index === 0 ? 'is-active' : ''}" type="button" data-gallery-dot="${index}" aria-label="Ver ${escapeHTML(view.label.toLowerCase())}" aria-pressed="${index === 0}"></button>
      `).join('')}
    </div>`;

  const renderGallery = (resetPosition = true) => {
    const gallery = root.querySelector('.product-detail__gallery');
    gallery.querySelector('[data-gallery-track]')?.remove();
    gallery.querySelector('[data-gallery-prev]')?.remove();
    gallery.querySelector('[data-gallery-next]')?.remove();
    gallery.querySelector('.product-gallery__pagination')?.remove();
    gallery.insertAdjacentHTML('beforeend', galleryMarkup());
    activeGalleryIndex = 0;
    const newTrack = root.querySelector('[data-gallery-track]');
    if (newTrack) {
      newTrack.addEventListener('scroll', () => {
        if (!newTrack.clientWidth) return;
        const index = Math.max(0, Math.min(galleryViews.length - 1, Math.round(newTrack.scrollLeft / newTrack.clientWidth)));
        activeGalleryIndex = index;
        activateDot(index);
      }, { passive: true });
      if (resetPosition) newTrack.scrollLeft = 0;
    }
  };

  const renderVariantOptions = () => {
    const selector = root.querySelector('[data-variant-selector]');
    if (!selector) return;
    selector.innerHTML = variants.map((variant, index) => {
      const custom = VIEW_LABELS.every((view) => String(variant.images?.[view.key] || '').trim());
      const thumb = safeImageUrl(custom ? variant.images.side : product.image);
      return `
        <button class="product-variant-option ${index === selectedVariantIndex ? 'is-selected' : ''}" type="button"
          data-variant-index="${index}" aria-pressed="${index === selectedVariantIndex}" title="${escapeHTML(variant.name)}">
          <span class="product-variant-option__image"><img src="${escapeHTML(thumb)}" alt="" loading="lazy" width="120" height="80"></span>
          <span class="product-variant-option__meta">
            <span class="product-variant-option__swatch" style="--swatch:${variant.colorHex}"></span>
            <span class="product-variant-option__label">${escapeHTML(variant.name)}</span>
          </span>
        </button>`;
    }).join('');
  };

  root.innerHTML = `
    <div class="product-detail__gallery">
      <button class="product-gallery__back" type="button" data-product-back aria-label="Volver a la página anterior"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>
      <a class="product-gallery__cart" href="carrito.html" aria-label="Abrir carrito de compras" title="Ver carrito">
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i><span class="cart-badge" data-cart-count hidden>0</span>
      </a>
      ${galleryMarkup()}
    </div>
    <section class="product-detail__info" aria-labelledby="product-title">
      <div class="eyebrow">${escapeHTML(product.brand)} · ${escapeHTML(getCategoryName(product.category))}</div>
      <div class="product-detail__heading">
        <h1 id="product-title">${escapeHTML(product.name)}</h1>
        <div class="product-detail__tools">
          <button class="icon-button product-detail__favorite ${favorite ? 'is-active' : ''}" type="button" data-product-favorite aria-label="${favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}" aria-pressed="${favorite}"><i class="${favorite ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i></button>
          <button class="icon-button product-detail__share" type="button" data-share-product aria-label="Compartir producto"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i></button>
        </div>
      </div>
      <div class="product-detail__rating">
        <span class="rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${Number(product.rating).toFixed(1)}</span>
        <span>(${product.reviews} opiniones de clientes)</span>
        <span class="stock-indicator">${product.stock > 0 ? 'Disponible' : 'Agotado'}</span>
      </div>
      <div class="product-detail__price">${money(product.price)} ${product.compareAt > product.price ? `<del>${money(product.compareAt)}</del>` : ''}</div>
      <div class="option-group">
        <div class="option-label"><strong>Selecciona tu talla</strong><button class="text-link" type="button" data-size-guide>Guía de tallas</button></div>
        <div class="size-selector" role="group" aria-label="Seleccionar talla">
          ${sizes.map((size, index) => `<button type="button" class="size-option ${index === 3 ? 'is-selected' : ''}" data-size="${escapeHTML(size)}" aria-pressed="${index === 3}">${escapeHTML(size)}</button>`).join('')}
        </div>
      </div>
      <div class="option-group product-color-group">
        <div class="option-label"><strong>Selecciona el color</strong><span id="selected-color">${escapeHTML(selectedVariant.name)}</span></div>
        <div class="product-variant-selector" data-variant-selector role="group" aria-label="Variantes de color"></div>
        <p class="variant-gallery-note" data-variant-gallery-note hidden></p>
      </div>
      <div class="product-detail__actions">
        <button class="button button--primary" type="button" id="buy-now" ${product.stock <= 0 ? 'disabled' : ''}>Comprar ahora <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
        <button class="button button--dark" type="button" id="add-to-cart" ${product.stock <= 0 ? 'disabled' : ''}><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Añadir al carrito</button>
      </div>
      <div class="product-assurances">
        <span><i class="fa-solid fa-truck-fast" aria-hidden="true"></i> Envío gratis</span>
        <span><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Cambios sencillos</span>
        <span><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Compra protegida</span>
      </div>
      <details class="product-accordion" open>
        <summary>Descripción y características</summary>
        <p>${escapeHTML(product.description)}</p>
        <ul>${(product.features || []).map((feature) => `<li>${escapeHTML(feature)}</li>`).join('')}</ul>
        <p>Materiales y especificaciones finales: datos demostrativos pendientes de validar.</p>
      </details>
    </section>`;

  renderVariantOptions();
  renderGallery();

  const galleryDialog = createLightbox();
  const lightboxImage = galleryDialog.querySelector('[data-lightbox-image]');
  const lightboxCounter = galleryDialog.querySelector('[data-lightbox-counter]');

  const activateDot = (index) => {
    const dots = [...root.querySelectorAll('[data-gallery-dot]')];
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
  };

  const scrollToGalleryImage = (index, behavior = 'smooth') => {
    const track = root.querySelector('[data-gallery-track]');
    const safeIndex = (index + galleryViews.length) % galleryViews.length;
    activeGalleryIndex = safeIndex;
    track?.scrollTo({ left: track.clientWidth * safeIndex, behavior });
    activateDot(safeIndex);
  };

  const renderLightbox = () => {
    const view = galleryViews[activeGalleryIndex];
    if (!view) return;
    lightboxImage.src = view.src;
    lightboxImage.alt = product.name + ' · ' + selectedVariant.name + ' · ' + view.label;
    lightboxCounter.textContent = `${activeGalleryIndex + 1} de ${galleryViews.length} · ${selectedVariant.name}`;
  };

  const openLightbox = (index) => {
    activeGalleryIndex = index;
    renderLightbox();
    if (galleryDialog.showModal && !galleryDialog.open) galleryDialog.showModal();
    else galleryDialog.setAttribute('open', '');
  };

  const moveLightbox = (direction) => {
    activeGalleryIndex = (activeGalleryIndex + direction + galleryViews.length) % galleryViews.length;
    renderLightbox();
    scrollToGalleryImage(activeGalleryIndex);
  };

  const moveGallery = (direction) => {
    const index = (activeGalleryIndex + direction + galleryViews.length) % galleryViews.length;
    scrollToGalleryImage(index);
  };

  root.querySelector('.product-detail__gallery').addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-gallery-open]');
    if (openButton) openLightbox(Number(openButton.dataset.galleryOpen));
    if (event.target.closest('[data-gallery-prev]')) moveGallery(-1);
    if (event.target.closest('[data-gallery-next]')) moveGallery(1);
    const dot = event.target.closest('[data-gallery-dot]');
    if (dot) scrollToGalleryImage(Number(dot.dataset.galleryDot));
  });

  galleryDialog.querySelector('[data-lightbox-close]').addEventListener('click', () => galleryDialog.close());
  galleryDialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => moveLightbox(-1));
  galleryDialog.querySelector('[data-lightbox-next]').addEventListener('click', () => moveLightbox(1));
  galleryDialog.addEventListener('click', (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
  });
  galleryDialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveLightbox(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveLightbox(1); }
  });

  let touchStartX = null;
  galleryDialog.querySelector('.product-lightbox__image-wrap').addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  }, { passive: true });
  galleryDialog.querySelector('.product-lightbox__image-wrap').addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) moveLightbox(delta < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });

  renderGallery();

  // Móvil: la barra inferior aparece después de abandonar la zona inicial de la ficha.
  const bottomNavigation = document.querySelector('.bottom-navigation');
  if (bottomNavigation) {
    const mobileViewport = window.matchMedia('(max-width: 767px)');
    const updateNavigationVisibility = () => document.body.classList.toggle(
      'product-nav-visible', mobileViewport.matches && window.scrollY > 110
    );
    window.addEventListener('scroll', updateNavigationVisibility, { passive: true });
    window.addEventListener('pageshow', updateNavigationVisibility);
    mobileViewport.addEventListener?.('change', updateNavigationVisibility);
    requestAnimationFrame(updateNavigationVisibility);
  }

  root.querySelector('[data-product-back]')?.addEventListener('click', () => {
    let sameOriginReferrer = false;
    try { sameOriginReferrer = Boolean(document.referrer && new URL(document.referrer).origin === location.origin); }
    catch { sameOriginReferrer = false; }
    if (history.length > 1 && sameOriginReferrer) history.back();
    else location.href = 'categorias.html';
  });

  setPageMeta(
    `${product.name} | Draco Shoes`,
    product.description,
    `${location.origin}${location.pathname}?id=${encodeURIComponent(product.id)}`
  );

  const updateProductSchema = () => {
    const images = galleryViews.map((item) => new URL(item.src, location.href).href);
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      sku: product.id,
      brand: { '@type': 'Brand', name: product.brand },
      description: product.description,
      image: images,
      offers: {
        '@type': 'Offer',
        priceCurrency: CONFIG.currency,
        price: Number(product.price).toFixed(2),
        availability: Number(product.stock) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: location.href
      }
    };
    let script = document.querySelector('#product-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'product-jsonld';
      script.type = 'application/ld+json';
      document.head.append(script);
    }
    script.textContent = JSON.stringify(productSchema);
  };
  updateProductSchema();

  const updateSocialImage = () => {
    const url = new URL(galleryViews[0].src, location.href).href;
    const social = document.querySelector('meta[property="og:image"]');
    const twitter = document.querySelector('meta[name="twitter:image"]');
    if (social) social.content = url;
    if (twitter) twitter.content = url;
  };
  updateSocialImage();

  const related = getProducts().filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const fallbackRelated = getProducts().filter((item) => item.id !== product.id).slice(0, 4);
  const relatedGrid = document.querySelector('#related-products');
  renderProducts(related.length ? related : fallbackRelated, relatedGrid);
  const carousel = relatedGrid?.closest('.product-carousel');
  carousel?.querySelector('[data-carousel-prev]')?.addEventListener('click', () => relatedGrid.scrollBy({ left: -relatedGrid.clientWidth * 0.8, behavior: 'smooth' }));
  carousel?.querySelector('[data-carousel-next]')?.addEventListener('click', () => relatedGrid.scrollBy({ left: relatedGrid.clientWidth * 0.8, behavior: 'smooth' }));

  let selectedSize = sizes[Math.min(3, sizes.length - 1)];

  root.querySelectorAll('[data-size]').forEach((button) => {
    button.addEventListener('click', () => {
      root.querySelectorAll('[data-size]').forEach((option) => {
        option.classList.remove('is-selected');
        option.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');
      selectedSize = button.dataset.size;
    });
  });

  root.querySelector('[data-variant-selector]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-variant-index]');
    if (!button) return;
    selectedVariantIndex = Number(button.dataset.variantIndex);
    selectedVariant = variants[selectedVariantIndex];
    galleryState = getVariantGallery(product, selectedVariant);
    galleryViews = galleryState.views;
    root.querySelectorAll('[data-variant-index]').forEach((option, index) => {
      const active = index === selectedVariantIndex;
      option.classList.toggle('is-selected', active);
      option.setAttribute('aria-pressed', String(active));
    });
    root.querySelector('#selected-color').textContent = selectedVariant.name;
    const note = root.querySelector('[data-variant-gallery-note]');
    note.hidden = galleryState.hasCustomGallery || selectedVariantIndex === 0;
    note.textContent = note.hidden ? '' : 'Esta variante aún no tiene fotografías propias. Se muestran temporalmente las imágenes generales del modelo.';
    renderGallery();
    if (galleryDialog.open) renderLightbox();
    updateProductSchema();
    updateSocialImage();
  });

  const addSelectedVariant = (redirectToCart = false) => {
    const result = addToCart(product.id, selectedSize, selectedVariant.name, 1, galleryViews[0].src);
    showToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) {
      document.dispatchEvent(new CustomEvent('shoex:cart-updated'));
      if (redirectToCart) location.href = 'carrito.html';
    }
  };
  root.querySelector('#add-to-cart').addEventListener('click', () => addSelectedVariant());
  root.querySelector('#buy-now').addEventListener('click', () => addSelectedVariant(true));

  root.querySelector('[data-product-favorite]').addEventListener('click', (event) => {
    const button = event.currentTarget;
    const active = toggleFavorite(product.id);
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Quitar de favoritos' : 'Añadir a favoritos');
    button.innerHTML = `<i class="${active ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i>`;
    showToast(active ? 'Añadido a favoritos.' : 'Eliminado de favoritos.');
  });

  root.querySelector('[data-size-guide]').addEventListener('click', () => {
    const dialog = document.querySelector('#size-guide-modal');
    if (dialog?.showModal) dialog.showModal();
    else showToast('La guía de tallas no está disponible en este navegador.');
  });

  const shareDialog = document.querySelector('#share-modal');
  const productUrl = location.href;
  const shareText = `Mira ${product.name} en Draco Shoes`;
  const encodedUrl = encodeURIComponent(productUrl);
  const encodedText = encodeURIComponent(shareText);
  const shareWhatsApp = shareDialog?.querySelector('[data-share-whatsapp]');
  const shareFacebook = shareDialog?.querySelector('[data-share-facebook]');
  const shareX = shareDialog?.querySelector('[data-share-x]');
  if (shareWhatsApp) shareWhatsApp.href = `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${productUrl}`)}`;
  if (shareFacebook) shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  if (shareX) shareX.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
  [shareWhatsApp, shareFacebook, shareX].forEach((link) => link?.addEventListener('click', () => shareDialog?.close()));
  [shareDialog, document.querySelector('#size-guide-modal')].forEach((dialog) => {
    dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  });

  root.querySelector('[data-share-product]')?.addEventListener('click', () => {
    if (shareDialog?.showModal) shareDialog.showModal();
  });

  shareDialog?.querySelector('[data-copy-product-link]')?.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(productUrl);
      else {
        const input = document.createElement('textarea');
        input.value = productUrl;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.append(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      shareDialog.close();
      showToast('Enlace del producto copiado.');
    } catch {
      showToast('No se pudo copiar el enlace.', 'error');
    }
  });

  shareDialog?.querySelector('[data-share-native]')?.addEventListener('click', async () => {
    if (!navigator.share) {
      showToast('Selecciona una red social o copia el enlace.');
      return;
    }
    try {
      await navigator.share({ title: product.name, text: shareText, url: productUrl });
      shareDialog.close();
    } catch (error) {
      if (error.name !== 'AbortError') showToast('No se pudo compartir.', 'error');
    }
  });
}
