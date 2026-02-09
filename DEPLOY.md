# Deployment Guide

## Vercel (Recommended - 2 minutes)

### Option 1: Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import `btjones-me/teach-me-black-jack` from GitHub
4. Vercel auto-detects Vite settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"
6. Done! 🎉

### Option 2: Vercel CLI
```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Deploy from project directory
cd ~/repos/teach-me-black-jack
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? teach-me-black-jack
# - Directory? ./
# - Override settings? N

# Production deployment
vercel --prod
```

## Railway (Alternative)

1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Select `teach-me-black-jack`
4. Railway auto-detects:
   - **Build Command**: `npm run build`
   - **Start Command**: Not needed (static site)
5. Add domain in settings
6. Deploy

## Netlify (Alternative)

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import from Git"
3. Select `teach-me-black-jack`
4. Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Deploy

## Custom Domain (After Deployment)

### Vercel
1. Go to project settings → Domains
2. Add your domain
3. Follow DNS instructions

### Railway
1. Project settings → Networking → Custom Domain
2. Add domain and configure DNS

---

## Post-Deployment Checklist

- [ ] Test on mobile (PWA install)
- [ ] Test in different browsers (Chrome, Safari, Firefox)
- [ ] Verify Jack's dialogue appears correctly
- [ ] Check score tracking works
- [ ] Test all action buttons (Hit, Stand, Double, Split)
- [ ] Verify game summary shows after 20 hands
- [ ] Test offline functionality (PWA)

## Monitoring

Once deployed, you can:
- View analytics in Vercel dashboard
- Check build logs for errors
- Set up alerts for downtime
- Monitor performance with Lighthouse

## Updates

To deploy updates:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will auto-deploy from the `main` branch.
