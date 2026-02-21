# Proyecto 7 eCommerce

Proyecto final del bootcamp de desarrollo web full stack: aplicación de comercio electrónico para **Proyecto Memorice** (marca del cliente). Los usuarios pueden registrarse, explorar el catálogo, agregar productos al carrito y pagar con tarjeta vía Stripe (modo pruebas). Incluye panel de administración para productos, usuarios, ventas y noticias.

## Qué hace la aplicación

- **Público:** Catálogo, noticias, secciones informativas (proyecto, colaboraciones, contacto).
- **Cliente registrado:** Inicio de sesión, perfil editable, carrito, checkout en Stripe, historial de compras con número de pedido (formato SOxxxx).
- **Administrador:** Panel en `/admin`: CRUD de productos (visibilidad y orden), usuarios, ventas (estados recibido/procesado/entregado), noticias y mensajes de contacto. Las órdenes se marcan como pagadas mediante webhook de Stripe.

## Stack (MERN + Stripe)

- **Frontend:** React (Vite), React Router, Context API, Axios.
- **Backend:** Node.js, Express, JWT, bcryptjs, Stripe.
- **Base de datos:** MongoDB Atlas (Mongoose).
- **Pasarela de pago:** Stripe (modo test).

## En producción

| Entorno | URL |
|---------|-----|
| Frontend | https://proyecto7ecommerce.vercel.app/ |
| Backend  | https://proyecto7ecommerce.onrender.com |
| Webhook Stripe | https://proyecto7ecommerce.onrender.com/api/checkout/webhook |

*Las credenciales de prueba (usuario admin y cliente) se envían en el correo de entrega del proyecto, no se publican en este repositorio.*

## Cómo usar el proyecto

### Ejecución en local

1. **Backend:** `cd server`, `npm install`, `npm run dev` (servidor en `http://localhost:4000` por defecto).
2. **Frontend:** `cd client`, `npm install`, `npm run dev` (app en `http://localhost:5173`).
3. Crear `server/.env` según la tabla de variables más abajo (referencia en `server/.env.example`). En `client`, crear `.env` con `VITE_API_URL=http://localhost:4000` y `VITE_STRIPE_PUBLIC_KEY` (clave pública de Stripe en modo test).

### Despliegue

- **Backend (Render):** Raíz `server`, build `npm install`, start `npm start`. Configurar en el servicio las variables de entorno del backend.
- **Frontend (Vercel):** Raíz `client`, build `npm run build`, directorio de salida `dist`. Variables: `VITE_API_URL` (URL del backend) y `VITE_STRIPE_PUBLIC_KEY`.

### Variables de entorno

**Backend (`server/.env`):**

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (ej. 4000). |
| `MONGODB_URI` | Cadena de conexión MongoDB Atlas. |
| `JWT_SECRET` | Clave para firmar JWT. |
| `STRIPE_SECRET_KEY` | Clave secreta Stripe test (`sk_test_...`). |
| `STRIPE_WEBHOOK_SECRET` | Signing secret del webhook Stripe (`whsec_...`). |
| `FRONTEND_URL` | URL del frontend (ej. `https://proyecto7ecommerce.vercel.app`) para redirecciones de Stripe. |

**Frontend (`client/.env`):**

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL del backend (ej. `https://proyecto7ecommerce.onrender.com`). |
| `VITE_STRIPE_PUBLIC_KEY` | Clave pública Stripe test (`pk_test_...`). |

**Webhook Stripe:** En Stripe Dashboard (Developers → Webhooks), añadir endpoint con URL `https://proyecto7ecommerce.onrender.com/api/checkout/webhook` y evento `checkout.session.completed`. El signing secret se configura en `STRIPE_WEBHOOK_SECRET` en el backend.

### Prueba de pago (Stripe test)

- Tarjeta: `4242 4242 4242 4242`
- Fecha y CVC: cualquier valor futuro/válido.

---

**Proyecto 7 eCommerce** — Desarrollo: Tiúke Studio.
