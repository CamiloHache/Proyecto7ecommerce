# Memorice eCommerce - Proyecto Fullstack

Aplicacion fullstack de comercio electronico para Memorice. Permite registro/login de usuarios, catalogo de productos, carrito de compras y pago en Stripe (modo pruebas), con backend en Node/Express y base de datos MongoDB Atlas.

## Stack tecnologico

- Frontend: React + Vite, React Router, Context API, Axios
- Backend: Node.js, Express, JWT, bcryptjs, Stripe
- Base de datos: MongoDB Atlas (Mongoose)

## Funcionalidades principales

- Registro e inicio de sesion con JWT
- Catalogo de productos y detalle por producto
- Carrito de compras con calculo de total
- Checkout protegido por token
- Redireccion a Stripe Checkout
- Pagina de compra exitosa y limpieza automatica del carrito
- Perfil cliente editable con historial de compras
- Roles cliente/admin con panel administrativo
- Modulos admin para productos, clientes, ventas y noticias

## URLs de despliegue

- Frontend (Vercel/Netlify): **PENDIENTE_AGREGAR_URL**
- Backend (Render/Railway): **PENDIENTE_AGREGAR_URL**

Cuando despliegues, reemplaza estos campos por las URLs reales de produccion.

## Variables de entorno

### Backend (`server/.env`)

- `PORT`: puerto del servidor (ej. `4000`)
- `MONGODB_URI`: cadena de conexion de MongoDB Atlas
- `JWT_SECRET`: clave para firmar tokens JWT
- `STRIPE_SECRET_KEY`: clave secreta de Stripe en modo test (`sk_test_...`)
- `FRONTEND_URL`: URL publica del frontend (ej. `https://tu-front.vercel.app`)

### Frontend (`client/.env`)

- `VITE_API_URL`: URL publica del backend (ej. `https://tu-api.onrender.com`)
- `VITE_STRIPE_PUBLIC_KEY`: clave publica de Stripe en modo test (`pk_test_...`)

## Roles y acceso

- Registro publico crea usuarios con rol `cliente`.
- Para habilitar un usuario administrador, cambia su campo `rol` a `admin` en MongoDB.
- El panel admin queda disponible en la ruta `/admin` para usuarios con rol `admin`.
- Las operaciones sensibles de catalogo (crear/editar/eliminar) requieren token valido y rol `admin`.

## Checklist de validacion por hito

- Cliente no autenticado: no accede a `/perfil` ni `/admin`.
- Cliente autenticado: ve navbar contextual (`Hola <nombre>`), puede comprar y ver historial en perfil.
- Admin autenticado: accede a `/admin` y puede gestionar productos, clientes, ventas, noticias y contactos.
- Frontend: todas las llamadas HTTP usan `VITE_API_URL` como base.
- Calidad minima: correr `npm run lint` y `npm run build` en `client` antes de desplegar.

## Ejecucion local

### 1) Backend

```bash
cd server
npm install
npm run dev
```

### 2) Frontend

```bash
cd client
npm install
npm run dev
```

## Despliegue sugerido

### Backend en Render o Railway

- Conecta el repo y selecciona la carpeta `server`
- Build command: `npm install`
- Start command: `npm start`
- Configura variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `FRONTEND_URL`

### Frontend en Vercel o Netlify

- Conecta el repo y selecciona la carpeta `client`
- Build command: `npm run build`
- Output directory: `dist`
- Configura variables: `VITE_API_URL`, `VITE_STRIPE_PUBLIC_KEY`

## Prueba de pago (Stripe test)

Tarjeta de prueba recomendada:

- Numero: `4242 4242 4242 4242`
- Fecha: cualquiera futura
- CVC: cualquiera de 3 digitos
