# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Hyperlynx is a landing page and UI showcase for a Compliance Copilot product—Agentic AI for Cyber Compliance. The application helps fintechs streamline regulatory change management.

## Development Commands

### Run Development Server
```powershell
npm run dev
```
The application runs on port 3000 (configured in vite.config.ts) and opens automatically in your browser.

### Build for Production
```powershell
npm build
```
Output is generated in the `dist/` directory.

### Install Dependencies
```powershell
npm install
```

## Architecture & Structure

### Tech Stack
- **Framework**: React 18 with Vite 6
- **Build Tool**: Vite with SWC (fast React refresh)
- **Styling**: Tailwind CSS with custom utility classes
- **UI Components**: shadcn/ui + Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Project Structure
```
src/
├── App.tsx                    # Main application entry with all landing page sections
├── main.tsx                   # React root mount point
├── components/
│   ├── CopilotChat.tsx       # Floating chat widget component
│   ├── FeatureIcons.tsx      # Custom icon components
│   ├── InterestForm.tsx      # Contact/interest form
│   ├── ui/                   # shadcn/ui component library (Radix + Tailwind)
│   └── figma/                # Figma-exported components
├── assets/                   # Images and static assets
└── styles/                   # Global CSS and Tailwind config
```

### Component Architecture

**App.tsx** is a single-page application containing multiple sections:
- Hero section with animated background effects
- Features grid showcasing product capabilities
- Workflow/demo sections
- FAQ accordion
- Contact form

**CopilotChat.tsx** is a standalone floating chat widget that:
- Toggles open/close state
- Manages message history (user + assistant)
- Simulates bot responses with setTimeout

**UI Components** (`src/components/ui/`):
- Built with shadcn/ui patterns (Radix primitives + Tailwind)
- Uses `class-variance-authority` for variant management
- Utility function `cn()` merges Tailwind classes via `clsx` + `tailwind-merge`
- All components follow the same import pattern with versioned package aliases in vite.config.ts

### Styling Approach

This project uses Tailwind CSS with:
- **Dark theme**: Base color is `bg-[#0a0a0a]` (near-black)
- **Glass morphism effects**: `backdrop-blur-xl`, `bg-white/[0.02]` for translucent cards
- **Low-opacity borders**: `border-white/[0.08]` for subtle separations
- **Responsive utilities**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Custom gradients**: Background grid patterns and gradient orbs for depth

Always use Tailwind utility classes directly in JSX. Avoid creating new CSS files unless absolutely necessary.

### Path Aliases

The project uses `@` as an alias for `src/` directory:
```typescript
import { Button } from '@/components/ui/button';
```
This is configured in vite.config.ts under `resolve.alias`.

### Package Version Aliases

Vite config includes explicit version aliases for all dependencies (e.g., `'lucide-react@0.487.0': 'lucide-react'`). When importing, use the standard package name—Vite handles the resolution.

## Key Patterns & Conventions

1. **Component imports**: Always import from `./components/ui/` for UI primitives
2. **Styling**: Use inline Tailwind classes following the existing dark glass morphism aesthetic
3. **Icons**: Use Lucide React icons (imported as named exports)
4. **Responsive design**: All new components should use mobile-first responsive patterns
5. **State management**: Use React hooks (useState, useEffect) - no external state library
6. **TypeScript**: Project uses `.tsx` and `.ts` files; follow existing type patterns

## Environment & Secrets

If environment variables are needed (e.g., API keys for Firebase or backend integration):
- Create a `.env` file at the project root
- Never commit secrets to version control
- Reference in code via `import.meta.env.VITE_*` (Vite convention)

## Component Library (shadcn/ui)

The project uses shadcn/ui components under MIT license. These are:
- Located in `src/components/ui/`
- Built on Radix UI primitives for accessibility
- Fully customizable via Tailwind classes
- Can be extended or overridden as needed

When adding new UI components, follow the shadcn/ui pattern:
1. Use Radix UI primitives as base
2. Style with Tailwind utilities
3. Export variants using `class-variance-authority`
4. Include proper TypeScript types

## Notes

- The server auto-opens the browser on `npm run dev` (configured in vite.config.ts)
- Build target is `esnext` for modern JavaScript features
- No testing framework is currently configured
- No linting or type-checking scripts are defined in package.json
