#!/bin/bash

# Script de despliegue para Bus Coruña
echo "🚌 Desplegando Bus Coruña..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar que todos los archivos necesarios existen
echo "🔍 Verificando archivos..."
required_files=("server.js" "bus-app-coruna.html" "manifest.json" "routes.json" "package.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: No se encontró $file"
        exit 1
    fi
done

echo "✅ Todos los archivos necesarios están presentes"

# Verificar configuración de Vercel
if [ -f "vercel.json" ]; then
    echo "✅ Archivo vercel.json encontrado"
else
    echo "⚠️  No se encontró vercel.json. Copiando vercel-simple.json..."
    if [ -f "vercel-simple.json" ]; then
        cp vercel-simple.json vercel.json
        echo "✅ vercel.json creado desde vercel-simple.json"
    else
        echo "❌ Error: No se encontró vercel-simple.json"
        exit 1
    fi
fi

echo "🎉 Proyecto listo para despliegue!"
echo ""
echo "📋 Pasos para desplegar:"
echo "1. Sube el código a GitHub:"
echo "   git add ."
echo "   git commit -m 'Initial commit'"
echo "   git push origin main"
echo ""
echo "2. Despliega en Render:"
echo "   - Ve a render.com"
echo "   - Crea una cuenta y conecta tu repositorio"
echo "   - Crea un Web Service con Node.js"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Plan: Free"
echo ""
echo "3. Después del despliegue:"
echo "   - Copia la URL del backend"
echo "   - Actualiza BACKEND_API en bus-app-coruna.html"
echo "   - Despliega el frontend en GitHub Pages" 