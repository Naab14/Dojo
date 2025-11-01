# Deployment Guide - Skiftschema Analysator

This guide explains how to deploy the Skiftschema Analysator to GitHub Pages.

## Prerequisites

- Node.js 18+ installed
- Git repository connected to GitHub
- Write access to the repository

## Quick Start

### Option 1: Automated Deployment (GitHub Actions)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select "GitHub Actions"

2. **Push your changes to the main branch:**
   ```bash
   git push origin main
   ```

3. **Wait for the workflow to complete:**
   - Go to the "Actions" tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow run
   - Once complete, your site will be live!

4. **Access your deployed application:**
   - Your app will be available at: `https://naab14.github.io/Dojo/`
   - Or the URL shown in Settings > Pages

### Option 2: Manual Deployment

If you prefer manual deployment or need to test the build locally:

1. **Build the application:**
   ```bash
   cd skiftschema-vite
   npm run deploy
   ```
   This runs the deploy.sh script which:
   - Cleans the previous build
   - Runs TypeScript compilation
   - Builds optimized production bundles
   - Creates a `.nojekyll` file for GitHub Pages

2. **Deploy the `dist` folder:**

   **Method A: Using gh-pages branch manually**
   ```bash
   # After running npm run deploy
   cd dist
   git init
   git add .
   git commit -m "Deploy to GitHub Pages"
   git branch -M gh-pages
   git remote add origin https://github.com/Naab14/Dojo.git
   git push -f origin gh-pages
   ```

   **Method B: Copy to existing gh-pages branch**
   ```bash
   # Clone your repo's gh-pages branch
   git clone -b gh-pages https://github.com/Naab14/Dojo.git gh-pages-deploy

   # Copy dist contents
   rm -rf gh-pages-deploy/*
   cp -r dist/* gh-pages-deploy/

   # Commit and push
   cd gh-pages-deploy
   git add .
   git commit -m "Deploy Skiftschema Analysator"
   git push
   ```

## Build Configuration

The application is configured for GitHub Pages deployment in `vite.config.ts`:

```typescript
base: '/Dojo/'  // Repository name as base path
```

If you deploy to a custom domain or different repository, update this value:
- For custom domain: `base: '/'`
- For different repo: `base: '/your-repo-name/'`

## Deployment Checklist

Before deploying, ensure:

- [ ] All changes are committed
- [ ] TypeScript compilation passes (`npm run build`)
- [ ] Application works locally (`npm run dev`)
- [ ] GitHub Pages is enabled in repository settings
- [ ] Base path in `vite.config.ts` matches your deployment URL

## Build Output

The production build creates optimized bundles:

```
dist/
├── index.html (0.90 kB)
├── assets/
│   ├── index-*.css (15.94 kB → 3.84 kB gzip)
│   ├── react-vendor-*.js (140.88 kB → 45.26 kB gzip)
│   ├── animation-vendor-*.js (114.42 kB → 37.78 kB gzip)
│   ├── chart-vendor-*.js (0.93 kB → 0.58 kB gzip)
│   └── index-*.js (43.49 kB → 12.49 kB gzip)
└── .nojekyll (prevents Jekyll processing)
```

## Troubleshooting

### Blank page after deployment
- Check browser console for 404 errors
- Verify `base` path in `vite.config.ts` matches your URL
- Ensure `.nojekyll` file exists in dist folder

### Assets not loading (404 errors)
- Confirm base path is correct
- Check that GitHub Pages is serving from the correct branch/folder
- Wait a few minutes for DNS propagation

### Build fails with TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Check for type errors: `npm run build`
- Review the error messages and fix type issues

### GitHub Actions workflow fails
- Check the Actions tab for detailed error logs
- Verify that GitHub Pages is enabled
- Ensure workflow has write permissions (Settings > Actions > General > Workflow permissions)

## Development vs Production

**Development (local):**
```bash
npm run dev
# Runs on http://localhost:3000
# Hot module replacement enabled
# Base path: / (root)
```

**Production (deployed):**
```bash
npm run build
npm run preview
# Preview production build on http://localhost:4173
# Base path: /Dojo/
# Optimized and minified
```

## Continuous Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys on:
- Push to `main` branch
- Push to `master` branch
- Manual trigger (workflow_dispatch)

To disable auto-deployment, remove or modify the workflow file.

## Support

For issues or questions:
- Check build logs: `npm run build`
- Review GitHub Actions logs in the Actions tab
- Verify GitHub Pages settings
- Check browser console for client-side errors

---

**Last Updated:** November 2025
**Application Version:** 2.0.0
