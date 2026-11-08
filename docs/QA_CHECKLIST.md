# Checklist de revisión

## Navegación

- [ ] Inicio abre desde `/` e incluye enlaces a catálogo, categorías, detalles y contacto.
- [ ] Cada tarjeta abre el producto correcto por su ID.
- [ ] Header, footer y navegación inferior se cargan desde componentes compartidos.
- [ ] En móvil no aparece menú hamburguesa; el carrito permanece en el header.
- [ ] Botón Atrás del navegador y enlaces internos no rompen el estado local.

## Catálogo y producto

- [ ] Se muestran 20 productos diferentes.
- [ ] Búsqueda, categoría, precio y ordenamiento actualizan el listado.
- [ ] Talla y color se pueden seleccionar en detalle.
- [ ] Favoritos se pueden añadir y quitar y sobreviven a una recarga.
- [ ] Compartir usa Web Share o copia el enlace como alternativa.
- [ ] Las imágenes tienen alt y dimensiones declaradas.

## Carrito

- [ ] Añadir el mismo producto + talla + color incrementa su cantidad.
- [ ] Variantes distintas generan líneas separadas.
- [ ] No permite exceder el stock configurado en el prototipo.
- [ ] Disminuir, aumentar y eliminar actualizan el total.
- [ ] Cupón `SHOE10` aplica descuento y un código inválido informa el error.
- [ ] El contador del carrito en el header se actualiza tras cada cambio.

## Checkout y WhatsApp

- [ ] Checkout vacío ofrece volver al catálogo.
- [ ] Campos requeridos y email se validan antes de crear una orden.
- [ ] Resumen muestra subtotales y total consistentes con el carrito.
- [ ] PayPal y Mercado Pago muestran el modal de medio no habilitado.
- [ ] Crear pedido produce una referencia y registra los datos localmente.
- [ ] La vista de éxito enseña referencia, total y cantidad de artículos.
- [ ] WhatsApp abre el mensaje estructurado en el número de prueba configurado.
- [ ] El texto indica que el cliente debe revisar y enviar el mensaje.
- [ ] No se afirma que el pago esté realizado o el pedido confirmado.

## Perfil y administrador

- [ ] Perfil abre modal de iniciar sesión/registro y guarda los datos demo en este navegador.
- [ ] La opción Google informa que OAuth no está conectado.
- [ ] Historial muestra los pedidos locales creados.
- [ ] El acceso unificado reconoce las credenciales del administrador y abre el dashboard; el registro no aparece en la ruta protegida de administración.
- [ ] Restablecer demo recupera catálogo inicial y limpia el estado del navegador.
- [ ] El aviso de admin demo permanece visible.

## Responsive y accesibilidad

- [ ] Probar 320–479 px, 480–767 px, 768–1023 px, 1024–1279 px y ≥1280 px.
- [ ] En móvil aparece navegación inferior; en escritorio aparece navegación superior.
- [ ] No hay scroll horizontal involuntario.
- [ ] Se puede recorrer todo con teclado y hay foco visible.
- [ ] Los botones de iconos tienen nombre accesible.
- [ ] Las etiquetas describen los campos y los errores/confirmaciones usan `aria-live` cuando corresponde.
- [ ] Contraste y zoom al 200% son legibles.
- [ ] `prefers-reduced-motion` se respeta si se añaden animaciones no esenciales.

## SEO / performance

- [ ] Título, descripción, canonical y Open Graph corresponden al dominio real.
- [ ] `sitemap.xml`, `robots.txt` y `llms.txt` tienen URLs reales y consistentes.
- [ ] Favicon y Apple Touch Icon cargan.
- [ ] No hay errores 404 en recursos o fragmentos.
- [ ] Imágenes reales están comprimidas y no se cargan eager salvo la imagen principal.
- [ ] Se revisa la página con Lighthouse / PageSpeed tras reemplazar recursos de muestra.


## Validaciones base heredadas de Fase 2.2

