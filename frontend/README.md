# Renewly — Dashboard

A dark-mode SaaS dashboard for tracking subscriptions, monitoring monthly spend, and getting automated renewal reminders.

## Tech Stack

- **Framework:** TanStack Start (React + SSR)
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State / Data:** TanStack Query
- **Language:** TypeScript

## Development

```bash
npm install
npm run dev
```

The frontend dev server proxies `/api` requests to the backend at `http://localhost:5500`.
Make sure the backend is running before testing API calls.

## Environment Variables

Create a `.env` file in this folder:

```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

In development this is not needed — the Vite proxy handles routing to `localhost:5500`.

## Production Build

```bash
npm run build
```
