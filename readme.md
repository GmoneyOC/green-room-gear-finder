# Snow Gear Finder

A web app that helps users find the perfect snowboard or skis based on their riding style, skill level, and preferences. Built with React and Tailwind CSS.

## 🚀 Quick Deploy to Vercel (Recommended)

### Step 1: Upload to GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in top right → "New repository"
3. Name it: `snow-gear-finder`
4. Set to "Public"
5. **DO NOT** initialize with README (we already have files)
6. Click "Create repository"

7. On the next page, look for "uploading an existing file"
8. Click that link
9. Drag and drop ALL the project files into the upload area:
   - package.json
   - vite.config.js
   - tailwind.config.js
   - postcss.config.js
   - index.html
   - .gitignore
   - README.md
   - Create a folder called `src` and upload:
     - main.jsx
     - App.jsx
     - index.css

10. Click "Commit changes"

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Once logged in, click "Add New..." → "Project"
4. Find your `snow-gear-finder` repository
5. Click "Import"
6. Vercel will auto-detect it's a Vite project
7. Click "Deploy"
8. Wait 1-2 minutes ⏳
9. Your app is LIVE! 🎉

Vercel will give you a URL like: `snow-gear-finder.vercel.app`

### Step 3: Add Your Custom Domain (Optional)

1. Buy a domain from Namecheap, GoDaddy, etc.
2. In Vercel, go to your project → Settings → Domains
3. Add your domain and follow the DNS setup instructions

## 💰 Setting Up Affiliate Links

Before going live, replace the placeholder affiliate links in `src/App.jsx`:

Find lines like:
```javascript
affiliate: 'https://affiliate-link-1.com'
```

Replace with your actual affiliate tracking URLs from:
- REI Affiliate Program
- Backcountry.com
- Evo.com
- Amazon Associates
- ShareASale

## 🛠️ Local Development

If you want to run the app locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
snow-gear-finder/
├── src/
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind imports
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
└── README.md           # This file
```

## 🎯 Features

- Interactive questionnaire (7 questions)
- Personalized gear recommendations
- Responsive design (works on mobile & desktop)
- Affiliate link integration
- Clean, modern UI with smooth animations

## 📈 Next Steps

1. **Analytics**: Add Google Analytics to track visitors
2. **SEO**: Optimize meta tags for better search rankings
3. **Content**: Add a blog for snowboard/ski buying guides
4. **Social**: Share on Reddit (r/snowboarding, r/skiing)
5. **A/B Testing**: Test different questionnaire flows

## 🔒 Legal

- Update affiliate disclosure if needed
- Add Privacy Policy (use TermsFeed generator)
- Add Terms of Service

## 📝 License

MIT License - feel free to modify and use!
