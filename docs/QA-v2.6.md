# Draco Shoes 2.6 — Plan de validación

Rama: feature/v2.6  
Base: main con SEO técnico y Open Graph.

## 1. Encabezado y sesión

- [ ] Sin sesión: el icono de usuario aparece en escritorio.
- [ ] Al activar el icono sin sesión: se abre el modal de autenticación.
- [ ] Acceso de cliente: el botón identifica «Cliente».
- [ ] Acceso administrativo: el botón identifica «Administrador».
- [ ] Con sesión de cliente, el menú ofrece «Mi perfil» y «Cerrar sesión».
- [ ] Con sesión administrativa, el menú ofrece «Panel de administración» y «Cerrar sesión».
- [ ] El clic fuera del menú lo cierra.
- [ ] Escape cierra el menú y devuelve el foco al botón.
- [ ] Flechas arriba/abajo recorren las opciones del menú.
- [ ] Cerrar sesión conserva carrito, favoritos, perfil y pedidos.
- [ ] En móvil el header conserva el comportamiento anterior y la navegación inferior sigue funcionando.

## 2. Perfil y teléfono

- [ ] El selector muestra +1 Estados Unidos, +57 Colombia y +58 Venezuela.
- [ ] El teléfono se guarda con prefijo y número en campos separados.
- [ ] El campo legado phone se conserva concatenado para checkout y pedidos.
- [ ] Un perfil creado antes de 2.6 con teléfono sin prefijo se conserva y adopta +57.
- [ ] Un teléfono legado que comience con +1, +57 o +58 se separa correctamente.
- [ ] Guardar y volver a abrir el perfil conserva país y número.

## 3. Galería de producto

- [ ] Hacer clic en cada una de las tres fotografías abre el visor con esa vista seleccionada.
- [ ] El visor cierra con X, clic en el fondo y Escape.
- [ ] Las flechas del visor recorren las imágenes.
- [ ] En escritorio, las flechas laterales recorren la galería principal.
- [ ] En móvil, los puntos y el desplazamiento táctil siguen sincronizados.
- [ ] Dentro del visor móvil, deslizar a izquierda/derecha cambia de fotografía.
- [ ] Cambiar de color reinicia la galería a la primera vista y actualiza la imagen del visor.

## 4. Variantes y administrador

- [ ] Las opciones de color se presentan como miniaturas e indican el color seleccionado.
- [ ] Una variante con tres rutas completas muestra su galería propia.
- [ ] Una variante sin fotos propias conserva la galería general y presenta el aviso de fotos pendientes.
- [ ] En el administrador, las rutas de las variantes 2 y 3 permiten previsualizar sus imágenes.
- [ ] El formulario rechaza una galería parcial; acepta las tres rutas o las tres vacías.
- [ ] El formulario exige configurar el color 2 antes del color 3.
- [ ] Guardar y volver a editar conserva nombres, tonos y rutas de las variantes.
- [ ] El carrito y el pedido conservan la imagen del color seleccionado.

## 5. Datos demo y regresión

- [ ] El cambio de versión de catálogo carga las nuevas variantes semilla sin borrar perfil, carrito, favoritos ni pedidos.
- [ ] Agregar al carrito, actualizar cantidades, checkout e historial siguen funcionando.
- [ ] La administración mantiene los flujos de pedidos y publicidad existentes.
- [ ] Las páginas siguen cargando componentes compartidos, fuentes, CSS, Vercel Analytics y PostHog.
- [ ] El head de la página principal mantiene canonical, Open Graph, Twitter Card y JSON-LD de Draco Shoes.

## Datos de variante incluidos en el catálogo semilla

Nike Air Force 1 (SHX-005) utiliza imágenes ya existentes para:
- Blanco / Gris.
- Negro / Naranja.

Azul / Blanco queda como variante sin imágenes propias hasta que se registren sus tres rutas en el administrador. En los demás productos, las galerías por color se habilitan al introducir las rutas de cada variante.

## Alcance de validación

La sintaxis de los módulos JavaScript modificados se comprueba estáticamente. La revisión visual y las pruebas de interacción deben completarse en la URL Preview de Vercel, tanto en escritorio como en móvil, antes de fusionar la rama con main.

La autenticación, el catálogo y los cambios del administrador siguen siendo locales al navegador. Esta versión no incorpora autenticación real, servidor ni sincronización remota.
