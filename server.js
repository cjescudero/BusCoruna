const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Datos de prueba para la aplicación
const mockData = {
    general: {
        iTranvias: {
            actualizacion: {
                lineas: [
                    {
                        id: "3",
                        nom_comer: "Línea 3",
                        orig_linea: "Los Rosales",
                        dest_linea: "Adromideras",
                        color: "#FF0000"
                    },
                    {
                        id: "4", 
                        nom_comer: "Línea 4",
                        orig_linea: "Los Rosales",
                        dest_linea: "Centro",
                        color: "#00FF00"
                    }
                ],
                paradas: [
                    {
                        id: "42",
                        nombre: "Emilio González López / Manuel Azaña",
                        posx: "-8.4115",
                        posy: "43.3623"
                    },
                    {
                        id: "150",
                        nombre: "Adromideras",
                        posx: "-8.4080", 
                        posy: "43.3650"
                    },
                    {
                        id: "200",
                        nombre: "Centro",
                        posx: "-8.4150",
                        posy: "43.3600"
                    }
                ]
            }
        }
    },
    arrivals: {
        parada: "42",
        llegadas: [
            {
                linea: "3",
                tiempo: "5 min",
                destino: "Adromideras"
            },
            {
                linea: "4", 
                tiempo: "8 min",
                destino: "Centro"
            }
        ]
    }
};

// Ruta para datos generales
app.get('/buscoruna/api/general', async (req, res) => {
    try {
        console.log('📡 Sirviendo datos generales (mock)...');
        res.json(mockData.general);
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
        console.log(`📡 Sirviendo llegadas para parada ${stopId} (mock)...`);
        
        // Simular diferentes llegadas según la parada
        const arrivals = {
            "42": {
                parada: stopId,
                llegadas: [
                    { linea: "3", tiempo: "5 min", destino: "Adromideras" },
                    { linea: "4", tiempo: "8 min", destino: "Centro" }
                ]
            },
            "150": {
                parada: stopId,
                llegadas: [
                    { linea: "3", tiempo: "12 min", destino: "Los Rosales" }
                ]
            },
            "200": {
                parada: stopId,
                llegadas: [
                    { linea: "4", tiempo: "3 min", destino: "Los Rosales" }
                ]
            }
        };
        
        res.json(arrivals[stopId] || mockData.arrivals);
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
        console.log(`📡 Sirviendo datos de línea ${lineId} (mock)...`);
        
        const lineData = mockData.general.iTranvias.actualizacion.lineas.find(l => l.id === lineId);
        if (lineData) {
            res.json({
                resultado: "OK",
                fecha_peticion: new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14),
                lineas: [lineData],
                Origen: "Mock_Data"
            });
        } else {
            res.status(404).json({ error: 'Línea no encontrada' });
        }
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
        console.log(`📡 Sirviendo horarios para línea ${lineId}, fecha ${fecha} (mock)...`);
        
        // Simular horarios básicos
        res.json({
            resultado: "OK",
            fecha_peticion: fecha,
            horarios: {
                ida: ["06:00", "06:30", "07:00", "07:30", "08:00"],
                vuelta: ["06:15", "06:45", "07:15", "07:45", "08:15"]
            },
            Origen: "Mock_Data"
        });
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
    console.log(`🧪 Usando datos de prueba (mock)`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
}); 