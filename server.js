const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

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

// Proxy para tiempos de llegada
app.get('/api/arrivals/:stopId', async (req, res) => {
    try {
        const { stopId } = req.params;
        const url = `https://itranvias.com/queryitr_v3.php?&func=0&dato=${stopId}`;
        
        console.log(`🚌 [ARRIVALS] Iniciando llamada al API:`);
        console.log(`   📍 Parada: ${stopId}`);
        console.log(`   🔗 URL: ${url}`);
        console.log(`   ⏰ Timestamp: ${new Date().toISOString()}`);
        
        const startTime = Date.now();
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`✅ [ARRIVALS] Respuesta exitosa:`);
        console.log(`   📊 Status: ${response.status}`);
        console.log(`   ⏱️  Tiempo de respuesta: ${responseTime}ms`);
        console.log(`   📦 Tamaño de respuesta: ${JSON.stringify(response.data).length} bytes`);
        console.log(`   📍 Parada: ${stopId}`);
        
        res.json(response.data);
        
    } catch (error) {
        console.error('❌ [ARRIVALS] Error obteniendo tiempos de llegada:');
        console.error(`   📍 Parada: ${req.params.stopId}`);
        console.error(`   🔗 URL: https://itranvias.com/queryitr_v3.php?&func=0&dato=${req.params.stopId}`);
        console.error(`   ⚠️  Error: ${error.message}`);
        if (error.response) {
            console.error(`   📊 Status: ${error.response.status}`);
            console.error(`   📄 Response data: ${JSON.stringify(error.response.data)}`);
        }
        res.status(500).json({
            error: 'Error al obtener tiempos de llegada',
            message: error.message
        });
    }
});

// Proxy para datos generales
app.get('/api/general', async (req, res) => {
    try {
        const url = 'https://itranvias.com/queryitr_v3.php?dato=20160101T000000_es_0_20160101T000000&func=7';
        
        console.log(`🚌 [GENERAL] Iniciando llamada al API:`);
        console.log(`   🔗 URL: ${url}`);
        console.log(`   ⏰ Timestamp: ${new Date().toISOString()}`);
        
        const startTime = Date.now();
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`✅ [GENERAL] Respuesta exitosa:`);
        console.log(`   📊 Status: ${response.status}`);
        console.log(`   ⏱️  Tiempo de respuesta: ${responseTime}ms`);
        console.log(`   📦 Tamaño de respuesta: ${JSON.stringify(response.data).length} bytes`);
        
        res.json(response.data);
        
    } catch (error) {
        console.error('❌ [GENERAL] Error obteniendo datos generales:');
        console.error(`   🔗 URL: https://itranvias.com/queryitr_v3.php?dato=20160101T000000_es_0_20160101T000000&func=7`);
        console.error(`   ⚠️  Error: ${error.message}`);
        if (error.response) {
            console.error(`   📊 Status: ${error.response.status}`);
            console.error(`   📄 Response data: ${JSON.stringify(error.response.data)}`);
        }
        res.status(500).json({
            error: 'Error al obtener datos generales',
            message: error.message
        });
    }
});

// Proxy para datos específicos de línea
app.get('/api/line/:lineId', async (req, res) => {
    try {
        const { lineId } = req.params;
        const url = `https://itranvias.com/queryitr_v3.php?&func=1&dato=${lineId}`;
        
        console.log(`🚌 [LINE] Iniciando llamada al API:`);
        console.log(`   🚇 Línea: ${lineId}`);
        console.log(`   🔗 URL: ${url}`);
        console.log(`   ⏰ Timestamp: ${new Date().toISOString()}`);
        
        const startTime = Date.now();
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`✅ [LINE] Respuesta exitosa:`);
        console.log(`   📊 Status: ${response.status}`);
        console.log(`   ⏱️  Tiempo de respuesta: ${responseTime}ms`);
        console.log(`   📦 Tamaño de respuesta: ${JSON.stringify(response.data).length} bytes`);
        console.log(`   🚇 Línea: ${lineId}`);
        
        res.json(response.data);
        
    } catch (error) {
        console.error('❌ [LINE] Error obteniendo datos de línea:');
        console.error(`   🚇 Línea: ${req.params.lineId}`);
        console.error(`   🔗 URL: https://itranvias.com/queryitr_v3.php?&func=1&dato=${req.params.lineId}`);
        console.error(`   ⚠️  Error: ${error.message}`);
        if (error.response) {
            console.error(`   📊 Status: ${error.response.status}`);
            console.error(`   📄 Response data: ${JSON.stringify(error.response.data)}`);
        }
        res.status(500).json({
            error: 'Error al obtener datos de línea',
            message: error.message
        });
    }
});

// Proxy para horarios de línea
app.get('/api/schedule/:lineId/:fecha', async (req, res) => {
    try {
        const { lineId, fecha } = req.params;
        const url = `https://itranvias.com/queryitr_v3.php?&func=8&dato=${lineId}&fecha=${fecha}`;
        
        console.log(`🚌 [SCHEDULE] Iniciando llamada al API:`);
        console.log(`   🚇 Línea: ${lineId}`);
        console.log(`   📅 Fecha: ${fecha}`);
        console.log(`   🔗 URL: ${url}`);
        console.log(`   ⏰ Timestamp: ${new Date().toISOString()}`);
        
        const startTime = Date.now();
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`✅ [SCHEDULE] Respuesta exitosa:`);
        console.log(`   📊 Status: ${response.status}`);
        console.log(`   ⏱️  Tiempo de respuesta: ${responseTime}ms`);
        console.log(`   📦 Tamaño de respuesta: ${JSON.stringify(response.data).length} bytes`);
        console.log(`   🚇 Línea: ${lineId}`);
        console.log(`   📅 Fecha: ${fecha}`);
        
        res.json(response.data);
        
    } catch (error) {
        console.error('❌ [SCHEDULE] Error obteniendo horarios:');
        console.error(`   🚇 Línea: ${req.params.lineId}`);
        console.error(`   📅 Fecha: ${req.params.fecha}`);
        console.error(`   🔗 URL: https://itranvias.com/queryitr_v3.php?&func=8&dato=${req.params.lineId}&fecha=${req.params.fecha}`);
        console.error(`   ⚠️  Error: ${error.message}`);
        if (error.response) {
            console.error(`   📊 Status: ${error.response.status}`);
            console.error(`   📄 Response data: ${JSON.stringify(error.response.data)}`);
        }
        res.status(500).json({
            error: 'Error al obtener horarios',
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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚌 Servidor backend iniciado en http://localhost:${PORT}`);
    console.log(`📡 Endpoints disponibles:`);
    console.log(`   - GET /api/arrivals/:stopId`);
    console.log(`   - GET /api/general`);
    console.log(`   - GET /api/line/:lineId`);
    console.log(`   - GET /api/schedule/:lineId/:fecha`);
}); 