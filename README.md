# Boneh Star Frontend

The modern web frontend for the Boneh Star bus management and booking platform, built with React 19, Vite, and TypeScript.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev)
- **Build Tool:** [Vite](https://vitejs.dev)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router 7](https://reactrouter.com)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com), Lucide React, FontAwesome

## 🛠️ Key Features

- **Public Booking Platform:** Search and book bus tickets easily.
- **Admin Dashboard:** Manage bus fleets, schedules, bookings, and reports.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Real-time Updates:** Smooth UI interactions and state management.

## 📋 Prerequisites

- Node.js >= 20
- NPM or PNPM

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

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   *Update `VITE_API_BASE_URL` in `.env` to point to your backend API.*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```text
boneh-star-frontend/
├── public/                 # Static assets (icons, images)
├── src/
│   ├── api/                # API client (Axios) & interceptors
│   ├── assets/             # Images, fonts, and global styles
│   ├── components/         # Reusable UI components (Shadcn UI)
│   ├── features/           # Domain-specific logic, hooks, and services
│   ├── hooks/              # Global custom React hooks
│   ├── layouts/            # Page layouts (e.g., DashboardLayout)
│   ├── lib/                # Library configurations (e.g., utils, tailwind-merge)
│   ├── page/               # Page-level components (Admin, Customer, Public)
│   ├── services/           # External service integrations
│   ├── store/              # Global state management (Zustand)
│   ├── types/              # TypeScript interfaces & types
│   └── utils/              # Helper functions & constants
├── .env                    # Environment variables
├── package.json            # Project dependencies & scripts
└── tsconfig.json           # TypeScript configuration
```

## 💅 Development Conventions

- **Component Styling:** Use Tailwind CSS utility classes.
- **API Calls:** Use the pre-configured Axios instance in `src/api/` for automatic auth header handling.
- **Icons:** Use Lucide React for general icons and FontAwesome for brand/specific icons.
- **Form Handling:** Standardized form components in `src/components/`.

## 📄 License

This project is licensed under the MIT License.