- [ ] En móvil no se muestra el botón hamburguesa ni el menú de escritorio.
- [ ] La barra inferior muestra Inicio, Categorías, Favoritos y Perfil; la página activa queda resaltada.
- [ ] El inicio móvil muestra buscador con una sola lupa y sugerencias, hero horizontal, carrusel de categorías y dos tarjetas destacadas.
- [ ] En tablet/desktop se conserva el hero y la cuadrícula editorial de categorías originales.
- [ ] La sección de ubicación presenta dirección y mini mapa lado a lado sin desbordamiento.
- [ ] El bloque de contacto presenta copywriting y formulario en columnas en escritorio y apilados en móvil.
- [ ] El botón flotante de WhatsApp aparece en móvil y escritorio al llegar a ubicación y desaparece al desplazar hacia arriba.
- [ ] El onboarding solo aparece por debajo de 768 px y se ajusta al alto dinámico de la pantalla.
- [ ] El mapa abre Google Maps dentro de la tarjeta y permite cerrar el iframe.
- [ ] Las secciones aparecen con reveal perceptible; categorías en cascada y testimonios alternando izquierda/derecha.
- [ ] La ficha de producto móvil oculta el header y la navegación inferior al cargar; al desplazarse hacia abajo, aparecen los cuatro accesos de navegación.
- [ ] El panel admin muestra cards y modal de edición en móvil, sin tabla horizontal.
- [ ] El toast se oculta después de 2.6 segundos y no bloquea clics cuando está oculto.


## Validaciones específicas de Fase 2.3

- [ ] Las cinco categorías se revelan en secuencia de izquierda a derecha sin que la última aparezca anticipadamente.
- [ ] WhatsApp aparece al entrar en `info-contact-grid`, permanece visible al continuar hacia abajo y se oculta al volver por encima del inicio de esa sección.
- [ ] El botón Enviar consulta ocupa el ancho completo de los campos en desktop.
- [ ] Los inputs de autenticación permiten foco, escritura, edición y envío en acceso de cliente y administración demo.
- [ ] En desktop, los puntos de galería desplazan una imagen por vez y no muestran diapositivas apiladas.
- [ ] El modal de compartir ofrece WhatsApp, Facebook, X, copiar vínculo y menú nativo si está disponible.
- [ ] La guía de tallas se abre en modal, contiene equivalencias y puede cerrarse con el botón.
- [ ] Comprar ahora aparece primero, naranja y a ancho completo; Añadir al carrito aparece debajo.
- [ ] En móvil, el carrusel relacionado utiliza el ancho del contenedor sin flechas ocupando espacio ni overflow horizontal en la página.

### Regresión de autenticación demo — versión 2.3.1

- [ ] Abrir `admin.html`; escribir el correo y la contraseña carácter por carácter. Los valores no deben borrarse ni cambiar el contexto del modal.
- [ ] Verificar el acceso con las credenciales configuradas en `assets/js/config.js`; debe abrir el panel y cargar las 20 tarjetas de producto.
- [ ] Abrir `perfil.html` en una sesión limpia; escribir correo y contraseña. Los campos deben conservar el texto y permitir acceder al perfil.
- [ ] En el modal de cliente, cambiar a «Registrarme». Solo ese botón debe reconstruir los campos para mostrar el nombre; escribir en los inputs no debe cambiar de pestaña.

### Navegación móvil contextual en producto — versión 2.3.2

- [ ] En `producto.html` y viewport menor de 768 px, el header superior permanece oculto.
- [ ] Al cargar la ficha desde el inicio o el catálogo, aparece una flecha circular en la esquina superior izquierda de la imagen principal.
- [ ] La flecha regresa a la página interna anterior; cuando se abre el producto directamente, lleva al catálogo.
- [ ] La barra inferior de cuatro iconos está oculta al inicio de la ficha.
- [ ] Al desplazar la página más de 110 px, la barra inferior aparece con transición suave y permite abrir Inicio, Categorías, Favoritos y Perfil.
- [ ] La barra permanece accesible mientras se recorre descripción, productos relacionados y footer; al regresar al inicio de la ficha se oculta.
- [ ] En desktop, la flecha móvil y la barra inferior no aparecen; la navegación de escritorio se conserva.
- [ ] El contenido final de la ficha no queda oculto detrás de la navegación fija y respeta el área segura del dispositivo.



