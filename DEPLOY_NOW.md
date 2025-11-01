# 🚀 DEPLOY NOW - Step by Step Instructions

Your app is built and ready! I've created a deployment branch. Follow these 4 simple steps:

---

## ⚡ Quick Deploy (5 Minutes)

### Step 1: Rename the Deployment Branch

I've pushed your built app to: `claude/gh-pages-011CUhbcXwNxMWFXDrmAt9pS`

GitHub Pages needs this to be called `gh-pages`. Here's how to rename it:

1. Go to: https://github.com/Naab14/Dojo
2. Click on the **"branches"** link (next to the branch dropdown)
3. Find the branch: `claude/gh-pages-011CUhbcXwNxMWFXDrmAt9pS`
4. Click the **pencil icon** next to it (rename)
5. Change the name to: `gh-pages`
6. Click **"Rename branch"**

**OR use Git locally (if you have it):**
```bash
git fetch origin
git checkout claude/gh-pages-011CUhbcXwNxMWFXDrmAt9pS
git branch -m gh-pages
git push origin gh-pages
git push origin --delete claude/gh-pages-011CUhbcXwNxMWFXDrmAt9pS
```

---

### Step 2: Enable GitHub Pages

1. In your repository, go to **Settings** (top menu)
2. Click **"Pages"** in the left sidebar
3. Under **"Source"**, select:
   - **Deploy from a branch**
4. Under **"Branch"**, select:
   - Branch: **gh-pages**
   - Folder: **/ (root)**
5. Click **"Save"**

---

### Step 3: Wait for Deployment

- GitHub will show a message: "Your site is live at..."
- Wait 1-2 minutes for the first deployment
- You'll see a green checkmark when it's ready

---

### Step 4: Access Your App! 🎉

Your app will be live at:

```
https://naab14.github.io/Dojo/
```

**Bookmark this URL!** This is your production app.

---

## 🔄 Alternative: Use GitHub Actions (For Future Updates)

If you want automatic deployments when you update code:

### Step 1: Create a Main Branch

1. Go to: https://github.com/Naab14/Dojo
2. Click **"Pull requests"** → **"New pull request"**
3. Click **"compare: ..."** and select: `claude/skiftschema-analysator-enhancements-011CUhbcXwNxMWFXDrmAt9pS`
4. Click **"Create pull request"**
5. Title: "Initial deployment"
6. Click **"Create pull request"** → **"Merge pull request"** → **"Confirm merge"**

### Step 2: Enable GitHub Actions for Pages

1. Go to **Settings** → **Pages**
2. Under **"Source"**, select: **GitHub Actions**
3. Done!

Now, every time you push to `main`, your app will automatically rebuild and deploy!

---

## 📱 Testing Your Deployed App

Once live, test these features:

- [ ] Click "Continental 8h" to add a preset shift
- [ ] Open the shift wizard (click any shift or "Lägg till skift")
- [ ] Navigate through months
- [ ] View the calendar
- [ ] Check FTE calculations in the sidebar
- [ ] Export to CSV
- [ ] Test on mobile (resize your browser or use your phone)

---

## 🐛 Troubleshooting

### "The page is blank"

1. Open browser DevTools (Press F12)
2. Go to the **Console** tab
3. Look for 404 errors
4. If you see errors about `/assets/`, the base path might be wrong
   - Check: Settings → Pages → Make sure you saved gh-pages as the source

### "I don't see my repository in Settings → Pages"

- Make sure the repository is **public** (you already did this ✅)
- Refresh the Settings page

### "It says 'There isn't a GitHub Pages site here'"

- Wait 2-5 minutes after saving Pages settings
- Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check that gh-pages branch exists and has files in it

### "I see a 404 page"

- Verify you're going to the correct URL: `https://naab14.github.io/Dojo/` (with capital D)
- Check Settings → Pages to see the exact URL GitHub generated

---

## ✅ What's Been Done

I've already:
- ✅ Built the production-optimized app
- ✅ Created the deployment files
- ✅ Pushed to a deployment branch: `claude/gh-pages-011CUhbcXwNxMWFXDrmAt9pS`
- ✅ Included `.nojekyll` file (tells GitHub not to use Jekyll)
- ✅ Set up GitHub Actions workflow for future deployments
- ✅ Tested the build locally

**All you need to do:** Follow Step 1 and Step 2 above (rename branch + enable Pages)

---

## 🆘 Still Stuck?

Tell me:
1. Which step you're on
2. What you see on the screen
3. Any error messages

I'll help you get it deployed! 🚀

---

**The deployment files are ready. You're literally one branch rename away from having a live app!**
