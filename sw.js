const CACHE_NAME = 'daily-hud-cache-v7.0';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './logo.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Silnik Offline] Aktualizacja protokołów do v7.0...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting(); // Wymusza natychmiastową instalację nowej wersji
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Silnik Offline] Usuwanie starych wersji systemu...');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Przejmuje kontrolę nad otwartymi kartami
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Jeśli plik jest w pamięci telefonu, ładuje go natychmiast (Offline).
                // Jeśli nie ma, pobiera z GitHuba (Online).
                // Aby zawsze mieć najnowszą wersję przy połączeniu z siecią, można też dodać strategię Network First, 
                // ale dla tego projektu Cache First działa idealnie.
                return cachedResponse || fetch(event.request);
            })
    );
});
