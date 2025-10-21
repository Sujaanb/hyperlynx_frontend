# Hyperlynx - Cyber Regulatory Compliance Platform

A modern, responsive website for Hyperlynx - an AI-powered cyber regulatory compliance platform designed for fintechs. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Responsive Design**: Fully responsive layout that works seamlessly across all devices
- **Smooth Animations**: Powered by Framer Motion for engaging user experience
- **Modern UI**: Clean, professional design with a custom color palette
- **Modular Architecture**: Well-organized component structure for easy maintenance
- **Performance Optimized**: Built with Vite for fast development and optimized production builds

## Color Palette

The website uses a carefully selected color palette that complements the Hyperlynx logo:

- **Primary**: Deep Blue (#0A2342) - Trust, security, professionalism
- **Secondary**: Cyan Blue (#2C74B3) - Technology, innovation
- **Accent**: Electric Cyan (#0BC5EA) - Energy, digital connectivity
- **Dark**: Near Black (#0F1419) - Sophistication, premium
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Navigation header with mobile menu
│   │   └── Footer.tsx       # Footer with links and certifications
│   ├── sections/
│   │   ├── Hero.tsx         # Hero section with animated graphics
│   │   ├── Features.tsx     # Features showcase with icons
│   │   ├── Impact.tsx       # Before/after comparison section
│   │   ├── Testimonials.tsx # Customer testimonials
│   │   └── FAQ.tsx          # Accordion FAQ section with CTA
│   └── common/              # Reusable components (future)
├── assets/
│   └── hyperlynx_logo.png   # Company logo
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles and Tailwind imports
```

## Technologies Used

- **React 19**: Modern UI library
- **TypeScript**: Type-safe development
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Key Sections

1. **Hero Section**: Eye-catching introduction with animated security-themed graphics
2. **Features**: Four main features with icons and descriptions
3. **Impact**: Before/after comparison showing the value proposition
4. **Testimonials**: Six customer testimonials from fintech leaders
5. **FAQ**: Expandable accordion with common questions and CTA
6. **Footer**: Comprehensive footer with links, social media, and certifications

## Customization

### Updating Colors

Edit the `@theme` block in `src/index.css` to modify the color palette:

```css
@theme {
  --color-primary: #0A2342;
  --color-secondary: #2C74B3;
  /* etc. */
}
```

### Adding New Sections

1. Create a new component in `src/components/sections/`
2. Import and add it to `App.tsx`
3. Update navigation links in `Header.tsx` if needed

### Modifying Content

Each section component contains its own content. Simply edit the respective component file to update text, images, or data.

## Contributing

This is a private project. For contributions or questions, please contact the development team.

## Performance

- Optimized animations with Framer Motion
- Lazy loading and code splitting ready
- Production build includes minification and tree-shaking
- Responsive images and assets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - All rights reserved

## Contact

For questions or support, contact: contact@hyperlynx.ai
