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

## Servidor local con proxy
```bash
node server.cjs
```

La app se sirve en http://localhost:8000/ y el endpoint `/api/wc-matches` proxy a la API de Football Data usando la clave guardada en `.env`.
# FIFA_WC_api
