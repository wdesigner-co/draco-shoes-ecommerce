# Modelo de contenido ShoeX 2.5.0

## Producto (`INITIAL_PRODUCTS`)

| Campo | Tipo | Uso |
|---|---|---|
| `id` | string | Identificador estable `SHX-001`–`SHX-020` |
| `name` | string | Nombre comercial |
| `brand` | string | Marca o línea |
| `category` | string | ID estable definido en `CATEGORIES` |
| `price`, `compareAt` | number | Precio actual y precio comparativo |
| `image` | string | Fotografía lateral (imagen principal) |
| `imageFront` | string | Fotografía frontal |
| `imagePair` | string | Fotografía de los dos zapatos |
| `colors` | array de strings | Hasta tres nombres de color configurables por producto |
| `colorHexes` | array de strings hex | Tono de muestra correspondiente a cada color; mantiene el mismo índice que `colors` |
| `sizes` | array | Tallas disponibles en la ficha |
| `stock` | number | Disponibilidad de muestra |
| `description`, `features` | string / array | Contenido de ficha |
| `rating`, `reviews` | number | Datos ilustrativos |
| `featured` | boolean | Incluir en selección destacada |

Las imágenes de producto son diferentes de las imágenes de publicidad y no deben intercambiarse.

## Categorías (`CATEGORIES`)

Cada categoría mantiene un `id` estable, nombre visible, `representativeProductId`, descripción y tema editorial. El nombre es editable sin cambiar los IDs asignados a los productos.

## Anuncios (`HOME_ADS`)

Cada registro contiene `id`, `slot`, `placement`, `eyebrow`, `title`, `titleAccent`, `description`, `image`, `alt`, `ctaLabel`, `productId` y `badge`. `slot` permite elegir la ubicación (`mobileHero`, `desktopHero`, `promotion`) y `productId` enlaza el CTA con el producto del catálogo.

Los anuncios se almacenan en una lista independiente para que sus banners tengan dirección visual propia y no se incluyan en la galería de tres vistas de un producto.

## Pedidos y despacho

Los pedidos se crean en `localStorage` con una copia de cada artículo, la variante elegida (talla y color), cantidades, precios y datos de entrega. Cada pedido mantiene `fulfillmentStatus` con tres estados:

| Clave | Etiqueta | Acción siguiente |
|---|---|---|
| `pending` | Pendiente | El cliente acaba de generar el pedido. El administrador revisa los datos de compra. |
| `packed` | Empacado | El administrador confirmó que los artículos están listos para despachar. |
| `processed` | Procesado | El administrador registra el despacho; el sistema descuenta del stock las unidades del pedido. |

`fulfillmentHistory` registra cada cambio con fecha (`at`). `inventoryDeductedAt` evita descontar dos veces el mismo pedido. El inventario se actualiza únicamente al pasar de **Empacado** a **Procesado**; antes de procesar se valida que todos los productos tengan stock suficiente. Si falta inventario, el pedido permanece empacado y se informa qué referencia no alcanza.

Los pedidos heredados con `adminStatus: "effective"` se migran a `processed` para conservar el estado que mostraban en versiones previas. Esa migración no descuenta unidades retroactivamente; el inventario solo se descuenta en pedidos que completen el nuevo flujo.

Estos estados e inventario son locales al navegador y no representan pago, facturación, despacho de transportadora ni inventario compartido en producción.

## Persistencia

`CATALOG_VERSION` se calcula a partir de productos, categorías, `HOME_SHOWCASE` y `HOME_ADS`. Si cambia la fuente publicada, `store.js` sustituye productos y anuncios del navegador, y conserva carrito, favoritos, perfil y pedidos.
