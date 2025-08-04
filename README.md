# 🚌 Bus Coruña - Aplicación Simple

Una aplicación web progresiva (PWA) **diseñada para personas con muy bajas competencias digitales**, que proporciona información de autobuses urbanos de A Coruña con máxima simplicidad y usabilidad.

## 📋 Descripción

Esta aplicación está **específicamente diseñada para usuarios con muy bajas competencias digitales**, priorizando la **usabilidad y accesibilidad** sobre funcionalidades complejas. Se han sacrificado características avanzadas para mantener una interfaz extremadamente simple y fácil de usar.

### 🎯 Público Objetivo
- Personas mayores
- Usuarios con poca experiencia tecnológica
- Personas que necesitan información de autobús de forma rápida y sencilla

## ⚠️ Limitaciones Diseñadas

**Esta aplicación NO incluye las siguientes funcionalidades por diseño:**

- ❌ **Búsqueda de rutas**: Todas las rutas son predefinidas
- ❌ **Rutas complejas**: Solo hay rutas directas entre destinos preferidos
- ❌ **Orígenes múltiples**: Las rutas están pensadas desde Los Rosales
- ❌ **Destinos flexibles**: Los destinos se pueden cambiar en `routes.json`

### 🏠 Configuración de "Casa"
- **Ubicación considerada como casa**: Parada 42 (Emilio González López / Manuel Azaña)
- **Origen principal**: Los Rosales
- **Rutas predefinidas**: Optimizadas para usuarios desde esta zona

## ✨ Características Principales

- 🌐 **PWA (Progressive Web App)**: Instalable en dispositivos móviles
- 📍 **Mapa interactivo**: Visualización de rutas con Leaflet
- ⏰ **Tiempos reales**: Información actualizada de llegadas
- 📱 **Diseño responsive**: Optimizado para móviles y tablets
- 🔄 **API Proxy**: Backend Node.js para evitar problemas de CORS
- 🎨 **Interfaz ultra-simple**: Diseño limpio y fácil de usar
- ♿ **Accesibilidad**: Diseñada para usuarios con bajas competencias digitales

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Leaflet.js para mapas
- PWA con Service Worker
- Manifest para instalación

### Backend
- Node.js
- Express.js
- Axios para peticiones HTTP
- CORS para compatibilidad

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/bus-coruna.git
   cd bus-coruna
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno** (opcional)
   ```bash
   cp .env.example .env
   # Edita .env con tus configuraciones
   ```

## 🚀 Uso

### Lanzamiento del Backend

El backend es un servidor Node.js que actúa como proxy para la API de autobuses:

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar servidor de producción
npm start
```

El backend estará disponible en `http://localhost:3000`

### Invocación del Frontend

El frontend es una aplicación web estática que se puede servir de varias formas:

#### Opción 1: Servidor web local
```bash
# Con Python 3
python3 -m http.server 8000

# Con Node.js (http-server)
npx http-server -p 8000

# Con PHP
php -S localhost:8000
```

#### Opción 2: Abrir directamente en el navegador
Simplemente abre el archivo `index.html` en tu navegador web.

#### Opción 3: Servidor de desarrollo integrado
Si tienes el backend corriendo, puedes configurar un servidor web para servir los archivos estáticos.

### Endpoints de la API

- `GET /api/arrivals/:stopId` - Tiempos de llegada para una parada
- `GET /api/general` - Datos generales del sistema
- `GET /api/line/:lineId` - Datos específicos de una línea
- `GET /api/schedule/:lineId/:fecha` - Horarios de una línea

## 📁 Estructura del Proyecto

```
BusCoruna/
├── index.html             # Aplicación PWA principal
├── server.js              # Servidor backend Node.js
├── routes.json            # Configuración de rutas (destinos personalizables)
├── manifest.json          # Manifest para PWA
├── sw.js                  # Service Worker
├── package.json           # Dependencias y scripts
└── README.md             # Este archivo
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=development
```

### Configuración de Rutas
Edita `routes.json` para añadir o modificar rutas de autobús. **Los posibles destinos se pueden cambiar en este archivo:**

```json
{
  "routes": [
    {
      "id": "3-42-150",
      "name": "Línea 3: Casa → Jardines Méndez Núñez → Adromideras",
      "lineId": "3",
      "apiLineId": "300",
      "originStop": 42,
      "destinationStop": 150,
      "originName": "E.Glez.López, M.Azaña",
      "destinationName": "Adromideras",
      "active": true
    }
  ]
}
```

## Despliegue en Ubuntu
---
## ⚙️ Paso 1: Crear el servicio systemd

Crear un archivo llamado `buscoruna.service` en `/etc/systemd/system/`:

```bash
sudo nano /etc/systemd/system/buscoruna.service
```
Pegar el siguiente contenido

```bash
[Unit]
Description=Backend Node.js BusCoruna
After=network.target

[Service]
ExecStart=/usr/bin/node /home/pathalcodigo/BusCoruna/server.js
WorkingDirectory=/pathalcodigo/BusCoruna
Restart=always
User=usuarioqueejecuta
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

🚀 Paso 2: Activar el servicio

Ejecutar los siguientes comandos para registrar y activar el servicio:

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable buscoruna.service
sudo systemctl start buscoruna.service
```

🔍 Paso 3: Verificar que esté funcionando

```bash
sudo systemctl status buscoruna.service
```

🛠️ Comandos de mantenimiento

| Acción                  | Comando                               |
| :---------------------- | :------------------------------------ |
| Iniciar el servicio     | `sudo systemctl start buscoruna`      |
| Detener el servicio     | `sudo systemctl stop buscoruna`       |
| Reiniciar el servicio   | `sudo systemctl restart buscoruna`    |
| Ver estado              | `sudo systemctl status buscoruna`     |
| Ver logs en tiempo real | `journalctl -u buscoruna -f`          |
| Ver logs recientes       | `journalctl -u buscoruna -e`          |

## 🤝 Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Tranvías de A Coruña** por proporcionar la API de datos
- **Leaflet.js** por la librería de mapas
- **Express.js** por el framework del servidor

## 📞 Contacto

- **Autor**: Carlos J. Escudero
- **GitHub**: [@cjescudero](https://github.com/cjescudero)

---

⭐ Si este proyecto te ha sido útil, ¡dale una estrella en GitHub! 