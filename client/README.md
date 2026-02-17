# Frontend - Memorice eCommerce

Aplicacion React (Vite) del proyecto Memorice eCommerce.

## Scripts

- `npm run dev`: inicia entorno de desarrollo
- `npm run build`: genera build de produccion
- `npm run preview`: previsualiza build local
- `npm run lint`: revisa estilo/codigo con ESLint

## Variables de entorno

Crear `client/.env` usando `client/.env.example`:

```env
VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
```

## Despliegue

- Sugerido: Vercel o Netlify
- Build command: `npm run build`
- Output directory: `dist`
- Variables requeridas: `VITE_API_URL`, `VITE_STRIPE_PUBLIC_KEY`

## Rutas relevantes

- `/perfil`: perfil del cliente y edicion de datos
- `/admin`: panel administrativo (solo rol `admin`)

Para documentacion completa del proyecto revisar el `README.md` de la raiz.
