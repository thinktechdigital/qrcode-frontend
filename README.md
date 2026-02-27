# QR & Barcode Frontend

React + Vite frontend for the QR/Barcode system.

## Tech Stack
- React 19
- React Router
- Vite

## Features
- User/Admin login flow
- QR code generator
  - URL
  - Text
  - Contact Card (vCard) with live phone preview
  - PDF link with live phone preview
- Barcode generator
- My Codes listing and management
- Admin analytics and user management
- Public pages:
  - `/c/:slug` (public vCard)
  - `/p/:slug` (public PDF landing page)

## Prerequisites
- Node.js 18+
- npm 9+

## Environment Variables
Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

## Install
```bash
cd Frontend
npm install
```

## Run (Development)
```bash
npm run dev
```

Default local URL: `http://localhost:5173`

## Build
```bash
npm run build
```

## Preview Production Build
```bash
npm run preview
```

## Lint
```bash
npm run lint
```

## Deployment Notes
- Set `VITE_API_URL` to the deployed backend URL.
- Ensure backend CORS allows your frontend domain in production.
- Do not commit `.env` files.
