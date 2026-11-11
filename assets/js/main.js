// Punto de entrada de la aplicación: componentes, autenticación demo y página activa.
import { loadSharedComponents } from './core/components.js';
import { getCart, getProfile, saveProfile } from './core/store.js';
import { openModal, showToast, safeImageUrl } from './core/ui.js';
import { CONFIG } from './config.js';
import { ONBOARDING_BACKGROUND, CATEGORIES } from './data/products.js';
import { initHome } from './pages/home.js';
import { initProduct } from './pages/product.js';
import { initCart } from './pages/cart.js';
import { initCheckout } from './pages/checkout.js';
import { initOrderSuccess } from './pages/order-success.js';
import { initFavorites } from './pages/favorites.js';
import { initCategories } from './pages/categories.js';
import { initProfile } from './pages/profile.js';
import { initAdmin } from './pages/admin.js';

const ACCOUNT_SESSION_KEY = 'shoex-account-demo-auth';
const ADMIN_SESSION_KEY = 'shoex-admin-demo-auth';
const ONBOARDING_SEEN_KEY = 'shoex-onboarding-seen-v1';

const pages = {
  home: initHome,
  product: initProduct,
  cart: initCart,
  checkout: initCheckout,
  success: initOrderSuccess,
  favorites: initFavorites,
  categories: initCategories,
  profile: initProfile,
  admin: initAdmin
};

/** Carga la creatividad vertical del onboarding desde su configuración central. */
function hydrateCatalogMedia() {
  const onboardingImage = document.querySelector('[data-onboarding-background]');
  if (!onboardingImage || !ONBOARDING_BACKGROUND?.image) return;

  onboardingImage.src = safeImageUrl(ONBOARDING_BACKGROUND.image);
  onboardingImage.alt = ONBOARDING_BACKGROUND.alt || 'Imagen de bienvenida ShoeX';
  onboardingImage.addEventListener('load', () => {
    // Las creatividades horizontales provisionales se contienen para no recortar el calzado.
    const ratio = onboardingImage.naturalWidth / Math.max(onboardingImage.naturalHeight, 1);
    onboardingImage.classList.toggle('is-landscape', ratio > 0.9);
    onboardingImage.classList.toggle('is-portrait', ratio <= 0.9);
  }, { once: true });
  if (onboardingImage.complete && onboardingImage.naturalWidth) {
    const ratio = onboardingImage.naturalWidth / Math.max(onboardingImage.naturalHeight, 1);
    onboardingImage.classList.toggle('is-landscape', ratio > 0.9);
    onboardingImage.classList.toggle('is-portrait', ratio <= 0.9);
  }
}

/** Devuelve el rol de la sesión activa en esta pestaña del navegador. */
function getActiveSessionRole() {
  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') return 'admin';
  if (sessionStorage.getItem(ACCOUNT_SESSION_KEY) === 'true') return 'account';
  return null;
}

