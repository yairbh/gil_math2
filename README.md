# Gil's Number Quest - Math Adventure Game

A fun, interactive math adventure game for children aged 5-6 who love math and are comfortable with basic operations.

## Features

- Touch-friendly design for both laptops and tablets
- No reading required - visual instructions only
- Progressive difficulty levels
- Multiple themed worlds (Jungle, Beach, Mountain, Space, Underwater)
- Visual math challenges with animated elements
- Star rewards system
- Game progress saved automatically

## Deployment to GitHub Pages

### Option 1: Deploy using GitHub Actions

1. Push this code to a GitHub repository
2. Go to your repository settings
3. Navigate to "Pages" in the sidebar
4. Under "Build and deployment", select "GitHub Actions"
5. Create a new workflow file in your repository at `.github/workflows/deploy.yml` with the following content:

\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: out
\`\`\`

6. Commit and push this file
7. GitHub Actions will build and deploy your site automatically

### Option 2: Manual Deployment

1. Build the project locally:
\`\`\`bash
npm run build
\`\`\`

2. The static files will be generated in the `out` directory
3. Push the contents of the `out` directory to the `gh-pages` branch of your repository:
\`\`\`bash
git checkout -b gh-pages
git add out/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
\`\`\`

4. Go to your repository settings
5. Navigate to "Pages" in the sidebar
6. Under "Build and deployment", select "Deploy from a branch"
7. Select the "gh-pages" branch and the "/ (root)" folder
8. Click "Save"

## Local Development

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

- Edit the character names and images in `components/character-select.tsx`
- Modify the locations and their properties in `components/game-map.tsx`
- Adjust the difficulty levels in the challenge generation logic
