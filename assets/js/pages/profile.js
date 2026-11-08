// Perfil básico y consulta del historial de pedidos guardados localmente.
import { getProfile, saveProfile, getOrders, getOrderStatusLabel, getOrderFulfillmentStatus } from '../core/store.js';
import { money, escapeHTML, showToast } from '../core/ui.js';
import { CONFIG } from '../config.js';

/** Carga el perfil, guarda cambios y muestra las órdenes de esta sesión local. */
export function initProfile() {
  const form = document.querySelector('#profile-form');
  const profile = getProfile();

  Object.entries(profile).forEach(([fieldName, value]) => {
    const field = form.elements.namedItem(fieldName);
    if (field) field.value = value;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    saveProfile(data);
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
