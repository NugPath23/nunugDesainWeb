const cache_name = 'v1';
const cache_assets = [
    'index.html',
    'contact.html',
    'about.html',
    'offline.html',
    'logo.html',
    'app.js',
    'style.css',
    'Logo-Unand-PTNBH.png',
    '/logohmif.png'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open(cache_name)
            .then((cache) => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(cache_assets);
            })
            .catch((error) => {
                console.error('Error caching assets:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(
            (cacheNames) => {
                return Promise.all(
                    cacheNames.map(
                        (cache) => {
                            if (cache !== cache_name) {
                                console.log('Service Worker: Clearing Old Cache');
                                return caches.delete(cache);
                            }
                        }
                    )
                );
            }
        )
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    event.respondWith(
        caches.match(event.request).then(
            (response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(
                    () => caches.match('offline.html')
                );
            }
        )
    );
});
