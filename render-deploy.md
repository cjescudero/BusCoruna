# 🚀 Despliegue en Render

## 📋 Pasos para Desplegar en Render

### 1. Preparar el Repositorio
Asegúrate de que tu código esté en GitHub con todos los archivos necesarios:
- ✅ `server.js` - Servidor backend
- ✅ `package.json` - Dependencias Node.js
- ✅ `render.yaml` - Configuración de Render
- ✅ `bus-app-coruna.html` - Aplicación frontend
- ✅ `manifest.json` - Configuración PWA
- ✅ `routes.json` - Configuración de rutas

### 2. Crear Cuenta en Render
1. Ve a [render.com](https://render.com)
2. Haz clic en "Get Started"
3. Crea una cuenta con GitHub

### 3. Crear Web Service
1. En el dashboard de Render, haz clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `bus-coruna`

### 4. Configurar el Servicio
Configura los siguientes parámetros:

**Información Básica:**
- **Name**: `bus-coruna-backend`
- **Region**: Elige la más cercana (ej: Frankfurt para Europa)

**Configuración del Servicio:**
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (o el plan que prefieras)

**Variables de Entorno (opcional):**
- `NODE_ENV`: `production`
- `PORT`: `10000`

### 5. Desplegar
1. Haz clic en "Create Web Service"
2. Render comenzará el despliegue automáticamente
3. Espera a que termine el build (puede tomar 2-5 minutos)

### 6. Configurar el Frontend
Una vez desplegado el backend:

1. **Obtén la URL del backend** (ej: `https://bus-coruna-backend.onrender.com`)
2. **Actualiza la URL en el frontend**:
   - Abre `bus-app-coruna.html`
   - Busca la línea que define `BACKEND_API`
   - Cámbiala a tu URL de Render

```javascript
// Cambia esta línea en bus-app-coruna.html
const BACKEND_API = 'https://tu-app.onrender.com';
```

### 7. Desplegar el Frontend
**Opción A: GitHub Pages (Gratis)**
1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)

**Opción B: Render Static Site**
1. En Render, crea un "Static Site"
2. Conecta el mismo repositorio
3. Build Command: `echo "Static site"`
4. Publish Directory: `.`

## 🔧 Configuración Avanzada

### Variables de Entorno en Render
En el dashboard de Render, ve a tu servicio → Environment:
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://tu-frontend-url.com
```

### Dominio Personalizado
1. En Render, ve a tu servicio
2. Settings → Custom Domains
3. Añade tu dominio personalizado
4. Configura los DNS según las instrucciones

### SSL Automático
Render proporciona SSL automático para todos los servicios.

## 🐛 Solución de Problemas

### Error de Build
- Verifica que `package.json` esté en la raíz
- Asegúrate de que todas las dependencias estén listadas
- Revisa los logs de build en Render

### Error de CORS
- Verifica que la URL del backend esté correcta en el frontend
- Añade la URL del frontend a `CORS_ORIGIN` en Render

### Error 404
- Verifica que el puerto esté configurado correctamente
- Asegúrate de que `server.js` esté en la raíz
- Revisa que el `startCommand` sea `npm start`

### Servicio No Responde
- Verifica los logs en Render
- Asegúrate de que el servicio esté "Live"
- Comprueba que el health check esté funcionando

## 📊 Monitoreo

### Logs en Tiempo Real
- Ve a tu servicio en Render
- Haz clic en "Logs"
- Puedes ver logs en tiempo real

### Métricas
- Render proporciona métricas básicas
- CPU, memoria, requests por minuto
- Disponible en el dashboard

## 💰 Costos

### Plan Gratuito
- 750 horas/mes de runtime
- 512MB RAM
- 0.1 CPU
- Perfecto para desarrollo y proyectos pequeños

### Planes de Pago
- Desde $7/mes para más recursos
- Escalabilidad automática
- Soporte prioritario

---

¡Tu aplicación Bus Coruña estará funcionando en Render en minutos! 🚌✨ 