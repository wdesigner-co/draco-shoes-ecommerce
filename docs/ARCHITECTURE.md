# Arquitectura y estructura del repositorio

## Tecnologías

- HTML Living Standard / HTML5 semántico.
- CSS3 con custom properties, diseño mobile-first y media queries.
- JavaScript Vanilla en módulos ECMAScript (ES Modules), sin framework ni bundler.
- `localStorage` / `sessionStorage` como persistencia de demostración.
- Fetch API para cargar fragmentos HTML compartidos.
- Google Fonts (Inter) y Font Awesome 6.5.2 desde CDN.

## Árbol de carpetas

```text
shoex-store/
├── index.html                    # Inicio / home
├── onboarding.html               # Bienvenida vertical de primera visita móvil
├── categorias.html               # Catálogo, búsqueda y filtros
├── producto.html                 # Detalle por ?id=SHX-xxx
├── favoritos.html                # Lista de favoritos
├── carrito.html                  # Carrito y resumen
├── checkout.html                 # Datos, entrega y método de confirmación
├── pedido-exitoso.html           # Confirmación + WhatsApp
├── perfil.html                   # Perfil e historial local
├── admin.html                    # Editor local del catálogo
├── 404.html                      # Página no encontrada
├── robots.txt                    # Reglas para rastreadores
├── sitemap.xml                   # URLs públicas del prototipo
├── llms.txt                      # Resumen estructurado de la tienda
├── site.webmanifest              # Metadatos de instalación
├── package.json                  # Comando de servidor local sin dependencias
├── components/
│   ├── site-header.html           # Header + navegación de escritorio
│   ├── site-footer.html           # Footer
│   ├── bottom-nav.html            # Navegación móvil inferior
│   └── overlays.html              # Toast, modal informativo y autenticación demo
├── assets/
│   ├── css/
│   │   ├── tokens.css             # Colores, tipografía, escala y radios
│   │   ├── base.css               # Reset, estilos base y accesibilidad
│   │   ├── layout.css             # Contenedores, header, footer y navegación
│   │   ├── components.css         # Botones, cards, formularios y overlays
│   │   └── pages.css              # Composición y responsive por página
│   ├── js/
│   │   ├── config.js              # Moneda, WhatsApp, cupón y ajustes
│   │   ├── main.js                # Bootstrap y eventos compartidos
│   │   ├── core/
│   │   │   ├── components.js      # Fetch de fragmentos compartidos
│   │   │   ├── storage.js         # Lectura/escritura segura del storage
│   │   │   ├── store.js           # Productos, carrito, favoritos y órdenes
│   │   │   └── ui.js              # Escape, moneda, tarjetas, toast y modal
│   │   ├── data/products.js       # Productos, categorías, hero y productos representativos
│   │   └── pages/                 # Inicializador JS específico por página
│   ├── images/
│   │   ├── brand/                 # Logotipos y recursos de marca
│   │   └── products/              # 20 imágenes SVG provisionales
│   └── icons/                     # Favicon y Apple Touch Icon
├── docs/                          # Documentación del flujo, datos, despliegue y QA
│   ├── CATALOG_GUIDE.md            # Guía para editar productos, categorías y hero
└── tools/                         # Herramientas de desarrollo local
```

## Patrón de inicialización

1. Cada HTML declara `data-page` en `<body>` y carga `assets/js/main.js` con `type="module"`.
2. `main.js` espera a que `loadSharedComponents()` termine de insertar los fragmentos del header, footer, navegación inferior y overlays.
3. Se conectan los eventos globales, se refresca el contador del carrito y se marca el enlace de navegación de la página activa.
4. El mapa `pages` ejecuta solo el inicializador correspondiente al `data-page` actual.
5. `core/store.js` es la única capa que conoce las claves de almacenamiento y calcula totales/órdenes.

## Responsabilidades y límites

- `data/products.js` es la fuente única de productos, categorías y selección de productos editoriales. `store.js` admite cambios locales del administrador mientras la firma del catálogo publicado no cambie; al detectar una nueva firma, sincroniza la semilla actualizada una vez.
- `ui.js` centraliza `escapeHTML`, `safeImageUrl`, formato de moneda, render de tarjetas, toasts y modales.
- `pages/*.js` manipula solamente el DOM de su página e invoca operaciones de `store.js`.
- No se usa `innerHTML` con datos no escapados en las vistas que pintan el catálogo, el carrito, perfil o pedido. Los textos de los formularios se guardan como valores y se convierten a texto seguro al renderizar.
- No existe API ni backend. `localStorage` es modificable por el usuario y no es una fuente de verdad para inventario o dinero.

