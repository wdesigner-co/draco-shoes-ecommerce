// Formulario de entrega, selección visual de método y creación de pedido demo.
import {
  getCartItems,
  calculateTotals,
  createOrder,
  getProfile
} from '../core/store.js';
import { money, safeImageUrl, escapeHTML, showToast } from '../core/ui.js';

/** Prepara el resumen, precarga el perfil y valida el cierre de compra. */
export function initCheckout() {
  const items = getCartItems();
  const form = document.querySelector('#checkout-form');
  const list = document.querySelector('#checkout-items');
  if (!form || !list) return;

  if (!items.length) {
    document.querySelector('#checkout-empty').hidden = false;
    form.hidden = true;
    document.querySelector('.checkout-summary').hidden = true;
    return;
  }

  list.innerHTML = items.map((item) => `
    <li>
      <img src="${escapeHTML(safeImageUrl(item.product.image))}" alt="" width="64" height="48">
      <span>${escapeHTML(item.product.name)} <small>· Talla ${escapeHTML(item.size)} · x${item.quantity}</small></span>
      <strong>${money(item.product.price * item.quantity)}</strong>
    </li>`).join('');

  const totals = calculateTotals();
  document.querySelector('[data-checkout-subtotal]').textContent = money(totals.subtotal);
  document.querySelector('[data-checkout-discount]').textContent = `− ${money(totals.discount)}`;
  document.querySelector('[data-checkout-shipping]').textContent = totals.shipping === 0
    ? 'Gratis'
    : money(totals.shipping);
  document.querySelector('[data-checkout-total]').textContent = money(totals.total);

  const profile = getProfile();
  ['name', 'email', 'phone', 'address', 'city', 'department', 'postalCode'].forEach((fieldName) => {
    const field = form.elements.namedItem(fieldName);
    if (field && profile[fieldName]) field.value = profile[fieldName];
  });

  /** Muestra el modal informativo para una pasarela que no está integrada. */
  document.querySelectorAll('[data-payment-unavailable]').forEach((button) => {
    button.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('shoex:modal', {
        detail: {
          title: 'Medio de pago no habilitado',
          message: `${button.dataset.paymentUnavailable} se muestra como referencia de diseño, pero no tiene integración activa. Para confirmar el pedido utiliza WhatsApp.`
        }
      }));
    });
  });

  /** Valida los datos y crea la orden local antes de abrir su página de éxito. */
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const customer = Object.fromEntries(
      ['name', 'email', 'phone', 'address', 'city', 'department', 'postalCode']
        .map((fieldName) => [fieldName, String(data.get(fieldName) || '').trim()])
    );
    const result = createOrder(customer, String(data.get('notes') || '').trim());

    if (!result.ok) {
      showToast(result.message, 'error');
      return;
    }

    const { order } = result;
    sessionStorage.setItem('shoex-last-order', order.id);
    location.href = `pedido-exitoso.html?order=${encodeURIComponent(order.id)}`;
  });
}
