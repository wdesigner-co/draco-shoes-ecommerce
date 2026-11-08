# Flujo de experiencia y compra

## Recorrido principal

```mermaid
flowchart TD
    A[Primera visita móvil] --> B0[Onboarding Step into style]
    B0 --> B[Inicio ShoeX]
    A2[Visita posterior o desktop] --> B
    B --> C[Catálogo / Categorías]
    B --> D[Productos destacados]
    C --> E[Tarjeta de producto]
    D --> E
    E --> F[Detalle del producto]
    F --> G{Seleccionar talla y color}
    G --> H[Añadir al carrito]
    H --> I[Carrito]
    I --> J{¿Seguir comprando?}
    J -- Sí --> C
    J -- No --> K[Checkout]
    K --> L[Datos de contacto y entrega]
    L --> M[Resumen y validación]
    M --> N{Método elegido}
    N -- PayPal / Mercado Pago --> O[Modal: no habilitado]
    O --> N
    N -- WhatsApp --> P[Crear pedido local]
    P --> Q[Pedido exitoso]
    Q --> R[Mensaje estructurado wa.me]
    R --> S[Cliente revisa y envía en WhatsApp]
    S --> T[Confirmación manual del vendedor]
```

## Flujo de preparación y despacho

```mermaid
stateDiagram-v2
    [*] --> Pendiente: Cliente crea pedido
    Pendiente --> Empacado: Administrador prepara artículos
    Empacado --> Procesado: Administrador registra despacho
    Procesado: Descuenta stock local una vez
    Procesado --> [*]
```

El administrador consulta el detalle de cada pedido antes de avanzar. El inventario solo se reduce al pasar de Empacado a Procesado y el historial de Perfil refleja el mismo estado.

## Ramas complementarias

```mermaid
flowchart LR
    A[Catálogo] --> B[Favoritos]
    A --> C[Detalle]
    B --> C
    D[Perfil] --> E[Guardar datos locales]
    D --> F[Historial de pedidos]
    G[Acceso admin por login unificado] --> H[Editar producto]
    H --> I[Guardar en localStorage]
    I --> A
    J[Carrito] --> K[Aplicar / retirar SHOE10]
    K --> J
```

## Estados y persistencia

| Estado | Dónde se guarda | Duración / alcance |
|---|---|---|
| Carrito | `localStorage` | En el mismo navegador y origen |
| Favoritos | `localStorage` | En el mismo navegador y origen |
| Perfil | `localStorage` | En el mismo navegador y origen |
| Catálogo editado | `localStorage` | En el mismo navegador y origen |
| Pedidos demo | `localStorage` | Historial local, no compartido con vendedor |
| Último pedido | `sessionStorage` + query string | Contexto de navegación actual; orden completa en localStorage |
| Código promocional | `localStorage` | Hasta retirar cupón, completar pedido o limpiar datos |

## Reglas de interacción

- Cada variante de carrito se identifica por producto + talla + color. La cantidad se valida contra el stock local configurado.
- Las páginas de carrito y checkout recalculan subtotal, descuento, envío y total a partir del estado persistido; no toman el importe de elementos visuales.
- `SHOE10` aplica el porcentaje definido en `assets/js/config.js` sobre el subtotal.
- Al crear la orden se guarda una copia del detalle del producto, sus variantes, totales y datos del comprador; después se vacía el carrito y se elimina el cupón.
- Al crear el pedido, su estado logístico es **Pendiente**. El cliente puede abrir el detalle desde el historial y ver los cambios posteriores.
- El administrador abre el detalle del pedido para consultar los artículos, tallas, colores, cantidades, totales y dirección de entrega.
- La transición permitida es **Pendiente → Empacado → Procesado**. No se permite saltar pasos ni procesar un pedido que no se haya empacado.
- Al cambiar a **Procesado**, el prototipo agrupa las cantidades por referencia, valida stock y descuenta el inventario local una sola vez.
- Si el inventario es insuficiente o ya no existe una referencia, el pedido permanece **Empacado** y el administrador recibe un mensaje.
- El estado actualizado se refleja en el historial local del cliente. No representa un pago o despacho real.
- El mensaje WhatsApp se compone a partir de la orden local, se codifica para URL y no se envía automáticamente.


## Sesión y cierre de sesión

```mermaid
flowchart TD
    A[Mi cuenta / Perfil] --> B[Modal de acceso unificado]
    B --> C{Credenciales}
    C -->|Cliente| D[Guardar rol cliente en sessionStorage]
    C -->|Administrador| E[Guardar rol admin en sessionStorage]
    D --> F[Perfil y navegación libre por la tienda]
    E --> G[Dashboard y navegación libre por la tienda]
    F --> H[Header: Cliente · Cerrar sesión]
    G --> I[Header: Administrador · Cerrar sesión]
    H --> J[Cerrar sesión: limpiar solo sesión]
    I --> J
    J --> K[Inicio sin autenticación]
```

La sesión permanece activa al cambiar de página dentro de la misma pestaña. El cierre de sesión no elimina carrito, favoritos, catálogo local ni pedidos.
