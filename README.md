# Draco Shoes — Prototipo ecommerce Vanilla (Versión 2.5.1)

Prototipo multipágina de tienda online de calzado desarrollado con **HTML5 semántico, CSS3 y JavaScript Vanilla (ES Modules)**. Convierte las cuatro vistas de referencia (onboarding, inicio, detalle y carrito) en un recorrido navegable con catálogo, favoritos, perfil, checkout, confirmación del pedido y panel de edición local.

> **Base visual:** se conserva la dirección de arte de la referencia suministrada: interfaz de calzado con superficies oscuras, paneles claros, acento naranja y tipografía Inter. La organización se amplía a una experiencia ecommerce completa y multipágina.

> **Alcance:** este proyecto es un prototipo funcional de frontend. Usa `localStorage` y `sessionStorage` del navegador para simular el catálogo editable, carrito, favoritos, perfil, estados logísticos e inventario demostrativo. No incluye backend, base de datos remota, autenticación segura, inventario transaccional ni pagos reales. Los accesos de cliente y administrador son simulaciones locales. El cierre de compra prepara un pedido y abre WhatsApp con un mensaje que el comprador revisa y envía manualmente.

## Funcionalidades incluidas

- 11 páginas HTML separadas y enlazadas: inicio, onboarding, catálogo/categorías, detalle de producto, favoritos, carrito, checkout, pedido exitoso, perfil, administración y página 404.
- Catálogo semilla de **20 productos** con identificadores `SHX-001` a `SHX-020`, fichas, categorías, precios, tallas, colores, stock, rating y descripción.
- Catálogo de 20 productos con tres vistas independientes por producto: lateral (`image`), frontal (`imageFront`) y par completo (`imagePair`). Incluye placeholders provisionales para sustituir por fotografías definitivas.
- Cada producto define hasta tres variantes de color (`colors`) y sus tonos (`colorHexes`); el selector de la ficha y el editor del administrador consumen esos datos dinámicamente.
- Carrito persistente con variantes, control de cantidades, eliminación, subtotal, descuento, envío y total. Código promocional de demostración: `SHOE10`.
- Favoritos y perfil persistentes en el navegador.
- Checkout con validación nativa, datos de contacto/entrega, resumen y botones de muestra para PayPal y Mercado Pago. Esos métodos abren un modal explicativo y no procesan pagos.
- Confirmación del pedido con referencia y resumen. El botón WhatsApp genera un texto con productos, variantes, cantidades, importes y datos de entrega.
- Panel de administración demo con Dashboard de pedidos pendientes, empacados y procesados, Catálogo con edición de tres fotografías, hasta tres variantes de color y stock por producto; Publicidad para gestionar banners del Home; detalle de pedidos y flujo logístico.
- Creatividades publicitarias independientes (`HOME_ADS`) para hero móvil, hero desktop y oferta; no se mezclan con las tres fotografías de la galería de producto.
- Home ampliado con sección de beneficios, proceso de compra en cinco pasos, garantías ilustrativas y preguntas frecuentes desplegables.
- Componentes compartidos cargados desde fragmentos HTML para no repetir header, footer, navegación inferior y overlays.
- Búsqueda móvil con sugerencias dinámicas de nombres de producto mediante `datalist`.
- Animaciones reveal por sección, cascada para categorías y entradas alternas laterales para testimonios; respetan `prefers-reduced-motion`.
- Galería de producto con tres puntos de paginación y desplazamiento táctil.
- En ficha de producto móvil, flecha de regreso sobre la imagen y navegación inferior de cuatro accesos que aparece al comenzar el desplazamiento.
- Acceso simulado de cliente y administrador mediante un modal unificado; el encabezado identifica el rol activo e incluye cierre de sesión sin borrar carrito, favoritos ni pedidos. La opción Google es visual y no implementa OAuth real.
- Panel de administración con tarjetas responsive y edición desde un modal, sin tabla horizontal.
- Onboarding de primera visita solo en móvil: se presenta automáticamente una vez por navegador, con creatividad vertical full-screen, título “Step into style”, CTA “Comenzar” y altura dinámica `100dvh`. La ruta `onboarding.html` también puede abrirse directamente.
- Diseño responsive mobile-first con cuatro rangos de adaptación (480, 768, 1024 y 1280 px), navegación inferior de cuatro accesos en móvil y carrito en el header móvil.
- Metadatos SEO y Open Graph por página, JSON-LD de tienda, favicon SVG, Apple Touch Icon, manifest, `robots.txt`, `sitemap.xml` y `llms.txt`.