## Catálogo centralizado (v2.3.3)

- [ ] Cambiar `INITIAL_PRODUCTS[].name` y `INITIAL_PRODUCTS[].image` en `assets/js/data/products.js`; verificar tarjetas, detalle, carrito, favoritos, búsqueda, hero y promoción.
- [ ] Cambiar `CATEGORIES[].name`; verificar etiquetas en el Home móvil/desktop, filtros de catálogo, tarjetas de producto, ficha, carrito y selector del administrador.
- [ ] Cambiar `CATEGORIES[].representativeProductId`; verificar que cambie la imagen de la categoría en el Home.
- [ ] Cambiar los IDs de `HOME_SHOWCASE`; verificar hero móvil, hero desktop, promoción y onboarding.
- [ ] Con datos locales de una versión anterior, cargar el sitio y confirmar que el catálogo se sincroniza con el código nuevo sin borrar carrito, favoritos, perfil ni pedidos.
- [ ] Editar un producto desde el panel; comprobar que el cambio queda solo en el navegador actual y que no altera `products.js`.


## ShoeX 2.4.0 — Galería, publicidad, dashboard y Home

- [ ] Cada producto presenta tres diapositivas distintas: lateral (`image`), frontal (`imageFront`) y par (`imagePair`).
- [ ] Los tres puntos de paginación corresponden a la vista lateral, frontal y par; en móvil funcionan por toque/scroll y en desktop por clic.
- [ ] El admin muestra los tres campos de imagen en el modal de producto, precarga rutas y actualiza las miniaturas de vista previa al editar los campos.
- [ ] El Home consume anuncios independientes: `mobileHero`, `desktopHero` y `promotion`; cada banner utiliza su propio archivo y su `productId` de destino.
- [ ] Cambiar el copy o imagen de un anuncio desde el editor local se refleja al volver a Home, sin cambiar la galería del producto relacionado.
- [x] Prueba histórica 2.4.0: dashboard de pendientes/efectivos. Comportamiento sustituido en 2.5.0 por estados logísticos y descuento de stock al procesar.
- [ ] El Home presenta la sección de compra con confianza, la ilustración, cinco pasos, cambios, garantía de 3 meses, atención 24/7 y la nota de que son beneficios ilustrativos.
- [ ] Las preguntas frecuentes abren y cierran cada elemento `<details>` con teclado y toque.
- [ ] El footer conserva «Mi cuenta» y ya no publica un enlace «Administración demo».
- [ ] Al escribir credenciales de administrador en el login unificado, se redirige a `admin.html`; un cliente inicia sesión o se registra y llega a `perfil.html`.
- [ ] Abrir `admin.html` directamente sin sesión muestra login protegido y no permite registrar un usuario administrador.
- [ ] Confirmar que no hay cambio de contraseña frontend; el aviso y la documentación explican que la autenticación es solo demostrativa y no segura para producción.
- [ ] Cambiar `INITIAL_PRODUCTS` o `HOME_ADS`, publicar la nueva versión y verificar que la firma sincroniza catálogo y anuncios locales conservando carrito, favoritos, perfil e historial.
- [ ] Revisar imágenes de producto en 1200 × 900 px WebP y banners en las dimensiones documentadas; confirmar peso, alt y encuadre consistente.


## Revisión de versión 2.4.0 — publicación

