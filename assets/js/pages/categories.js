// Filtros y resultados del catálogo de productos.
import { getProducts } from '../core/store.js';
import { CATEGORIES, getCategoryName } from '../data/products.js';
import { renderProducts } from '../core/ui.js';

/** Prepara filtros por categoría, búsqueda, precio y orden de catálogo. */
export function initCategories() {
  const products = getProducts();
  const grid = document.querySelector('#category-products');
  const params = new URLSearchParams(location.search);
  const category = document.querySelector('#category-filter');
  const search = document.querySelector('#catalog-search');
  const sort = document.querySelector('#catalog-sort');
  const price = document.querySelector('#max-price');
  const priceLabel = document.querySelector('#max-price-value');
  const filters = document.querySelector('#catalog-filters');
  const filterButton = document.querySelector('#mobile-filter-toggle');

  const categories = CATEGORIES;
  const productPrices = products.map((product) => Number(product.price) || 0);
  const maxProductPrice = Math.max(...productPrices, 0);
  const priceCeiling = Math.ceil(maxProductPrice + 50);
  price.max = String(priceCeiling);
  price.value = String(priceCeiling);
  price.min = '80';
  category.innerHTML = `<option value="">Todas</option>${categories.map((item) => (
    `<option value="${item.id}">${item.name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</option>`
  )).join('')}`;

  if (params.get('category')) {
    const requestedCategory = params.get('category');
    const match = categories.find((item) => (
      item.id === requestedCategory
      || item.name.toLocaleLowerCase('es') === requestedCategory.toLocaleLowerCase('es')
    ));
    category.value = match?.id || '';
  }
  if (params.get('q')) search.value = params.get('q');

  /** Aplica los criterios actuales y vuelve a pintar el listado. */
  const updateResults = () => {
    const term = search.value.toLowerCase().trim();
    const selectedCategory = category.value;
    const maxPrice = Number(price.value);

    let filtered = products.filter((product) => (
      (!selectedCategory || product.category === selectedCategory)
      && product.price <= maxPrice
      && `${product.name} ${product.brand} ${getCategoryName(product.category)}`.toLocaleLowerCase('es').includes(term)
    ));

    if (sort.value === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort.value === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sort.value === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    priceLabel.textContent = `$${maxPrice}`;
    renderProducts(filtered, grid, 'Prueba con otra búsqueda o cambia los filtros.');
    document.querySelector('#results-count').textContent = `${filtered.length} productos`;

    // Describe el listado actualmente visible mediante schema.org ItemList.
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: filtered.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: new URL(`producto.html?id=${encodeURIComponent(product.id)}`, location.href).href
      }))
    };
    let schemaScript = document.querySelector('#catalog-jsonld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'catalog-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.append(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(itemListSchema);
  };

  [category, search, sort, price].forEach((control) => {
    control.addEventListener(control === search ? 'input' : 'change', updateResults);
  });

  document.querySelector('#clear-filters').addEventListener('click', () => {
    category.value = '';
    search.value = '';
    sort.value = 'featured';
    price.value = String(priceCeiling);
    updateResults();
  });

  filterButton.addEventListener('click', () => {
    const expanded = filters.classList.toggle('is-open');
    filterButton.setAttribute('aria-expanded', String(expanded));
  });

  updateResults();
}
