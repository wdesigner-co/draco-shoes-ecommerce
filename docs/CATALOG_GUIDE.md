# Guía de catálogo y publicidad — ShoeX 2.4.0

La fuente editable del catálogo y de las creatividades de inicio es `assets/js/data/products.js`. No es necesario modificar HTML para cambiar nombres, fotografías, categorías, banners o productos destacados.

## 1. Las tres fotografías de cada producto

Cada producto tiene tres campos de imagen independientes:

| Campo | Vista | Uso en la ficha |
|---|---|---|
| `image` | Lateral | Primera imagen y vista principal |
| `imageFront` | Frontal | Segunda imagen de la galería |
| `imagePair` | Par completo | Tercera imagen de la galería |

Ejemplo:

```js
{
  id: 'SHX-001',
  name: 'Air Max Pro 270',
  image: 'assets/images/products/shx-001-lateral.webp',
  imageFront: 'assets/images/products/shx-001-frontal.webp',
  imagePair: 'assets/images/products/shx-001-par.webp'
}
```

Los archivos deben estar dentro de `assets/images/products/`. Las tres imágenes aparecen en la galería con puntos de paginación y son independientes de cualquier banner publicitario.

### Medidas y preparación recomendadas

- **Lienzo recomendado:** 1200 × 900 px (relación 4:3) para las tres vistas.
- **Formato:** WebP; AVIF también es válido en navegadores modernos, pero WebP ofrece una compatibilidad más amplia.
- **Peso orientativo:** 100–220 KB por imagen; procura no superar 300 KB salvo que el detalle lo justifique.
- **Encuadre:** fondo uniforme blanco cálido o gris muy claro; producto centrado, sin cortar su silueta y ocupando aproximadamente 72–82% del área útil.
- **Consistencia:** las tres vistas del mismo modelo deben conservar escala, iluminación, fondo, color y distancia de cámara.
- **Vista lateral:** calzado completo de perfil, punta y talón visibles.
- **Vista frontal:** producto orientado hacia la cámara, simétrico y centrado.
- **Vista del par:** ambos zapatos visibles, separados ligeramente y sin superponerse de forma que oculten sus siluetas.
- **Accesibilidad:** los textos alternativos se generan con el nombre del producto y la vista correspondiente.

Para 20 productos se prepararán hasta 60 fotografías. Los archivos SVG `view-front-placeholder.svg` y `view-pair-placeholder.svg` son recursos provisionales compartidos. Sustitúyelos en cada producto por las fotografías definitivas mediante las rutas `imageFront` e `imagePair`.

## 2. Cambiar nombre, precio, stock o descripción

Busca el producto por su ID estable dentro de `INITIAL_PRODUCTS` y modifica los campos requeridos. El nombre, precio, descripción, stock e imágenes se propagan a tarjetas, ficha, carrito, favoritos, búsqueda y resumen de compra.

No cambies el `id` del producto al actualizar su contenido porque se utiliza en enlaces, favoritos, carrito e historial de pedidos.

## 3. Cambiar el nombre visible de una categoría

Busca `CATEGORIES` y modifica solo `name`:

```js
{
  id: 'running',
  name: 'Running / Carrera',
  representativeProductId: 'SHX-003'
}
```

Conserva el `id`. El nombre visible se actualiza en Home, filtros, tarjetas, ficha, carrito y selector de administración. `representativeProductId` determina qué producto suministra la imagen de la categoría.

## 4. Creatividades publicitarias independientes

`HOME_ADS` es una lista separada de `INITIAL_PRODUCTS`. Cada anuncio declara dónde se muestra y qué producto abre su CTA:

| `slot` | Ubicación | Archivo semilla |
|---|---|---|
| `mobileHero` | Hero de inicio móvil | `assets/images/ads/hero-mobile.svg` |
| `desktopHero` | Hero de inicio desktop | `assets/images/ads/hero-desktop.svg` |
| `promotion` | Banner de oferta | `assets/images/ads/promotion.svg` |

Ejemplo:

```js
{
  id: 'AD-HERO-DESKTOP',
  slot: 'desktopHero',
  placement: 'Hero escritorio',
  eyebrow: 'Nueva colección',
  title: 'Step into your style.',
  titleAccent: 'your style.',
  description: 'Texto comercial del hero.',
  image: 'assets/images/ads/hero-desktop.webp',
  alt: 'Creatividad editorial de la colección ShoeX',
  ctaLabel: 'Explorar colección',
  productId: 'SHX-004',
  badge: ''
}
```

- `image` es la creatividad publicitaria. **No** la agregues a `image`, `imageFront` o `imagePair` del producto.
- `productId` determina a qué ficha dirige el anuncio. Puedes cambiar la creatividad sin cambiar el producto de destino.
- `title`, `eyebrow`, `description`, `ctaLabel` y `badge` controlan el texto del anuncio.
- `titleAccent` permite destacar una palabra o frase en los hero. Déjalo vacío si no necesitas resaltado.

### Medidas recomendadas para publicidad

