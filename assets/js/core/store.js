// Estado de productos, carrito, favoritos, perfil y pedidos del prototipo.
import { CONFIG } from '../config.js';
import { INITIAL_PRODUCTS, HOME_ADS, CATALOG_VERSION } from '../data/products.js';
import { readStorage, writeStorage, removeStorage } from './storage.js';

/** Construye la clave namespaced que utiliza cada entidad persistida. */
const key = (name) => `${CONFIG.storagePrefix}:${name}`;

/** Estados logísticos utilizados por el flujo de preparación y despacho. */
export const ORDER_STATUSES = Object.freeze({
  pending: { label: 'Pendiente', next: 'packed', action: 'Marcar como empacado' },
  packed: { label: 'Empacado', next: 'processed', action: 'Marcar como procesado' },
  processed: { label: 'Procesado', next: null, action: 'Pedido procesado' }
});

/** Devuelve la clave de estado compatible con pedidos actuales y versiones anteriores. */
export function getOrderFulfillmentStatus(orderOrStatus) {
  const rawStatus = typeof orderOrStatus === 'string'
    ? orderOrStatus
    : orderOrStatus?.fulfillmentStatus;
  if (Object.hasOwn(ORDER_STATUSES, rawStatus)) return rawStatus;

  // Compatibilidad con pedidos creados antes del flujo logístico 2.5.0.
  if (typeof orderOrStatus === 'object' && orderOrStatus?.adminStatus === 'effective') {
    return 'processed';
  }
  return 'pending';
}

/** Devuelve la etiqueta visible de un estado de pedido. */
export function getOrderStatusLabel(orderOrStatus) {
  const status = getOrderFulfillmentStatus(orderOrStatus);
  return ORDER_STATUSES[status].label;
}

/**
 * Devuelve el catálogo activo.
 * Si cambia el catálogo publicado en products.js, actualiza una sola vez la copia
 * local y conserva el resto de datos demo (carrito, favoritos, perfil y pedidos).
 */
function syncPublishedCatalog() {
  const savedVersion = readStorage(key('catalogVersion'), null);
  if (savedVersion === CATALOG_VERSION) return;

  // Una publicación nueva reemplaza el catálogo y los anuncios locales antiguos,
  // pero deja intactos carrito, favoritos, perfil e historial de pedidos.
  writeStorage(key('products'), INITIAL_PRODUCTS);
  writeStorage(key('homeAds'), HOME_ADS);
  writeStorage(key('catalogVersion'), CATALOG_VERSION);
}