/** Cierra menús de cuenta abiertos, excepto el control indicado. */
function closeAccountMenus(exceptControl = null) {
  document.querySelectorAll('[data-account-control]').forEach((control) => {
    if (control === exceptControl) return;
    const menu = control.querySelector('[data-account-menu]');
    const trigger = control.querySelector('[data-account-trigger]');
    if (menu) menu.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

/** Mantiene visible el acceso y refleja el rol cuando hay una sesión demo. */
function updateAuthSessionUI() {
  const role = getActiveSessionRole();
  document.querySelectorAll('[data-account-control]').forEach((control) => {
    const trigger = control.querySelector('[data-account-trigger]');
    const roleLabel = control.querySelector('[data-session-role]');
    const roleIcon = control.querySelector('[data-session-role-icon]');
    const destination = control.querySelector('[data-session-destination]');
    const destinationLabel = control.querySelector('[data-session-destination-label]');
    const menu = control.querySelector('[data-account-menu]');
    const roleName = role === 'admin' ? 'Administrador' : 'Cliente';
    const destinationUrl = role === 'admin' ? 'admin.html' : 'perfil.html';
    const destinationText = role === 'admin' ? 'Panel de administración' : 'Mi perfil';

    control.classList.toggle('is-admin', role === 'admin');
    control.classList.toggle('is-account', role === 'account');
    if (roleLabel) {
      roleLabel.textContent = role ? roleName : '';
      roleLabel.hidden = !role;
    }
    if (roleIcon) roleIcon.className = role === 'admin'
      ? 'fa-solid fa-user-shield'
      : 'fa-regular fa-user';
    if (trigger) {
      trigger.setAttribute('aria-label', role
        ? 'Cuenta ' + roleName + '. Abrir opciones de cuenta'
        : 'Iniciar sesión');
      trigger.title = role ? roleName : 'Iniciar sesión';
      trigger.setAttribute('aria-expanded', 'false');
    }
    if (destination) {
      destination.href = destinationUrl;
      if (destinationLabel) destinationLabel.textContent = destinationText;
      if (document.body.dataset.page === (role === 'admin' ? 'admin' : 'profile')) {
        destination.setAttribute('aria-current', 'page');
      } else {
        destination.removeAttribute('aria-current');
      }
    }
    if (menu) menu.hidden = !role;
  });
  closeAccountMenus();
}

/** Cierra el rol demo sin eliminar carrito, favoritos ni pedidos del navegador. */
function closeDemoSession() {
  sessionStorage.removeItem(ACCOUNT_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  updateAuthSessionUI();

  const currentPage = document.body.dataset.page;
  if (currentPage === 'profile' || currentPage === 'admin') {
    location.replace('index.html');
    return;
  }
  showToast('Sesión cerrada correctamente.');
}

/** Marca la bienvenida como vista para no repetirla en cada navegación. */
function markOnboardingAsSeen() {
  try {
    localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
  } catch (error) {
    // Si el almacenamiento está bloqueado, la sesión actual no debe quedar atrapada en un bucle.
    console.warn('No se pudo guardar el estado del onboarding.', error);
  }
}

/** Actualiza nombres y destinos de los enlaces de categoría en header y footer. */
function hydrateCategoryLinks() {
  document.querySelectorAll('[data-category-link]').forEach((link) => {
    const category = CATEGORIES.find((item) => item.id === link.dataset.categoryLink);
    if (!category) {
      link.hidden = true;
      return;
    }
    link.hidden = false;
    link.href = `categorias.html?category=${encodeURIComponent(category.id)}`;
    link.textContent = category.name;
  });
}

/** Actualiza el número de unidades visible en los accesos al carrito. */
function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll('[data-cart-count]').forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;
    badge.setAttribute('aria-label', `${count} productos en el carrito`);
  });
}

/** Construye campos de formulario accesibles sin inyectar etiquetas ambiguas. */
function createAuthField({ label, name, type = 'text', autocomplete = 'off', placeholder = '', required = true, value = '', hidden = false, minLength = 0 }) {
  const wrapper = document.createElement('label');
  wrapper.hidden = hidden;
  wrapper.append(document.createTextNode(label));

  const input = document.createElement('input');
  input.name = name;
  input.type = type;
  input.autocomplete = autocomplete;
  input.placeholder = placeholder;
  input.required = required;
  input.defaultValue = value;
  input.value = value;
  input.minLength = minLength;
  input.spellcheck = false;
  if (type === 'email') {
    input.autocapitalize = 'none';
    input.autocorrect = 'off';
  }
  input.setAttribute('aria-label', label);
  wrapper.append(input);
  return wrapper;
}

/** Muestra un acceso unificado; la ruta depende de la credencial usada. */
function openAuthDialog(mode = 'account', tab = 'login') {
  const dialog = document.querySelector('#auth-modal');
  if (!dialog) return;

  const adminGate = mode === 'admin' || document.body.dataset.page === 'admin';
  const tabs = dialog.querySelector('[data-auth-tabs]');
  const googleButton = dialog.querySelector('[data-auth-google]');
  const fields = dialog.querySelector('[data-auth-fields]');
  const title = dialog.querySelector('[data-auth-title]');
  const eyebrow = dialog.querySelector('[data-auth-eyebrow]');
  const copy = dialog.querySelector('[data-auth-copy]');
  const note = dialog.querySelector('[data-auth-note]');
  const submit = dialog.querySelector('[data-auth-submit]');
  const feedback = dialog.querySelector('[data-auth-feedback]');

  // El contexto se separa de las pestañas para que escribir nunca reconstruya el formulario.
  dialog.dataset.authContext = adminGate ? 'admin-gate' : 'account';
  dialog.dataset.authView = adminGate ? 'login' : tab;
  feedback.textContent = '';
  tabs.hidden = adminGate;
  googleButton.hidden = adminGate;
  fields.replaceChildren();

  if (adminGate) {
    eyebrow.textContent = 'Acceso restringido';
    title.textContent = 'Administración ShoeX';
    copy.textContent = 'Ingresa con las credenciales del administrador para abrir el panel.';
    submit.textContent = 'Ingresar al panel';
    note.textContent = 'Acceso demostrativo local. No se permite crear cuentas de administrador desde esta pantalla.';
    fields.append(
      createAuthField({ label: 'Correo de acceso', name: 'email', type: 'email', autocomplete: 'username', placeholder: 'Correo del administrador' }),
      createAuthField({ label: 'Contraseña', name: 'password', type: 'password', autocomplete: 'current-password', placeholder: 'Ingresa la contraseña' })
    );
  } else {
    const isRegister = tab === 'register';
    eyebrow.textContent = 'Tu cuenta ShoeX';
    title.textContent = isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo';
    copy.textContent = isRegister
      ? 'Registra tus datos para consultar tus pedidos y guardar tus preferencias.'
      : 'Inicia sesión para acceder a tu perfil. El acceso del administrador utiliza este mismo formulario.';
    submit.textContent = isRegister ? 'Crear cuenta demo' : 'Iniciar sesión';
    note.textContent = 'Prototipo local: los datos se guardan en este navegador. Google se muestra como opción visual, sin conexión OAuth.';

    if (isRegister) {
      fields.append(createAuthField({
        label: 'Nombre completo', name: 'name', autocomplete: 'name', placeholder: 'Tu nombre'
      }));
    }
    fields.append(
      createAuthField({ label: 'Correo electrónico', name: 'email', type: 'email', autocomplete: 'email', placeholder: 'nombre@correo.com' }),
      createAuthField({ label: 'Contraseña', name: 'password', type: 'password', autocomplete: isRegister ? 'new-password' : 'current-password', placeholder: 'Mínimo 4 caracteres', minLength: 4 })
    );

    tabs.querySelectorAll('[data-auth-tab]').forEach((button) => {
      const active = button.dataset.authTab === tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }

  const firstInput = fields.querySelector('input:not([type="hidden"])');
  if (dialog.showModal && !dialog.open) dialog.showModal();
  else if (!dialog.showModal) dialog.setAttribute('open', '');
  requestAnimationFrame(() => firstInput?.focus({ preventScroll: true }));
}

/** Conecta eventos globales para favoritos, modales, búsquedas y autenticación. */
function bindGlobalEvents() {
  document.addEventListener('click', (event) => {
    const onboardingExit = event.target.closest('[data-onboarding-complete]');
    if (onboardingExit) markOnboardingAsSeen();

    const accountTrigger = event.target.closest('[data-account-trigger]');
    if (accountTrigger) {
      event.preventDefault();
      const role = getActiveSessionRole();
      if (!role) {
        openAuthDialog('account');
        return;
      }
      const control = accountTrigger.closest('[data-account-control]');
      const menu = control?.querySelector('[data-account-menu]');
      if (!menu) return;
      const shouldOpen = menu.hidden;
      closeAccountMenus(control);
      menu.hidden = !shouldOpen;
      accountTrigger.setAttribute('aria-expanded', String(shouldOpen));
      return;
    }
    if (!event.target.closest('[data-account-control]')) closeAccountMenus();

    const logoutTrigger = event.target.closest('[data-auth-logout]');
    if (logoutTrigger) {
      event.preventDefault();
      closeDemoSession();
      return;
    }

    const authTrigger = event.target.closest('[data-auth-trigger]');
    if (authTrigger) {
      const mode = authTrigger.dataset.authTrigger;
      const role = getActiveSessionRole();

      // Si la sesión activa es administrativa, "Mi cuenta" vuelve al panel sin pedir credenciales.
      if (mode === 'account' && role === 'admin') {
        event.preventDefault();
        location.href = 'admin.html';
        return;
      }

      const authenticated = mode === 'admin' ? role === 'admin' : role === 'account';
      if (!authenticated) {
        event.preventDefault();
        openAuthDialog(mode);
        return;
      }
    }

    const favoriteButton = event.target.closest('[data-favorite]');
    if (favoriteButton) {
      event.preventDefault();
      import('./core/store.js').then(({ toggleFavorite }) => {
        const active = toggleFavorite(favoriteButton.dataset.favorite);
        favoriteButton.classList.toggle('is-active', active);
        favoriteButton.setAttribute('aria-pressed', String(active));
        favoriteButton.setAttribute('aria-label', active ? 'Quitar de favoritos' : 'Añadir a favoritos');
        favoriteButton.innerHTML = `<i class="${active ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i>`;
        showToast(active ? 'Añadido a favoritos.' : 'Eliminado de favoritos.');

        if (document.body.dataset.page === 'favorites' && !active) {
          favoriteButton.closest('.product-card')?.remove();
          const grid = document.querySelector('#favorite-products');
          if (grid && !grid.querySelector('.product-card')) {
            grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-heart" aria-hidden="true"></i><h3>Sin favoritos</h3><p>Explora el catálogo para guardar tus modelos preferidos.</p><a class="button button--primary" href="categorias.html">Explorar catálogo</a></div>';
          }
        }
      });
    }

    const modalCloseButton = event.target.closest('[data-modal-close]');
    if (modalCloseButton) modalCloseButton.closest('dialog')?.close?.();
    if (event.target.closest('[data-auth-close]')) document.querySelector('#auth-modal')?.close?.();

    // Solo las pestañas del selector cambian entre login y registro.
    // Los inputs están dentro del dialog, pero no coinciden con este selector.
    const authTabButton = event.target.closest('[data-auth-tabs] [data-auth-tab]');
    if (authTabButton && document.querySelector('#auth-modal')?.open) {
      openAuthDialog('account', authTabButton.dataset.authTab);
    }

    if (event.target.closest('[data-auth-google]')) {
      const feedback = document.querySelector('[data-auth-feedback]');
      if (feedback) feedback.textContent = 'Google está disponible como elemento visual del prototipo. La conexión OAuth no está configurada.';
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAccountMenus();
  });

  document.querySelector('#auth-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const dialog = document.querySelector('#auth-modal');
    const context = dialog.dataset.authContext;
    const view = dialog.dataset.authView || 'login';
    const adminGate = context === 'admin-gate';
    const data = Object.fromEntries(new FormData(form).entries());
    const email = String(data.email || '').trim().toLowerCase();
    const password = String(data.password || '');
    const feedback = dialog.querySelector('[data-auth-feedback]');

    const expectedAdminEmail = String(CONFIG.demoAdminEmail || '').trim().toLowerCase();
    const isAdminCredential = email === expectedAdminEmail && password === CONFIG.demoAdminPassword;

    // El administrador usa el mismo formulario de acceso, pero nunca puede registrarse.
    if (view === 'login' && isAdminCredential) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      sessionStorage.removeItem(ACCOUNT_SESSION_KEY);
      dialog.close();
      location.href = 'admin.html';
      return;
    }

    // Reserva el correo administrativo para evitar crear o abrir un perfil cliente con esa identidad.
    if (email && email === expectedAdminEmail) {
      feedback.textContent = adminGate || view === 'login'
        ? 'Las credenciales de administración no son válidas.'
        : 'Este correo está reservado para administración. Inicia sesión desde la pestaña correspondiente.';
      return;
    }

    if (adminGate) {
      feedback.textContent = 'No se reconocieron las credenciales de administración.';
      return;
    }

    if (password.length < 4) {
      feedback.textContent = 'La contraseña debe contener al menos cuatro caracteres.';
      return;
    }

    const profile = getProfile();
    saveProfile({
      ...profile,
      ...(view === 'register' && data.name ? { name: String(data.name).trim() } : {}),
      email
    });
    sessionStorage.setItem(ACCOUNT_SESSION_KEY, 'true');
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    dialog.close();
    location.href = 'perfil.html';
  });

  document.addEventListener('shoex:modal', (event) => {
    openModal(event.detail.title, event.detail.message);
  });

  document.addEventListener('shoex:cart-updated', updateCartCount);

  document.querySelector('#header-search-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = event.currentTarget.elements.namedItem('q').value.trim();
    location.href = `categorias.html?q=${encodeURIComponent(query)}`;
  });
}

/** Añade transiciones de entrada perceptibles y progresivas al hacer scroll. */
function initScrollReveal() {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.add('reveal-enabled');
  const sectionTargets = document.querySelectorAll(
    '#main-content > section:not(.mobile-hero-section):not(.desktop-home-hero), #main-content > .page-title-row, #main-content > .catalog-layout, #main-content > .profile-layout, #main-content > .admin-panel, #main-content > .admin-stats, #main-content > .admin-warning, #product-detail'
  );
  const itemTargets = document.querySelectorAll(
    '.category-feature, .testimonial-card, .product-grid > .product-card, .admin-product-card'
  );

  sectionTargets.forEach((element, index) => {
    element.dataset.revealSection = '';
    element.style.setProperty('--reveal-delay', `${Math.min(index * 55, 220)}ms`);
  });

  itemTargets.forEach((element, index) => {
    element.dataset.revealItem = '';
    element.style.setProperty('--reveal-delay', `${(index % 8) * 85}ms`);

    if (element.classList.contains('testimonial-card')) {
      element.dataset.revealFrom = index % 2 === 0 ? 'left' : 'right';
    }
  });

  // La tira horizontal se revela como un grupo y cada categoría entra en cascada de izquierda a derecha.
  const categoryCarousel = document.querySelector('.mobile-category-carousel');
  if (categoryCarousel) {
    const categoryObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      categoryCarousel.classList.add('is-revealed');
      categoryObserver.disconnect();
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    categoryObserver.observe(categoryCarousel);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });

  [...sectionTargets, ...itemTargets].forEach((element) => observer.observe(element));
}

