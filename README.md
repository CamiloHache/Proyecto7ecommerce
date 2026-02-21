# Memorice eCommerce – Proyecto Fullstack

Aplicación fullstack de comercio electrónico para Proyecto Memorice: catálogo de productos, carrito, autenticación con JWT, pasarela de pagos Stripe (modo pruebas) y panel de administración.

## Stack

- **Frontend:** React (Vite), React Router, Context API, Axios
- **Backend:** Node.js, Express, JWT, bcryptjs, Stripe
- **Base de datos:** MongoDB Atlas (Mongoose)

## Funcionalidades

- Registro e inicio de sesión con JWT
- Catálogo de productos y detalle por producto
- Carrito de compras (solo usuarios autenticados)
- Checkout protegido por token y redirección a Stripe Checkout
- Página de compra exitosa con número de pedido (SOxxxx)
- Perfil de usuario con historial de compras
- Roles cliente/admin y panel administrativo (productos, usuarios, ventas, noticias, contacto)
- Webhook Stripe para marcar órdenes como pagadas

## Despliegue

Indica aquí las URLs de tu despliegue:

- **Frontend:** (ej. Vercel/Netlify)
- **Backend:** (ej. Render/Railway)

## Variables de entorno

### Backend (`server/.env`)

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (ej. 4000) |
| `MONGODB_URI` | Cadena de conexión MongoDB Atlas |
| `JWT_SECRET` | Clave para firmar JWT |
| `STRIPE_SECRET_KEY` | Clave secreta Stripe test (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret del webhook Stripe (`whsec_...`) |
| `FRONTEND_URL` | URL pública del frontend (redirecciones) |

### Frontend (`client/.env`)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL pública del backend |
| `VITE_STRIPE_PUBLIC_KEY` | Clave pública Stripe test (`pk_test_...`) |

### Webhook Stripe

En el Dashboard de Stripe (Developers → Webhooks) configura un endpoint con la URL `https://TU_BACKEND/api/checkout/webhook` y el evento `checkout.session.completed`. Usa el signing secret que te entrega Stripe en `STRIPE_WEBHOOK_SECRET`.

## Ejecución local

**Backend:**

```bash
cd server
npm install
npm run dev
```

**Frontend:**

```bash
cd client
npm install
npm run dev
```

## Despliegue sugerido

- **Backend (Render/Railway):** raíz `server`, build `npm install`, start `npm start`. Configurar todas las variables de entorno del backend.
- **Frontend (Vercel/Netlify):** raíz `client`, build `npm run build`, salida `dist`. Configurar `VITE_API_URL` y `VITE_STRIPE_PUBLIC_KEY`.

## Prueba de pago (Stripe test)

- Número de tarjeta: `4242 4242 4242 4242`
- Fecha y CVC: cualquier valor válido

## Evaluación según rúbrica del proyecto

| Área | Peso | Cumplimiento estimado |
|------|------|----------------------|
| Gestión de productos | 30% | CRUD productos, catálogo, detalle, listado; admin con visibilidad y orden |
| Autenticación | 30% | Registro, login, JWT, perfil, rutas privadas, roles cliente/admin |
| Pasarela de pagos / eCommerce | 20% | Carrito, checkout protegido, Stripe Checkout, página success con número de pedido, webhook |
| Despliegue | 20% | Completar al publicar front y back y actualizar URLs en este README |
| Entrega a tiempo | 10% | Según calendario del bootcamp |

Documentación detallada del API en `server/readme.md`.