export function getProducts() {
  syncPublishedCatalog();
  const saved = readStorage(key('products'), null);
  if (Array.isArray(saved) && saved.length) return saved;
  writeStorage(key('products'), INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

/** Devuelve las creatividades publicitarias del Home, separadas de las imágenes de producto. */
export function getHomeAds() {
  syncPublishedCatalog();
  const saved = readStorage(key('homeAds'), null);
  return Array.isArray(saved) && saved.length ? saved : HOME_ADS;
}

/** Guarda localmente los cambios de publicidad realizados en el panel demo. */
export function saveHomeAds(items) {
  return writeStorage(key('homeAds'), items);
}

/** Guarda el catálogo editado desde el panel de administración demo. */
export function saveProducts(items) {
  return writeStorage(key('products'), items);
}

/** Busca un producto por su identificador estable. */
export function getProduct(id) {
  return getProducts().find((product) => product.id === id) || null;
}

/** Obtiene las líneas actuales del carrito. */
export function getCart() {
  return readStorage(key('cart'), []);
}

/** Persiste el carrito después de cualquier operación. */
export function saveCart(items) {
  writeStorage(key('cart'), items);
}

/** Añade una variante al carrito y valida el stock disponible. */
export function addToCart(productId, size, color, quantity = 1, selectedImage = '') {
  const product = getProduct(productId);
  if (!product) return { ok: false, message: 'No encontramos este producto.' };
  const availableStock = Number(product.stock);
  if (!Number.isSafeInteger(availableStock) || availableStock <= 0) {
    return { ok: false, message: 'Este producto está agotado.' };
  }

  const cart = getCart();
  const existingItem = cart.find((item) => (
    item.productId === productId
    && String(item.size) === String(size)
    && item.color === color
  ));
  const requestedQuantity = Number(quantity);
  if (!Number.isSafeInteger(requestedQuantity) || requestedQuantity <= 0) {
    return { ok: false, message: 'La cantidad solicitada no es válida.' };
  }
  const totalProductQuantity = cart
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  if (totalProductQuantity + requestedQuantity > availableStock) {
    return { ok: false, message: `Disponibles para todas las variantes: ${availableStock} unidades.` };
  }

  const image = String(selectedImage || product.image || '').trim();
  if (existingItem) {
    existingItem.quantity += requestedQuantity;
    if (image) existingItem.image = image;
  } else {
    cart.push({ productId, size: String(size), color, quantity: requestedQuantity, image });
  }

  saveCart(cart);
  return { ok: true, message: 'Producto añadido al carrito.' };
}

/**
 * Cambia la cantidad de una línea, limita el máximo al stock local y elimina
 * la línea cuando la cantidad solicitada llega a cero.
 */
export function updateCartItem(index, quantity) {
  const cart = getCart();
  const item = cart[index];
  if (!item) return false;

  const requestedQuantity = Number(quantity);
  if (!Number.isSafeInteger(requestedQuantity)) return false;

  if (requestedQuantity <= 0) {
    cart.splice(index, 1);
  } else {
    const product = getProduct(item.productId);
    const stock = Math.max(0, Number(product?.stock) || 0);
    const otherVariantQuantity = cart.reduce((sum, cartItem, cartIndex) => (
      cartIndex !== index && cartItem.productId === item.productId
        ? sum + Number(cartItem.quantity || 0)
        : sum
    ), 0);
    const availableForLine = Math.max(0, stock - otherVariantQuantity);
    if (!availableForLine) return false;
    item.quantity = Math.min(requestedQuantity, availableForLine);
  }

  saveCart(cart);
  return true;
}

/** Elimina una línea del carrito por su índice actual. */
export function removeCartItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

/** Vacía por completo el carrito después de crear un pedido. */
export function clearCart() {
  saveCart([]);
}

/**
 * Enriquece cada línea del carrito con los datos actuales del producto.
 * También descarta referencias a productos que ya no estén en el catálogo.
 */
export function getCartItems() {
  const products = getProducts();
  return getCart()
    .map((item, index) => {
      const product = products.find((entry) => entry.id === item.productId);
      return {
        ...item,
        index,
        product: product ? { ...product, image: item.image || product.image } : null
      };
    })
    .filter((item) => item.product);
}

/** Devuelve los identificadores de productos marcados como favoritos. */
export function getFavorites() {
  return readStorage(key('favorites'), []);
}

/** Añade o elimina un favorito y devuelve su estado resultante. */
export function toggleFavorite(id) {
  const current = getFavorites();
  const alreadySaved = current.includes(id);
  const next = alreadySaved
    ? current.filter((item) => item !== id)
    : [...current, id];

  writeStorage(key('favorites'), next);
  return !alreadySaved;
}

/** Devuelve el perfil local o un objeto vacío con sus campos conocidos. */
export function getProfile() {
  return readStorage(key('profile'), {
    name: '',
    email: '',
    phone: '',
    phoneCountryCode: '+57',
    phoneNumber: '',
    address: '',
    city: '',
    department: '',
    postalCode: ''
  });
}

/** Guarda los datos de contacto introducidos por el usuario. */
export function saveProfile(profile) {
  return writeStorage(key('profile'), profile);
}

/** Calcula subtotal, descuento, envío, total y cantidad de artículos. */
export function calculateTotals() {
  const items = getCartItems();
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const coupon = readStorage(key('coupon'), null);
  const discount = coupon?.code === CONFIG.promoCode
    ? subtotal * CONFIG.promoRate
    : 0;
  const shipping = CONFIG.freeShipping || subtotal === 0 ? 0 : CONFIG.shippingFee;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(0, subtotal - discount + shipping),
    itemCount,
    coupon: coupon?.code || ''
  };
}

/** Valida y activa el código promocional configurado para la demostración. */
export function applyCoupon(code) {
  const normalized = String(code || '').trim().toUpperCase();
  if (normalized !== CONFIG.promoCode) {
    return { ok: false, message: 'El código no es válido.' };
  }

  writeStorage(key('coupon'), { code: normalized });
  return { ok: true, message: 'Descuento aplicado correctamente.' };
}

/** Elimina el código promocional aplicado al carrito actual. */
export function removeCoupon() {
  writeStorage(key('coupon'), null);
}

/**
 * Crea una orden local con una copia de los productos, variantes y datos de entrega.
 * Vuelve a validar el inventario para evitar confirmar cantidades que ya no existen.
 */
export function createOrder(customer, notes = '') {
  const items = getCartItems();
  if (!items.length) return { ok: false, message: 'Tu carrito está vacío.' };

  const requiredByProduct = new Map();
  items.forEach((item) => {
    requiredByProduct.set(
      item.productId,
      (requiredByProduct.get(item.productId) || 0) + Number(item.quantity)
    );
  });
  const unavailableItem = items.find((item) => (
    Number(item.product.stock) < requiredByProduct.get(item.productId)
  ));
  if (unavailableItem) {
    const required = requiredByProduct.get(unavailableItem.productId);
    return {
      ok: false,
      message: `Stock insuficiente para ${unavailableItem.product.name}. Se requieren ${required} y hay ${unavailableItem.product.stock} unidad(es).`
    };
  }

  const totals = calculateTotals();
  const createdAt = new Date().toISOString();
  const order = {
    id: `SHX-${createdAt.slice(0, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    createdAt,
    status: ORDER_STATUSES.pending.label,
    fulfillmentStatus: 'pending',
    fulfillmentHistory: [{ status: 'pending', at: createdAt }],
    inventoryDeductedAt: null,
    customer,
    deliveryNotes: notes,
    items: items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      lineTotal: Number(item.product.price) * item.quantity,
      image: item.image || item.product.image
    })),
    totals
  };

  const orders = getOrders();
  orders.unshift(order);
  if (!writeStorage(key('orders'), orders)) {
    return { ok: false, message: 'No pudimos guardar el pedido en este navegador. Inténtalo nuevamente.' };
  }

  saveProfile({ ...getProfile(), ...customer });
  clearCart();
  removeCoupon();
  return { ok: true, order };
}

/** Recupera una orden local por su identificador. */
export function getOrder(id) {
  return getOrders().find((order) => order.id === id) || null;
}

/**
 * Devuelve y migra, una sola vez, los pedidos guardados por versiones anteriores.
 * Los antiguos "efectivos" pasan a "procesados" sin descontar stock retroactivamente.
 */
export function getOrders() {
  const storedOrders = readStorage(key('orders'), []);
  if (!Array.isArray(storedOrders)) return [];

  let migrated = false;
  const orders = storedOrders.map((order) => {
    if (Object.hasOwn(ORDER_STATUSES, order.fulfillmentStatus)) return order;

    migrated = true;
    const fulfillmentStatus = order.adminStatus === 'effective' ? 'processed' : 'pending';
    const migratedAt = order.adminStatusUpdatedAt || order.createdAt || new Date().toISOString();
    return {
      ...order,
      fulfillmentStatus,
      status: ORDER_STATUSES[fulfillmentStatus].label,
      fulfillmentHistory: [{ status: fulfillmentStatus, at: migratedAt, legacy: true }],
      // Los pedidos antiguos ya marcados como efectivos no deben provocar
      // un descuento de inventario duplicado al migrarse.
      inventoryDeductedAt: fulfillmentStatus === 'processed' ? 'legacy-not-deducted' : null,
      legacyStatusMigration: true
    };
  });

  if (migrated) writeStorage(key('orders'), orders);
  return orders;
}

/**
 * Avanza el pedido por la secuencia Pendiente → Empacado → Procesado.
 * Al procesarlo valida y descuenta el inventario una sola vez por pedido.
 */
export function updateOrderStatus(orderId, nextStatus) {
  const orders = getOrders();
  const order = orders.find((item) => item.id === orderId);
  if (!order) return { ok: false, message: 'No encontramos ese pedido.' };

  const currentStatus = getOrderFulfillmentStatus(order);
  const expectedNextStatus = ORDER_STATUSES[currentStatus].next;
  if (!expectedNextStatus) {
    return { ok: false, message: 'Este pedido ya está procesado.' };
  }
  if (nextStatus !== expectedNextStatus) {
    return { ok: false, message: `El siguiente estado permitido es ${ORDER_STATUSES[expectedNextStatus].label}.` };
  }

  const now = new Date().toISOString();
  let previousProducts = null;

  if (nextStatus === 'processed' && !order.inventoryDeductedAt) {
    if (!Array.isArray(order.items) || !order.items.length) {
      return { ok: false, message: 'El pedido no contiene artículos para descontar del inventario.' };
    }

    previousProducts = getProducts();
    const quantitiesByProduct = new Map();
    for (const item of order.items) {
      const quantity = Number(item.quantity);
      if (!item.productId || !Number.isInteger(quantity) || quantity <= 0) {
        return { ok: false, message: 'El detalle del pedido contiene una cantidad o referencia no válida.' };
      }
      quantitiesByProduct.set(
        item.productId,
        (quantitiesByProduct.get(item.productId) || 0) + quantity
      );
    }

    for (const [productId, requiredQuantity] of quantitiesByProduct.entries()) {
      const product = previousProducts.find((item) => item.id === productId);
      if (!product) {
        return { ok: false, message: `El producto ${productId} ya no existe en el catálogo. No se procesó el pedido.` };
      }
      const availableStock = Number(product.stock);
      if (!Number.isFinite(availableStock) || availableStock < requiredQuantity) {
        return {
          ok: false,
          message: `Inventario insuficiente para ${product.name}. Se requieren ${requiredQuantity} y hay ${Number.isFinite(availableStock) ? availableStock : 0}.`
        };
      }
    }

    const updatedProducts = previousProducts.map((product) => {
      const quantity = quantitiesByProduct.get(product.id) || 0;
      return quantity
        ? { ...product, stock: Math.max(0, Number(product.stock) - quantity) }
        : product;
    });

    if (!saveProducts(updatedProducts)) {
      return { ok: false, message: 'No se pudo actualizar el inventario. El pedido conserva su estado empacado.' };
    }
    order.inventoryDeductedAt = now;
  }

  order.fulfillmentStatus = nextStatus;
  order.status = ORDER_STATUSES[nextStatus].label;
  order.adminStatusUpdatedAt = now;
  order.fulfillmentHistory = Array.isArray(order.fulfillmentHistory)
    ? order.fulfillmentHistory
    : [];
  order.fulfillmentHistory.push({ status: nextStatus, at: now });

  if (!writeStorage(key('orders'), orders)) {
    // Si falla el guardado de la orden, se restaura el inventario previo.
    if (previousProducts) saveProducts(previousProducts);
    return { ok: false, message: 'No pudimos guardar el estado del pedido. Se revirtió el cambio de inventario.' };
  }

  return {
    ok: true,
    message: nextStatus === 'processed'
      ? 'Pedido procesado. El inventario se actualizó correctamente.'
      : 'Pedido marcado como empacado.'
  };
}

/** Restablece catálogo y datos de sesión para repetir el recorrido demo. */
export function resetDemoData() {
  writeStorage(key('products'), INITIAL_PRODUCTS);
  writeStorage(key('homeAds'), HOME_ADS);
  writeStorage(key('catalogVersion'), CATALOG_VERSION);
  writeStorage(key('cart'), []);
  writeStorage(key('favorites'), []);
  writeStorage(key('profile'), {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    postalCode: ''
  });
  writeStorage(key('orders'), []);
  removeStorage(key('coupon'));
}
