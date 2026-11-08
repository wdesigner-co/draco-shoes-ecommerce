# Despliegue estático

## Recomendación

Este repositorio se puede desplegar en GitHub Pages, Netlify, Vercel o cualquier hosting de archivos estáticos con soporte para rutas relativas. No necesita build: los módulos JavaScript y el CSS se sirven tal como están.

## Pasos

1. Sustituye el dominio de ejemplo y el teléfono de WhatsApp en la configuración y metadatos.
2. Reemplaza los placeholders de producto y el contenido de muestra.
3. Prueba todas las páginas en servidor local. No uses `file://`.
4. Sube la carpeta completa conservando las rutas relativas.
5. Configura el dominio, HTTPS y la URL canónica del sitio.
6. Actualiza `sitemap.xml` con URLs absolutas reales y registra el sitemap en tu herramienta de webmaster.
7. Revisa las reglas de `robots.txt` para permitir únicamente las URLs que quieras indexar.

## GitHub Pages

- Publica desde la rama principal y la carpeta raíz (`/`).
- Conserva `.nojekyll` para evitar transformaciones de Jekyll.
- Habilita HTTPS desde la configuración del repositorio.
- Si el proyecto se publica bajo una subruta de repositorio, verifica rutas relativas y corrige canonical/OG/sitemap para reflejar la URL real.

## Netlify / Vercel

- Importa el repositorio y selecciona el directorio raíz como carpeta pública.
- No configures comando de build ni directorio de salida distinto de `.`.
- Añade las cabeceras de caché y seguridad en la configuración del hosting según la política del sitio. No se incluye una política CSP estricta por las dependencias CDN actuales.

## Antes de producción real

Este prototipo no puede procesar pagos, controlar inventario concurrente ni proteger una vista de administración. Para una tienda productiva hace falta backend con API, base de datos, autenticación/autorización de administradores, validación de inventario del lado servidor, cálculo de precios en servidor, integración oficial de pasarelas con credenciales protegidas, webhooks, registro de pedidos, privacidad, términos y políticas legales. Nunca almacenes secretos de pasarela o credenciales dentro de estos archivos estáticos.
