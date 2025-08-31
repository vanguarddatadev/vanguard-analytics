// Service Worker for Vanguard Bingo Analytics PWA
const VERSION = '1.5'; // Version 1.5 - Added Leaderboard feature and Notifications placeholder
const CACHE_NAME = `vanguard-v${VERSION}`;
const DATA_CACHE_NAME = 'vanguard-data-v1.5'; // Force refresh for new version // Force data refresh with version update

// Files to cache for offline use - using relative paths for GitHub Pages
const urlsToCache = [
  './',
  './index.html',
  './vanguard_logo.png',
  './manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle Google Apps Script API calls differently
  if (url.origin === 'https://script.google.com' || 
      url.origin === 'https://script.googleusercontent.com') {
    // For data API calls, try network first, cache as fallback
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          caches.open(DATA_CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(request).then(response => {
            if (response) {
              console.log('Serving data from cache:', request.url);
              return response;
            }
            // Return a fallback response if nothing in cache
            return new Response(JSON.stringify({
              error: 'Offline - No cached data available'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // For all other requests, try cache first
  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        return response;
      }
      return fetch(request).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
        
        return response;
      });
    })
  );
});

// Background sync for data updates
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Fetch fresh data from Google Sheets
    const response = await fetch('https://script.google.com/macros/s/AKfycbz2sSz7qJOOKKFXxjxjksZwVqCJlDpUFQlDVB0ljUHE00F_OPyVlpBGDJoCtIGMK5E8/exec?type=getAllData');
    const data = await response.json();
    
    // Store in cache
    const cache = await caches.open(DATA_CACHE_NAME);
    await cache.put('./api/data', new Response(JSON.stringify(data)));
    
    // Notify clients of update
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'DATA_UPDATED',
        data: data
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}