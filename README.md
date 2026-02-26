# Green Room Gear Finder

A React web app that helps users find the perfect snowboard or skis based on their skill level, riding style, terrain preference, budget, and body measurements.

## Tech Stack

- **React 18** + **Vite** for fast builds
- **Tailwind CSS** for styling
- **PapaParse** for CSV parsing
- **Google Sheets** as the product database (published as CSV)
- **Botpress** chatbot for additional gear guidance
- **Vercel** for deployment (auto-deploys from `main`)

## How It Works

1. User picks "All Brands" or selects specific brands
2. A 7-question quiz captures sport, skill level, riding style, terrain, budget, height, and weight
3. Products are fetched from a Google Sheets CSV and scored against the user's answers
4. Top 3 recommendations are displayed with affiliate links
5. Size recommendation is shown based on height/weight matrix
6. Botpress chatbot appears after 8 seconds on the results page

## Project Structure

```
src/
  App.jsx                  # Main app component (all screens)
  main.jsx                 # React entry point
  index.css                # Tailwind imports
  data/
    questions.js           # Quiz questions and option labels
  services/
    googleSheets.js        # Fetches and caches product data from Google Sheets
  utils/
    helpers.js             # Recommendation engine, sizing, brand extraction
public/
  logo.png                 # App logo
  snow-background.mp4      # Background video
```

## Product Data

Products are managed in a Google Sheets spreadsheet published as CSV. Each row includes brand, product name, sport, price, image URL, affiliate link, and matching criteria (levels, styles, terrains, budgets). Data is cached in localStorage for 1 hour.

## Development

```bash
npm install
npm run dev
```

## Deployment

Pushes to `main` auto-deploy to Vercel at [green-room-gear-finder.vercel.app](https://green-room-gear-finder.vercel.app).
