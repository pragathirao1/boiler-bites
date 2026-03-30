# Boiler Bites

Boiler Bites is a React application scaffolded with Vite and styled using Tailwind CSS. It's structured around a simple food/venue ordering dashboard and student-facing app. The repository contains prebuilt pages and data utilities to support a campus-food ordering or dining-dashboard style application.

## Tech stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Framer Motion (animations)
- Recharts (simple charts/analytics)
- EmailJS (for sending email from the browser)

## Project structure (key files / folders)

- `index.html` — Vite entry HTML.
- `src/main.jsx` — React entrypoint; mounts the app.
- `src/App.jsx` — App component and routes.
- `src/index.css` — Tailwind imports / base styles.

Folders:
- `src/pages/` — Top-level page components:
  - `LandingPage.jsx` — Public landing page.
  - `StudentApp.jsx` — Student-facing ordering UI.
  - `KitchenDashboard.jsx` — Dashboard for kitchen/staff.
  - `VenueSelection.jsx` — Venue selection UI.
- `src/contexts/` — React Contexts (e.g., `FoodContext.jsx`) for global state.
- `src/data/` — Static data used across the app (e.g., `menuItems.js`, `venues.js`, `analytics.js`).
- `src/constants/` — Small constant files (e.g., `venues.js`).
- `src/utils/` — Utilities (e.g., `cn.js` for conditional classNames).

## What this repo provides

- A simple multi-page React app wired with React Router.
- Sample data for venues and menu items intended to demonstrate how pages consume data.
- A `FoodContext` to share selected venue/menu state across pages.
- A basic dashboard page with analytics (uses `recharts`).

## Single-page app and multi-role logins

This repository is implemented as a single-page application (SPA) using React and React Router. "Single-page" means the app is delivered as one HTML file (`index.html`) and navigation between views is handled client-side without full page reloads.

The project supports two distinct user roles (Aramark employees and students). Both roles can be implemented inside the same SPA by using different routes and role-based route protection:

- Aramark employees: the kitchen/staff UI is represented by `src/pages/KitchenDashboard.jsx` (example route `/kitchen`).
- Students: the student-facing ordering UI is `src/pages/StudentApp.jsx` (example route `/app` or `/student`).

How this works in practice:

- React Router switches components based on the URL (client-side). That keeps navigation fast and preserves the SPA characteristic.
- An `AuthContext` (or similar) stores the signed-in user and their role (e.g., `role: 'employee' | 'student'`).
- Protected routes (a small wrapper component, often called `ProtectedRoute`) check the user's role before rendering a route and redirect to a login or "not authorized" page if needed.

Simple pattern (high level):

- On sign-in, the app receives a session token or user object from your backend and stores it in memory and/or `localStorage` (or uses an HttpOnly cookie for better security).
- `AuthContext` exposes the current user and helper functions (signIn, signOut).
- `ProtectedRoute` reads `AuthContext` and either renders the child route or redirects.

Security notes and options:

- For prototypes, storing a token in `localStorage` is common but has XSS risks; using HttpOnly cookies with server-side session validation is safer for production.
- Always validate role/permissions on the server for any sensitive operations (front-end checks are only for UX and convenience).

If you'd like, I can scaffold a small `AuthContext` and `ProtectedRoute` component in the repo and wire the `KitchenDashboard` and `StudentApp` routes to demonstrate the full flow.

## Setup and run (local development)

Make sure you have Node.js installed (recommended v16+ or newer). Then in the project root run:

```bash
npm install
npm run dev
```

The app will run with Vite's dev server (by default at http://localhost:5173).

Available npm scripts (from `package.json`):

- `npm run dev` — Start Vite dev server.
- `npm run build` — Build production assets with Vite.
- `npm run preview` — Preview the production build locally.

## Notes on extending the app

- To add authentication, insert an auth provider at `src/main.jsx` and protect routes in `src/App.jsx`.
- Replace the `src/data/*.js` files with API calls for a real backend. Keep the `FoodContext` as a convenient place to cache fetched data and share state.
- To persist cart/selection state across reloads, add localStorage or integrate a backend session.

## Tests

This repository doesn't include automated tests by default. If you'd like, I can add a small test setup using Vitest + React Testing Library and a couple of basic tests (rendering and route navigation).

## Contact / Contribution

This project is a small demo scaffold. If you want help adding features (authentication, API integration, or deployment), tell me what you'd like and I can implement it.

---

(Generated README summarizing the current repository files: App pages, contexts, data files, Vite + Tailwind setup.)
