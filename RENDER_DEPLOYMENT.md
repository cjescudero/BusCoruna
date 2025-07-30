# 🚌 Bus Coruña - Despliegue en Render

## 📋 Archivos de Configuración para Render

### Archivos Principales
- ✅ `render.yaml` - Configuración principal del servicio web
- ✅ `render-static.yaml` - Configuración para backend + frontend
- ✅ `render-deploy.md` - Guía completa de despliegue
- ✅ `deploy-render.sh` - Script de verificación y despliegue

### Archivos del Proyecto
- ✅ `server.js` - Servidor backend (puerto 10000)
- ✅ `package.json` - Dependencias Node.js
- ✅ `bus-app-coruna.html` - Aplicación PWA frontend
- ✅ `manifest.json` - Configuración PWA
- ✅ `routes.json` - Configuración de rutas de autobús

## 🚀 Despliegue Rápido

### 1. Verificar Configuración
```bash
./deploy-render.sh
```

### 2. Subir a GitHub
```bash
git add .
git commit -m "Configure Render deployment"
git push origin main
```

### 3. Desplegar en Render
1. Ve a [render.com](https://render.com)
2. Crea cuenta y conecta tu repositorio
3. Crea "Web Service"
4. Configura:
   - **Name**: `bus-coruna-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 4. Configurar Frontend
1. Copia la URL del backend (ej: `https://tu-app.onrender.com`)
2. Actualiza `BACKEND_API` en `bus-app-coruna.html`
3. Despliega el frontend en GitHub Pages

## 🔧 Configuración Detallada

### render.yaml
```yaml
services:
  - type: web
    name: bus-coruna-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /
    autoDeploy: true
```

### Variables de Entorno
- `NODE_ENV`: `production`
- `PORT`: `10000`

## 📊 Ventajas de Render

- **Gratis**: 750 horas/mes
- **SSL automático**: Incluido
- **Despliegue automático**: Desde GitHub
- **Logs en tiempo real**: Fácil debugging
- **Escalabilidad**: Fácil upgrade
- **Node.js nativo**: Soporte completo

## 🐛 Solución de Problemas

### Error de Build
- Verifica `package.json` en la raíz
- Revisa logs en Render dashboard
- Asegúrate de que `render.yaml` esté presente

### Error de CORS
- Actualiza URL del backend en el frontend
- Verifica que el servicio esté "Live"
- Revisa variables de entorno

### Servicio No Responde
- Verifica health check en `/`
- Revisa logs en tiempo real
- Comprueba que el puerto sea 10000

## 📱 PWA Features

- ✅ Service Worker para offline
- ✅ Manifest para instalación
- ✅ Mapa interactivo con Leaflet
- ✅ Tiempos de llegada en tiempo real
- ✅ Diseño responsive

---

¡Tu aplicación Bus Coruña estará funcionando en Render en minutos! 🚌✨ 