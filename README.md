# 🚌 Bus Coruña - Aplicación Simple

Aplicación web para consultar información de rutas de autobús urbano de A Coruña en tiempo real.

## 🗺️ Configuración de Google Maps

### 🔐 Configuración Segura de API Key

Por seguridad, las API keys no se incluyen en el código fuente. Sigue estos pasos:

#### 1. Crear API Key de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Maps JavaScript API**
4. Ve a "Credenciales" y crea una nueva API Key
5. **IMPORTANTE**: Restringe la API Key:
   - **Aplicaciones web**: Añade tus dominios (localhost, tu-dominio.com)
   - **Referencias HTTP**: Limita a tus dominios específicos

#### 2. Configurar la API Key

**Opción A: Archivo local (Recomendado para desarrollo)**
```bash
# Copia el archivo de configuración
cp config.js config.local.js

# Edita config.local.js y añade tu API key
nano config.local.js
```

**Opción B: Variable de entorno (Para producción)**
```bash
# En tu servidor web, configura la variable
export GOOGLE_MAPS_API_KEY="tu-api-key-aqui"
```

**Opción C: Meta tag (Alternativa)**
```html
<!-- Añade esto en el <head> de index.html -->
<meta name="google-maps-api-key" content="tu-api-key-aqui">
```

#### 3. Verificar configuración

Abre la consola del navegador y verifica que no aparezcan warnings sobre la API key.

### 🛡️ Seguridad

- ✅ **Nunca** subas API keys a GitHub
- ✅ **Siempre** restringe las API keys por dominio
- ✅ Usa diferentes API keys para desarrollo y producción
- ✅ Revisa regularmente el uso de la API en Google Cloud Console

### 🔧 Desarrollo Local

1. Copia `config.js` como `config.local.js`
2. Añade tu API key en `config.local.js`
3. El archivo `config.local.js` está en `.gitignore` y no se subirá a GitHub

### 🚀 Producción

Para producción, usa variables de entorno o meta tags. Nunca incluyas API keys directamente en el código.

## 📋 Características

- 🗺️ **Mapa interactivo** con Google Maps
- 🚌 **Rutas de autobús** en tiempo real
- 📍 **Ubicación del usuario** con GPS
- ⏰ **Horarios** y tiempos de llegada
- 📱 **Diseño responsive** para móviles
- ♿ **Accesibilidad** mejorada

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Mapas**: Google Maps JavaScript API
- **Backend**: API REST personalizada
- **Almacenamiento**: localStorage para caché

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

## 👤 Autor

[@cjescudero](https://github.com/cjescudero)

---

**⚠️ IMPORTANTE**: Configura tu API key de Google Maps antes de usar la aplicación. 