# Hyperlynx

Hyperlynx — Agentic AI for Cyber Compliance. This repository contains a single React app with the Hyperlynx marketing site and dashboard.

## Running the project

1. Install dependencies:
```powershell
npm install
```

2. Start the development server:
```powershell
npm run dev
```

3. Open the app in your browser (commonly http://localhost:3000).

## Routes

- Marketing site: /
- Dashboard: /dashboard
- Auth: /dashboard/login and /dashboard/signup

## Notes

- If the project uses environment variables (e.g., Firebase or API keys), add a `.env` file at the project root and do not commit secrets.
- For styling this project uses Tailwind CSS utility classes; ensure the dev server rebuilds after changes.
- For authentication, routing, or backend integration follow the appropriate setup steps in the repository files.
