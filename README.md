# 🚌 Bus Coruña - PWA

Una aplicación web progresiva (PWA) para obtener información en tiempo real de los autobuses urbanos de A Coruña.

## 📋 Descripción

Esta aplicación proporciona información actualizada sobre las rutas de autobús urbano de A Coruña, incluyendo:

- **Tiempos de llegada en tiempo real** para cada parada
- **Mapa interactivo** con las rutas de autobús
- **Información detallada** de líneas y horarios
- **Interfaz responsive** optimizada para móviles
- **Funcionalidad offline** como PWA

## ✨ Características

- 🌐 **PWA (Progressive Web App)**: Instalable en dispositivos móviles
- 📍 **Mapa interactivo**: Visualización de rutas con Leaflet
- ⏰ **Tiempos reales**: Información actualizada de llegadas
- 📱 **Diseño responsive**: Optimizado para móviles y tablets
- 🔄 **API Proxy**: Backend Node.js para evitar problemas de CORS
- 🎨 **Interfaz moderna**: Diseño limpio y fácil de usar

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
├── routes.json            # Configuración de rutas
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
Edita `routes.json` para añadir o modificar rutas de autobús:

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



### Comandos útiles para gestión

```bash
# Ver estado del backend
sudo systemctl status bus-coruna

# Reiniciar backend
sudo systemctl restart bus-coruna

# Ver logs del backend
sudo journalctl -u bus-coruna -f

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
```

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

- **Autor**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [@tu-usuario]

---

⭐ Si este proyecto te ha sido útil, ¡dale una estrella en GitHub! 