# Changelog

## 2.5.1 — Acceso rápido al espacio de sesión y entrada animada del Hero
- El indicador de sesión del encabezado ahora es un enlace accesible: «Cliente» lleva a `perfil.html` y «Administrador» lleva a `admin.html`, según el rol activo.
- Se conserva el mismo componente visual y el botón de cierre de sesión; no se añade un icono adicional ni un enlace público de administración.
- El Home anima la copia del hero desde el borde izquierdo hacia su posición y el visual desde el borde derecho, tanto en móvil como en escritorio.
- Se corrigieron las rutas de respaldo del hero en `index.html` para apuntar a la creatividad `AirJordan.webp` incluida en el paquete del usuario, incluso antes de que termine la hidratación dinámica.
- Se normalizó el nombre de archivo de la creatividad de promoción del producto Nike Pegasus (sin espacios ni caracteres reservados) y se actualizaron sus referencias en el catálogo y el Home.
- La animación se activa después de hidratar el contenido publicitario del Home, excluye los dos hero del reveal vertical genérico y respeta `prefers-reduced-motion`.
- Se actualizaron las pruebas de navegación, teclado y movimiento reducido.

## 2.5.0 — Estados logísticos, inventario y colores por producto
- El pedido se crea en estado **Pendiente** e incluye una instantánea de artículos, tallas, colores, cantidades, precios y datos de entrega.
- El administrador puede desplegar el detalle completo de compra para consultar qué debe empacar y a dónde debe enviarlo.
- Se incorporó la secuencia **Pendiente → Empacado → Procesado**. Las acciones disponibles avanzan un solo paso por vez.
- Al marcar un pedido como procesado, se valida disponibilidad y se descuentan del inventario las cantidades agrupadas por referencia. El marcador `inventoryDeductedAt` evita descuentos duplicados.
- Los pedidos con stock insuficiente permanecen empacados; no se actualizan a procesados.
- El historial de cliente muestra el estado logístico actual del pedido.
- El editor de productos permite configurar hasta tres colores, cada uno con su nombre y muestra hexadecimal; la ficha de producto dibuja los selectores desde esos datos.
- Se añadió migración de pedidos del esquema anterior (`adminStatus`) al nuevo `fulfillmentStatus`; los pedidos históricos efectivos se muestran procesados sin descuentos retroactivos.
- Se amplió la documentación de modelo de datos, recorrido, administración y pruebas.
- El alcance continúa siendo frontend local: no hay pagos, inventario remoto, autenticación segura ni sincronización entre navegadores.


## 2.4.2 — Corrección de estilos
- Restaurada la hoja `assets/css/pages.css` completa a partir de la versión 2.4.0, que conservaba las reglas de producto, autenticación, administración, modales, responsive y componentes de la tienda.
- Conservado el tratamiento visual de onboarding de pantalla completa introducido en 2.4.1 (`100dvh`, fondo vertical, degradados, título y CTA).
- No se modificaron la lógica de sesión, el catálogo, el almacenamiento ni los flujos de compra.
- Añadidas comprobaciones CSS y revisión visual local de Inicio, Producto, Administración y Onboarding.

 — ShoeX

## 2.4.1 — Sesión persistente y onboarding automático

- Se añadió un indicador de rol en el header para distinguir la sesión activa de Cliente y Administrador.
- Se añadió el control global «Cerrar sesión». Limpia solo las claves de autenticación de `sessionStorage` y conserva carrito, favoritos, perfil, catálogo y pedidos.
- La navegación multipágina mantiene la sesión dentro de la pestaña actual; un cliente puede recorrer la tienda sin volver a iniciar sesión y el administrador conserva el acceso al panel mientras la sesión esté activa.
- El enlace «Mi cuenta» lleva al panel cuando el rol activo es administrador, sin pedir credenciales de nuevo.
- El onboarding se muestra automáticamente en la primera visita desde un viewport móvil; registra el estado en `localStorage` para no repetirse en cada navegación. Sigue disponible mediante acceso directo a `onboarding.html`.
- Se añadió una creatividad vertical independiente para onboarding, el título «Step into style» y composición full-screen con CTA inferior.
- El onboarding se adapta a la altura dinámica con `100dvh`, respeta áreas seguras y detecta imágenes horizontales para contenerlas sin recorte.
- Se documentaron dimensiones recomendadas 1080 × 1920 px, formato WebP, peso orientativo y áreas seguras de composición.

## 2.4.0 — Galería de tres vistas, publicidad y Home de confianza

