# Admin Panel Frontend Interface Documentation

## Overview
The Admin Panel is a secured, internal interface for managing the content and operations of the HEAL Pakistan Portal. It provides a dashboard and management screens for Alumni, Events, Publications, and more.

## Technical Implementation

### Technology Stack
-   **Framework:** React (v18) with Vite
-   **Styling:** Tailwind CSS + Shadcn UI
-   **Routing:** Nested Routes via React Router DOM
-   **State Management:** React Query (Server State) + Context API (Auth/Role State)
-   **Charts:** Recharts (for Dashboard analytics)
-   **Data Tables:** TanStack Table (likely used within Shadcn Table components)

### Architecture
The admin panel uses a nested layout architecture:
-   **Entry Point:** The `/admin` route in `src/App.tsx` acts as the parent route.
-   **Admin Shell:** `src/components/admin/AdminLayout.tsx` serves as the shell, providing:
    -   **Sidebar Navigation:** `AdminSidebar` component.
    -   **Header:** Contains global actions and user profile/role switching.
    -   **Outlet:** Renders the specific management page based on the URL.
-   **RBAC (Role-Based Access Control):**
    -   Currently simulated via local state in `AdminLayout`.
    -   `userRole` is passed down via `Outlet` context to child pages to control visibility of actions (e.g., Edit/Delete buttons).

### Coding Patterns
1.  **Layout Wrapping:** All admin pages are children of `AdminLayout`, ensuring a consistent "Dashboard" feel.
2.  **Context Injection:** User roles and permissions are injected into pages via `useOutletContext` (or passed as props from the layout), allowing pages to adapt their UI based on the user's role.
3.  **Management Screens:** Pages like `AlumniManagement.tsx` typically follow a pattern:
    -   Fetch data (React Query).
    -   Display data in a Table or Grid.
    -   Provide "Add New" modal/form.
    -   Provide "Edit/Delete" actions per item.

### State Management
-   **Authentication State:** Currently mocked in `AdminLayout` using `useState` for the `userRole`. In a production scenario, this would be replaced by a global Auth Context or Redux store.
-   **Data Fetching:** React Query is used to manage the state of remote data (loading, error, success states) for tables and lists.

## Directory Structure
```
src/
├── components/
│   └── admin/          # Admin-specific components
│       ├── AdminLayout.tsx
│       ├── AdminSidebar.tsx
│       └── ...
├── pages/
│   └── admin/          # Admin route components
│       ├── Dashboard.tsx
│       ├── AlumniManagement.tsx
│       └── ...
└── App.tsx             # Admin route definitions nested under /admin
```
