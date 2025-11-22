const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Base URL for external API
const ITRANVIAS_BASE_URL = 'https://itranvias.com/queryitr_v3.php';

// Helper function to fetch data
// Helper function to fetch data with retry logic
async function fetchFromApi(params, retries = 3, delay = 1000) {
    try {
        console.log(`📡 Requesting to itranvias:`, params);
        const response = await axios.get(ITRANVIAS_BASE_URL, { params });
        console.log(`✅ Response from itranvias (status ${response.status}):`, JSON.stringify(response.data).substring(0, 200) + '...');
        return response.data;
    } catch (error) {
        console.error(`❌ Error requesting itranvias: ${error.message}`);
        if (retries > 0) {
            console.warn(`⚠️ Retrying in ${delay}ms... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchFromApi(params, retries - 1, delay * 2);
        }
        throw error;
    }
}

// Ruta para datos generales
app.get('/buscoruna/api/general', async (req, res) => {
    try {
        console.log('📡 Sirviendo datos generales (real)...');
        // https://itranvias.com/queryitr_v3.php?dato=20160101T000000_gl_0_20160101T000000&func=7
        const data = await fetchFromApi({
            dato: '20160101T000000_gl_0_20160101T000000',
            func: 7
        });
        res.json(data);
    } catch (error) {
        console.error('❌ Error sirviendo datos generales:', error.message);
        res.status(500).json({
            error: 'Error obteniendo datos generales',
            message: error.message
        });
    }
});

// Ruta para tiempos de llegada
app.get('/buscoruna/api/arrivals/:stopId', async (req, res) => {
    try {
        const { stopId } = req.params;
        console.log(`📡 Sirviendo llegadas para parada ${stopId} (real)...`);

        // https://itranvias.com/queryitr_v3.php?&func=0&dato={stopId}
        const data = await fetchFromApi({
            func: 0,
            dato: stopId
        });

        res.json(data);
    } catch (error) {
        console.error(`❌ Error sirviendo llegadas para parada ${req.params.stopId}:`, error.message);
        res.status(500).json({
            error: 'Error obteniendo tiempos de llegada',
            message: error.message
        });
    }
});

// Ruta para datos de línea específica
app.get('/buscoruna/api/line/:lineId', async (req, res) => {
    try {
        const { lineId } = req.params;
        console.log(`📡 Sirviendo datos de línea ${lineId} (real)...`);

        // https://itranvias.com/queryitr_v3.php?&func=1&dato={lineId}
        const data = await fetchFromApi({
            func: 1,
            dato: lineId
        });

        res.json(data);
    } catch (error) {
        console.error(`❌ Error sirviendo datos de línea ${req.params.lineId}:`, error.message);
        res.status(500).json({
            error: 'Error obteniendo datos de línea',
            message: error.message
        });
    }
});

// Ruta para horarios
app.get('/buscoruna/api/schedule/:lineId/:fecha', async (req, res) => {
    try {
        const { lineId, fecha } = req.params;
        console.log(`📡 Sirviendo horarios para línea ${lineId}, fecha ${fecha} (real)...`);

        // https://itranvias.com/queryitr_v3.php?&func=8&dato={lineId}&fecha={fecha}
        const data = await fetchFromApi({
            func: 8,
            dato: lineId,
            fecha: fecha
        });

        res.json(data);
    } catch (error) {
        console.error(`❌ Error sirviendo horarios:`, error.message);
        res.status(500).json({
            error: 'Error obteniendo horarios',
            message: error.message
        });
    }
});

// Ruta raíz - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejar rutas no encontradas
app.use('*', (req, res) => {
    console.log(`404 - Ruta no encontrada: ${req.originalUrl}`);
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend iniciado en puerto ${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/buscoruna/api`);
    console.log(`🌐 Aplicación disponible en http://localhost:${PORT}`);
    console.log(`🔌 Conectado a API real: ${ITRANVIAS_BASE_URL}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
}); 