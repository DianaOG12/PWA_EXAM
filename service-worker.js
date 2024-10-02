// Instalación 
self.addEventListener('install', (event) => {
    // Esperar a que se complete la instalación
    event.waitUntil(
        // Abrir una caché llamada pwa-cache-v2
        caches.open('pwa-cache-v2').then((cache) => {
            // Añadir a la caché los archivos especificados para que estén disponibles en modo offline
            return cache.addAll([
                '/',
                '/script.js',
                '/style.css',
                '/index.html',
                '/iconos',
                '/manifest.json'
            ]);
        }).catch((error) => {
            console.error('Error al abrir la caché: ', error);
        })
    );
});

// Peticiones fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
        
            return response || fetch(event.request);
        }).catch((error) => {
            console.error('Error en la respuesta fetch: ', error);
        })
    );
});

//  Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['pwa-cache-v2']; 

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Borrar cachés 
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).catch((error) => {
            console.error('Error al activar y limpiar caché: ', error);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // es para eseperar respuesta de cache
                if (response) {
                    return response;
                }

                // y su no hay respuest, la manda a la red 
                return fetch(event.request).catch(() => {
                    // Si la red falla manda error 
                    console.error('Error al intentar obtener el recurso:', event.request.url);
                    return new Response('Error al cargar el recurso', {
                        status: 404,
                        statusText: 'Not Found',
                    });
                });
            })
    );
});