## Convenciones

- Nombres de clases en kebab-case; claves de objetos en camelCase.
- Identificadores estables `SHX-001`–`SHX-020`.
- Montos numéricos en el objeto de catálogo; formato en `money()`.
- HTML en español con `lang="es-CO"`, textos alternativos descriptivos, etiquetas explícitas y estados accesibles.
- Estilos separados por capa: tokens → base → layout → componentes → páginas.


## Ajustes de presentación Fases 2.1, 2.2 y 2.3

- `components/site-header.html`: encabezado de marca; no contiene menú hamburguesa móvil.
- `components/bottom-nav.html`: navegación fija móvil con cuatro destinos; carrito disponible en el header.
- `assets/css/pages.css`: hero móvil independiente, carrusel de categorías, mini mapa, distribución del formulario, onboarding responsive y botón flotante.
- `assets/js/pages/home.js`: sugerencias de búsqueda, mapa embebido y acceso flotante a WhatsApp en móvil/escritorio.
- `assets/js/pages/product.js`: galería desplazable con paginación por puntos y acciones de compra.
- `assets/js/pages/admin.js`: catálogo administrativo en tarjetas y edición modal.
- `assets/js/main.js`: sesión demo de cliente/administración, cierre de sesión global, onboarding automático y animaciones reveal por sección.
- `assets/js/config.js`: credenciales demo y consulta de ubicación provisional para Google Maps.
- `assets/js/core/ui.js`: ciclo de visibilidad del toast con timeout y atributos ARIA.


## Cambios de interacción de Fase 2.3

Los flujos de producto agregan dos diálogos especializados: guía de tallas y opciones de compartir. La galería mantiene un carrusel horizontal único entre breakpoints para que la paginación por puntos conserve el mismo comportamiento en móvil y escritorio. El botón de WhatsApp de inicio se gobierna por la posición del bloque `info-contact-grid` y no por la visibilidad aislada del mapa. La secuencia de categorías se dispara como grupo y distribuye retardos por posición, evitando que una tarjeta parcialmente visible active su animación de forma independiente.


## Catálogo dinámico y sincronización (v2.3.3)

`assets/js/data/products.js` es la única fuente editable para los productos, las categorías y las selecciones editoriales del Home. Los enlaces de categoría del header y footer se actualizan desde `CATEGORIES` al montar los componentes compartidos. `index.html` conserva únicamente contenedores y atributos de destino; `home.js` inyecta nombres, imágenes, textos de categoría y enlaces a partir de los datos. La creatividad independiente del onboarding se hidrata desde `ONBOARDING_BACKGROUND`.

Las categorías usan IDs estables en `INITIAL_PRODUCTS[].category`. El nombre visible está centralizado en `CATEGORIES[].name`, por lo que renombrar una categoría no exige cambiar los 20 productos ni páginas HTML. `representativeProductId` define qué producto suministra la imagen de cada categoría.

`CATALOG_VERSION` se calcula automáticamente a partir del catálogo, las categorías y la configuración editorial. Cuando cambia cualquier dato publicado en `products.js`, `store.js` sustituye la copia del catálogo en `localStorage` en la siguiente visita y conserva carrito, favoritos, perfil y pedidos. Las ediciones realizadas en Administración Demo permanecen locales mientras no cambie la firma del catálogo publicado.


## ShoeX 2.4.0 — Modelo de galería y publicidad

