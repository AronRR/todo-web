# Todo List App — Web

Proyecto web desarrollado con Next.js como complemento del proyecto móvil (React Native + Expo). Consume el mismo backend Quarkus y usa Firebase Authentication.

## Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Axios con interceptors JWT

## Variables de entorno

Crear `.env.local` con:

```env
NEXT_PUBLIC_API_URL=https://backtodolist-ccu4.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Ver `.env.example` para referencia.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Deploy

Deployado en Vercel: [URL pública aquí]

Backend: https://backtodolist-ccu4.onrender.com

## Usuario de prueba

Se crea en el video de demostración.
