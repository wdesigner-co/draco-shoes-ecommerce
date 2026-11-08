// Comportamiento exclusivo de la página principal.
import { getProducts, getHomeAds } from '../core/store.js';
import { HOME_SHOWCASE, CATEGORIES, getCategoryName } from '../data/products.js';
import { CONFIG } from '../config.js';
import { renderProducts, showToast, escapeHTML, safeImageUrl } from '../core/ui.js';

/** Renderiza colecciones, sugerencias de búsqueda y formularios de contacto demo. */
export function initHome() {
  const products = getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 8);

  // Los hero, las categorías y la promoción se construyen desde el catálogo central.
  renderHomeShowcases(products, getHomeAds());
  renderHomeCategories(products);
  initHeroEntrance();

  renderProducts(
    featured.length ? featured : products.slice(0, 8),
    document.querySelector('#featured-products')
  );
  renderProducts(products.slice(0, 8), document.querySelector('#best-sellers'));

  // Sugiere nombres de productos conforme el visitante escribe en el buscador móvil.
  initMobileSearchSuggestions(products);

  // Permite abrir Google Maps embebido en el mismo contenedor de ubicación.
  initExpandableMap();

  // WhatsApp puede aparecer en móvil y escritorio al entrar al bloque de ubicación.
  initHomeWhatsAppFloat();

  document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    showToast('Formulario demostrativo: conecta un servicio para recibir consultas.');
    event.currentTarget.reset();
  });
}


/** Obtiene el producto solicitado o usa el primer producto disponible como respaldo. */
function resolveShowcaseProduct(products, productId) {
  return products.find((product) => product.id === productId) || products[0] || null;
}


/** Anima la entrada inicial de los bloques de texto y visuales del hero. */
function initHeroEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const entranceTargets = [
    ['.mobile-hero__copy', 'hero-entry-from-left'],
    ['.mobile-hero__visual', 'hero-entry-from-right'],
    ['.hero-copy', 'hero-entry-from-left'],
    ['.hero-visual', 'hero-entry-from-right']
  ];

  entranceTargets.forEach(([selector, className]) => {
    document.querySelector(selector)?.classList.add(className);
  });
}