| Espacio | Tamaño recomendado | Formato | Peso orientativo |
|---|---:|---|---:|
| Hero móvil | 1200 × 900 px | WebP | 120–250 KB |
| Hero desktop | 1600 × 1100 px | WebP | 180–320 KB |
| Banner de oferta | 1400 × 900 px | WebP | 150–280 KB |

El arte puede tener más impacto visual, fondos, composición y elementos gráficos que las fotos de producto. Conserva espacio de seguridad alrededor del calzado y evita incrustar textos pequeños que no se lean al reducirse.

## 5. Panel de administración

El panel tiene tres áreas:

- **Dashboard:** pedidos pendientes y efectivos simulados, con importes locales. Puedes alternar el estado de un pedido para probar los indicadores.
- **Catálogo:** editar nombre, marca, categoría, precio, stock, descripción y las tres rutas de imagen.
- **Publicidad:** editar cada banner, textos, ruta de imagen y producto de destino.

Los cambios realizados desde el panel se guardan únicamente en el `localStorage` del navegador actual. No se suben archivos a GitHub ni son visibles para otros visitantes. Para publicar imágenes para todos, agrega los archivos al repositorio y cambia sus rutas en `products.js`.

## 6. Publicar cambios en GitHub y sincronizar visitantes

1. Copia las fotografías optimizadas a `assets/images/products/` o las creatividades a `assets/images/ads/`.
2. Actualiza las rutas dentro de `INITIAL_PRODUCTS` o `HOME_ADS` en `assets/js/data/products.js`.
3. Verifica el recorrido en un servidor local y sube el proyecto completo al repositorio.
4. Cuando el navegador detecte la nueva firma `CATALOG_VERSION`, reemplazará los productos y anuncios guardados localmente con los datos publicados.
5. Se conservan carrito, favoritos, perfil e historial de pedidos. La firma incluye productos, categorías, selecciones y anuncios.

No necesitas incrementar una versión manualmente: `CATALOG_VERSION` se calcula automáticamente a partir de los datos fuente.

## 7. Seguridad y límites del demo

No se implementa cambio de contraseña. La autenticación y el panel son simulaciones frontend; las credenciales definidas en `assets/js/config.js` se pueden inspeccionar desde el código público y no deben tratarse como secreto. Como los cambios viven solo en el navegador, no modifican una base de datos central ni los datos de otros visitantes. Para proteger un comercio real se necesita autenticación y autorización en servidor, base de datos y almacenamiento de archivos con permisos.


## Creatividad vertical de onboarding

La imagen de bienvenida no reutiliza una fotografía de producto ni una creatividad de publicidad del Home. Se configura en `ONBOARDING_BACKGROUND` dentro de `assets/js/data/products.js`. La ruta por defecto es `assets/images/brand/onboarding-background.svg`. Para una imagen fotográfica final, recomendamos 1080 × 1920 px (9:16), WebP, calidad 80–85 y 250–450 KB. Mantén el zapato en la zona central; evita ubicar detalles importantes en el 10% superior (logotipo) y el 25% inferior (título y CTA). La pantalla se ajusta con `100dvh` y safe areas para cubrir el alto visible del dispositivo.


## Variantes de color por producto (2.5.0)

En el panel, abre **Catálogo → Editar producto**. El formulario permite hasta tres variantes, cada una con nombre y selector de tono. Deja el nombre vacío cuando no necesites esa opción. Al guardar, el detalle de producto renderiza únicamente las variantes configuradas.

En el código fuente, los arreglos relacionados mantienen el mismo orden:

```js
colors: ['Negro / Naranja', 'Blanco / Gris', 'Azul / Blanco'],
colorHexes: ['#292d35', '#e7e4dd', '#315c9a']
```

`colors[0]` utiliza `colorHexes[0]`, etc. Mantén ambos arreglos alineados. Los cambios del administrador se guardan solo en `localStorage`; para publicarlos a todos los visitantes actualiza `assets/js/data/products.js` y vuelve a desplegar el sitio.

## Pedidos, estados e inventario (2.5.0)

En **Dashboard → Pedidos y estado**, abre **Ver compra y datos de entrega** para revisar los artículos, tallas, colores, cantidades, subtotales y datos del comprador. Avanza cada pedido en este orden:

1. **Pendiente:** el cliente generó el pedido.
2. **Empacado:** el administrador preparó los artículos.
3. **Procesado:** el administrador registra que fue despachado. En este paso se descuenta del stock cada cantidad comprada y el catálogo se actualiza.

El botón de avance no permite saltar estados. Si el stock no alcanza o el producto no está en catálogo, no se procesa el pedido. Los pedidos antiguos marcados como efectivos se muestran como procesados al migrarse, sin descontarles stock retroactivamente.

El historial del cliente utiliza el mismo estado. Pedidos, inventario y estados son datos locales del navegador y no se comparten con el vendedor ni con otros dispositivos.


## Convención de nombres de archivo

Utiliza nombres ASCII en minúsculas y guiones, sin espacios, tildes, `#`, `?` ni otros caracteres reservados. Ejemplo: `nike-pegasus-42-velocidad-neon.webp`. Actualiza la ruta correspondiente en `HOME_ADS[].image` y conserva la misma ruta de respaldo en `index.html` cuando exista una imagen estática inicial.
