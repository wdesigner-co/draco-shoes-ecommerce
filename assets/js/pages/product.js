// Ficha de producto: galería por puntos, variantes, favoritos y compra.
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

/** Carga el producto solicitado y conecta todas sus interacciones. */
export function initProduct() {
  const params = new URLSearchParams(location.search);
  const product = getProduct(params.get('id')) || getProducts()[0];
  const root = document.querySelector('#product-detail');
  if (!root) return;

  const image = safeImageUrl(product.image);
  // La galería utiliza tres vistas de catálogo independientes de las creatividades publicitarias.
  const galleryViews = [
    { src: image, label: 'Vista lateral' },
    { src: safeImageUrl(product.imageFront || 'assets/images/products/view-front-placeholder.svg'), label: 'Vista frontal' },
    { src: safeImageUrl(product.imagePair || 'assets/images/products/view-pair-placeholder.svg'), label: 'Vista del par' }
  ];
  const galleryImages = galleryViews.map((view) => view.src);

  const sizes = product.sizes || [36, 37, 38, 39, 40, 41, 42, 43, 44];
  const colors = (Array.isArray(product.colors) && product.colors.length
    ? product.colors
    : ['Negro / Naranja', 'Blanco / Gris', 'Azul / Blanco']).filter(Boolean).slice(0, 3);
  const defaultColorHexes = ['#292d35', '#e7e4dd', '#315c9a'];
  const colorHexes = colors.map((_, index) => {
    const candidate = product.colorHexes?.[index] || defaultColorHexes[index];
    return /^#[0-9a-f]{6}$/i.test(candidate || '') ? candidate : defaultColorHexes[index];
  });
  const favorite = getFavorites().includes(product.id);

  root.innerHTML = `
    <div class="product-detail__gallery">
      <button class="product-gallery__back" type="button" data-product-back aria-label="Volver a la página anterior">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>

      <a class="product-gallery__cart"
      href="carrito.html"
      aria-label="Abrir carrito de compras"
      title="Ver carrito">
      <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
      <span class="cart-badge" data-cart-count hidden>0</span>
      </a>


      <div class="product-gallery__track" data-gallery-track tabindex="0" aria-label="Galería de imágenes de ${escapeHTML(product.name)}">
        ${galleryImages.map((galleryImage, index) => `
          <figure class="product-gallery__slide product-gallery__slide--${index + 1}" data-gallery-slide="${index}">
            <img src="${escapeHTML(galleryImage)}" alt="${escapeHTML(product.name)} · ${escapeHTML(galleryViews[index].label)}" width="1200" height="900" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
          </figure>`).join('')}
      </div>
      <div class="product-gallery__pagination" role="group" aria-label="Seleccionar imagen del producto">
        ${galleryImages.map((_, index) => `
          <button class="gallery-dot ${index === 0 ? 'is-active' : ''}" type="button" data-gallery-dot="${index}" aria-label="Ver ${escapeHTML(galleryViews[index].label.toLowerCase())}" aria-pressed="${index === 0}"></button>
        `).join('')}
      </div>
    </div>

    <section class="product-detail__info" aria-labelledby="product-title">
      <div class="eyebrow">${escapeHTML(product.brand)} · ${escapeHTML(getCategoryName(product.category))}</div>
      <div class="product-detail__heading">
        <h1 id="product-title">${escapeHTML(product.name)}</h1>
        <div class="product-detail__tools">
          <button class="icon-button product-detail__favorite ${favorite ? 'is-active' : ''}" type="button" data-product-favorite aria-label="${favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}" aria-pressed="${favorite}">
            <i class="${favorite ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i>
          </button>
          <button class="icon-button product-detail__share" type="button" data-share-product aria-label="Compartir producto">
            <i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="product-detail__rating">
        <span class="rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${Number(product.rating).toFixed(1)}</span>
        <span>(${product.reviews} opiniones de clientes)</span>
        <span class="stock-indicator">${product.stock > 0 ? 'Disponible' : 'Agotado'}</span>
      </div>
      <div class="product-detail__price">
        ${money(product.price)}
        ${product.compareAt > product.price ? `<del>${money(product.compareAt)}</del>` : ''}
      </div>

      <div class="option-group">
        <div class="option-label">
          <strong>Selecciona tu talla</strong>
          <button class="text-link" type="button" data-size-guide>Guía de tallas</button>
        </div>
        <div class="size-selector" role="group" aria-label="Seleccionar talla">
          ${sizes.map((size, index) => `
            <button type="button" class="size-option ${index === 3 ? 'is-selected' : ''}" data-size="${escapeHTML(size)}" aria-pressed="${index === 3}">${escapeHTML(size)}</button>
          `).join('')}
        </div>
      </div>

      <div class="option-group product-color-group">
        <div class="option-label">
          <strong>Color</strong>
          <span id="selected-color">${escapeHTML(colors[0])}</span>
        </div>
        <div class="color-selector" role="group" aria-label="Seleccionar color">
          ${colors.map((color, index) => `
            <button type="button" class="color-option ${index === 0 ? 'is-selected' : ''}" style="--swatch:${colorHexes[index]}" data-color="${escapeHTML(color)}" aria-label="Color ${escapeHTML(color)}" aria-pressed="${index === 0}" title="${escapeHTML(color)}">
              <span></span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="product-detail__actions">
        <button class="button button--primary" type="button" id="buy-now" ${product.stock <= 0 ? 'disabled' : ''}>
          Comprar ahora <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
        <button class="button button--dark" type="button" id="add-to-cart" ${product.stock <= 0 ? 'disabled' : ''}>
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Añadir al carrito
        </button>
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

    // Actualiza el contador del nuevo acceso al carrito de la ficha.
document.dispatchEvent(new CustomEvent('shoex:cart-updated'));

  // En móvil, muestra la navegación inferior después de abandonar la zona inicial del producto.
  const initMobileProductNavigation = () => {
    const bottomNavigation = document.querySelector('.bottom-navigation');
    if (!bottomNavigation) return;

    const mobileViewport = window.matchMedia('(max-width: 767px)');
    const updateNavigationVisibility = () => {
      const shouldShow = mobileViewport.matches && window.scrollY > 110;
      document.body.classList.toggle('product-nav-visible', shouldShow);
    };

    window.addEventListener('scroll', updateNavigationVisibility, { passive: true });
    window.addEventListener('pageshow', updateNavigationVisibility);
    mobileViewport.addEventListener?.('change', updateNavigationVisibility);
    requestAnimationFrame(updateNavigationVisibility);
  };
  initMobileProductNavigation();

  // La flecha vuelve a la página interna desde la que se abrió el producto.
  // Si se abrió directamente o el origen es externo, utiliza el catálogo como destino seguro.
  root.querySelector('[data-product-back]')?.addEventListener('click', () => {
    let sameOriginReferrer = false;
    try {
      sameOriginReferrer = Boolean(
        document.referrer && new URL(document.referrer).origin === location.origin
      );
    } catch {
      sameOriginReferrer = false;
    }

    if (history.length > 1 && sameOriginReferrer) {
      history.back();
    } else {
      location.href = 'categorias.html';
    }
  });

  setPageMeta(
    `${product.name} | ShoeX`,
    product.description,
    `${location.origin}${location.pathname}?id=${encodeURIComponent(product.id)}`
  );

  // Publica datos estructurados del producto para motores de búsqueda compatibles.
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.id,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.description,
    image: galleryImages.map((item) => new URL(item, location.href).href),
    offers: {
      '@type': 'Offer',
      priceCurrency: CONFIG.currency,
      price: Number(product.price).toFixed(2),
      availability: Number(product.stock) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: location.href
    }
  };
  let schemaScript = document.querySelector('#product-jsonld');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'product-jsonld';
    schemaScript.type = 'application/ld+json';
    document.head.append(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(productSchema);

  const socialImage = document.querySelector('meta[property="og:image"]');
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (socialImage) socialImage.content = new URL(image, location.href).href;
  if (twitterImage) twitterImage.content = new URL(image, location.href).href;

  const related = getProducts()
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);
  const fallbackRelated = getProducts().filter((item) => item.id !== product.id).slice(0, 4);
  const relatedGrid = document.querySelector('#related-products');
  renderProducts(related.length ? related : fallbackRelated, relatedGrid);

  // Desplaza el carrusel de productos relacionados por tramos.
  const carousel = relatedGrid?.closest('.product-carousel');
  carousel?.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
    relatedGrid.scrollBy({ left: -relatedGrid.clientWidth * 0.8, behavior: 'smooth' });
  });
  carousel?.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
    relatedGrid.scrollBy({ left: relatedGrid.clientWidth * 0.8, behavior: 'smooth' });
  });

  // Sincroniza los puntos de paginación con el deslizamiento táctil de la galería.
  const galleryTrack = root.querySelector('[data-gallery-track]');
  const gallerySlides = [...root.querySelectorAll('[data-gallery-slide]')];
  const galleryDots = [...root.querySelectorAll('[data-gallery-dot]')];

  const activateGalleryDot = (index) => {
    galleryDots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
  };

  galleryDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.galleryDot);
      galleryTrack.scrollTo({ left: galleryTrack.clientWidth * index, behavior: 'smooth' });
      activateGalleryDot(index);
    });
  });

  if ('IntersectionObserver' in window && galleryTrack) {
    const galleryObserver = new IntersectionObserver((entries) => {
      const mostVisible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (mostVisible) activateGalleryDot(Number(mostVisible.target.dataset.gallerySlide));
    }, { root: galleryTrack, threshold: [0.55, 0.75] });
    gallerySlides.forEach((slide) => galleryObserver.observe(slide));
  }

  let selectedSize = sizes[Math.min(3, sizes.length - 1)];
  let selectedColor = colors[0];

  /** Selecciona una talla y actualiza el estado accesible del grupo. */
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

  /** Selecciona un color y actualiza su descripción junto al grupo. */
  root.querySelectorAll('[data-color]').forEach((button) => {
    button.addEventListener('click', () => {
      root.querySelectorAll('[data-color]').forEach((option) => {
        option.classList.remove('is-selected');
        option.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');
      selectedColor = button.dataset.color;
      root.querySelector('#selected-color').textContent = selectedColor;
    });
  });

  /** Añade la variante elegida y opcionalmente dirige al carrito. */
  const addSelectedVariant = (redirectToCart = false) => {
    const result = addToCart(product.id, selectedSize, selectedColor);
    showToast(result.message, result.ok ? 'success' : 'error');

    if (result.ok) {
      document.dispatchEvent(new CustomEvent('shoex:cart-updated'));
      if (redirectToCart) location.href = 'carrito.html';
    }
  };

  root.querySelector('#add-to-cart').addEventListener('click', () => addSelectedVariant());
  root.querySelector('#buy-now').addEventListener('click', () => addSelectedVariant(true));

  /** Alterna el favorito de la ficha sin recargar la página. */
  root.querySelector('[data-product-favorite]').addEventListener('click', (event) => {
    const button = event.currentTarget;
    const active = toggleFavorite(product.id);

    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Quitar de favoritos' : 'Añadir a favoritos');
    button.innerHTML = `<i class="${active ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i>`;
    showToast(active ? 'Añadido a favoritos.' : 'Eliminado de favoritos.');
  });

  /** Abre el cuadro con equivalencias orientativas de tallas EU, US y centímetros. */
  root.querySelector('[data-size-guide]').addEventListener('click', () => {
    const dialog = document.querySelector('#size-guide-modal');
    if (dialog?.showModal) dialog.showModal();
    else showToast('La guía de tallas no está disponible en este navegador.');
  });

  /** Prepara enlaces de redes y muestra el panel de opciones para compartir el producto. */
  const shareDialog = document.querySelector('#share-modal');
  const productUrl = location.href;
  const shareText = `Mira ${product.name} en ShoeX`;
  const encodedUrl = encodeURIComponent(productUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareWhatsApp = shareDialog?.querySelector('[data-share-whatsapp]');
  const shareFacebook = shareDialog?.querySelector('[data-share-facebook]');
  const shareX = shareDialog?.querySelector('[data-share-x]');
  if (shareWhatsApp) shareWhatsApp.href = `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${productUrl}`)}`;
  if (shareFacebook) shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  if (shareX) shareX.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

  [shareWhatsApp, shareFacebook, shareX].forEach((link) => {
    link?.addEventListener('click', () => shareDialog?.close());
  });

  [shareDialog, document.querySelector('#size-guide-modal')].forEach((dialog) => {
    dialog?.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  root.querySelector('[data-share-product]')?.addEventListener('click', () => {
    if (shareDialog?.showModal) shareDialog.showModal();
  });

  /** Copia el vínculo y confirma la acción sin abandonar la ficha. */
  shareDialog?.querySelector('[data-copy-product-link]')?.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(productUrl);
      } else {
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = productUrl;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.opacity = '0';
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand('copy');
        temporaryInput.remove();
        if (!copied) throw new Error('El navegador no permitió copiar el enlace.');
      }
      shareDialog.close();
      showToast('Enlace del producto copiado.');
    } catch {
      showToast('No se pudo copiar el enlace.', 'error');
    }
  });

  /** Abre el menú nativo del dispositivo cuando el navegador lo permite. */
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
