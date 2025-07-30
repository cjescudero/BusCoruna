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

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre la aplicación**
   - Backend: http://localhost:3000
   - Frontend: Abre `bus-app-coruna.html` en tu navegador

## 🚀 Uso

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar servidor de producción
npm start
```

### Endpoints de la API

- `GET /api/arrivals/:stopId` - Tiempos de llegada para una parada
- `GET /api/general` - Datos generales del sistema
- `GET /api/line/:lineId` - Datos específicos de una línea
- `GET /api/schedule/:lineId/:fecha` - Horarios de una línea

## 📁 Estructura del Proyecto

```
BusCoruna/
├── bus-app-coruna.html    # Aplicación PWA principal
├── server.js              # Servidor backend Node.js
├── routes.json            # Configuración de rutas
├── manifest.json          # Manifest para PWA
├── sw.js                  # Service Worker
├── package.json           # Dependencias y scripts
└── README.md             # Este archivo
```

## 🌐 Despliegue

### Opción 1: Render (Recomendado)
1. Ve a [render.com](https://render.com) y crea una cuenta
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: `bus-coruna-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (o el plan que prefieras)
5. Haz clic en "Create Web Service"

**Ventajas de Render:**
- Despliegue automático desde GitHub
- SSL gratuito incluido
- Escalabilidad fácil
- Logs en tiempo real

### Opción 2: Vercel
1. Conecta tu repositorio a Vercel
2. Configura el directorio raíz como `/`
3. El build command será `npm start`

**Si tienes error 404 en Vercel:**
- Asegúrate de que el archivo `vercel.json` esté en la raíz del proyecto
- Si el problema persiste, usa el archivo `vercel-simple.json` como `vercel.json`
- Verifica que todos los archivos estén incluidos en el repositorio

### Opción 3: Heroku
1. Crea una aplicación en Heroku
2. Conecta tu repositorio
3. Configura las variables de entorno si es necesario

### Opción 4: Netlify
1. Sube los archivos estáticos a Netlify
2. Configura el backend en un servicio separado

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