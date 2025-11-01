#!/bin/bash

# GitHub Pages Deployment Script for Skiftschema Analysator
# This script builds the application and prepares it for GitHub Pages deployment

set -e  # Exit on error

echo "🏗️  Building Skiftschema Analysator for GitHub Pages..."

# Clean previous build
rm -rf dist

# Build the application
npm run build

# Create .nojekyll file to allow files starting with underscore
touch dist/.nojekyll

echo "✅ Build complete! Files are in the 'dist' directory."
echo ""
echo "📦 To deploy to GitHub Pages:"
echo "   1. Commit and push your changes to the main branch"
echo "   2. Go to GitHub repository settings > Pages"
echo "   3. Set source to 'GitHub Actions' or 'Deploy from a branch'"
echo "   4. If using branch deployment, select 'gh-pages' branch and '/ (root)' folder"
echo ""
echo "🔧 Alternative: Copy the 'dist' folder contents to your gh-pages branch manually"
echo ""
echo "🌐 Your app will be available at: https://naab14.github.io/Dojo/"
