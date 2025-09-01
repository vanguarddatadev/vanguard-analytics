# Vanguard Bingo Analytics PWA

## Files in this folder
- `app.html` - Main application with advanced leaderboard and sharing features
- `index.html` - Landing page (redirects to app.html)
- `manifest.json` - PWA configuration file
- `service-worker.js` - Enables offline functionality
- `vanguard_logo.png` - App icon
- `README.md` - This file

## Quick Deploy to GitHub Pages

### 1. Upload to GitHub
1. Go to github.com and sign in
2. Click the "+" icon → "New repository"
3. Name it: `vanguard-analytics` (or your choice)
4. Make it Public
5. Click "Create repository"
6. Click "uploading an existing file"
7. Drag ALL files from this folder into the upload area
8. Click "Commit changes"

### 2. Enable GitHub Pages
1. In your repository, go to Settings
2. Scroll to "Pages" in left sidebar
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click Save
6. Wait 2-5 minutes

### 3. Access Your App
Your app will be available at:
```
https://[your-github-username].github.io/vanguard-analytics/
```

## Testing the PWA

### On Desktop (Chrome/Edge):
1. Visit your GitHub Pages URL
2. Look for install icon in address bar (computer with arrow)
3. Click to install
4. App opens in its own window

### On Mobile:
1. Visit URL in Chrome/Safari
2. Tap browser menu
3. Select "Add to Home Screen" or "Install App"
4. App appears on home screen with Vanguard logo

## Features
- ✅ Installable as app on desktop and mobile
- ✅ Works offline with cached data
- ✅ Auto-updates from Google Sheets when online
- ✅ Advanced Leaderboard with URL sharing
- ✅ Hash-based shortened URLs for easy sharing
- ✅ Smart notification system
- ✅ Enhanced event navigation
- ✅ Responsive design for all screen sizes
- ✅ No server needed - runs entirely in browser

## Data Source
The app pulls data from your Google Sheets via the Apps Script URL embedded in the code. No changes needed to your Google Sheets setup.

## Troubleshooting

### App not installing?
- Must be served over HTTPS (GitHub Pages provides this)
- Try in Chrome or Edge (best PWA support)
- Check browser console (F12) for errors

### Data not loading?
- Check internet connection
- Verify Google Apps Script is still published
- Look in browser console for error messages

### Changes not showing?
- After updating files on GitHub, wait 2-5 minutes
- Clear browser cache (Ctrl+Shift+R)
- For PWA: Uninstall and reinstall the app

## Support
For issues, check the browser console (F12) for error messages.

## Version
v1.5.2 - Enhanced with advanced leaderboard, URL sharing, and improved user experience

### IMPORTANT: Version Update Checklist
When updating to a new version, you MUST update ALL of these locations:
1. **service-worker.js** - Line 2: `const VERSION = '1.5.2';`
2. **manifest.json** - Line 4: `"version": "1.5.2"`
3. **app.html** - Line 2061: Header display `v1.5.2`
4. **app.html** - Line 52: Service worker URL `?v=1.5.2`
5. **app.html** - Line 90: Current version check `const currentVersion = '1.5.2';`
6. **app.html** - Line 12738: Update popup text `Version 1.5.2 Available!`
7. **README.md** - Version section header

⚠️ **Failure to update all locations will result in confusing version mismatches and update detection failures!**

### New in v1.5.2:
- 🔧 Fixed aggressive update prompts - only prompts for newer versions
- 🔄 Update checks now happen during data fetch instead of every page load
- ✅ Proper version comparison logic
- 🚀 Removed problematic timestamp from service worker registration

### Previous v1.5.1:
- ✨ Advanced Leaderboard with customizable filters
- 🔗 URL sharing system with hash-based shortened URLs
- 📱 Smart notification system
- 🎯 Enhanced event navigation and selection
- 🚀 Improved performance and user experience
- 🔄 Streamlined data loading and caching