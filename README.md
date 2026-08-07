# 🌟 Boneh Star Frontend

The modern, high-performance web frontend for the **Boneh Star** bus management and booking platform. Built from the ground up using **React 19**, **Vite**, and **TypeScript**, styled with the cutting-edge **Tailwind CSS v4**, and driven by lightweight state management.

---

## 🚀 Tech Stack & Core Libraries

- **Core Framework:** [React 19](https://react.dev) (Functional components, hooks, optimized rendering)
- **Build & Dev Tooling:** [Vite](https://vitejs.dev) (Instant hot module replacement, optimized production bundles)
- **Language:** TypeScript (Strict type safety, self-documenting code)
- **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com) (Modern CSS-first configuration, fluid layouts)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Super-fast, boilerplate-free global stores for auth, toasts, and navigation)
- **Routing Engine:** [React Router v7](https://reactrouter.com) (Modern routing, nested routes, and route-redirect guards)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com) (Accessible, customizable primitives built on Radix UI)
- **Icons:** Lucide React, FontAwesome, SVG-React

---

## 🛠️ Key Features

### 🚌 Customer Portal
- **Interactive Booking Wizard:** A step-by-step form to select destinations, activities, seat capacity, travel dates, and select specific buses manually or via automatic recommendations.
- **Auto-Selection Engine:** A smart backtracking and greedy search algorithm that automatically matches the best combination of buses based on passenger count and requested vehicle count.
- **Booking List & Detail Tracker:** Real-time booking status tracking (pending, quoted, ongoing, completed, cancelled) with responsive timeline steps.
- **Quotation & Negotiation Interface:** View official quotes from admins, accept prices, request revisions/negotiate custom pricing with support notes, or chat directly via WhatsApp.
- **Secure Payment Flow:** Upload bank transfer proof directly with instant preview and download official invoices in PDF format.
- **Customer Profiles:** Easy profile management including avatar uploads and booking statistics.

### 👑 Admin Control Panel
- **Comprehensive Dashboard:** Analytics reports, income charts, and fleet availability statuses.
- **Fleet Management:** CRUD operations for bus fleets, categories, and facilities with multi-image upload galleries.
- **Booking & Order Fulfillment:** View requests, send custom price quotations, review payments, assign drivers & buses, and finalize bookings.
- **Role-Based Access Control (RBAC):** Manage roles and system permissions for administrators, staff, and drivers.

---

## 📋 Prerequisites

- **Node.js** >= 20.x (Recommended: LTS)
- **NPM** >= 10.x or **PNPM**

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd boneh-star-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your backend API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Launch Local Development Server:**
   ```bash
   npm run dev
   ```
   *Your app will be running at `http://localhost:5173`.*

5. **Build & Optimize for Production:**
   ```bash
   npm run build
   ```
   *Compiles the application into highly-optimized, static assets in the `dist/` directory.*

---

## 🏗️ Project Architecture & Directory Structure

The codebase is organized using a **modular feature-based structure**, separating domain-specific modules for clean code organization, separation of concerns, and easy scalability.

```text
boneh-star-frontend/
├── public/                 # Static assets (favicons, fallback images)
├── src/
│   ├── api/                # Axios instance, API clients, and auth interceptors
│   ├── assets/             # Global fonts, icons, and base stylesheets
│   ├── components/         # Global reusable UI primitives (buttons, modals, skeleton loaders)
│   ├── features/           # Modular domain-specific features
│   │   ├── admin/          # Admin dashboard, fleet management, roles, and reports
│   │   ├── auth/           # Login, registration, password recovery flows
│   │   ├── customer/       # Customer bookings, profile, and payment sections
│   │   └── public/         # Homepage, public fleet grid, about us page
│   ├── hooks/              # Custom global React hooks
│   ├── layouts/            # Layout wrappers (PublicLayout, AdminLayout, CustomerLayout)
│   ├── lib/                # Library wrappers (Tailwind helpers, utility config)
│   ├── page/               # Page-level route views (mapping to routes)
│   ├── store/              # Zustand global state stores (Toast, Auth, UI)
│   ├── types/              # Database models, API responses, and custom TS typings
│   └── utils/              # Formatter utils, date helpers, and constants
├── .env                    # Local environment variables
├── package.json            # Scripts, dependency locks, and project info
├── tsconfig.json           # Main compiler config with absolute path mappings
└── vite.config.ts          # Vite build config with plugins and path aliases
```

---

## 💅 Coding Standards & Development Guidelines

- **Absolute Imports:** Always use path aliases starting with `@/` (configured in `tsconfig.json` and `vite.config.ts`) instead of relative paths (e.g., use `import { Button } from '@/components/ui/Button'` instead of `../../components/ui/Button`).
- **Styling:** Use Tailwind CSS utility classes exclusively. Keep components clean by utilizing design system classes.
- **State Management:** Use Zustand stores (`src/store/`) for global states only (e.g., authentication status, active toast messages). Use React `useState` for local component UI state.
- **Type Safety:** Declare strict interfaces/types inside `src/types/` or adjacent to components, avoiding the use of `any` whenever possible.
- **API Calls:** Use the centralized Axios client in `src/api/` which automatically handles base URLs and authorization headers via interceptors.

---

## 📄 License

Licensed under the MIT License. Developed for Boneh Star Booking Platform.
