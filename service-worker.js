self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open('my-cache').then(function (cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/script.js'
        ])
        .then(function() {
          return fetch('/assets-manifest.json')
            .then(response => response.json())
            .then(assets => {
              const urlsToCache = Object.values(assets);
              return cache.addAll(urlsToCache);
            });
        });
      })
    );
  });
  