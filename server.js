const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
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

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'API Proxy para Bus Coruña',
        endpoints: {
            '/api/arrivals/:stopId': 'Obtener tiempos de llegada para una parada',
            '/api/general': 'Obtener datos generales del sistema',
            '/api/line/:lineId': 'Obtener datos específicos de una línea',
            '/api/schedule/:lineId/:fecha': 'Obtener horarios de una línea para una fecha específica'
        }
    });
});

// Proxy para tiempos de llegada
app.get('/api/arrivals/:stopId', async (req, res) => {
    try {
        const { stopId } = req.params;
        console.log(`Solicitando tiempos de llegada para parada ${stopId}`);
        
        const response = await axios.get(`https://itranvias.com/queryitr_v3.php?&func=0&dato=${stopId}`, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log(`Datos recibidos para parada ${stopId}:`, response.data);
        res.json(response.data);
        
    } catch (error) {
        console.error('Error obteniendo tiempos de llegada:', error.message);
        res.status(500).json({
            error: 'Error al obtener tiempos de llegada',
            message: error.message
        });
    }
});

// Proxy para datos generales
app.get('/api/general', async (req, res) => {
    try {
        console.log('Solicitando datos generales del sistema');
        
        const response = await axios.get('https://itranvias.com/queryitr_v3.php?dato=20160101T000000_gl_0_20160101T000000&func=7', {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log('Datos generales recibidos');
        res.json(response.data);
        
    } catch (error) {
        console.error('Error obteniendo datos generales:', error.message);
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
        console.log(`Solicitando datos de línea ${lineId}`);
        
        const response = await axios.get(`https://itranvias.com/queryitr_v3.php?&func=1&dato=${lineId}`, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log(`Datos de línea ${lineId} recibidos`);
        res.json(response.data);
        
    } catch (error) {
        console.error('Error obteniendo datos de línea:', error.message);
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
        console.log(`Solicitando horarios para línea ${lineId} en fecha ${fecha}`);
        
        const response = await axios.get(`https://itranvias.com/queryitr_v3.php?&func=8&dato=${lineId}&fecha=${fecha}`, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log(`Horarios de línea ${lineId} para fecha ${fecha} recibidos`);
        res.json(response.data);
        
    } catch (error) {
        console.error('Error obteniendo horarios:', error.message);
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