# 🚀 Guía de Despliegue en GitHub

## 📋 Archivos Creados para GitHub

### Archivos Principales
- ✅ `README.md` - Documentación completa del proyecto
- ✅ `.gitignore` - Archivos a ignorar en Git
- ✅ `LICENSE` - Licencia MIT
- ✅ `env.example` - Ejemplo de variables de entorno

### Configuración de Despliegue
- ✅ `render.yaml` - Configuración para Render
- ✅ `render-static.yaml` - Configuración para backend + frontend
- ✅ `render-deploy.md` - Guía completa de despliegue
- ✅ `deploy-render.sh` - Script específico para Render

### Scripts de Ayuda
- ✅ `deploy.sh` - Script de verificación y despliegue

## 🚀 Pasos para Subir a GitHub

### 1. Inicializar Git (si no está inicializado)
```bash
git init
git add .
git commit -m "Initial commit: Bus Coruña PWA"
```

### 2. Crear Repositorio en GitHub
1. Ve a [github.com](https://github.com)
2. Haz clic en "New repository"
3. Nombra el repositorio (ej: `bus-coruna`)
4. **NO** inicialices con README, .gitignore o LICENSE (ya los tenemos)
5. Crea el repositorio

### 3. Conectar y Subir
```bash
git remote add origin https://github.com/TU-USUARIO/bus-coruna.git
git branch -M main
git push -u origin main
```

## 🌐 Despliegue en Render

### Pasos para Desplegar
1. Ve a [render.com](https://render.com)
2. Crea una cuenta y conecta tu repositorio de GitHub
3. Crea un "Web Service" con Node.js
4. Configura:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

### Configuración Automática
El archivo `render.yaml` permite configurar automáticamente:
- Servicio web con Node.js
- Variables de entorno
- Health checks
- Auto-deploy desde GitHub

## 🔧 Solución de Problemas

### Error de Build en Render
**Causa**: Configuración incorrecta del servicio
**Solución**:
1. Verifica que `render.yaml` esté en la raíz
2. Asegúrate de que `package.json` esté configurado correctamente
3. Revisa los logs de build en Render

### Error de CORS
**Causa**: El frontend no puede acceder al backend
**Solución**:
1. Verifica que el backend esté desplegado en Render
2. Actualiza la URL del backend en `bus-app-coruna.html`
3. Configura las variables de entorno en Render

### Error de Dependencias
**Causa**: Node.js no encuentra las dependencias
**Solución**:
1. Verifica que `package.json` esté en la raíz
2. Asegúrate de que `node_modules` esté en `.gitignore`
3. Render instalará las dependencias automáticamente

## 📱 Configuración de PWA

### Manifest
- ✅ `manifest.json` ya está configurado
- Los iconos están comentados, añádelos cuando los tengas

### Service Worker
- ✅ `sw.js` ya está configurado
- Funciona offline automáticamente

## 🔍 Verificación

### Antes del Despliegue
```bash
# Ejecuta el script de verificación
./deploy.sh
```

### Después del Despliegue
1. Verifica que la aplicación cargue correctamente
2. Prueba las funcionalidades de PWA
3. Verifica que el mapa funcione
4. Comprueba que los tiempos de llegada se actualicen

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Vercel/Netlify/Heroku
2. Verifica la consola del navegador
3. Comprueba que todos los archivos estén en el repositorio
4. Usa el script `deploy.sh` para verificar la configuración

---

¡Tu aplicación Bus Coruña está lista para ser desplegada! 🚌✨ 