- [ ] Confirmar que `package.json` declara `2.4.0` y el README identifica la versión publicada.
- [ ] Editar lateral, frontal y par de un producto desde el modal de Catálogo; revisar las tres diapositivas en `producto.html`.
- [ ] Cambiar cada `HOME_ADS[].image` y su texto/destino en Publicidad; comprobar hero móvil, hero desktop y promoción.
- [ ] Entrar al administrador desde Mi cuenta y desde `admin.html`; verificar que la cuenta administrativa no pueda registrarse como cliente.
- [x] Revisión histórica 2.4.0: estados pendientes/efectivos solo locales. En 2.5.0 se reemplazan por Pendiente, Empacado y Procesado.
- [ ] Revisar beneficios, pasos de compra y FAQ en móvil y escritorio.
- [ ] Publicar las imágenes en el repositorio; verificar que las rutas sean relativas a la raíz y que catálogo/anuncios se sincronicen por `CATALOG_VERSION`.


## ShoeX 2.4.1 — Sesión y bienvenida

- [ ] En una pestaña nueva y con viewport móvil, entrar a `index.html`; debe redirigir automáticamente a `onboarding.html`.
- [ ] Verificar el título «Step into style», el logotipo, el CTA «Comenzar» y el texto inferior; el diseño debe ocupar la altura visible usando `100dvh`.
- [ ] Pulsar «Comenzar» o «Saltar»; debe llegar a Home y no volver a mostrar onboarding al navegar/recargar en ese navegador.
- [ ] Abrir `onboarding.html` directamente en móvil después de haberlo visto; debe seguir disponible.
- [ ] Abrir `index.html` y `onboarding.html` en desktop; Home debe cargar y el onboarding debe redirigir al Home.
- [ ] En Cliente, iniciar sesión; el header debe identificar “Cliente”, la navegación a categorías, producto, carrito, favoritos y Home no debe pedir credenciales otra vez.
- [ ] En Administrador, iniciar sesión; el header debe identificar “Administrador”, acceder al panel y navegar por la tienda sin volver a pedir credenciales.
- [ ] Desde una página normal, pulsar el icono de cerrar sesión; debe desaparecer el indicador y el usuario debe seguir en la tienda sin sesión.
- [ ] Desde `perfil.html` o `admin.html`, cerrar sesión; debe regresar a `index.html`.
- [ ] Confirmar que cerrar sesión no borra carrito, favoritos, perfil, pedidos ni cambios locales de catálogo.
- [ ] Con rol Administrador activo, pulsar «Mi cuenta» desde el footer o Perfil desde la navegación móvil; debe volver al panel sin pedir credenciales.
- [ ] Confirmar que un Cliente no obtiene acceso al dashboard de administración; al abrir `admin.html` debe pedir credenciales administrativas.
- [ ] Revisar el onboarding con imagen 1080 × 1920 WebP y con imagen horizontal temporal; la primera debe cubrir el viewport y la segunda no debe recortar el producto.

## Regresión visual 2.4.2 — estilos
- [x] Restaurar `assets/css/pages.css` completo; el paquete 2.4.1 había omitido reglas de producto, modales, administración y responsive.
- [x] Mantener el onboarding 2.4.1: fondo vertical, degradados, título, CTA y `100dvh`.
- [x] Analizar las cinco hojas CSS sin errores de parseo.
- [x] Comprobar que están presentes las reglas de galería de producto, navegación móvil, modales, compra segura, FAQ y panel administrador.
- [x] Verificar sintaxis de todos los módulos JavaScript y parseo de las páginas HTML.
- [ ] Revisión manual final en navegadores/dispositivos físicos antes de publicar en producción.


## ShoeX 2.5.0 — pedidos, despacho, stock y colores

