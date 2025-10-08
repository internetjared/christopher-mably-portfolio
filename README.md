# Fullscreen Video Player - SvelteKit + Tailwind CSS

A modern, fullscreen video player that maintains aspect ratio across all screen sizes. Built with SvelteKit, Tailwind CSS, and designed to showcase video content with elegant overlays and controls.

## 🎬 **Current Implementation**

The homepage features a fullscreen Vimeo video player with:
- **Aspect ratio preservation** - Video maintains 16:9 ratio on all screen sizes
- **Autoplay with no sound** - Video starts automatically and loops
- **Overlay controls** - Hover to reveal play/pause button
- **Minimal title display** - "Star Trek Discovery 'Rosetta'" appears in small text, centered at the bottom
- **Minimal credits** - Small, uppercase "CREDITS" button with no borders, leading to a compact modal
- **Loading state** - Smooth loading animation
- **Responsive design** - Works perfectly on mobile and desktop
- **Accessibility features** - Proper ARIA labels and keyboard navigation

## Features

- 🎬 **Full-screen video backgrounds** with custom controls
- 📱 **Responsive design** that works on all devices
- 🎨 **Modern UI/UX** with smooth animations and transitions
- 🏗️ **Modular architecture** with reusable components
- 📊 **CMS-ready structure** for easy content management
- ⚡ **Fast performance** with SvelteKit's optimized build

## Tech Stack

- **SvelteKit** - Full-stack web framework
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd christopher-mably-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.svelte
│   │   └── ProjectShowcase.svelte
│   ├── data/               # Data layer (CMS integration)
│   │   └── projects.ts
│   └── types/              # TypeScript type definitions
│       └── project.ts
├── routes/                 # SvelteKit routes
│   ├── +layout.svelte     # Root layout
│   ├── +page.svelte       # Home page
│   ├── projects/          # Projects listing
│   └── project/[id]/      # Dynamic project pages
└── app.css                # Global styles with Tailwind
```

## CMS Integration

The project is structured to easily integrate with headless CMS platforms like:

- **Strapi** - Open-source headless CMS
- **Contentful** - Cloud-based content platform
- **Sanity** - Real-time content platform
- **Ghost** - Publishing platform

### Data Structure

Projects follow this TypeScript interface:

```typescript
interface ProjectData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  credits: ProjectCredit[];
  category: string;
  year: number;
  client?: string;
  agency?: string;
  director?: string;
  producer?: string;
}
```

### API Integration

Replace the mock data in `src/lib/data/projects.ts` with actual API calls:

```typescript
// Example with fetch
export async function getProjectById(id: string): Promise<ProjectData | null> {
  const response = await fetch(`${CMS_API_URL}/projects/${id}`);
  return response.json();
}
```

## Customization

### Styling

- Modify `src/app.css` for global styles
- Update `tailwind.config.js` for theme customization
- Use Tailwind utility classes for component styling

### Components

- `ProjectShowcase.svelte` - Main project display component
- `Navigation.svelte` - Site navigation
- Add new components in `src/lib/components/`

### Content

- Update project data in `src/lib/data/projects.ts`
- Modify the project structure in `src/lib/types/project.ts`

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the build output to Netlify
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lighthouse score: 95+ (Performance)
- Core Web Vitals optimized
- Lazy loading for images and videos
- Optimized bundle size with SvelteKit

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

Inspired by creative agency portfolios and modern web design trends.# Force deployment update