## Requisitos

- Navegador moderno con soporte para JavaScript ES Modules, `localStorage`, `fetch` y `<dialog>`.
- Un servidor HTTP local o estático. **No abras los HTML mediante `file://`**, porque los fragmentos compartidos se cargan con `fetch()` y los módulos ES necesitan contexto HTTP.
- Conexión a internet solo para cargar Google Fonts (Inter) y Font Awesome desde CDN. Si se requiere funcionamiento completamente offline, descarga esas dependencias y actualiza las rutas en el `<head>` de las páginas.

## Ejecutar en local

### Opción A — Python

Desde la carpeta raíz del proyecto:

```bash
python -m http.server 5500
```

Abre `http://localhost:5500/`.

### Opción B — Node.js (sin dependencias)

```bash
node tools/serve.mjs
```

Abre `http://localhost:5500/`. Para cambiar el puerto:

```bash
PORT=8080 node tools/serve.mjs
```

### Opción C — VS Code

Abre la carpeta en VS Code y ejecuta `index.html` mediante Live Server o una extensión equivalente.

## Configuración obligatoria antes de presentar o publicar

Edita `assets/js/config.js`:

```js
export const CONFIG = {
  storeName: 'Draco Shoes',
  currency: 'USD',
  locale: 'es-CO',
  sellerWhatsApp: '573000000000', // Reemplazar por el número real en formato internacional, solo dígitos.
  supportEmail: 'ventas@shoex.example',
  siteUrl: 'https://shoex.example',
  // ...
};
```

Reemplaza también:

