# GitHub Deployment Commands

## Step 1: Add all files to Git
```bash
cd "C:\Users\forda\projectsocial"
git add .
git commit -m "Initial commit: Theatre Operations Manager with 26 theatres and NHS terminology"
```

## Step 2: Add GitHub remote and push
Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual values:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages
After pushing your code:
1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Build and deployment":
   - Source: Select "GitHub Actions"
5. The workflow will automatically run when you push to main branch

## Step 4: Update basePath if needed
If your repository is not using a custom domain and is deployed to `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`, you need to update `next.config.ts`:

Change:
```typescript
basePath: '',
```

To:
```typescript
basePath: '/YOUR-REPO-NAME',
```

Then commit and push:
```bash
git add next.config.ts
git commit -m "Update basePath for GitHub Pages deployment"
git push
```

## Alternative: Deploy to Vercel (Easier!)
If you prefer an easier deployment:
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy"
6. Done! Your app will be live in minutes

## Your site will be available at:
- **GitHub Pages**: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`
- **Vercel**: `https://YOUR-PROJECT-NAME.vercel.app`

## Troubleshooting
- If the GitHub Actions workflow fails, check the Actions tab in your repository for error logs
- Make sure Node.js version in the workflow matches your local version
- For GitHub Pages, the first deployment may take up to 10 minutes to become available