# Quick Start - Deploy Your Skiftschema Analysator NOW

You're almost there! Here's how to get your app live on GitHub Pages in 3 simple ways.

## 🎯 Option 1: Deploy via GitHub UI (Recommended - 5 minutes)

### Step 1: Create a Main Branch on GitHub

1. Go to your repository on GitHub: https://github.com/Naab14/Dojo
2. Click the **"Pull requests"** tab
3. Click **"New pull request"**
4. Set:
   - Base: `main` (if main doesn't exist, GitHub will offer to create it)
   - Compare: `claude/skiftschema-analysator-enhancements-011CUhbcXwNxMWFXDrmAt9pS`
5. Click **"Create pull request"**
6. Add title: "Deploy Skiftschema Analysator"
7. Click **"Create pull request"** again
8. Click **"Merge pull request"** → **"Confirm merge"**

### Step 2: Enable GitHub Pages

1. Go to repository **Settings** → **Pages** (left sidebar)
2. Under **"Source"**, select **"GitHub Actions"**
3. That's it! The deployment will start automatically

### Step 3: Wait and Access

- GitHub Actions will build and deploy (takes ~2 minutes)
- Check progress: Go to **"Actions"** tab in your repo
- Once complete, your app will be live at: **https://naab14.github.io/Dojo/**

---

## 🚀 Option 2: Quick Manual Deploy (If Actions Don't Work)

If GitHub Actions has issues, deploy the `dist` folder directly:

### Using Git Command Line:

```bash
# 1. Go to the dist folder
cd dist

# 2. Initialize as git repo
git init
git add .
git commit -m "Deploy Skiftschema Analysator"

# 3. Push to gh-pages branch
git branch -M gh-pages
git remote add origin https://github.com/Naab14/Dojo.git
git push -f origin gh-pages

# 4. Clean up (go back to main project)
cd ..
```

Then in GitHub Settings → Pages:
- Source: **Deploy from a branch**
- Branch: **gh-pages** / **/ (root)**
- Click **Save**

Your app will be live at: **https://naab14.github.io/Dojo/**

---

## 🧪 Option 3: Test Locally First (Running Now!)

**Your app is already running!** Open your browser and go to:

```
http://localhost:4173/Dojo/
```

This is the production build running locally. Test all features before deploying:

- ✅ Try adding a shift using the wizard
- ✅ Test the calendar view
- ✅ Check FTE calculations
- ✅ Try exporting to CSV
- ✅ Test on mobile (responsive view)

When done testing, press `Ctrl+C` in the terminal to stop the server.

---

## 🔍 Troubleshooting

### "I don't see my app at the GitHub Pages URL"

1. **Wait 2-5 minutes** - GitHub Pages can take time to propagate
2. **Check the Actions tab** - Make sure the workflow completed successfully (green checkmark)
3. **Hard refresh your browser** - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
4. **Check GitHub Pages settings** - Settings → Pages should show your URL

### "The page loads but it's blank"

1. Open browser DevTools (F12)
2. Check the Console for errors
3. If you see 404 errors for assets:
   - Make sure you deployed to the correct repository (should be Dojo)
   - Verify the base path in `vite.config.ts` is `/Dojo/`

### "GitHub Actions workflow isn't running"

1. Check if main branch was created: Go to repository → branches
2. Make sure GitHub Pages is set to "GitHub Actions" mode
3. Check workflow permissions: Settings → Actions → General → Workflow permissions → "Read and write permissions"

### "I get a 403 error when pushing"

This is normal - Claude can only push to branches starting with `claude/`. Use Option 1 (GitHub UI) or Option 2 (manual gh-pages) instead.

---

## 📦 What You Have

Your application is fully built and ready:

```
dist/
├── .nojekyll ✅             (Tells GitHub Pages not to use Jekyll)
├── index.html ✅            (Main HTML file)
└── assets/ ✅               (All JavaScript, CSS, and other assets)
    ├── index-*.css          (15.94 kB → 3.84 kB gzip)
    ├── react-vendor-*.js    (140.88 kB → 45.26 kB gzip)
    ├── animation-vendor-*.js (114.42 kB → 37.78 kB gzip)
    ├── chart-vendor-*.js    (0.93 kB → 0.58 kB gzip)
    └── index-*.js           (43.49 kB → 12.49 kB gzip)
```

Total size: **~316 kB** (~99 kB compressed) - Lightning fast! ⚡

---

## ✅ Next Steps

1. **Test locally now**: http://localhost:4173/Dojo/
2. **Choose deployment method** above (I recommend Option 1)
3. **Access your live app**: https://naab14.github.io/Dojo/
4. **Share with your team** and start planning shifts!

---

## 🆘 Need Help?

If you're stuck, tell me:
- Which option you tried
- What error message you see (if any)
- What happens when you visit the GitHub Pages URL

I'll help you get it deployed! 🚀
