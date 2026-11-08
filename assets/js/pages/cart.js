// Lógica del carrito: cantidades, eliminación, descuentos y cálculo de totales.
import {
  getCartItems,
  updateCartItem,
  removeCartItem,
  calculateTotals,
  applyCoupon,
  removeCoupon
} from '../core/store.js';
import { money, safeImageUrl, escapeHTML, showToast } from '../core/ui.js';
import { getCategoryName } from '../data/products.js';

/** Renderiza el carrito y mantiene sincronizados sus importes visibles. */
export function initCart() {
  const list = document.querySelector('#cart-items');
  const empty = document.querySelector('#cart-empty');
  const summary = document.querySelector('#cart-summary');

  /** Reconstruye líneas, estado vacío y resumen después de cada operación. */
  const renderCart = () => {
    const items = getCartItems();
    empty.hidden = items.length > 0;
    list.hidden = !items.length;
    summary.hidden = !items.length;

    list.innerHTML = items.map((item) => `
      <article class="cart-line">
        <a href="producto.html?id=${encodeURIComponent(item.product.id)}" class="cart-line__image">
          <img src="${escapeHTML(safeImageUrl(item.product.image))}" alt="${escapeHTML(item.product.name)}" width="140" height="100">
        </a>
        <div class="cart-line__details">
          <span class="eyebrow">${escapeHTML(getCategoryName(item.product.category))}</span>
          <h2><a href="producto.html?id=${encodeURIComponent(item.product.id)}">${escapeHTML(item.product.name)}</a></h2>
          <p>Talla: ${escapeHTML(item.size)} · ${escapeHTML(item.color)}</p>
          <strong>${money(item.product.price)}</strong>
        </div>
        <div class="cart-line__controls">
          <div class="quantity-control" aria-label="Cantidad">
            <button type="button" data-qty="-1" data-index="${item.index}" aria-label="Disminuir cantidad">−</button>
            <output>${item.quantity}</output>
            <button type="button" data-qty="1" data-index="${item.index}" aria-label="Aumentar cantidad">+</button>
          </div>
          <button class="text-link text-link--danger" type="button" data-remove="${item.index}">
            <i class="fa-regular fa-trash-can" aria-hidden="true"></i> Quitar
          </button>
        </div>
      </article>`).join('');

    const totals = calculateTotals();
    document.querySelector('[data-subtotal]').textContent = money(totals.subtotal);
    document.querySelector('[data-discount]').textContent = `− ${money(totals.discount)}`;
    document.querySelector('[data-shipping]').textContent = totals.shipping === 0
      ? 'Gratis'
      : money(totals.shipping);
    document.querySelector('[data-total]').textContent = money(totals.total);
    document.querySelector('[data-applied-coupon]').textContent = totals.coupon
      ? `Código ${totals.coupon} aplicado`
      : '';
  };

  /** Procesa los controles de cantidad y la acción de quitar un producto. */
  list.addEventListener('click', (event) => {
    const quantityButton = event.target.closest('[data-qty]');
    const removeButton = event.target.closest('[data-remove]');

    if (quantityButton) {
      const index = Number(quantityButton.dataset.index);
      const item = getCartItems().find((entry) => entry.index === index);

      if (item) {
        const nextQuantity = item.quantity + Number(quantityButton.dataset.qty);
        const otherVariantQuantity = getCartItems()
          .filter((entry) => entry.product.id === item.product.id && entry.index !== index)
          .reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);
        const availableForLine = Math.max(0, Number(item.product.stock) - otherVariantQuantity);

        if (nextQuantity > availableForLine) {
          showToast(`Inventario disponible para las otras variantes: ${availableForLine} unidades.`, 'error');
        } else {
          updateCartItem(index, nextQuantity);
        }
      }

      renderCart();
      document.dispatchEvent(new CustomEvent('shoex:cart-updated'));
    }

    if (removeButton) {
      removeCartItem(Number(removeButton.dataset.remove));
      renderCart();
      showToast('Producto eliminado del carrito.');
      document.dispatchEvent(new CustomEvent('shoex:cart-updated'));
    }
  });

  /** Valida el código promocional y presenta el nuevo total. */
  document.querySelector('#coupon-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const code = document.querySelector('#coupon-code').value;
    const result = applyCoupon(code);
    showToast(result.message, result.ok ? 'success' : 'error');
    renderCart();
  });

  /** Retira el descuento aplicado al carrito actual. */
  document.querySelector('[data-remove-coupon]').addEventListener('click', () => {
    removeCoupon();
    renderCart();
    showToast('Código promocional retirado.');
  });

  renderCart();
}
