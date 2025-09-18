// Service Worker para HabitWolf Pro PWA
const CACHE_NAME = 'habitwolf-pro-v1.0.0';
const STATIC_CACHE = 'habitwolf-static-v1';
const DYNAMIC_CACHE = 'habitwolf-dynamic-v1';

// Archivos críticos para cachear
const STATIC_FILES = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com/3.3.0',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('🐺 HabitWolf Pro SW: Instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('🐺 Pre-cacheando archivos estáticos...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ HabitWolf Pro SW: Instalado correctamente');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Error instalando SW:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('🐺 HabitWolf Pro SW: Activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar cachés antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Eliminando caché antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar control de todas las pestañas
      self.clients.claim()
    ])
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar peticiones HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Estrategia Cache First para recursos estáticos
  if (STATIC_FILES.includes(request.url) || request.url.includes('cdn.')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(fetchResponse => {
              const responseClone = fetchResponse.clone();
              caches.open(STATIC_CACHE)
                .then(cache => cache.put(request, responseClone));
              return fetchResponse;
            });
        })
        .catch(() => {
          // Fallback offline
          if (request.destination === 'document') {
            return caches.match('./index.html');
          }
        })
    );
    return;
  }

  // Estrategia Network First para el HTML principal
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              return response || caches.match('./index.html');
            });
        })
    );
    return;
  }

  // Para el resto, intentar red primero, luego caché
  event.respondWith(
    fetch(request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE)
          .then(cache => cache.put(request, responseClone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Notificaciones Push (para futuras funcionalidades)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || '¡Es hora de registrar tus hábitos! 🐺',
      icon: './manifest.json', // Usaremos el ícono del manifest
      badge: './manifest.json',
      vibrate: [100, 50, 100],
      data: data,
      actions: [
        {
          action: 'registro',
          title: 'Registrar Ahora',
          icon: './manifest.json'
        },
        {
          action: 'postponer',
          title: 'Recordar más tarde',
          icon: './manifest.json'
        }
      ],
      tag: 'habitwolf-reminder',
      renotify: true,
      requireInteraction: false
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'HabitWolf Pro - Recordatorio',
        options
      )
    );
  }
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'registro') {
    event.waitUntil(
      clients.openWindow('./index.html?tab=registro&notification=true')
    );
  } else if (event.action === 'postponer') {
    // Programar recordatorio para más tarde (implementación futura)
    console.log('Recordatorio pospuesto');
  } else {
    event.waitUntil(
      clients.openWindow('./index.html')
    );
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'habitwolf-sync') {
    event.waitUntil(
      // Aquí se implementaría la lógica de sincronización
      // Por ejemplo, enviar datos pendientes cuando haya conexión
      console.log('🔄 Sincronización de datos en segundo plano')
    );
  }
});

// Manejo de errores
self.addEventListener('error', event => {
  console.error('❌ Error en Service Worker:', event.error);
});

// Logging de información útil
console.log('🐺 HabitWolf Pro Service Worker cargado');
console.log(`📦 Versión de caché: ${CACHE_NAME}`);
console.log(`📁 Archivos estáticos: ${STATIC_FILES.length} archivos`);
