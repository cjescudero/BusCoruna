const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Configurar caché en memoria
const cache = new NodeCache({
    stdTTL: 600, // TTL por defecto: 10 minutos
    checkperiod: 120 // Verificar elementos expirados cada 2 minutos
});

// Configuración de URLs base de la API
const BASE_API_URL = 'https://itranvias.com/queryitr_v3.php';

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:10000'],
    credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Configurar headers para evitar problemas de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname)));

// === FUNCIONES DE UTILIDAD PARA CACHÉ ===

/**
 * Realiza una petición HTTP con caché inteligente
 * @param {string} cacheKey - Clave única para el caché
 * @param {string} url - URL completa de la API
 * @param {number} ttl - Time To Live en segundos
 * @param {string} logCategory - Categoría para los logs
 * @param {Object} extraData - Datos adicionales para logs
 */
async function cachedApiRequest(cacheKey, url, ttl, logCategory, extraData = {}) {
    // Verificar caché primero
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`✅ [${logCategory}] Datos servidos desde caché:`);
        console.log(`   🗃️  Cache Key: ${cacheKey}`);
        console.log(`   📦 Tamaño: ${JSON.stringify(cachedData).length} bytes`);
        Object.entries(extraData).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
        });
        return { data: cachedData, fromCache: true };
    }

    try {
        console.log(`🚌 [${logCategory}] Petición a API remota (caché miss):`);
        console.log(`   🔗 URL: ${url}`);
        console.log(`   🗃️  Cache Key: ${cacheKey}`);
        console.log(`   ⏰ TTL: ${ttl}s`);
        Object.entries(extraData).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
        });

        const startTime = Date.now();
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Guardar en caché
        cache.set(cacheKey, response.data, ttl);

        console.log(`✅ [${logCategory}] Respuesta exitosa y cacheada:`);
        console.log(`   📊 Status: ${response.status}`);
        console.log(`   ⏱️  Tiempo de respuesta: ${responseTime}ms`);
        console.log(`   📦 Tamaño: ${JSON.stringify(response.data).length} bytes`);
        console.log(`   🗃️  Guardado en caché por ${ttl}s`);

        return { data: response.data, fromCache: false };

    } catch (error) {
        console.error(`❌ [${logCategory}] Error en petición:`);
        console.error(`   🔗 URL: ${url}`);
        console.error(`   🗃️  Cache Key: ${cacheKey}`);
        console.error(`   ⚠️  Error: ${error.message}`);
        if (error.response) {
            console.error(`   📊 Status: ${error.response.status}`);
        }
        throw error;
    }
}

/**
 * Obtiene datos generales desde caché o API
 */
async function getGeneralData() {
    const cacheKey = 'generalData';
    const url = `${BASE_API_URL}?dato=20160101T000000_es_0_20160101T000000&func=7`;
    const ttl = 24 * 3600; // 24 horas

    return await cachedApiRequest(cacheKey, url, ttl, 'GENERAL');
}

/**
 * Calcula TTL hasta la medianoche para horarios
 */
function getTTLUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Próxima medianoche
    return Math.floor((midnight - now) / 1000);
}

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para la configuración de rutas
app.get('/routes.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'routes.json'));
});

// API routes - prefijo /buscoruna/api
app.use('/buscoruna/api', (req, res, next) => {
    // Remover el prefijo /buscoruna/api para las rutas internas
    req.url = req.url.replace('/buscoruna/api', '');
    next();
});