/** Inicializa la aplicación tras cargar los fragmentos HTML compartidos. */
document.addEventListener('DOMContentLoaded', async () => {
  const currentPage = document.body.dataset.page;
  const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;

  // La bienvenida se presenta automáticamente una sola vez en la primera visita móvil.
  if (currentPage === 'home' && isMobileViewport) {
    let onboardingSeen = false;
    try {
      onboardingSeen = localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true';
    } catch (error) {
      // Al no poder consultar almacenamiento, se prioriza mostrar la tienda y evitar redirecciones repetidas.
      onboardingSeen = true;
    }
    if (!onboardingSeen) {
      location.replace('onboarding.html');
      return;
    }
  }

  // En escritorio se omite la bienvenida; al verla en móvil se registra para próximas visitas.
  if (currentPage === 'onboarding') {
    if (!isMobileViewport) {
      location.replace('index.html');
      return;
    }
    markOnboardingAsSeen();
  }

  await loadSharedComponents();
  hydrateCatalogMedia();
  hydrateCategoryLinks();
  bindGlobalEvents();
  updateCartCount();

  updateAuthSessionUI();

  if (currentPage === 'profile' && getActiveSessionRole() === 'admin') {
    location.replace('admin.html');
    return;
  }
  if (currentPage === 'profile' && getActiveSessionRole() !== 'account') {
    openAuthDialog('account');
    return;
  }
  if (currentPage === 'admin' && getActiveSessionRole() !== 'admin') {
    openAuthDialog('admin');
    return;
  }

  const activeNavigationPage = {
    product: 'categories',
    checkout: 'cart',
    success: 'cart'
  }[currentPage] || currentPage;

  document.querySelectorAll('[data-nav-page]').forEach((link) => {
    if (link.dataset.navPage === activeNavigationPage) link.setAttribute('aria-current', 'page');
  });

  pages[currentPage]?.();
  if (currentPage !== 'onboarding') initScrollReveal();

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();
});
