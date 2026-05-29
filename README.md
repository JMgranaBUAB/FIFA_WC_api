# Football WC React App

Aplicación React que muestra los partidos de la Copa del Mundo consumiendo la API de football-data.

## Requisitos
- Node.js 18+
- npm

## Instalación
```bash
npm install
```

## Desarrollo
```bash
npm run dev
```

## Build de producción
```bash
npm run build
```

## Despliegue en Vercel
En Vercel, define la variable de entorno `FOOTBALL_API_KEY` (o `API_KEY`) con la clave de Football Data.

La app usa `/api/wc-matches` como endpoint. En desarrollo local, Vite proxyá esa ruta a la API; en Vercel, la ruta la resuelve la función serverless incluida en `api/`.
