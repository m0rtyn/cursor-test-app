/// <reference lib="webworker" />

const CACHE_NAME = 'task-manager-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(fetchResponse => {
          // Кэшируем новые запросы
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request.url, fetchResponse.clone());
            return fetchResponse;
          })
        });
      }).catch(() => {
        // Возвращаем заглушку, если запрос не удался и нет кэша
        return new Response('Offline content not available');
      })
  );
});