- Cada producto incorpora tres imágenes independientes: lateral (`image`), frontal (`imageFront`) y par completo (`imagePair`). La galería del detalle consume esas tres rutas y etiqueta cada punto de paginación.
- El editor de catálogo del administrador permite cambiar las tres rutas y muestra una vista previa de cada una.
- Se añadió `HOME_ADS`, una lista publicitaria independiente con slots para hero móvil, hero desktop y oferta; cada anuncio tiene su propia creatividad y relación mediante `productId` hacia el catálogo.
- La Home renderiza imagen, copy, CTA y vínculo de destino a partir de `HOME_ADS`, sin mezclar banners con las fotografías de producto.
- El panel se reorganizó en Dashboard, Catálogo y Publicidad. El dashboard presenta pedidos pendientes y efectivos simulados, con acciones locales para cambiar el estado y métricas de importe.
- Se retiró el enlace público «Administración demo» del footer. Mi cuenta y la ruta directa `admin.html` usan un acceso unificado que reconoce las credenciales del administrador y dirige al panel; los clientes van a Perfil.
- No se añadió cambio de contraseña: el prototipo no tiene backend ni credenciales seguras. Se documentó el límite de seguridad del acceso frontend.
- La Home incorpora sección ilustrada de beneficios, garantías informativas, proceso de compra en cinco pasos y preguntas frecuentes desplegables.
- Se documentaron dimensiones, relación de aspecto, formato, peso aproximado y reglas de encuadre para las fotografías de producto y banners publicitarios.
- `CATALOG_VERSION` ahora firma también los anuncios y las tres vistas de producto; al publicar cambios se sincronizan productos y publicidad local sin borrar carrito, favoritos, perfil ni pedidos.

## 2.3.0 — 2026-11-05

- Se corrigió la secuencia de reveal del carrusel móvil de categorías para que se active como grupo y avance de izquierda a derecha.
- Se ajustó el botón flotante de WhatsApp para que dependa del inicio de `info-contact-grid` y permanezca visible hasta volver por encima de esa sección.
- Se igualó el ancho del botón de envío del formulario de contacto al ancho de los campos.
- Se reconstruyeron los campos de autenticación con nodos DOM, foco inicial explícito y estilos de interacción para corregir la escritura en el modal de cuenta y administración demo.
- Se eliminó el layout de galería tipo grid en escritorio; las imágenes ahora se navegan como diapositivas horizontales mediante los tres puntos.
- Se añadió un modal de compartir con WhatsApp, Facebook, X, compartir nativo y copiar vínculo.
- Se añadió una guía de tallas en modal con equivalencias aproximadas EU / US / centímetros.
- Se reorganizaron las acciones del producto: «Comprar ahora» primero, en naranja y a ancho completo; «Añadir al carrito» debajo.
- Se corrigió el carrusel de productos relacionados en móvil: las flechas se ocultan para reservar el ancho completo a las tarjetas y mantener el desplazamiento táctil.

## 2.2.0

- Onboarding móvil, búsqueda con sugerencias, navegación inferior compacta, animaciones reveal, mapa expandible, autenticación demo, administración desde tarjetas y ajustes responsive.


## 2.3.1 — Corrección definitiva de autenticación demo

- Se separó el contexto del modal (`data-auth-context`) del identificador de pestaña (`data-auth-tab`).
- El cambio de pestaña ahora escucha exclusivamente los botones dentro de `[data-auth-tabs]`.
- Los clics y la escritura dentro de los campos ya no reconstruyen el formulario ni borran los valores ingresados.
- Se eliminó el `form.reset()` posterior a la generación dinámica de campos.
- La comparación del correo administrativo ignora espacios laterales y diferencias entre mayúsculas/minúsculas.
- Se añadieron atributos de entrada apropiados para correo electrónico.

## 2.3.2 — Navegación móvil en ficha de producto

- Se añadió una flecha de regreso sobre la esquina superior izquierda de la galería de producto en móvil. Vuelve al documento interno anterior cuando existe un referente del mismo origen; ante acceso directo utiliza el catálogo como destino seguro.
- La navegación inferior de cuatro accesos permanece oculta al inicio de la ficha y aparece con una transición suave al desplazar la página hacia abajo.
- La barra inferior se mantiene disponible durante la lectura de descripción, productos relacionados y pie de página; al regresar al inicio de la ficha vuelve a ocultarse.
- Se conserva el header oculto en producto móvil y no se altera la navegación ni el diseño de escritorio.



## 2.3.3 — Catálogo y contenido dinámico

- El archivo `assets/js/data/products.js` centraliza productos, categorías, productos representativos y configuración de hero/promoción/onboarding.
- Los nombres de categoría se editan en `CATEGORIES[].name`, conservando IDs estables para los filtros y las relaciones entre productos.
- Home móvil y desktop renderizan hero, categorías y promoción a partir de los datos del catálogo; se eliminaron las rutas de imágenes de producto escritas directamente en `index.html`.
- La imagen de onboarding se obtiene de `HOME_SHOWCASE`.
- Se actualizaron las etiquetas de categoría en tarjetas, detalle, carrito y administración.
- La firma automática `CATALOG_VERSION` sincroniza el catálogo publicado con `localStorage` cuando cambia cualquier dato fuente, sin borrar carrito, favoritos, perfil ni pedidos.
- El selector de categoría del administrador y los filtros del catálogo se generan desde `CATEGORIES`.