1. `shoex.example` por el dominio definitivo en canonical, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml` y correo de contacto.
2. Número WhatsApp `sellerWhatsApp` por el número real en formato internacional sin `+`, espacios ni guiones.
3. Las ilustraciones provisionales por fotografías autorizadas y optimizadas. Para cada producto actualiza `INITIAL_PRODUCTS[].image` (lateral), `imageFront` (frontal) e `imagePair` (par) en `assets/js/data/products.js`. Consulta `docs/CATALOG_GUIDE.md` para dimensiones y peso recomendados.
4. Sustituye las creatividades de `assets/images/ads/` y actualiza las rutas de `HOME_ADS[].image`; cada anuncio tiene un `slot` y un `productId` de destino independientes del catálogo de fotos.
5. Precios, moneda, descuentos, tallas, colores, inventario, ubicación, datos comerciales, términos, envíos, cambios y textos de muestra.
6. Testimonios y calificaciones: el contenido actual es ficticio y solo sirve para visualizar el componente.

## Flujo de compra de demostración

1. Añade un producto desde el catálogo o su ficha, seleccionando talla y color.
2. En el carrito, ajusta cantidades, elimina referencias o aplica `SHOE10`.
3. Continúa al checkout e introduce los datos de contacto y entrega. Acepta el texto de confirmación.
4. Pulsa **Crear pedido y continuar por WhatsApp**. Se registra una orden local y se muestra la pantalla de pedido exitoso.
5. Pulsa **Enviar pedido por WhatsApp**. WhatsApp abre la conversación con el detalle prellenado; el cliente debe revisar y pulsar Enviar.

PayPal y Mercado Pago son elementos visuales de UI que muestran un modal “medio de pago no habilitado”. No se capturan credenciales ni se simula una autorización financiera.

## Sesiones de demostración

- El cliente y el administrador mantienen una sesión en `sessionStorage` durante la pestaña actual; la navegación entre páginas no vuelve a pedir credenciales.
- El encabezado muestra el rol activo (“Cliente” o “Administrador”); el propio indicador es un enlace al Perfil o al Panel de administración según la sesión, y junto a él aparece el botón para cerrar sesión.
- Cerrar sesión elimina solo las claves de autenticación de esa pestaña. No borra carrito, favoritos, perfil, catálogo local ni pedidos. Al cerrar desde `perfil.html` o `admin.html`, vuelve a Inicio.
- La bienvenida móvil se muestra en la primera visita y registra `shoex-onboarding-seen-v1` en `localStorage`. Para volver a verla automáticamente, elimina esa clave desde las herramientas del navegador; también puedes abrir `onboarding.html` directamente.

## Panel de administración

Para administrar, abre directamente `admin.html` o inicia sesión desde «Mi cuenta» con la credencial administrativa. El enlace público «Administración demo» se retiró del footer; ambos accesos usan el mismo modal. El panel incluye Dashboard, Catálogo y Publicidad. Los cambios se almacenan en el navegador actual; no se sincronizan entre usuarios ni dispositivos. Las credenciales están en el código frontend y pueden inspeccionarse: no existe protección real ni modificación de contraseña, porque este panel es solo un prototipo.

## Acceso demo y persistencia

- Cliente: cualquier email válido y una contraseña de al menos cuatro caracteres permiten iniciar sesión o registrarse de forma local.
- Administrador: usa el mismo formulario de acceso de cliente; las credenciales de demostración se configuran en `assets/js/config.js`. No compartas esas credenciales como si fueran un mecanismo seguro.
- La opción de Google solo presenta un mensaje de que OAuth no está conectado.
- Las sesiones demo usan `sessionStorage`; se reinician al cerrar la pestaña o el navegador.

## Persistencia y restablecimiento

Las claves del navegador usan el prefijo `shoex-v1:`. El panel `admin.html` incluye **Restablecer datos demo** para recuperar el catálogo inicial y limpiar carrito, favoritos, perfil y pedidos. Los datos permanecen en el navegador y pueden perderse al limpiar el almacenamiento del sitio.

## Ajustes de experiencia móvil (Fases 2.1, 2.2 y 2.3)

- En móvil se elimina el menú hamburguesa, el carrito permanece en el header y la navegación inferior muestra Inicio, Categorías, Favoritos y Perfil.
- Inicio móvil incorpora buscador, hero Air Max Pro 270, carrusel horizontal de categorías y dos productos destacados; el hero editorial y las tarjetas de categorías originales se conservan en escritorio.
- Ubicación y formulario de contacto se reorganizan en bloques de contenido + mapa miniatura, y copywriting + formulario.
- El acceso flotante de WhatsApp aparece al entrar en la zona de ubicación tanto en móvil como en escritorio y se oculta al desplazarse hacia arriba.
- El mapa ilustrativo se puede expandir dentro de la tarjeta para cargar Google Maps. La búsqueda de ubicación es provisional y se configura en `CONFIG.mapSearchQuery`.
- El acceso a Mi cuenta abre un modal unificado. El administrador se reconoce por sus credenciales y se dirige al panel; los clientes inician sesión o se registran y llegan al perfil. No hay un enlace público de administración en el footer. La opción Google es solamente visual.
- En la ficha de producto móvil se oculta el header; la barra inferior aparece al desplazarse hacia abajo y se oculta al regresar al inicio. La flecha sobre la imagen permite volver a la página anterior; se conserva la galería con puntos y las acciones de compra antes de la descripción y productos relacionados.
- La administración usa un dashboard de pedidos simulados, una cuadrícula de tarjetas con editor de tres fotografías por producto y una sección de publicidad con edición de banners y relación a productos.
- El buscador móvil muestra sugerencias dinámicas al escribir y la barra de precio del catálogo se calcula como precio máximo de producto + 50.
- El onboarding se muestra automáticamente en la primera visita móvil, solo una vez por navegador; utiliza una creatividad vertical y se adapta al alto dinámico del viewport con `100dvh`.
- Las notificaciones toast se ocultan automáticamente y dejan de interceptar eventos al finalizar.

## ShoeX 2.4.0 — Galería de tres vistas y contenido editorial

Cada ficha utiliza tres rutas (`image`, `imageFront`, `imagePair`) y tres puntos de paginación. Los espacios publicitarios se gestionan en `HOME_ADS`, con creatividades independientes para hero móvil, hero desktop y oferta. El Home incorpora beneficios, garantías ilustrativas, un proceso de compra en cinco pasos y preguntas frecuentes.

El panel admin incluye Dashboard (estados locales de pedidos), Catálogo y Publicidad. El acceso está unificado con Mi cuenta y ya no se publica un enlace de administración en el footer. No se permite cambiar contraseña desde este prototipo; las credenciales frontend son visibles y no proporcionan seguridad de producción.

Consulta [`docs/CATALOG_GUIDE.md`](docs/CATALOG_GUIDE.md) para los tamaños de fotografía, convención de nombres, vistas de producto y administración de creatividades.

## Estructura del proyecto

Consulta [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para el árbol y las responsabilidades de cada módulo. El recorrido de usuario se encuentra en [`docs/USER_FLOW.md`](docs/USER_FLOW.md).

## Validación rápida

- Verifica la carga desde servidor HTTP, navega a todas las páginas y revisa la consola del navegador.
- Completa el flujo carrito → checkout → pedido → WhatsApp.
- Prueba tamaños de pantalla móvil, tablet, laptop y desktop.
- Revisa teclado, foco visible, etiquetas de formulario, contraste, texto alternativo y navegación inferior.
- Revisa [`docs/QA_CHECKLIST.md`](docs/QA_CHECKLIST.md) antes de mostrar el prototipo.

## Licencia y atribución

Código de prototipo preparado para personalización. Las ilustraciones SVG y la identidad visual están incluidas como recursos de demostración. Los proveedores externos (Google Fonts y Font Awesome CDN) se rigen por sus propias condiciones de uso.


## Historial de ajustes de versión 2.3

- La secuencia de categorías se dispara desde el contenedor del carrusel y entra de izquierda a derecha con retardos escalonados.
- WhatsApp se activa al llegar a `section.info-contact-grid` y permanece visible hasta volver por encima del inicio de esa sección, tanto en móvil como en escritorio.
- El botón del formulario de contacto ocupa el ancho completo de los campos.
- Los modales de autenticación reconstruyen los campos con nodos DOM, restauran el foco y fuerzan la interacción de los inputs.
- La galería de producto usa un único carrusel horizontal para todos los breakpoints; los puntos controlan la diapositiva activa también en desktop.
- Compartir producto abre un modal con WhatsApp, Facebook, X, copiar vínculo y compartir nativo cuando el navegador lo permite.
- La guía de tallas muestra una tabla orientativa EU / US / centímetros.
- Comprar ahora aparece primero, en naranja y a ancho completo; Añadir al carrito queda debajo.
- En móvil, el carrusel de productos relacionados reserva todo el ancho para las tarjetas y oculta las flechas laterales, manteniendo el desplazamiento táctil.


### Navegación de ficha de producto móvil (v2.3.2)

- La flecha sobre la imagen principal vuelve a la página interna anterior o al catálogo como alternativa segura.
- La navegación inferior de Inicio, Categorías, Favoritos y Perfil aparece al desplazarse hacia abajo y se oculta al volver al inicio de la ficha.
- El comportamiento aplica solo a móvil; escritorio conserva el diseño anterior.

### Corrección de acceso demo (v2.3.1)

El modal de autenticación separa ahora el contexto de acceso (`data-auth-context`) de las pestañas de inicio de sesión/registro (`data-auth-tab`). Esto evita que los clics dentro de los campos activen accidentalmente el cambio de pestaña y reconstruyan el formulario.

Para el perfil de cliente, utiliza un correo válido y una contraseña de al menos cuatro caracteres. El administrador utiliza los valores definidos en `assets/js/config.js`; no se documentan como un secreto porque forman parte del código frontend.


## Catálogo centralizado (v2.3.3)

Para actualizar el catálogo público, edita únicamente `assets/js/data/products.js`. La guía práctica con ejemplos se encuentra en [`docs/CATALOG_GUIDE.md`](docs/CATALOG_GUIDE.md):

1. **Nombre, imagen, precio o descripción de un producto:** cambia el campo correspondiente dentro de `INITIAL_PRODUCTS`.
2. **Nombre visible de una categoría:** cambia `CATEGORIES[].name`. Conserva su `id` para mantener filtros, enlaces de header/footer y relaciones de productos.
3. **Imagen de una categoría:** cambia `CATEGORIES[].representativeProductId` para elegir otro producto. La ruta de imagen se toma automáticamente del campo `image` de ese producto.
4. **Creatividades editoriales:** cambia imagen y contenido en `HOME_ADS`; cada registro define el slot, el archivo y el producto de destino. `HOME_SHOWCASE` configura los productos destacados del Home. `ONBOARDING_BACKGROUND` centraliza por separado la creatividad vertical de bienvenida.
5. **Publicación:** sube el proyecto completo a GitHub. No es necesario actualizar una versión a mano: `CATALOG_VERSION` se calcula mediante una firma de los datos. Cuando un navegador detecta cambios, reemplaza sus copias locales de productos y anuncios; conserva carrito, favoritos, perfil y pedidos.

El administrador demo sigue permitiendo pruebas locales. Sus cambios se mantienen en el navegador y no se publican en GitHub ni se comparten con otros visitantes. Cuando cambie el catálogo o las creatividades fuente y se publique, la nueva firma reemplazará esas ediciones locales para evitar que oculten la versión pública.

### Imagen de bienvenida (onboarding)

La creatividad se configura en `ONBOARDING_BACKGROUND` dentro de `assets/js/data/products.js`. El archivo inicial es `assets/images/brand/onboarding-background.svg`, una ilustración vertical provisional. Para sustituirla por fotografía, usa preferentemente **1080 × 1920 px (relación 9:16)** en WebP, calidad 80–85 y un peso orientativo de **250–450 KB**. Deja el calzado/personaje principal dentro del 70% central del encuadre; reserva la zona superior para el logotipo y la zona inferior para el título, botón y texto, porque esas áreas tienen degradados superpuestos. El layout utiliza `100dvh` con fallback `100vh` y `object-fit: cover` para creatividades verticales. Si usas temporalmente una imagen horizontal, el frontend detecta su proporción y la contiene para evitar recortar el producto.


## Corrección 2.4.2

Se restauraron las reglas CSS que habían quedado fuera de `assets/css/pages.css` en el paquete 2.4.1. Se conserva el diseño de onboarding de pantalla completa y se recuperan los estilos de las páginas de producto, autenticación, administración, modales, tarjetas, secciones de confianza y breakpoints responsive.


## ShoeX 2.5.0 — pedidos e inventario de demostración

El Dashboard de administración ahora permite abrir cada pedido y revisar productos, variantes, cantidades, datos de entrega y totales. El administrador avanza los pedidos desde **Pendiente** a **Empacado** y después a **Procesado**. Al procesar, el sistema valida y descuenta el inventario local de cada producto comprado; si no hay unidades suficientes, conserva el estado Empacado y muestra un aviso. El historial del cliente muestra el mismo estado.

El editor de catálogo permite definir hasta tres colores por producto, cada uno con nombre y tono hexadecimal. La ficha genera sus swatches con los datos de ese producto.

**Límite del prototipo:** estos pedidos, estados e inventario solo existen en el `localStorage` del navegador donde se realizaron. No son un inventario multiusuario ni un sistema de pedidos de producción. Para el proyecto real, esta lógica debe trasladarse a una API/backend y a operaciones transaccionales de base de datos.


## Actualización 2.5.1 — Acceso desde el indicador de sesión y Hero animado

- Con una sesión de cliente activa, pulsa la etiqueta «Cliente» del encabezado para volver a `perfil.html` desde cualquier página.
- Con una sesión administrativa activa, pulsa «Administrador» para volver a `admin.html` desde cualquier página. El botón contiguo conserva la acción independiente de cerrar sesión.
- En Inicio, la copia del hero entra desde la izquierda y la imagen/visual desde la derecha, en móvil y escritorio. La animación se activa después de renderizar los anuncios, no se superpone al reveal vertical genérico y se desactiva para usuarios con `prefers-reduced-motion`.