// Tiempos de llegada con caché breve optimizado
app.get('/api/arrivals/:stopId', async (req, res) => {
    try {
        const { stopId } = req.params;
        
        // Debug: mostrar el valor recibido
        console.log(`🔍 [ARRIVALS DEBUG] stopId recibido: "${stopId}" (tipo: ${typeof stopId})`);
        
        // Validar que stopId no sea undefined, null o 'undefined'
        if (!stopId || stopId === 'undefined' || stopId === 'null') {
            console.error(`❌ [ARRIVALS] Parámetro stopId inválido: "${stopId}"`);
            return res.status(400).json({
                error: 'Parámetro stopId requerido',
                message: `El parámetro stopId debe ser un número válido, recibido: "${stopId}"`
            });
        }
        
        const cacheKey = `arrivals_${stopId}`;
        const url = `${BASE_API_URL}?func=0&dato=${stopId}`;
        const ttl = 15; // 15 segundos para datos en tiempo real
        
        const result = await cachedApiRequest(
            cacheKey, 
            url, 
            ttl, 
            'ARRIVALS', 
            { '📍 Parada': stopId }
        );
        
        // Headers para datos en tiempo real
        res.set({
            'Cache-Control': 'public, max-age=15', // 15 segundos
            'X-Cache-Type': 'realtime-15s',
            'X-Cache-Hit': result.fromCache ? 'true' : 'false',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.json(result.data);
        
    } catch (error) {
        console.error(`❌ [ARRIVALS] Error para parada ${req.params.stopId}:`, error.message);
        res.status(500).json({
            error: 'Error al obtener tiempos de llegada',
            message: error.message
        });
    }
});

// === ENDPOINTS OPTIMIZADOS ===

// Datos generales con caché optimizado (líneas, paradas, tarifas)
app.get('/api/general', async (req, res) => {
    try {
        const result = await getGeneralData();
        
        // Headers para datos estáticos
        res.set({
            'Cache-Control': 'public, max-age=86400', // 24 horas
            'X-Cache-Type': 'static-24h',
            'X-Cache-Hit': result.fromCache ? 'true' : 'false',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.json(result.data);
        
    } catch (error) {
        console.error('❌ [GENERAL] Error obteniendo datos generales:', error.message);
        res.status(500).json({
            error: 'Error al obtener datos generales',
            message: error.message
        });
    }
});

// Datos específicos de línea optimizado (reutiliza datos generales cacheados)
app.get('/api/line/:lineId', async (req, res) => {
    try {
        const { lineId } = req.params;
        
        // Validar que lineId no sea undefined, null o 'undefined'
        if (!lineId || lineId === 'undefined' || lineId === 'null') {
            console.error(`❌ [LINE] Parámetro lineId inválido: "${lineId}"`);
            return res.status(400).json({
                error: 'Parámetro lineId requerido',
                message: `El parámetro lineId debe ser un número válido, recibido: "${lineId}"`
            });
        }
        
        // Primero intentar obtener datos estáticos del caché general
        let staticLineData = null;
        try {
            const generalResult = await getGeneralData();
            if (generalResult.data && generalResult.data.lineas) {
                staticLineData = generalResult.data.lineas.find(line => line.id === lineId);
            }
        } catch (err) {
            console.log(`⚠️  [LINE] No se pudieron obtener datos generales, consultando API directa`);
        }
        
        // Si no encontramos la línea en caché general, consultar API específica
        if (!staticLineData) {
            const cacheKey = `line_${lineId}`;
            const url = `${BASE_API_URL}?func=1&dato=${lineId}`;
            const ttl = 24 * 3600; // 24 horas para datos estáticos
            
            const result = await cachedApiRequest(
                cacheKey, 
                url, 
                ttl, 
                'LINE', 
                { '🚇 Línea': lineId }
            );
            
            res.set({
                'Cache-Control': 'public, max-age=86400', // 24 horas
                'X-Cache-Type': 'static-24h',
                'X-Cache-Hit': result.fromCache ? 'true' : 'false',
                'X-Data-Source': 'api-specific',
                'Access-Control-Allow-Origin': '*'
            });
            
            return res.json(result.data);
        }
        
        // Datos encontrados en caché general
        console.log(`✅ [LINE] Datos estáticos servidos desde caché general:`);
        console.log(`   🚇 Línea: ${lineId}`);
        console.log(`   📦 Datos: ${staticLineData.nom_comer} (${staticLineData.orig_linea} - ${staticLineData.dest_linea})`);
        
        res.set({
            'Cache-Control': 'public, max-age=86400', // 24 horas
            'X-Cache-Type': 'static-24h',
            'X-Cache-Hit': 'true',
            'X-Data-Source': 'general-cache',
            'Access-Control-Allow-Origin': '*'
        });
        
        // Formato compatible con la respuesta original
        res.json({
            resultado: "OK",
            fecha_peticion: new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14),
            lineas: [staticLineData],
            Origen: "Cache_Optimizado"
        });
        
    } catch (error) {
        console.error(`❌ [LINE] Error para línea ${req.params.lineId}:`, error.message);
        res.status(500).json({
            error: 'Error al obtener datos de línea',
            message: error.message
        });
    }
});

// Horarios de línea optimizado (caché hasta medianoche)
app.get('/api/schedule/:lineId/:fecha', async (req, res) => {
    try {
        const { lineId, fecha } = req.params;
        
        // Validar que los parámetros no sean undefined, null o 'undefined'
        if (!lineId || lineId === 'undefined' || lineId === 'null') {
            console.error(`❌ [SCHEDULE] Parámetro lineId inválido: "${lineId}"`);
            return res.status(400).json({
                error: 'Parámetro lineId requerido',
                message: `El parámetro lineId debe ser un número válido, recibido: "${lineId}"`
            });
        }
        
        if (!fecha || fecha === 'undefined' || fecha === 'null') {
            console.error(`❌ [SCHEDULE] Parámetro fecha inválido: "${fecha}"`);
            return res.status(400).json({
                error: 'Parámetro fecha requerido',
                message: `El parámetro fecha debe tener formato YYYYMMDD, recibido: "${fecha}"`
            });
        }
        
        const cacheKey = `schedule_${lineId}_${fecha}`;
        const url = `${BASE_API_URL}?func=8&dato=${lineId}&fecha=${fecha}`;
        
        // TTL hasta medianoche para la fecha consultada
        const ttl = getTTLUntilMidnight();
        
        const result = await cachedApiRequest(
            cacheKey, 
            url, 
            ttl, 
            'SCHEDULE', 
            { '🚇 Línea': lineId, '📅 Fecha': fecha }
        );
        
        // Headers para horarios
        res.set({
            'Cache-Control': `public, max-age=${ttl}`,
            'X-Cache-Type': 'until-midnight',
            'X-Cache-Hit': result.fromCache ? 'true' : 'false',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.json(result.data);
        
    } catch (error) {
        console.error(`❌ [SCHEDULE] Error para línea ${req.params.lineId}, fecha ${req.params.fecha}:`, error.message);
        res.status(500).json({
            error: 'Error al obtener horarios',
            message: error.message
        });
    }
});

// === NUEVOS ENDPOINTS PARA APROVECHAR LA API COMPLETA ===

// Posiciones de buses en una línea (datos en tiempo real)
app.get('/api/line/:lineId/buses', async (req, res) => {
    try {
        const { lineId } = req.params;
        const cacheKey = `buses_${lineId}`;
        const url = `${BASE_API_URL}?func=2&dato=${lineId}`;
        const ttl = 15; // 15 segundos para posiciones de buses
        
        const result = await cachedApiRequest(
            cacheKey, 
            url, 
            ttl, 
            'BUSES-POSITION', 
            { '🚇 Línea': lineId }
        );
        
        res.set({
            'Cache-Control': 'public, max-age=15',
            'X-Cache-Type': 'realtime-15s',
            'X-Cache-Hit': result.fromCache ? 'true' : 'false',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.json(result.data);
        
    } catch (error) {
        console.error(`❌ [BUSES-POSITION] Error para línea ${req.params.lineId}:`, error.message);
        res.status(500).json({
            error: 'Error al obtener posiciones de buses',
            message: error.message
        });
    }
});

// Coordenadas geográficas de buses de una línea
app.get('/api/line/:lineId/buses/coordinates', async (req, res) => {
    try {
        const { lineId } = req.params;
        const cacheKey = `bus_coords_${lineId}`;
        const url = `${BASE_API_URL}?func=99&mostrar=B&dato=${lineId}`;
        const ttl = 15; // 15 segundos para coordenadas de buses
        
        const result = await cachedApiRequest(
            cacheKey, 
            url, 
            ttl, 
            'BUS-COORDINATES', 
            { '🚇 Línea': lineId }
        );
        
        res.set({
            'Cache-Control': 'public, max-age=15',
            'X-Cache-Type': 'realtime-15s',
            'X-Cache-Hit': result.fromCache ? 'true' : 'false',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.json(result.data);
        
    } catch (error) {
        console.error(`❌ [BUS-COORDINATES] Error para línea ${req.params.lineId}:`, error.message);
        res.status(500).json({
            error: 'Error al obtener coordenadas de buses',
            message: error.message
        });
    }
});

// Coordenadas de paradas de una línea
app.get('/api/line/:lineId/stops/coordinates', async (req, res) => {
    try {
        const { lineId } = req.params;
        const cacheKey = `stop_coords_${lineId}`;
        const url = `${BASE_API_URL}?func=99&mostrar=P&dato=${lineId}`;
        const ttl = 7 * 24 * 3600; // 7 días para coordenadas de paradas (datos estáticos)
        
        const result = await cachedApiRequest(
            cacheKey, 
            url, 
            ttl, 
            'STOP-COORDINATES', 
            { '🚇 Línea': lineId }
        );
        
        res.set({
            'Cache-Control': 'public, max-age=604800', // 7 días
            'X-Cache-Type': 'static-7d',
            'X-Cache-Hit': result.fromCache ? 'true' : 'false',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.json(result.data);
        
    } catch (error) {
        console.error(`❌ [STOP-COORDINATES] Error para línea ${req.params.lineId}:`, error.message);
        res.status(500).json({
            error: 'Error al obtener coordenadas de paradas',
            message: error.message
        });
    }
});

// Trazado del recorrido de una línea (polilínea)
app.get('/api/line/:lineId/route', async (req, res) => {
    try {
        const { lineId } = req.params;
        const cacheKey = `route_${lineId}`;
        const url = `${BASE_API_URL}?func=99&mostrar=R&dato=${lineId}`;
        const ttl = 7 * 24 * 3600; // 7 días para trazado de recorrido (datos estáticos)
        
        const result = await cachedApiRequest(
            cacheKey, 
            url, 
            ttl, 
            'ROUTE-TRACE', 
            { '🚇 Línea': lineId }
        );
        
        res.set({
            'Cache-Control': 'public, max-age=604800', // 7 días
            'X-Cache-Type': 'static-7d',
            'X-Cache-Hit': result.fromCache ? 'true' : 'false',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.json(result.data);
        
    } catch (error) {
        console.error(`❌ [ROUTE-TRACE] Error para línea ${req.params.lineId}:`, error.message);
        res.status(500).json({
            error: 'Error al obtener trazado de recorrido',
            message: error.message
        });
    }
});

// Endpoint consolidado para datos completos de una línea
app.get('/api/line/:lineId/complete', async (req, res) => {
    try {
        const { lineId } = req.params;
        
        // Ejecutar múltiples peticiones en paralelo para optimizar
        const [
            staticDataResult,
            busPositionsResult,
            busCoordinatesResult
        ] = await Promise.allSettled([
            // Datos estáticos (desde caché general o API específica)
            (async () => {
                try {
                    const generalResult = await getGeneralData();
                    if (generalResult.data && generalResult.data.lineas) {
                        const lineData = generalResult.data.lineas.find(line => line.id === lineId);
                        if (lineData) return { data: lineData, fromCache: true };
                    }
                } catch (err) {
                    console.log(`⚠️  Fallback a API específica para línea ${lineId}`);
                }
                
                const cacheKey = `line_${lineId}`;
                const url = `${BASE_API_URL}?func=1&dato=${lineId}`;
                return await cachedApiRequest(cacheKey, url, 24 * 3600, 'LINE-COMPLETE');
            })(),
            
            // Posiciones de buses
            cachedApiRequest(`buses_${lineId}`, `${BASE_API_URL}?func=2&dato=${lineId}`, 15, 'BUSES-COMPLETE'),
            
            // Coordenadas geográficas de buses
            cachedApiRequest(`bus_coords_${lineId}`, `${BASE_API_URL}?func=99&mostrar=B&dato=${lineId}`, 15, 'BUS-COORDS-COMPLETE')
        ]);
        
        // Consolidar resultados
        const response = {
            lineId,
            timestamp: new Date().toISOString(),
            static: staticDataResult.status === 'fulfilled' ? staticDataResult.value.data : null,
            buses: busPositionsResult.status === 'fulfilled' ? busPositionsResult.value.data : null,
            coordinates: busCoordinatesResult.status === 'fulfilled' ? busCoordinatesResult.value.data : null,
            cache_info: {
                static_cached: staticDataResult.status === 'fulfilled' && staticDataResult.value.fromCache,
                buses_cached: busPositionsResult.status === 'fulfilled' && busPositionsResult.value.fromCache,
                coordinates_cached: busCoordinatesResult.status === 'fulfilled' && busCoordinatesResult.value.fromCache
            }
        };
        
        console.log(`✅ [LINE-COMPLETE] Datos consolidados para línea ${lineId}:`);
        console.log(`   📊 Datos estáticos: ${response.static ? '✓' : '✗'}`);
        console.log(`   🚌 Posiciones buses: ${response.buses ? '✓' : '✗'}`);
        console.log(`   📍 Coordenadas: ${response.coordinates ? '✓' : '✗'}`);
        
        res.set({
            'Cache-Control': 'public, max-age=15', // TTL más corto por datos dinámicos
            'X-Cache-Type': 'mixed',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.json(response);
        
    } catch (error) {
        console.error(`❌ [LINE-COMPLETE] Error para línea ${req.params.lineId}:`, error.message);
        res.status(500).json({
            error: 'Error al obtener datos completos de línea',
            message: error.message
        });
    }
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

// === INICIALIZACIÓN DEL SERVIDOR ===

// Precargar datos generales al iniciar (opcional)
async function preloadGeneralData() {
    try {
        console.log('🔄 Precargando datos generales...');
        await getGeneralData();
        console.log('✅ Datos generales precargados en caché');
    } catch (error) {
        console.log('⚠️  No se pudieron precargar datos generales:', error.message);
    }
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚌 Servidor BusCoruña optimizado iniciado en http://localhost:${PORT}`);
    console.log(`📦 Sistema de caché: node-cache habilitado`);
    console.log(`📡 Endpoints disponibles:`);
    console.log(`\n   === DATOS BÁSICOS ===`);
    console.log(`   - GET /api/general                          (Líneas, paradas, tarifas - Cache 24h)`);
    console.log(`   - GET /api/arrivals/:stopId                 (Llegadas a parada - Cache 15s)`);
    console.log(`\n   === INFORMACIÓN DE LÍNEAS ===`);
    console.log(`   - GET /api/line/:lineId                     (Info línea - Reutiliza cache general)`);
    console.log(`   - GET /api/schedule/:lineId/:fecha          (Horarios - Cache hasta medianoche)`);
    console.log(`\n   === DATOS EN TIEMPO REAL ===`);
    console.log(`   - GET /api/line/:lineId/buses               (Posiciones buses - Cache 15s)`);
    console.log(`   - GET /api/line/:lineId/buses/coordinates   (Coordenadas buses - Cache 15s)`);
    console.log(`\n   === DATOS ESTÁTICOS GEOGRÁFICOS ===`);
    console.log(`   - GET /api/line/:lineId/stops/coordinates   (Coordenadas paradas - Cache 7d)`);
    console.log(`   - GET /api/line/:lineId/route               (Trazado recorrido - Cache 7d)`);
    console.log(`\n   === ENDPOINT CONSOLIDADO ===`);
    console.log(`   - GET /api/line/:lineId/complete            (Todos los datos - Cache mixto)`);
    console.log(`\n🗂️  Estrategias de caché implementadas:`);
    console.log(`   📦 Datos estáticos: 24h (líneas, paradas, tarifas)`);
    console.log(`   🏃 Tiempo real: 15s (llegadas, posiciones buses)`);
    console.log(`   📅 Horarios: hasta medianoche`);
    console.log(`   🗺️  Geográficos: 7d (rutas, coordenadas paradas)`);
    console.log(`\n⚡ Optimizaciones activas:`);
    console.log(`   🔄 Reutilización de datos cacheados`);
    console.log(`   🚀 Peticiones paralelas en endpoints consolidados`);
    console.log(`   📊 Headers informativos de caché`);
    
    // Precargar datos generales después de 2 segundos
    setTimeout(preloadGeneralData, 2000);
}); 