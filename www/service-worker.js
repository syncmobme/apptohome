var cacheName = 'aptohome';
var filesToCache = [
  'index.html',
  'js/my-app.js',
  'framework7/js/framework7.js',
  'css/my-app.css',
  'framework7/css/framework7.material.css',
  'framework7/css/framework7.material.colors.css',
  'framework7/css/font-awesome.min.css',
  'framework7/css/kitchen-sink.css'
];

// validando service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
}

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache'+ key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
    	if (response) {
    		console.log("achou no cache = "+e.request.url);
    		return response;
    	}

    	console.log('Não achou no cache buscar no servidor', e.request.url);
		return fetch(e.request).then(function(response) {
			//console.log('Response from network is:', response);
			return response;
		}).catch(function(error) {
			console.error('Fetching failed:'+ error);
			throw error;
		});
    })
  );
});