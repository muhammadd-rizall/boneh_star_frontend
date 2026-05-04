# Boneh Star Frontend

Boneh Star is a bus management and booking platform. This repository contains the frontend application, built with React, Vite, and TypeScript.

## Project Overview
This is a modern web application designed for both public users and administrators to manage bus operations, bookings, and reporting.

- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router v7
- **API Client:** Axios (configured with interceptors for auth)

## Architecture
The project follows a feature-based architecture under `src/features/` and `src/page/`.
- `src/api/`: API client configurations.
- `src/components/`: Reusable UI and form components.
- `src/features/`: Domain-specific business logic (hooks, services, types).
- `src/page/`: Page-level components organized by access level (admin, customer, public).
- `src/store/`: Global state stores (Zustand).

## Building and Running

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Development Conventions
- **TypeScript:** Strict type checking is enabled.
- **Styling:** Use Tailwind CSS utility classes.
- **State Management:** Use Zustand for global state.
- **API:** Use the pre-configured `api` instance in `src/api/Axios.tsx` for all HTTP requests to ensure proper header handling and auth interceptors.
- **Routing:** Use React Router for all navigation. Ensure admin routes are wrapped in `DahsbordLayout`.
