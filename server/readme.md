# API Backend – Memorice eCommerce

API del proyecto Memorice eCommerce (Node.js, Express, MongoDB, Stripe).

## Endpoints principales

### Auth
- `POST /api/auth/register` – Registro de usuario
- `POST /api/auth/login` – Login y JWT

### Productos
- `GET /api/products` – Listar productos activos
- `GET /api/products/:id` – Obtener producto por id
- `POST /api/products` – Crear producto (admin)
- `PUT /api/products/:id` – Actualizar producto (admin)
- `DELETE /api/products/:id` – Eliminar producto (admin)

### Checkout
- `POST /api/checkout` – Crear sesión Stripe y orden en BD (requiere JWT). Redirige a Stripe Checkout; `success_url` incluye `orderId`.
- `GET /api/checkout/order/:orderId` – Obtener `codigoPedido` y `estado` de una orden (público, para la página de éxito).
- `POST /api/checkout/webhook` – Webhook Stripe (`checkout.session.completed`). Debe recibir body raw; en este servidor se monta con `express.raw({ type: 'application/json' })` antes de `express.json()`.

### Usuario autenticado
- `GET /api/users/me` – Perfil del usuario
- `PUT /api/users/me` – Actualizar nombre/email
- `GET /api/users/me/orders` – Historial de compras
- `GET /api/users/me/orders/:id` – Detalle de una compra

### Admin (rol `admin`)
- Productos: CRUD y control de visibilidad/orden
- Usuarios: listar, editar, eliminar
- Órdenes/ventas: listar, ver detalle, cambiar estado, exportar
- Noticias: CRUD
- Contacto: ver mensajes

### Público
- `GET /api/news` – Listar noticias publicadas
- `POST /api/contact` – Enviar mensaje de contacto

## Variables de entorno

- `PORT` – Puerto del servidor
- `MONGODB_URI` – Conexión MongoDB Atlas
- `JWT_SECRET` – Clave JWT
- `STRIPE_SECRET_KEY` – Clave secreta Stripe (`sk_test_...`)
- `STRIPE_WEBHOOK_SECRET` – Signing secret del webhook Stripe (`whsec_...`)
- `FRONTEND_URL` – URL del frontend (para `success_url` y `cancel_url`)

## Scripts

- `npm run dev` – Servidor con nodemon
- `npm start` – Servidor en producción

Para descripción del proyecto y despliegue ver el `README.md` de la raíz del repositorio.
