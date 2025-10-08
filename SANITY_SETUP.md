# Sanity CMS Setup Guide

## 🚀 Quick Start

### 1. Create a Sanity Project

1. Go to [https://sanity.io](https://sanity.io) and sign up/login
2. Click "Create new project"
3. Choose "Clean project with no predefined schemas"
4. Name your project: "Christ Mably CMS"
5. Choose "Production" dataset
6. Note down your **Project ID** from the project dashboard

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Sanity Configuration
PUBLIC_SANITY_PROJECT_ID=cr745m4x
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2023-05-03
```

✅ **Your Project ID is already configured: `cr745m4x`**

### 3. Install Sanity Studio Dependencies

```bash
cd sanity-studio
npm install
```

### 4. Update Sanity Configuration

✅ **Sanity configuration is already updated with your Project ID: `cr745m4x`**

### 5. Start Sanity Studio

```bash
cd sanity-studio
npm run dev
```

This will open the Sanity Studio at `http://localhost:3333`

### 6. Create Your First Project

1. In the Sanity Studio, click "Create" → "Project"
2. Fill in the required fields:
   - **Project Title**: e.g., "Star Trek Discovery 'Rosetta'"
   - **Slug**: Auto-generated from title
   - **Project Thumbnail**: Upload an image
   - **Project Overview**: Add a description
   - **Project Credits**: Add role/name pairs
   - **Project Stills**: Upload multiple images
   - **Vimeo Video URL**: Add your Vimeo URL
   - **Featured Project**: Check this box for homepage display

### 7. Test Your Integration

```bash
# In your main project directory
npm run dev
```

Visit `http://localhost:5173` to see your project with Sanity data!

## 📋 Content Management

### Adding Projects

1. Open Sanity Studio (`http://localhost:3333`)
2. Click "Create" → "Project"
3. Fill in all required fields
4. Click "Publish"

### Managing Content

- **Projects**: Create, edit, and delete projects
- **Media**: Upload and manage images with automatic optimization
- **Credits**: Add role/name pairs for each project
- **Stills**: Upload multiple images for the gallery
- **Featured**: Mark projects to appear on homepage

## 🔧 Development

### Schema Customization

Edit `sanity-studio/schemas/project.ts` to modify the project structure.

### Adding New Fields

1. Update the schema in `sanity-studio/schemas/project.ts`
2. Update the TypeScript types in `src/lib/sanity.ts`
3. Update the component to use the new fields

### API Queries

The following queries are available in `src/lib/sanity.ts`:

- `getProjects()` - Get all projects
- `getProject(slug)` - Get a specific project by slug
- `getFeaturedProject()` - Get the featured project for homepage

## 🚀 Deployment

### Deploy Sanity Studio

```bash
cd sanity-studio
npm run build
npm run deploy
```

### Deploy Your SvelteKit App

Your SvelteKit app will automatically use the Sanity data when deployed.

## 🆘 Troubleshooting

### Common Issues

1. **"No Project Found"**: Make sure you've created a project in Sanity Studio and marked it as "Featured"
2. **Images not loading**: Check that your Project ID is correct in `.env.local`
3. **Build errors**: Ensure all environment variables are set correctly

### Getting Help

- [Sanity Documentation](https://www.sanity.io/docs)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- Check the browser console for error messages

## 📁 File Structure

```
├── sanity-studio/           # Sanity Studio configuration
│   ├── sanity.config.ts     # Main Sanity config
│   ├── schemas/             # Content schemas
│   │   └── project.ts       # Project schema
│   └── package.json         # Studio dependencies
├── src/
│   ├── lib/
│   │   └── sanity.ts        # Sanity client and queries
│   └── routes/
│       ├── +page.ts         # Data loading
│       └── +page.svelte     # Main page component
└── .env.local               # Environment variables
```

## 🎯 Next Steps

1. **Customize the schema** to match your specific needs
2. **Add more content types** (e.g., About, Contact pages)
3. **Set up webhooks** for automatic deployments
4. **Configure image optimization** settings
5. **Add user roles** for different content editors
