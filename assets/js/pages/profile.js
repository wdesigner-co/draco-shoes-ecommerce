// Perfil básico, teléfono internacional e historial local de pedidos.
import { getProfile, saveProfile, getOrders, getOrderStatusLabel, getOrderFulfillmentStatus } from '../core/store.js';
import { money, escapeHTML, showToast } from '../core/ui.js';
import { CONFIG } from '../config.js';

const PHONE_CODES = ['+1', '+57', '+58'];

/** Separa códigos internacionales conocidos de teléfonos guardados por versiones anteriores. */
function readPhoneFields(profile) {
  const storedCode = PHONE_CODES.includes(profile.phoneCountryCode) ? profile.phoneCountryCode : '';
  const storedNumber = String(profile.phoneNumber || '').trim();
  const legacyPhone = String(profile.phone || '').trim();
  const match = legacyPhone.match(/^\s*(\+1|\+57|\+58)\s*(.*)$/);
  return {
    phoneCountryCode: storedCode || match?.[1] || '+57',
    phoneNumber: storedNumber || (match ? match[2] : legacyPhone)
  };
}

/** Carga datos, conserva teléfonos antiguos y presenta el historial de pedidos. */
export function initProfile() {
  const form = document.querySelector('#profile-form');
  if (!form) return;

  const profile = getProfile();
  Object.entries(profile).forEach(([fieldName, value]) => {
    if (['phone', 'phoneCountryCode', 'phoneNumber'].includes(fieldName)) return;
    const field = form.elements.namedItem(fieldName);
    if (field) field.value = value ?? '';
  });

  const phone = readPhoneFields(profile);
  const countryField = form.elements.namedItem('phoneCountryCode');
  const numberField = form.elements.namedItem('phoneNumber');
  if (countryField) countryField.value = phone.phoneCountryCode;
  if (numberField) numberField.value = phone.phoneNumber;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const phoneCountryCode = PHONE_CODES.includes(data.phoneCountryCode) ? data.phoneCountryCode : '+57';
    const digits = phoneCountryCode.replace('+', '');
    const rawNumber = String(data.phoneNumber || '').trim();
    const phoneNumber = rawNumber.replace(new RegExp('^\\+?' + digits + '\\s*'), '').trim();

    saveProfile({
      ...getProfile(),
      ...data,
      phoneCountryCode,
      phoneNumber,
      // Mantiene compatibilidad con checkout, pedidos e historial de versiones previas.
      phone: phoneNumber ? phoneCountryCode + ' ' + phoneNumber : ''
    });
    showToast('Datos guardados en este navegador.');
  });

  const list = document.querySelector('#profile-orders');
  const renderOrderHistory = () => {
    const orders = getOrders();
    list.innerHTML = orders.length
      ? orders.map((order) => {
        const status = getOrderFulfillmentStatus(order);
        const itemsSummary = (order.items || []).map((item) => `${item.name} × ${item.quantity}`).join(' · ');
        return `
          <article class="order-history-card">
            <div>
              <strong>${escapeHTML(order.id)}</strong>
              <span>${new Date(order.createdAt).toLocaleDateString('es-CO')}</span>
            </div>
            <div>
              <strong>${money(order.totals?.total || 0)}</strong>
              <span class="order-status-badge is-${status}">${escapeHTML(getOrderStatusLabel(order))}</span>
            </div>
            <p class="order-history-card__items">${escapeHTML(itemsSummary)}</p>
            <a class="text-link" href="pedido-exitoso.html?order=${encodeURIComponent(order.id)}">Ver pedido</a>
          </article>`;
      }).join('')
      : '<p class="helper-text">Todavía no tienes pedidos en este navegador.</p>';
  };

  renderOrderHistory();
  window.addEventListener('storage', (event) => {
    if (event.key === `${CONFIG.storagePrefix}:orders`) renderOrderHistory();
  });
}