/** Actualiza los espacios publicitarios del Home sin mezclarlos con la galería del producto. */
function renderHomeShowcases(products, ads) {
  const adFor = (slot) => ads.find((item) => item.slot === slot) || null;
  const resolveAdProduct = (ad, fallbackId) => (
    products.find((product) => product.id === (ad?.productId || fallbackId)) || products[0] || null
  );
  const renderAdTitle = (element, ad, fallbackTitle, accentTag = 'span') => {
    if (!element) return;
    const title = String(ad?.title || fallbackTitle);
    const accent = String(ad?.titleAccent || '').trim();
    if (accent && title.endsWith(accent)) {
      const prefix = title.slice(0, -accent.length).trimEnd();
      const highlight = document.createElement(accentTag);
      highlight.textContent = accent;
      element.replaceChildren(document.createTextNode(prefix ? `${prefix} ` : ''), highlight);
    } else {
      element.textContent = title;
    }
  };

  const mobileAd = adFor('mobileHero');
  const mobileProduct = resolveAdProduct(mobileAd, HOME_SHOWCASE.mobileHeroProductId);
  if (mobileProduct) {
    const image = document.querySelector('[data-home-ad-image="mobileHero"]');
    if (image) {
      image.src = safeImageUrl(mobileAd?.image || mobileProduct.image);
      image.alt = mobileAd?.alt || `Creatividad de ${mobileProduct.name} de ShoeX`;
    }
    const eyebrow = document.querySelector('[data-home-ad-eyebrow="mobileHero"]');
    if (eyebrow) eyebrow.textContent = mobileAd?.eyebrow || 'New collection';
    const title = document.querySelector('[data-home-ad-title="mobileHero"]');
    renderAdTitle(title, mobileAd, mobileProduct.name, 'span');
    document.querySelectorAll('[data-home-product-link="mobile"]').forEach((link) => {
      link.href = `producto.html?id=${encodeURIComponent(mobileProduct.id)}`;
      if (link.classList.contains('mobile-hero__visual')) {
        link.setAttribute('aria-label', `Ver ${mobileProduct.name}`);
      }
    });
    const cta = document.querySelector('[data-home-ad-cta="mobileHero"]');
    if (cta) cta.textContent = mobileAd?.ctaLabel || 'Shop Now';
  }

  const desktopAd = adFor('desktopHero');
  const desktopProduct = resolveAdProduct(desktopAd, HOME_SHOWCASE.desktopHeroProductId);
  if (desktopProduct) {
    const image = document.querySelector('[data-home-ad-image="desktopHero"]');
    if (image) {
      image.src = safeImageUrl(desktopAd?.image || desktopProduct.image);
      image.alt = desktopAd?.alt || `Creatividad de colección con ${desktopProduct.name}`;
    }
    const eyebrow = document.querySelector('[data-home-ad-eyebrow="desktopHero"]');
    if (eyebrow) eyebrow.textContent = desktopAd?.eyebrow || 'Nueva colección';
    const title = document.querySelector('[data-home-ad-title="desktopHero"]');
    renderAdTitle(title, desktopAd, 'Step into your style.', 'em');
    const description = document.querySelector('[data-home-ad-description="desktopHero"]');
    if (description) description.textContent = desktopAd?.description || 'Encuentra zapatillas que acompañan tu ritmo.';
    const productName = document.querySelector('[data-home-product-name="desktop"]');
    if (productName) productName.textContent = desktopProduct.name;
    document.querySelectorAll('[data-home-product-link="desktop"]').forEach((link) => {
      link.href = `producto.html?id=${encodeURIComponent(desktopProduct.id)}`;
      if (link.matches('.hero-actions a')) {
        const ctaText = link.querySelector('[data-home-ad-cta="desktopHero"]');
        if (ctaText) ctaText.textContent = desktopAd?.ctaLabel || 'Explorar colección';
      }
    });
  }

  const promotionAd = adFor('promotion');
  const promotionProduct = resolveAdProduct(promotionAd, HOME_SHOWCASE.promotionProductId);
  if (promotionProduct) {
    const image = document.querySelector('[data-home-ad-image="promotion"]');
    if (image) {
      image.src = safeImageUrl(promotionAd?.image || promotionProduct.image);
      image.alt = promotionAd?.alt || `Creatividad de promoción ShoeX para ${promotionProduct.name}`;
    }
    const eyebrow = document.querySelector('[data-home-ad-eyebrow="promotion"]');
    if (eyebrow) eyebrow.textContent = promotionAd?.eyebrow || 'Oferta de bienvenida';
    const title = document.querySelector('[data-home-ad-title="promotion"]');
    if (title) title.textContent = promotionAd?.title || 'Tu próximo par está más cerca.';
    const description = document.querySelector('[data-home-ad-description="promotion"]');
    if (description) description.textContent = promotionAd?.description || 'Descubre la colección ShoeX.';
    const badge = document.querySelector('[data-home-ad-badge="promotion"]');
    if (badge) badge.textContent = promotionAd?.badge || '';
    const cta = document.querySelector('[data-home-ad-cta="promotion"]');
    if (cta) cta.textContent = promotionAd?.ctaLabel || 'Comprar ahora';
    document.querySelectorAll('[data-home-product-link="promotion"]').forEach((link) => {
      link.href = `producto.html?id=${encodeURIComponent(promotionProduct.id)}`;
    });
  }
}

/** Genera los carruseles y tarjetas editoriales usando CATEGORIES y sus productos. */
function renderHomeCategories(products) {
  const mobileContainer = document.querySelector('#mobile-home-categories');
  const desktopContainer = document.querySelector('#desktop-home-categories');
  const desktopThemes = ['dark', 'orange', 'light', 'sand'];

  const categories = CATEGORIES.map((category) => {
    const representative = products.find((product) => (
      product.id === category.representativeProductId && product.category === category.id
    )) || products.find((product) => product.category === category.id);
    if (!representative) return null;
    return { ...category, representative };
  }).filter(Boolean);

  if (mobileContainer) {
    mobileContainer.innerHTML = categories.map((category) => {
      const image = safeImageUrl(category.representative.image);
      const name = escapeHTML(category.name);
      const productName = escapeHTML(category.representative.name);
      return `
        <a class="mobile-category-item" href="categorias.html?category=${encodeURIComponent(category.id)}" aria-label="Explorar categoría ${name}">
          <span class="mobile-category-item__image">
            <img src="${escapeHTML(image)}" alt="${productName}" width="150" height="100" loading="lazy">
          </span>
          <span>${name}</span>
        </a>`;
    }).join('');
  }

  if (desktopContainer) {
    desktopContainer.innerHTML = categories
      .filter((category) => category.showOnDesktop !== false)
      .map((category, index) => {
        const image = safeImageUrl(category.representative.image);
        const name = escapeHTML(category.name);
        const productName = escapeHTML(category.representative.name);
        const eyebrow = escapeHTML(category.eyebrow || `${String(index + 1).padStart(2, '0')} / ${category.name.toUpperCase()}`);
        const description = escapeHTML(category.description || `Descubre nuestra selección ${category.name.toLowerCase()}`);
        const theme = desktopThemes.includes(category.theme) ? category.theme : desktopThemes[index % desktopThemes.length];
        return `
          <a class="category-feature category-feature--${theme}" href="categorias.html?category=${encodeURIComponent(category.id)}">
            <span>${eyebrow}</span>
            <strong>${name}</strong>
            <small>${description}</small>
            <img src="${escapeHTML(image)}" alt="${productName}" loading="lazy" width="600" height="360">
          </a>`;
      }).join('');
  }
}

