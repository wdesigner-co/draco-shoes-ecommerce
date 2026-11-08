// Vista final del pedido y creación del mensaje que se comparte por WhatsApp.
import { getOrder, getOrderStatusLabel } from '../core/store.js';
import { CONFIG } from '../config.js';
import { money, escapeHTML, showToast } from '../core/ui.js';

/** Recupera la orden local, resume sus artículos y arma el enlace wa.me. */
export function initOrderSuccess() {
  const orderId = new URLSearchParams(location.search).get('order')
    || sessionStorage.getItem('shoex-last-order');
  const order = orderId ? getOrder(orderId) : null;
  const root = document.querySelector('#order-success');
  if (!root) return;

  if (!order) {
    root.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-receipt" aria-hidden="true"></i>
        <h1>No encontramos el pedido</h1>
        <p>Vuelve al catálogo para iniciar una compra de demostración.</p>
        <a class="button button--primary" href="index.html">Ir a la tienda</a>
      </div>`;
    return;
  }

  const message = [
    `Hola, quiero confirmar mi pedido en ${CONFIG.storeName}.`,
    `Pedido: ${order.id}`,
    '',
    'PRODUCTOS:',
    ...order.items.map((item, index) => (
      `${index + 1}. ${item.name}\n   Talla: ${item.size} | Color: ${item.color} | Cantidad: ${item.quantity}\n   Precio: ${money(item.price)} | Total: ${money(item.lineTotal)}`
    )),
    '',
    `Subtotal: ${money(order.totals.subtotal)}`,
    `Descuento: ${money(order.totals.discount)}`,
    `Envío: ${order.totals.shipping === 0 ? 'Gratis' : money(order.totals.shipping)}`,
    `TOTAL: ${money(order.totals.total)}`,
    '',
    'DATOS DE ENTREGA:',
    `Nombre: ${order.customer.name}`,
    `Teléfono: ${order.customer.phone}`,
    `Correo: ${order.customer.email}`,
    `Dirección: ${order.customer.address}`,
    `Ciudad: ${order.customer.city}`,
    `Departamento: ${order.customer.department}`,
    `Código postal: ${order.customer.postalCode || 'No indicado'}`,
    `Notas: ${order.deliveryNotes || 'Sin notas'}`,
    '',
    'Quedo atento/a a la confirmación del pedido. Gracias.'
  ].join('\n');

  const phone = String(CONFIG.sellerWhatsApp).replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

  root.innerHTML = `
    <div class="success-icon"><i class="fa-solid fa-check" aria-hidden="true"></i></div>
    <p class="eyebrow">Pedido creado correctamente</p>
    <h1>¡Gracias por tu compra!</h1>
    <p class="success-lead">Tu pedido <strong>${escapeHTML(order.id)}</strong> quedó registrado en este prototipo. Envíalo al vendedor por WhatsApp para confirmar disponibilidad y entrega.</p>
    <div class="success-summary">
      <div><span>Estado</span><strong>${escapeHTML(getOrderStatusLabel(order))}</strong></div>
      <div><span>Total</span><strong>${money(order.totals.total)}</strong></div>
      <div><span>Artículos</span><strong>${itemCount}</strong></div>
    </div>
    <div class="success-actions">
      <a class="button button--primary" id="send-whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Enviar pedido por WhatsApp
      </a>
      <a class="button button--outline" href="index.html">Seguir comprando</a>
    </div>
    <p class="helper-text">WhatsApp abrirá el mensaje con productos, tallas, cantidades, totales y datos de entrega. Revisa y pulsa Enviar.</p>`;

  /** Informa que se abrirá la aplicación externa de mensajería. */
  root.querySelector('#send-whatsapp').addEventListener('click', () => {
    showToast('Abriendo WhatsApp con el detalle del pedido.');
  });
}
