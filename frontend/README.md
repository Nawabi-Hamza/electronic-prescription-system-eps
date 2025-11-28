# School MIS Frontend (React + Vite)

This frontend project is part of your School MIS system and uses React with Vite for fast development, HMR, and a modern build setup.

## Features
React 18+ with functional components and hooks

Vite for super-fast bundling and Hot Module Replacement (HMR)

ESLint for code quality and consistent formatting

Ready for integration with your Express.js backend API

Modular architecture for students, teachers, finance, attendance, and reports

## Recommended Plugins
Two official Vite plugins for React are supported:

@vitejs/plugin-react
 – uses Babel for Fast Refresh.

@vitejs/plugin-react-swc
 – uses SWC, faster builds for large projects.

You can pick either depending on your performance needs.

## ESLint & Code Quality
For production-ready projects, we recommend using TypeScript with type-aware ESLint rules:

Use the TS template
 if you plan to migrate to TypeScript.

For JS-only projects, configure ESLint with:
`npm install --save-dev eslint eslint-plugin-react eslint-config-airbnb`
{
  "extends": ["airbnb", "plugin:react/recommended"],
  "env": {
    "browser": true,
    "es2021": true
  },
  "settings": {
    "react": { "version": "detect" }
  }
}

## Project Structure (React + Vite + School MIS)
`
school-mis-frontend/
│
├─ public/          # Static assets
├─ src/
│  ├─ api/          # Axios API calls for backend
│  ├─ components/   # Reusable UI components (Table, Modal, etc.)
│  ├─ pages/        # Feature pages (Students, Teachers, Finance, etc.)
│  ├─ styles/       # Tailwind or CSS files
│  ├─ App.jsx       # Main app component
│  └─ main.jsx      # Entry point
├─ package.json
├─ vite.config.js
└─ .eslintrc.json
`

## How to Run

# Install dependencies
`npm install`

# Start development server with HMR
`npm run dev`

# Build production assets
`npm run build`

# Preview production build locally
`npm run preview`
