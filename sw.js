// sw.js
const CACHE_NAME = 'bus-coruna-v3';
const CACHE_NAME_STATIC = 'bus-coruna-static-v3';
const CACHE_NAME_DAILY = 'bus-coruna-daily-v3';
const CACHE_NAME_REALTIME = 'bus-coruna-realtime-v3';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
];

// Configuración de caché por tipo de datos
const CACHE_CONFIG = {
  // Datos estáticos: paradas y líneas (7 días)
  static: {
    cacheName: CACHE_NAME_STATIC,
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    endpoints: ['/api/general', '/api/line/']
  },
  // Horarios: datos válidos durante todo el día
  daily: {
    cacheName: CACHE_NAME_DAILY,
    ttl: 24 * 60 * 60 * 1000, // 24 horas
    endpoints: ['/api/schedule/']
  },
  // Próximos buses: datos de tiempo real (2 minutos)
  realtime: {
    cacheName: CACHE_NAME_REALTIME,
    ttl: 2 * 60 * 1000, // 2 minutos
    endpoints: ['/api/arrivals/']
  }
};

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Mantener solo los cachés de la versión actual
          const validCaches = [
            CACHE_NAME, 
            CACHE_NAME_STATIC, 
            CACHE_NAME_DAILY, 
            CACHE_NAME_REALTIME
          ];
          if (!validCaches.includes(cacheName)) {
            console.log('Eliminando caché obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Función para determinar qué tipo de caché usar para una URL
function getCacheConfig(url) {
  for (const [type, config] of Object.entries(CACHE_CONFIG)) {
    if (config.endpoints.some(endpoint => url.includes(endpoint))) {
      return { type, config };
    }
  }
  return null;
}

// Función para verificar si un elemento en caché aún es válido
function isCacheValid(cachedResponse) {
  if (!cachedResponse) return false;
  
  const cachedTime = cachedResponse.headers.get('sw-cached-time');
  if (!cachedTime) return false;
  
  const ttl = cachedResponse.headers.get('sw-cache-ttl');
  if (!ttl) return false;
  
  const age = Date.now() - parseInt(cachedTime);
  return age < parseInt(ttl);
}

// Función para agregar metadatos de caché a una respuesta
function addCacheMetadata(response, ttl) {
  const newResponse = response.clone();
  const headers = new Headers(newResponse.headers);
  headers.set('sw-cached-time', Date.now().toString());
  headers.set('sw-cache-ttl', ttl.toString());
  
  return new Response(newResponse.body, {
    status: newResponse.status,
    statusText: newResponse.statusText,
    headers: headers
  });
}

// Interceptar peticiones
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // No cachear routes.json para que siempre se recargue
  if (url.includes('routes.json')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Verificar si es una petición a la API
  const cacheConfig = getCacheConfig(url);
  
  if (cacheConfig) {
    // Es una petición a la API - usar caché inteligente
    event.respondWith(handleApiRequest(event.request, cacheConfig));
  } else {
    // Es una petición estática normal
    event.respondWith(handleStaticRequest(event.request));
  }
});

// Manejar peticiones a la API con caché inteligente
async function handleApiRequest(request, { type, config }) {
  try {
    // Intentar obtener desde caché
    const cache = await caches.open(config.cacheName);
    const cachedResponse = await cache.match(request);
    
    // Verificar si el caché es válido
    if (cachedResponse && isCacheValid(cachedResponse)) {
      console.log(`🎯 [CACHE HIT] ${type}:`, request.url);
      return cachedResponse;
    }
    
    console.log(`🌐 [CACHE MISS] ${type}:`, request.url);
    
    // Hacer petición a la red
    const networkResponse = await fetch(request);
    
    if (!networkResponse.ok) {
      // Si la red falla pero tenemos caché (aunque sea expirado), usarlo
      if (cachedResponse) {
        console.log(`⚠️ [FALLBACK] Usando caché expirado para ${type}:`, request.url);
        return cachedResponse;
      }
      throw new Error(`Network error: ${networkResponse.status}`);
    }
    
    // Agregar metadatos de caché y guardar
    const responseToCache = addCacheMetadata(networkResponse.clone(), config.ttl);
    await cache.put(request, responseToCache);
    
    console.log(`💾 [CACHED] ${type} por ${config.ttl/1000/60} minutos:`, request.url);
    return networkResponse;
    
  } catch (error) {
    console.error(`❌ [ERROR] ${type}:`, request.url, error);
    
    // Intentar devolver caché expirado como último recurso
    const cache = await caches.open(config.cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log(`🆘 [EMERGENCY] Usando caché expirado como último recurso:`, request.url);
      return cachedResponse;
    }
    
    // Si no hay caché, devolver error
    return new Response(JSON.stringify({ 
      error: 'Error de conexión', 
      message: 'No se puede conectar al servidor y no hay datos en caché' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Manejar peticiones estáticas (recursos de la app)
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Error en petición estática:', error);
    return new Response('Error de red', { status: 503 });
  }
}

// Escuchar mensajes del cliente
self.addEventListener('message', event => {
  const { type, cacheType } = event.data || {};
  
  if (type === 'CLEAR_CACHE') {
    console.log('Limpiando caché del Service Worker...');
    event.waitUntil(
      clearCaches(cacheType).then(() => {
        console.log('Caché del Service Worker limpiada');
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      })
    );
  }
  
  if (type === 'CACHE_STATS') {
    event.waitUntil(
      getCacheStats().then(stats => {
        event.ports[0].postMessage({ type: 'CACHE_STATS', stats });
      })
    );
  }
});

// Función para limpiar cachés (específico o todos)
async function clearCaches(cacheType = null) {
  const cacheNames = await caches.keys();
  
  if (cacheType === 'all' || !cacheType) {
    // Limpiar todos los cachés
    return Promise.all(
      cacheNames.map(cacheName => {
        console.log('Eliminando caché:', cacheName);
        return caches.delete(cacheName);
      })
    );
  } else {
    // Limpiar solo un tipo específico
    const cacheConfig = Object.values(CACHE_CONFIG).find(config => 
      config.cacheName.includes(cacheType)
    );
    
    if (cacheConfig) {
      console.log('Eliminando caché específico:', cacheConfig.cacheName);
      return caches.delete(cacheConfig.cacheName);
    }
  }
}

// Función para obtener estadísticas de caché
async function getCacheStats() {
  const stats = {
    static: { count: 0, size: 0 },
    daily: { count: 0, size: 0 },
    realtime: { count: 0, size: 0 },
    total: { count: 0, size: 0 }
  };
  
  for (const [type, config] of Object.entries(CACHE_CONFIG)) {
    try {
      const cache = await caches.open(config.cacheName);
      const keys = await cache.keys();
      
      stats[type].count = keys.length;
      
      // Calcular tamaño aproximado
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const text = await response.text();
          stats[type].size += text.length;
        }
      }
    } catch (error) {
      console.warn(`Error obteniendo stats para ${type}:`, error);
    }
  }
  
  // Calcular totales
  Object.values(stats).forEach(stat => {
    if (stat !== stats.total) {
      stats.total.count += stat.count;
      stats.total.size += stat.size;
    }
  });
  
  return stats;
}