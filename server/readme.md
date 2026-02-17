# Memorice API - Backend

API backend del proyecto Memorice eCommerce.

## Endpoints principales

### Auth
- **POST** `/api/auth/register`: registro de usuario
- **POST** `/api/auth/login`: login y entrega de JWT

### Productos
- **GET** `/api/products`: listar productos
- **GET** `/api/products/:id`: obtener producto por id
- **POST** `/api/products`: crear producto
- **PUT** `/api/products/:id`: actualizar producto
- **DELETE** `/api/products/:id`: eliminar producto

### Checkout
- **POST** `/api/checkout`: crea sesion de Stripe (ruta protegida por JWT)

### Usuario autenticado
- **GET** `/api/users/me`: obtiene perfil del usuario
- **PUT** `/api/users/me`: actualiza nombre/email del usuario
- **GET** `/api/users/me/orders`: lista compras del usuario

### Admin (rol `admin`)
- **GET/POST/PUT/DELETE** `/api/admin/products...`: gestion de catalogo y stock
- **GET/PUT** `/api/admin/users...`: gestion de clientes y roles
- **GET/PUT** `/api/admin/orders...`: revision y procesamiento de ventas + nota de contacto
- **GET/POST/PUT/DELETE** `/api/admin/news...`: gestion de noticias

### Noticias públicas
- **GET** `/api/news`: lista noticias publicadas

## Variables de entorno (`server/.env`)

- `PORT`: puerto del servidor
- `MONGODB_URI`: cadena de conexion a MongoDB Atlas
- `JWT_SECRET`: clave para firmar JWT
- `STRIPE_SECRET_KEY`: clave secreta de Stripe (`sk_test_...`)
- `FRONTEND_URL`: URL del frontend para redirecciones (`/success` y `/cart`)

## Scripts

- `npm run dev`: inicia servidor con nodemon
- `npm start`: inicia servidor

## Despliegue

- Sugerido: Render o Railway
- Build command: `npm install`
- Start command: `npm start`
- Configurar variables de entorno indicadas arriba

Para documentacion completa revisar el `README.md` de la raiz.