/** Actualiza las opciones del datalist con los nombres que coinciden con el texto. */
function initMobileSearchSuggestions(products) {
  const input = document.querySelector('#mobile-search-input');
  const list = document.querySelector('#mobile-search-suggestions');
  const form = document.querySelector('#mobile-search-form');
  if (!input || !list || !form) return;

  const updateSuggestions = () => {
    const query = input.value.trim().toLocaleLowerCase('es');
    const matches = products
      .filter((product) => !query || `${product.name} ${product.brand}`.toLocaleLowerCase('es').includes(query))
      .slice(0, 8);

    list.replaceChildren(...matches.map((product) => {
      const option = document.createElement('option');
      option.value = product.name;
      option.label = `${product.name} · ${getCategoryName(product.category)}`;
      return option;
    }));
  };

  input.addEventListener('input', updateSuggestions);
  updateSuggestions();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input.value.trim();
    location.href = `categorias.html?q=${encodeURIComponent(query)}`;
  });
}

/** Inserta el mapa interactivo de Google Maps dentro de la tarjeta al tocarla. */
function initExpandableMap() {
  const preview = document.querySelector('[data-map-preview]');
  const expandButton = preview?.querySelector('[data-map-expand]');
  if (!preview || !expandButton) return;

  expandButton.addEventListener('click', () => {
    if (preview.classList.contains('is-expanded')) return;

    const map = document.createElement('iframe');
    const query = encodeURIComponent(CONFIG.mapSearchQuery || CONFIG.storeName);
    map.src = `https://www.google.com/maps?q=${query}&output=embed`;
    map.title = 'Mapa de Google Maps de la ubicación demostrativa de ShoeX';
    map.loading = 'lazy';
    map.referrerPolicy = 'no-referrer-when-downgrade';
    map.allowFullscreen = true;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'map-close-button';
    closeButton.setAttribute('aria-label', 'Cerrar mapa');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    closeButton.addEventListener('click', () => {
      map.remove();
      closeButton.remove();
      preview.classList.remove('is-expanded');
      expandButton.hidden = false;
      expandButton.setAttribute('aria-expanded', 'false');
    });

    preview.append(map, closeButton);
    preview.classList.add('is-expanded');
    expandButton.hidden = true;
    expandButton.setAttribute('aria-expanded', 'true');
  });
}

/** Muestra WhatsApp al llegar a ubicación y lo mantiene hasta volver por encima de esa sección. */
function initHomeWhatsAppFloat() {
  const button = document.querySelector('[data-home-whatsapp]');
  const section = document.querySelector('.info-contact-grid');
  if (!button || !section) return;

  const message = encodeURIComponent('Hola, quisiera recibir información sobre los productos de Draco Shoes.');
  button.href = `https://wa.me/${CONFIG.sellerWhatsApp}?text=${message}`;

  const setVisibility = (visible) => {
    button.classList.toggle('is-visible', Boolean(visible));
    button.setAttribute('aria-hidden', String(!visible));
    button.tabIndex = visible ? 0 : -1;
  };

  // El umbral se calcula desde el inicio de la sección, no desde el bloque interno de dirección.
  const updateVisibility = () => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const activationPoint = Math.max(0, sectionTop - 140);
    setVisibility(window.scrollY >= activationPoint);
  };

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility, { passive: true });
}