- [ ] Crear un pedido desde checkout; confirmar que se registra en estado **Pendiente** y que se conserva la instantánea de artículos, talla, color, cantidad, precio y entrega.
- [ ] Entrar como administrador y abrir el detalle de la compra; verificar el nombre y contacto del cliente, dirección, notas, fotos, variantes, cantidades y totales.
- [ ] Marcar un pedido pendiente como **Empacado**; verificar que su detalle y el historial del cliente muestran el nuevo estado y que el stock todavía no cambia.
- [ ] Marcar el pedido empacado como **Procesado**; verificar que el inventario disminuye por la cantidad comprada para cada ID de producto.
- [ ] Recargar Admin y Perfil; comprobar que el estado y el inventario se mantienen en el mismo navegador.
- [ ] Intentar procesar una orden cuyo stock haya sido reducido manualmente por debajo de la cantidad comprada; debe bloquear el cambio y conservar el estado Empacado.
- [ ] Confirmar que no es posible saltar de Pendiente directamente a Procesado.
- [ ] Confirmar que un pedido ya procesado no presenta otra acción de avance y que no vuelve a descontar inventario.
- [ ] Crear un pedido con varias líneas del mismo producto y comprobar que las cantidades se agrupan antes de descontar stock.
- [ ] Cargar datos de pedidos antiguos con `adminStatus: pending/effective`; verificar la migración a `fulfillmentStatus` sin descuento retroactivo.
- [ ] Abrir un producto en Administración; cambiar hasta tres nombres y tonos de color, guardar y verificar que la ficha muestra solo los colores configurados.
- [ ] Elegir cada color en la ficha y comprobar que el nombre seleccionado y el color asociado se guardan en la línea del carrito y en el pedido.
- [ ] Actualizar manualmente el stock desde el catálogo demo y verificar que la tarjeta de administración refleja la cantidad guardada.
- [ ] Restablecer datos demo y comprobar que productos, stock, colores y pedidos vuelven al catálogo inicial.
- [ ] Recordar que los datos son locales; probar en una pestaña/navegador diferente y confirmar que no existe sincronización entre dispositivos.
- [ ] Ejecutar comprobación sintáctica de JS, revisión HTML/CSS y prueba manual responsive antes de publicar.


### Verificación estática y lógica 2.5.0 (ejecutada en el entorno de desarrollo)

- [x] Sintaxis de los módulos JavaScript con `node --check`.
- [x] Parseo de las 15 páginas/fragmentos HTML.
- [x] Parseo de las cinco hojas CSS.
- [x] Prueba de transición Pendiente → Empacado → Procesado.
- [x] Prueba de descuento de inventario al procesar, incluyendo varias líneas del mismo producto.
- [x] Prueba de bloqueo por stock insuficiente y de prevención de descuento duplicado.
- [x] Prueba de migración de pedidos históricos `adminStatus` al nuevo `fulfillmentStatus`.
- [x] Validación del esquema de colores de los 20 productos.
- [ ] Prueba visual completa de los modales y pantallas en navegador móvil y escritorio.


## ShoeX 2.5.1 — Acceso desde header y entrada del Hero

- [ ] Iniciar sesión como cliente; desde Inicio, Catálogo, Producto y Carrito, pulsar la etiqueta «Cliente» del header y verificar que abre `perfil.html` sin solicitar credenciales de nuevo.
- [ ] Iniciar sesión como administrador; desde las mismas páginas, pulsar «Administrador» y verificar que abre `admin.html` sin volver a autenticar.
- [ ] Confirmar que el botón de cerrar sesión sigue siendo independiente y conserva carrito, favoritos y pedidos.
- [ ] En móvil, comprobar que la copia del hero entra desde el borde izquierdo y la creatividad desde el derecho, terminando en su posición original.
- [ ] En escritorio, comprobar la misma dirección de entrada: bloque de texto izquierda→derecha e imagen derecha→izquierda.
- [ ] Comprobar que el hero sigue mostrando las imágenes publicitarias actuales después de la hidratación dinámica y que el `src` de respaldo (`AirJordan.webp`) existe antes de que se ejecute JavaScript.
- [ ] Activar `prefers-reduced-motion: reduce` y verificar que el contenido aparece sin desplazamientos ni pérdida de visibilidad.
- [ ] Comprobar que la animación no provoca scroll horizontal ni altera el ancho del documento.
