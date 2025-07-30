#!/bin/bash

# Script de configuración de nginx para Bus Coruña
echo "🚌 Configurando nginx para Bus Coruña..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Obtener la ruta absoluta del proyecto
PROJECT_PATH=$(pwd)
echo "📁 Ruta del proyecto: $PROJECT_PATH"

# Verificar si nginx está instalado
if ! command -v nginx &> /dev/null; then
    echo "❌ Error: nginx no está instalado."
    echo "📦 Instalando nginx..."
    sudo apt update
    sudo apt install -y nginx
fi

# Crear configuración de nginx
echo "⚙️  Creando configuración de nginx..."

# Obtener el nombre del dominio del usuario
read -p "🌐 Introduce tu dominio (o presiona Enter para usar localhost): " DOMAIN
DOMAIN=${DOMAIN:-localhost}

# Crear el archivo de configuración
sudo tee /etc/nginx/sites-available/buscoruna << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Configuración para archivos estáticos (CSS, JS, imágenes)
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root $PROJECT_PATH;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy para el backend API
    location /buscoruna/api {
        proxy_pass http://localhost:10000/buscoruna/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Configuración para CORS
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range";
        
        # Manejar preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain; charset=utf-8';
            add_header Content-Length 0;
            return 204;
        }
    }

    # Servir archivos estáticos del frontend
    location / {
        root $PROJECT_PATH;
        try_files \$uri \$uri/ /index.html;
        
        # Configuración de cache para archivos estáticos
        location ~* \.(html)$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }

    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Configuración de logs
    access_log /var/log/nginx/buscoruna_access.log;
    error_log /var/log/nginx/buscoruna_error.log;
}
EOF

# Habilitar el sitio
echo "🔗 Habilitando sitio..."
sudo ln -sf /etc/nginx/sites-available/buscoruna /etc/nginx/sites-enabled/

# Deshabilitar el sitio por defecto si existe
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🗑️  Deshabilitando sitio por defecto..."
    sudo rm /etc/nginx/sites-enabled/default
fi

# Verificar configuración de nginx
echo "🔍 Verificando configuración de nginx..."
if sudo nginx -t; then
    echo "✅ Configuración de nginx válida"
    
    # Reiniciar nginx
    echo "🔄 Reiniciando nginx..."
    sudo systemctl restart nginx
    
    # Verificar estado de nginx
    if sudo systemctl is-active --quiet nginx; then
        echo "✅ nginx está ejecutándose correctamente"
    else
        echo "❌ Error: nginx no se pudo iniciar"
        exit 1
    fi
else
    echo "❌ Error: Configuración de nginx inválida"
    exit 1
fi

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "📋 Pasos siguientes:"
echo "1. Inicia el servidor backend:"
echo "   npm start"
echo ""
echo "2. Accede a tu aplicación en:"
echo "   http://$DOMAIN"
echo ""
echo "3. Para verificar que todo funciona:"
echo "   curl http://$DOMAIN/buscoruna/api/general"
echo ""
echo "4. Para ver los logs de nginx:"
echo "   sudo tail -f /var/log/nginx/buscoruna_access.log"
echo "   sudo tail -f /var/log/nginx/buscoruna_error.log" 