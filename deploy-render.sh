#!/bin/bash

# Script de despliegue específico para Render
echo "🚌 Desplegando Bus Coruña en Render..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar archivos necesarios para Render
echo "🔍 Verificando archivos para Render..."
required_files=("server.js" "package.json" "render.yaml" "bus-app-coruna.html")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: No se encontró $file"
        exit 1
    fi
done

echo "✅ Todos los archivos necesarios están presentes"

# Verificar configuración de Render
if [ -f "render.yaml" ]; then
    echo "✅ Archivo render.yaml encontrado"
else
    echo "❌ Error: No se encontró render.yaml"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar que el servidor funciona localmente
echo "🧪 Probando el servidor localmente..."
timeout 10s npm start &
SERVER_PID=$!
sleep 3

if curl -s http://localhost:10000 > /dev/null; then
    echo "✅ Servidor funciona correctamente"
    kill $SERVER_PID 2>/dev/null
else
    echo "⚠️  No se pudo verificar el servidor localmente (esto es normal si no está configurado)"
    kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "🎉 Proyecto listo para Render!"
echo ""
echo "📋 Pasos para desplegar en Render:"
echo ""
echo "1. Sube el código a GitHub:"
echo "   git add ."
echo "   git commit -m 'Add Render deployment configuration'"
echo "   git push origin main"
echo ""
echo "2. Ve a Render.com:"
echo "   - Crea una cuenta en render.com"
echo "   - Conecta tu repositorio de GitHub"
echo "   - Crea un 'Web Service'"
echo ""
echo "3. Configura el servicio:"
echo "   - Name: bus-coruna-backend"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Plan: Free"
echo ""
echo "4. Variables de entorno (opcional):"
echo "   - NODE_ENV: production"
echo "   - PORT: 10000"
echo ""
echo "5. Después del despliegue:"
echo "   - Copia la URL del backend (ej: https://tu-app.onrender.com)"
echo "   - Actualiza BACKEND_API en bus-app-coruna.html"
echo "   - Despliega el frontend en GitHub Pages o Render Static Site"
echo ""
echo "📖 Para más detalles, consulta: render-deploy.md" 