- `INITIAL_PRODUCTS[].image`, `imageFront` e `imagePair` son las tres fotografías de ficha (lateral, frontal y par). Las creatividades del Home nunca se reutilizan como vistas de producto.
- `HOME_ADS` define una lista aparte de anuncios con `slot`, imagen, copy y `productId` de destino. El Home renderiza los slots `mobileHero`, `desktopHero` y `promotion` desde `home.js`.
- `store.js` sincroniza también los anuncios cuando cambia `CATALOG_VERSION`; los cambios locales del dashboard, catálogo y publicidad se guardan en localStorage.
- `admin.js` presenta tres espacios de trabajo: Dashboard, Catálogo y Publicidad. En 2.4.0 el Dashboard usaba estados pendientes/efectivos; ese modelo histórico quedó sustituido por el flujo logístico descrito en la sección 2.5.0.
- El acceso al administrador comparte el modal de acceso de Mi cuenta. En `admin.html` el modal no ofrece registro. El enlace público de administración se retiró del footer.

## Límite de seguridad

La aplicación sigue siendo un frontend estático. Las credenciales de administrador incluidas en el bundle se pueden inspeccionar y la sesión es modificable desde el navegador. El panel no cambia contraseñas ni protege datos compartidos: los cambios solo afectan al almacenamiento local. Para producción se requiere autenticación de servidor, autorización por roles, base de datos y almacenamiento de objetos.


## Sesión de cliente y administración

Las claves `shoex-account-demo-auth` y `shoex-admin-demo-auth` viven en `sessionStorage`, por lo que permanecen activas al navegar entre HTML del mismo origen dentro de la pestaña actual y se descartan al cerrar la pestaña/navegador. `getActiveSessionRole()` prioriza el rol administrador y `updateAuthSessionUI()` muestra el rol en el header compartido. El evento `data-auth-logout` elimina solo ambas claves de sesión, sin tocar el estado comercial guardado en `localStorage`. Las rutas `perfil.html` y `admin.html` verifican el rol requerido.

## Onboarding inicial

En viewports menores de 768 px, `index.html` redirige a `onboarding.html` cuando no existe `shoex-onboarding-seen-v1` en `localStorage`. La pantalla de bienvenida marca esa clave cuando se muestra; al pulsar «Comenzar» o «Saltar» regresa al Home y no entra en bucle. En desktop se omite. `ONBOARDING_BACKGROUND` centraliza la ruta de la creatividad. El CSS usa `100dvh` con fallback `100vh`, safe areas y `object-fit: cover` para imagen vertical; si detecta una imagen apaisada aplica `object-fit: contain`.


## ShoeX 2.5.0 — flujo de pedidos, inventario y variantes

- `store.js` define `ORDER_STATUSES` y centraliza la secuencia `pending → packed → processed`.
- `createOrder()` guarda una copia del pedido y vuelve a validar el stock antes de vaciar el carrito.
- `updateOrderStatus()` valida la transición; al llegar a `processed`, agrupa cantidades por ID de producto, comprueba disponibilidad y descuenta unidades del catálogo local una sola vez.
- `fulfillmentHistory` registra la hora de cada cambio y `inventoryDeductedAt` protege frente a descuentos duplicados.
- `admin.js` presenta el detalle de productos, variantes, cantidades, importes y datos de entrega. La acción disponible depende del estado actual.
- `profile.js` utiliza el mismo estado logístico del pedido para actualizar el historial del cliente.
- Cada producto define hasta tres `colors` y un arreglo `colorHexes` alineado por índice. El panel edita nombre y tono; `product.js` construye los selectores dinámicamente.
- Todo el flujo continúa en almacenamiento local del navegador. No hay sincronización entre usuarios, reserva de inventario multiusuario, cobro, autenticación segura ni operaciones transaccionales de servidor.


## ShoeX 2.5.1 — Acceso al perfil/panel desde el header y entrada del Hero

- `components/site-header.html` renderiza el chip de rol como enlace accesible (`data-session-role-link`).
- `main.js` actualiza el destino del chip según `sessionStorage`: cliente → `perfil.html`; administrador → `admin.html`. El botón de salida (`data-auth-logout`) permanece separado y no comparte la acción de navegación.
- `pages/home.js` hidrata primero los anuncios del Home y después asigna clases de entrada a `.mobile-hero__copy`, `.mobile-hero__visual`, `.hero-copy` y `.hero-visual`.
- `pages.css` anima la copia desde el borde izquierdo y el visual desde el derecho con keyframes transform/opacity; el comportamiento solo se activa con `prefers-reduced-motion: no-preference`. Los contenedores de ambos hero quedan excluidos del reveal vertical genérico para que los desplazamientos horizontales sean perceptibles y no compitan entre sí.
