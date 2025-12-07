# Public Frontend Interface Documentation

## Overview
The Public Frontend of the HEAL Pakistan Portal is designed to be a user-friendly, responsive, and visually appealing interface for the general public. It serves as the face of the organization, providing information about programs, events, alumni, and more.

## Technical Implementation

### Technology Stack
-   **Framework:** React (v18) with Vite
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **UI Library:** Shadcn UI (Radix UI primitives + Tailwind)
-   **Routing:** React Router DOM (v6)
-   **Icons:** Lucide React
-   **State Management:** React Query (TanStack Query) + Local State
-   **Form Handling:** React Hook Form + Zod Validation

### Architecture
The public frontend follows a component-based architecture:
-   **Entry Point:** `src/App.tsx` defines the public routes (e.g., `/`, `/about`, `/programs`).
-   **Layout:** A shared `Layout` component (`src/components/layout/Layout`) wraps all public pages, ensuring consistent Header and Footer presence.
-   **Pages:** Located in `src/pages/`, each file corresponds to a route (e.g., `Index.tsx`, `About.tsx`).
-   **Components:** Reusable UI blocks are stored in `src/components/`. Feature-specific components (like those for the homepage) are grouped (e.g., `src/components/home/`).

### Coding Patterns
1.  **Composition:** Pages are composed of smaller, focused components (e.g., `Index.tsx` renders `HeroSection`, `AboutPreview`, etc.).
2.  **Modular Styles:** Styling is handled via Tailwind utility classes, keeping styles co-located with markup.
3.  **Type Safety:** TypeScript is used extensively to ensure type safety for props and state.
4.  **Responsive Design:** Mobile-first approach using Tailwind's responsive prefixes (`md:`, `lg:`).

### State Management
-   **Server State:** `React Query` is configured in `App.tsx` to handle data fetching, caching, and synchronization with the backend (future implementation).
-   **UI State:** Local `useState` and `useContext` (e.g., `TooltipProvider`) are used for interactive UI elements.

## Directory Structure
```
src/
├── components/
│   ├── home/       # Homepage specific components
│   ├── layout/     # Shared layout components (Header, Footer)
│   └── ui/         # Shadcn UI reusable components
├── pages/          # Public route components
│   ├── Index.tsx
│   ├── About.tsx
│   └── ...
└── App.tsx         # Route definitions
```
