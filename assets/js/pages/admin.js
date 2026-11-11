// Panel de administración demostrativo: dashboard, catálogo y publicidad editorial.
import {
  getProducts,
  saveProducts,
  getHomeAds,
  saveHomeAds,
  resetDemoData,
  getOrders,
  updateOrderStatus,
  getOrderFulfillmentStatus,
  ORDER_STATUSES
} from '../core/store.js';
import { money, escapeHTML, safeImageUrl, showToast } from '../core/ui.js';
import { CATEGORIES, getCategoryName } from '../data/products.js';
import { CONFIG } from '../config.js';

const imagePathIsAllowed = (value) => (
  value.startsWith('assets/') || /^https:\/\//i.test(value)
);

/** Administra el dashboard y los editores locales del prototipo. */
export function initAdmin() {
  const grid = document.querySelector('#admin-product-list');
  const form = document.querySelector('#admin-product-form');
  const dialog = document.querySelector('#admin-edit-dialog');
  const adGrid = document.querySelector('#admin-ad-list');
  const adForm = document.querySelector('#admin-ad-form');
  const adDialog = document.querySelector('#admin-ad-dialog');
  let activeId = null;
  let activeAdId = null;

  if (!grid || !form || !dialog || !adGrid || !adForm || !adDialog) return;

  const categorySelect = form.elements.namedItem('category');
  categorySelect.innerHTML = CATEGORIES.map((category) => (
    `<option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>`
  )).join('');

  const adProductSelect = adForm.elements.namedItem('productId');
  const renderAdProductOptions = () => {
    adProductSelect.innerHTML = getProducts().map((product) => (
      `<option value="${escapeHTML(product.id)}">${escapeHTML(product.id)} · ${escapeHTML(product.name)}</option>`
    )).join('');
  };

  /** Formatea la fecha local de creación de un pedido. */
  const formatOrderDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  /** Resume los pedidos y muestra los datos necesarios para preparar y despachar cada compra. */
  const renderDashboard = () => {
    const orders = getOrders();
    const pending = orders.filter((order) => getOrderFulfillmentStatus(order) === 'pending');
    const packed = orders.filter((order) => getOrderFulfillmentStatus(order) === 'packed');
    const processed = orders.filter((order) => getOrderFulfillmentStatus(order) === 'processed');
    const totalOf = (collection) => collection.reduce((sum, order) => sum + Number(order.totals?.total || 0), 0);

    document.querySelector('#admin-pending-count').textContent = String(pending.length);
    document.querySelector('#admin-packed-count').textContent = String(packed.length);
    document.querySelector('#admin-processed-count').textContent = String(processed.length);
    document.querySelector('#admin-order-count').textContent = String(orders.length);
    document.querySelector('#admin-product-count').textContent = String(getProducts().length);
    document.querySelector('#admin-pending-total').textContent = `${money(totalOf(pending))} pendientes`;
    document.querySelector('#admin-packed-total').textContent = `${money(totalOf(packed))} empacados`;
    document.querySelector('#admin-processed-total').textContent = `${money(totalOf(processed))} procesados`;

    const list = document.querySelector('#admin-orders');
    list.innerHTML = orders.length
      ? orders.map((order) => {
        const statusKey = getOrderFulfillmentStatus(order);
        const status = ORDER_STATUSES[statusKey];
        const nextStatus = status.next;
        const customer = order.customer || {};
        const customerName = customer.name || customer.fullName || 'Cliente';
        const itemCount = (order.items || []).reduce((count, item) => count + Number(item.quantity || 0), 0);
        const itemRows = (order.items || []).map((item) => `
          <li class="admin-order-product">
            <img src="${escapeHTML(safeImageUrl(item.image || 'assets/images/products/shx-001.svg'))}" alt="" width="58" height="52" loading="lazy">
            <div><strong>${escapeHTML(item.name)}</strong><small>Referencia: ${escapeHTML(item.productId || '—')} · Talla: ${escapeHTML(item.size || '—')} · Color: ${escapeHTML(item.color || '—')}</small><small>Cantidad: ${Number(item.quantity || 0)} × ${money(item.price || 0)}</small></div>
            <strong>${money(item.lineTotal || 0)}</strong>
          </li>`).join('');
        const address = [customer.address, customer.city, customer.department, customer.postalCode].filter(Boolean).join(', ');
        const progress = ['pending', 'packed', 'processed'].map((step) => `
          <span class="admin-order-progress__step ${['pending', 'packed', 'processed'].indexOf(step) <= ['pending', 'packed', 'processed'].indexOf(statusKey) ? 'is-complete' : ''}">${ORDER_STATUSES[step].label}</span>`).join('');

        return `
          <li class="admin-order-item">
            <div class="admin-order-item__main">
              <strong>${escapeHTML(order.id)}</strong>
              <span>${escapeHTML(customerName)} · ${money(order.totals?.total || 0)}</span>
              <small>${escapeHTML(formatOrderDate(order.createdAt))} · ${itemCount} artículo(s)</small>
            </div>
            <span class="admin-order-status is-${statusKey}">${status.label}</span>
            ${nextStatus
              ? `<button class="button button--small ${nextStatus === 'processed' ? 'button--primary' : 'button--outline'}" type="button" data-order-status="${escapeHTML(order.id)}" data-next-status="${nextStatus}">${status.action}</button>`
              : `<span class="admin-order-complete"><i class="fa-solid fa-check-circle" aria-hidden="true"></i> ${order.inventoryDeductedAt === 'legacy-not-deducted' ? 'Pedido histórico migrado' : 'Inventario actualizado'}</span>`}
            <details class="admin-order-details">
              <summary><i class="fa-solid fa-box-open" aria-hidden="true"></i> Ver compra y datos de entrega</summary>
              <div class="admin-order-progress" aria-label="Progreso del pedido">${progress}</div>
              <div class="admin-order-details__grid">
                <section class="admin-order-detail-block">
                  <h4>Artículos por preparar</h4>
                  <ul class="admin-order-products">${itemRows}</ul>
                </section>
                <section class="admin-order-detail-block">
                  <h4>Datos del cliente y entrega</h4>
                  <dl class="admin-order-customer">
                    <div><dt>Nombre</dt><dd>${escapeHTML(customerName)}</dd></div>
                    <div><dt>Teléfono</dt><dd>${escapeHTML(customer.phone || 'No indicado')}</dd></div>
                    <div><dt>Correo</dt><dd>${escapeHTML(customer.email || 'No indicado')}</dd></div>
                    <div><dt>Dirección</dt><dd>${escapeHTML(address || 'No indicada')}</dd></div>
                    <div><dt>Notas</dt><dd>${escapeHTML(order.deliveryNotes || 'Sin instrucciones adicionales')}</dd></div>
                  </dl>
                  <div class="admin-order-totals">
                    <div><span>Subtotal</span><strong>${money(order.totals?.subtotal || 0)}</strong></div>
                    <div><span>Descuento</span><strong>${money(order.totals?.discount || 0)}</strong></div>
                    <div><span>Envío</span><strong>${Number(order.totals?.shipping || 0) === 0 ? 'Gratis' : money(order.totals.shipping)}</strong></div>
                    <div class="is-total"><span>Total del pedido</span><strong>${money(order.totals?.total || 0)}</strong></div>
                  </div>
                </section>
              </div>
              ${statusKey === 'processed' && order.inventoryDeductedAt === 'legacy-not-deducted'
                ? '<p class="admin-order-inventory-note is-legacy"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Pedido histórico de una versión anterior: se conserva como procesado, pero no se descontó inventario retroactivamente.</p>'
                : statusKey === 'processed' ? '<p class="admin-order-inventory-note"><i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i> Se descontaron las cantidades del inventario al procesar este pedido.</p>' : ''}
            </details>
          </li>`;
      }).join('')
      : '<li class="admin-order-empty">Todavía no hay pedidos en este navegador. Completa el flujo de compra para generar el primero.</li>';
  };

  /** Renderiza las tarjetas del catálogo con la vista lateral como imagen principal. */
  const renderProducts = () => {
    const products = getProducts();
    grid.innerHTML = products.map((product) => `
      <article class="admin-product-card">
        <div class="admin-product-card__image">
          <img src="${escapeHTML(safeImageUrl(product.image))}" alt="${escapeHTML(product.name)} · vista lateral" width="320" height="220" loading="lazy">
          <span class="admin-product-card__stock ${product.stock > 0 ? 'is-available' : 'is-empty'}">${product.stock > 0 ? `${Number(product.stock)} uds.` : 'Agotado'}</span>
        </div>
        <div class="admin-product-card__body">
          <span class="eyebrow">${escapeHTML(getCategoryName(product.category))} · ${escapeHTML(product.id)}</span>
          <h3>${escapeHTML(product.name)}</h3>
          <div class="admin-product-card__meta"><strong>${money(product.price)}</strong><span>${escapeHTML(product.brand)}</span></div>
          <div class="admin-product-color-preview" aria-label="${(product.colors || []).map((color) => escapeHTML(color)).join(', ')}">${(product.colors || []).map((color, index) => `<span title="${escapeHTML(color)}" style="--swatch:${/^#[0-9a-f]{6}$/i.test(product.colorHexes?.[index] || '') ? product.colorHexes[index] : ['#292d35', '#e7e4dd', '#315c9a'][index]}"></span>`).join('')}</div>
          <p class="admin-product-card__views"><i class="fa-regular fa-images" aria-hidden="true"></i> 3 vistas configurables</p>
          <button class="button button--outline button--small button--block" type="button" data-edit-product="${escapeHTML(product.id)}"><i class="fa-solid fa-pen" aria-hidden="true"></i> Editar producto</button>
        </div>
      </article>`).join('');

    const count = `${products.length} productos`;
    document.querySelector('#admin-catalog-count').textContent = count;
  };

  /** Renderiza las creatividades de campaña separadas de la galería de productos. */
  const renderAds = () => {
    const ads = getHomeAds();
    adGrid.innerHTML = ads.map((ad) => {
      const relatedProduct = getProducts().find((product) => product.id === ad.productId);
      return `
        <article class="admin-ad-card">
          <div class="admin-ad-card__image"><img src="${escapeHTML(safeImageUrl(ad.image))}" alt="${escapeHTML(ad.alt || ad.placement)}" loading="lazy" width="520" height="340"></div>
          <div class="admin-ad-card__body">
            <span class="eyebrow">${escapeHTML(ad.placement)}</span>
            <h3>${escapeHTML(ad.title)}</h3>
            <p>${escapeHTML(ad.description || '')}</p>
            <small>Destino: ${escapeHTML(relatedProduct ? `${relatedProduct.id} · ${relatedProduct.name}` : ad.productId)}</small>
            <button class="button button--outline button--small button--block" type="button" data-edit-ad="${escapeHTML(ad.id)}"><i class="fa-solid fa-pen" aria-hidden="true"></i> Editar creatividad</button>
          </div>
        </article>`;
    }).join('');
  };

  /** Cambia la vista activa del área de administración sin recargar la página. */
  document.querySelectorAll('[data-admin-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.adminView;
      document.querySelectorAll('[data-admin-view]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.querySelectorAll('.admin-view').forEach((view) => {
        view.hidden = view.id !== `admin-view-${target}`;
      });
    });
  });

  /** Llena el formulario de producto con los datos actuales del catálogo. */
  const openEditor = (productId) => {
    const product = getProducts().find((item) => item.id === productId);
    if (!product) return;

    activeId = product.id;
    const fields = {
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      compareAt: product.compareAt,
      stock: product.stock,
      image: product.image,
      imageFront: product.imageFront || 'assets/images/products/view-front-placeholder.svg',
      imagePair: product.imagePair || 'assets/images/products/view-pair-placeholder.svg',
      color1: product.colors?.[0] || 'Negro / Naranja',
      color2: product.colors?.[1] || '',
      color3: product.colors?.[2] || '',
      colorHex1: product.colorHexes?.[0] || '#292d35',
      colorHex2: product.colorHexes?.[1] || '#e7e4dd',
      colorHex3: product.colorHexes?.[2] || '#315c9a',
      color2Side: product.colorVariants?.[1]?.images?.side || '',
      color2Front: product.colorVariants?.[1]?.images?.front || '',
      color2Pair: product.colorVariants?.[1]?.images?.pair || '',
      color3Side: product.colorVariants?.[2]?.images?.side || '',
      color3Front: product.colorVariants?.[2]?.images?.front || '',
      color3Pair: product.colorVariants?.[2]?.images?.pair || '',
      description: product.description
    };

    Object.entries(fields).forEach(([fieldName, value]) => {
      const input = form.elements.namedItem(fieldName);
      if (input) input.value = value ?? '';
      const preview = form.querySelector(`[data-admin-image-preview="${fieldName}"]`)
        || form.querySelector(`[data-admin-variant-preview="${fieldName}"]`);
      if (preview) {
        preview.hidden = !value;
        if (value) preview.src = safeImageUrl(value);
      }
    });

    document.querySelector('#admin-form-title').textContent = `Editar ${product.name}`;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  /** Llena el modal con el anuncio editorial seleccionado. */
  const openAdEditor = (adId) => {
    const ad = getHomeAds().find((item) => item.id === adId);
    if (!ad) return;

    activeAdId = ad.id;
    renderAdProductOptions();
    ['id', 'placement', 'eyebrow', 'title', 'titleAccent', 'description', 'image', 'alt', 'ctaLabel', 'productId', 'badge'].forEach((field) => {
      adForm.elements.namedItem(field).value = ad[field] ?? '';
    });
    document.querySelector('#admin-ad-form-title').textContent = `Editar ${ad.placement}`;
    if (adDialog.showModal) adDialog.showModal();
    else adDialog.setAttribute('open', '');
  };

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-edit-product]');
    if (button) openEditor(button.dataset.editProduct);
  });

  adGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-edit-ad]');
    if (button) openAdEditor(button.dataset.editAd);
  });

  /** Actualiza las previsualizaciones de las galerías principal y alternativas. */
  [
    'image', 'imageFront', 'imagePair',
    'color2Side', 'color2Front', 'color2Pair',
    'color3Side', 'color3Front', 'color3Pair'
  ].forEach((fieldName) => {
    const input = form.elements.namedItem(fieldName);
    input?.addEventListener('input', () => {
      const preview = form.querySelector(`[data-admin-image-preview="${fieldName}"]`)
        || form.querySelector(`[data-admin-variant-preview="${fieldName}"]`);
      if (!preview) return;
      preview.hidden = !input.value.trim();
      if (input.value.trim()) preview.src = safeImageUrl(input.value);
    });
  });

  /** Valida y guarda el producto en el almacenamiento local de demostración. */
  /** Valida y guarda ficha, colores y galerías independientes en el catálogo local. */
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!activeId) {
      showToast('Selecciona un producto para editar.', 'error');
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const imageFields = ['image', 'imageFront', 'imagePair'];
    const invalidImage = imageFields.find((field) => !imagePathIsAllowed(String(data[field] || '').trim()));
    if (invalidImage) {
      showToast('Usa una ruta assets/ o una URL HTTPS en las tres imágenes principales.', 'error');
      form.elements.namedItem(invalidImage).focus();
      return;
    }

    const colorSlots = [1, 2, 3].map((index) => ({
      index,
      name: String(data['color' + index] || '').trim(),
      hex: String(data['colorHex' + index] || '').trim()
    }));
    if (!colorSlots[0].name) {
      showToast('El producto debe tener al menos un color.', 'error');
      form.elements.namedItem('color1').focus();
      return;
    }
    if (colorSlots[2].name && !colorSlots[1].name) {
      showToast('Configura el color 2 antes de agregar el color 3.', 'error');
      form.elements.namedItem('color2').focus();
      return;
    }
    const activeColorSlots = colorSlots.filter((slot) => slot.name);

    const colorVariants = activeColorSlots.map((slot, index) => {
      const number = slot.index;
      const images = number === 1
        ? {
          side: String(data.image || '').trim(),
          front: String(data.imageFront || '').trim(),
          pair: String(data.imagePair || '').trim()
        }
        : {
          side: String(data['color' + number + 'Side'] || '').trim(),
          front: String(data['color' + number + 'Front'] || '').trim(),
          pair: String(data['color' + number + 'Pair'] || '').trim()
        };
      return {
        id: activeId + '-color-' + number,
        name: slot.name,
        colorHex: /^#[0-9a-f]{6}$/i.test(slot.hex) ? slot.hex : ['#292d35', '#e7e4dd', '#315c9a'][index],
        images
      };
    });

    for (let index = 1; index < colorVariants.length; index += 1) {
      const variant = colorVariants[index];
      const values = Object.values(variant.images);
      const hasAnyImage = values.some(Boolean);
      const hasAllImages = values.every(Boolean);
      if (hasAnyImage && !hasAllImages) {
        showToast('Completa las tres vistas de ' + variant.name + ' o deja sus tres rutas vacías.', 'error');
        form.elements.namedItem('color' + (index + 1) + 'Side').focus();
        return;
      }
      if (values.some((value) => value && !imagePathIsAllowed(value))) {
        showToast('Las imágenes de variante deben usar rutas assets/ o URLs HTTPS.', 'error');
        return;
      }
    }

    const colors = colorVariants.map((variant) => variant.name);
    const colorHexes = colorVariants.map((variant) => variant.colorHex);
    [
      'color1', 'color2', 'color3', 'colorHex1', 'colorHex2', 'colorHex3',
      'color2Side', 'color2Front', 'color2Pair',
      'color3Side', 'color3Front', 'color3Pair'
    ].forEach((field) => delete data[field]);

    const updatedProducts = getProducts().map((product) => (
      product.id === activeId
        ? {
          ...product,
          ...data,
          price: Number(data.price),
          compareAt: Number(data.compareAt || 0),
          stock: Number(data.stock),
          image: String(data.image).trim(),
          imageFront: String(data.imageFront).trim(),
          imagePair: String(data.imagePair).trim(),
          colors,
          colorHexes,
          colorVariants,
          color: colors[0]
        }
        : product
    ));

    saveProducts(updatedProducts);
    renderProducts();
    closeProductEditor();
    showToast('Producto y galerías de color actualizados en este navegador.');
  });

  /** Valida los datos publicitarios y guarda la creatividad en el estado local. */
  adForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!adForm.reportValidity()) return;
    if (!activeAdId) return;

    const data = Object.fromEntries(new FormData(adForm).entries());
    const image = String(data.image || '').trim();
    if (!imagePathIsAllowed(image)) {
      showToast('La creatividad debe usar una ruta assets/ o una URL HTTPS.', 'error');
      adForm.elements.namedItem('image').focus();
      return;
    }

    const updatedAds = getHomeAds().map((ad) => (
      ad.id === activeAdId
        ? { ...ad, ...data, image, productId: String(data.productId) }
        : ad
    ));
    saveHomeAds(updatedAds);
    renderAds();
    closeAdEditor();
    showToast('Creatividad actualizada en este navegador.');
  });

  /** Cierra el editor de producto y reinicia su estado temporal. */
  function closeProductEditor() {
    activeId = null;
    form.reset();
    if (dialog.open) dialog.close();
  }

  /** Cierra el editor publicitario. */
  function closeAdEditor() {
    activeAdId = null;
    adForm.reset();
    if (adDialog.open) adDialog.close();
  }

  document.querySelector('#admin-cancel').addEventListener('click', closeProductEditor);
  document.querySelector('#admin-dialog-close').addEventListener('click', closeProductEditor);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeProductEditor();
  });
  document.querySelector('#admin-ad-cancel').addEventListener('click', closeAdEditor);
  document.querySelector('#admin-ad-dialog-close').addEventListener('click', closeAdEditor);
  adDialog.addEventListener('click', (event) => {
    if (event.target === adDialog) closeAdEditor();
  });

  /** Avanza el estado logístico y refresca también el inventario visible del catálogo. */
  document.querySelector('#admin-orders').addEventListener('click', (event) => {
    const button = event.target.closest('[data-order-status]');
    if (!button) return;
    const result = updateOrderStatus(button.dataset.orderStatus, button.dataset.nextStatus);
    if (!result.ok) {
      showToast(result.message, 'error');
      return;
    }
    renderDashboard();
    renderProducts();
    showToast(result.message);
  });

  /** Restablece catálogo, publicidad y actividad local para repetir las pruebas. */
  document.querySelector('#reset-demo').addEventListener('click', () => {
    const confirmed = confirm('¿Restablecer catálogo, publicidad, carrito, favoritos, perfil y pedidos de demostración?');
    if (!confirmed) return;
    resetDemoData();
    renderDashboard();
    renderProducts();
    renderAds();
    closeProductEditor();
    closeAdEditor();
    showToast('Datos demo restablecidos.');
  });

  renderAdProductOptions();
  renderDashboard();
  renderProducts();
  renderAds();

  // Si el cliente crea un pedido en otra pestaña del mismo navegador,
  // el Dashboard lo incorpora sin exigir una recarga manual.
  window.addEventListener('storage', (event) => {
    if (event.key === `${CONFIG.storagePrefix}:orders`) renderDashboard();
    if (event.key === `${CONFIG.storagePrefix}:products`) {
      renderDashboard();
      renderProducts();
    }
  });
}
