const CACHE_NAME = 'meow-audio-terminal-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // Agrega aquí otros archivos HTML o JS que necesites guardar
];

// Instalar el Service Worker y guardar los recursos en la caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Guardando archivos en caché');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activar la caché y limpiar versiones viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar las peticiones de red y servir desde la caché si está disponible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna el archivo de la caché si existe, si no, lo busca en la red
      return cachedResponse || fetch(event.request);
    })
  );
});
