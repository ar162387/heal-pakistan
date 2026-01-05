# HEAL Pakistan Portal

Official website for HEAL Pakistan - a humanitarian organization dedicated to reaching the unreached and empowering communities across Pakistan.

## About

HEAL Pakistan inspires humanity and fosters healing through initiatives to reach the unreached. We empower youth with education and awareness, cultivating a compassionate generation dedicated to uplifting communities across Pakistan.

Founded by Habib ur Rehman and co-founded by Vaneeza Khan, HEAL Pakistan works with university chapters across Pakistan to create meaningful impact through humanitarian work, education empowerment, awareness campaigns, and leadership development.

## Technologies

This project is built with:

- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **React Router** - Client-side routing
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend and database
- **TanStack Query** - Data fetching and caching

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone https://github.com/ar162387/heal-pakistan.git
cd heal-pakistan-portal
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Add your Supabase credentials

4. Start the development server:
```sh
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/           # API client functions
├── components/    # React components
│   ├── admin/    # Admin panel components
│   ├── home/     # Homepage sections
│   ├── layout/   # Layout components
│   └── ui/       # Reusable UI components
├── context/      # React context providers
├── hooks/        # Custom React hooks
├── lib/          # Utility functions
├── pages/        # Page components
└── types/        # TypeScript type definitions
```

## Deployment

The project is deployed on Vercel. The `vercel.json` configuration file handles SPA routing.

## Contributing

This is an organization website. For contributions, please contact the project maintainers.

## License

Copyright © HEAL Pakistan. All rights reserved.
