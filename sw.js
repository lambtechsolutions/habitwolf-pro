1	// Service Worker para HabitWolf Pro PWA
     2	const CACHE_NAME = 'habitwolf-pro-v1.0.0';
     3	const STATIC_CACHE = 'habitwolf-static-v1';
     4	const DYNAMIC_CACHE = 'habitwolf-dynamic-v1';
     5	
     6	// Archivos críticos para cachear
     7	const STATIC_FILES = [
     8	  './',
     9	  './index.html',
    10	  './manifest.json',
    11	  'https://cdn.tailwindcss.com/3.3.0',
    12	  'https://cdn.jsdelivr.net/npm/chart.js',
    13	  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    14	  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
    15	];
    16	
    17	// Instalación del Service Worker
    18	self.addEventListener('install', event => {
    19	  console.log('🐺 HabitWolf Pro SW: Instalando...');
    20	  
    21	  event.waitUntil(
    22	    caches.open(STATIC_CACHE)
    23	      .then(cache => {
    24	        console.log('🐺 Pre-cacheando archivos estáticos...');
    25	        return cache.addAll(STATIC_FILES);
    26	      })
    27	      .then(() => {
    28	        console.log('✅ HabitWolf Pro SW: Instalado correctamente');
    29	        return self.skipWaiting();
    30	      })
    31	      .catch(error => {
    32	        console.error('❌ Error instalando SW:', error);
    33	      })
    34	  );
    35	});
    36	
    37	// Activación del Service Worker
    38	self.addEventListener('activate', event => {
    39	  console.log('🐺 HabitWolf Pro SW: Activando...');
    40	  
    41	  event.waitUntil(
    42	    Promise.all([
    43	      // Limpiar cachés antiguos
    44	      caches.keys().then(cacheNames => {
    45	        return Promise.all(
    46	          cacheNames.map(cacheName => {
    47	            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
    48	              console.log('🗑️ Eliminando caché antiguo:', cacheName);
    49	              return caches.delete(cacheName);
    50	            }
    51	          })
    52	        );
    53	      }),
    54	      // Tomar control de todas las pestañas
    55	      self.clients.claim()
    56	    ])
    57	  );
    58	});
    59	
    60	// Interceptar peticiones de red
    61	self.addEventListener('fetch', event => {
    62	  const { request } = event;
    63	  const url = new URL(request.url);
    64	
    65	  // Solo manejar peticiones HTTP/HTTPS
    66	  if (!url.protocol.startsWith('http')) {
    67	    return;
    68	  }
    69	
    70	  // Estrategia Cache First para recursos estáticos
    71	  if (STATIC_FILES.includes(request.url) || request.url.includes('cdn.')) {
    72	    event.respondWith(
    73	      caches.match(request)
    74	        .then(response => {
    75	          if (response) {
    76	            return response;
    77	          }
    78	          return fetch(request)
    79	            .then(fetchResponse => {
    80	              const responseClone = fetchResponse.clone();
    81	              caches.open(STATIC_CACHE)
    82	                .then(cache => cache.put(request, responseClone));
    83	              return fetchResponse;
    84	            });
    85	        })
    86	        .catch(() => {
    87	          // Fallback offline
    88	          if (request.destination === 'document') {
    89	            return caches.match('./index.html');
    90	          }
    91	        })
    92	    );
    93	    return;
    94	  }
    95	
    96	  // Estrategia Network First para el HTML principal
    97	  if (request.destination === 'document') {
    98	    event.respondWith(
    99	      fetch(request)
   100	        .then(response => {
   101	          const responseClone = response.clone();
   102	          caches.open(DYNAMIC_CACHE)
   103	            .then(cache => cache.put(request, responseClone));
   104	          return response;
   105	        })
   106	        .catch(() => {
   107	          return caches.match(request)
   108	            .then(response => {
   109	              return response || caches.match('./index.html');
   110	            });
   111	        })
   112	    );
   113	    return;
   114	  }
   115	
   116	  // Para el resto, intentar red primero, luego caché
   117	  event.respondWith(
   118	    fetch(request)
   119	      .then(response => {
   120	        const responseClone = response.clone();
   121	        caches.open(DYNAMIC_CACHE)
   122	          .then(cache => cache.put(request, responseClone));
   123	        return response;
   124	      })
   125	      .catch(() => caches.match(request))
   126	  );
   127	});
   128	
   129	// Notificaciones Push (para futuras funcionalidades)
   130	self.addEventListener('push', event => {
   131	  if (event.data) {
   132	    const data = event.data.json();
   133	    const options = {
   134	      body: data.body || '¡Es hora de registrar tus hábitos! 🐺',
   135	      icon: './manifest.json', // Usaremos el ícono del manifest
   136	      badge: './manifest.json',
   137	      vibrate: [100, 50, 100],
   138	      data: data,
   139	      actions: [
   140	        {
   141	          action: 'registro',
   142	          title: 'Registrar Ahora',
   143	          icon: './manifest.json'
   144	        },
   145	        {
   146	          action: 'postponer',
   147	          title: 'Recordar más tarde',
   148	          icon: './manifest.json'
   149	        }
   150	      ],
   151	      tag: 'habitwolf-reminder',
   152	      renotify: true,
   153	      requireInteraction: false
   154	    };
   155	
   156	    event.waitUntil(
   157	      self.registration.showNotification(
   158	        data.title || 'HabitWolf Pro - Recordatorio',
   159	        options
   160	      )
   161	    );
   162	  }
   163	});
   164	
   165	// Manejar clicks en notificaciones
   166	self.addEventListener('notificationclick', event => {
   167	  event.notification.close();
   168	
   169	  if (event.action === 'registro') {
   170	    event.waitUntil(
   171	      clients.openWindow('./index.html?tab=registro&notification=true')
   172	    );
   173	  } else if (event.action === 'postponer') {
   174	    // Programar recordatorio para más tarde (implementación futura)
   175	    console.log('Recordatorio pospuesto');
   176	  } else {
   177	    event.waitUntil(
   178	      clients.openWindow('./index.html')
   179	    );
   180	  }
   181	});
   182	
   183	// Sincronización en segundo plano
   184	self.addEventListener('sync', event => {
   185	  if (event.tag === 'habitwolf-sync') {
   186	    event.waitUntil(
   187	      // Aquí se implementaría la lógica de sincronización
   188	      // Por ejemplo, enviar datos pendientes cuando haya conexión
   189	      console.log('🔄 Sincronización de datos en segundo plano')
   190	    );
   191	  }
   192	});
   193	
   194	// Manejo de errores
   195	self.addEventListener('error', event => {
   196	  console.error('❌ Error en Service Worker:', event.error);
   197	});
   198	
   199	// Logging de información útil
   200	console.log('🐺 HabitWolf Pro Service Worker cargado');
   201	console.log(`📦 Versión de caché: ${CACHE_NAME}`);
   202	console.log(`📁 Archivos estáticos: ${STATIC_FILES.length} archivos`);