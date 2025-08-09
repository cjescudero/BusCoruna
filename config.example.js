// Ejemplo de configuración - Copia este archivo como config.local.js
// ⚠️ IMPORTANTE: Este archivo NO debe subirse a GitHub
// Copia este archivo como config.local.js y añade tus API keys

// Configuración de Google Maps API Key
window.GOOGLE_MAPS_API_KEY = 'TU_API_KEY_AQUI';

// Configuraciones adicionales
window.APP_CONFIG = {
    // Configuración del mapa
    map: {
        defaultCenter: { lat: 43.3623, lng: -8.4115 },
        defaultZoom: 14,
        // Restricciones de la API key (para desarrollo)
        apiKeyRestrictions: {
            // Dominios permitidos (ejemplo)
            allowedDomains: ['localhost', '127.0.0.1', 'tu-dominio.com']
        }
    },
    
    // Configuración de caché
    cache: {
        enabled: true,
        maxAge: 5 * 60 * 1000 // 5 minutos
    }
};

// Función para validar la configuración
function validateConfig() {
    if (!window.GOOGLE_MAPS_API_KEY || window.GOOGLE_MAPS_API_KEY === 'TU_API_KEY_AQUI') {
        console.warn('⚠️ Google Maps API Key no configurada. El mapa no funcionará.');
        return false;
    }
    return true;
}

// Validar al cargar
if (typeof window !== 'undefined') {
    validateConfig();
}
