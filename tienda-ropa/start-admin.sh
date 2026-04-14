#!/bin/bash
# Script de inicio rápido para el panel administrativo

echo "🚀 Iniciando Tienda de Ropa - Panel Administrativo"
echo ""
echo "Paso 1: Verificando dependencias..."
npm --version > /dev/null 2>&1 || { echo "❌ npm no está instalado"; exit 1; }
echo "✅ npm encontrado"

echo ""
echo "Paso 2: Limpiando cache de Next.js..."
rm -rf .next 2>/dev/null
echo "✅ Cache limpiado"

echo ""
echo "Paso 3: Iniciando servidor de desarrollo..."
echo "📍 http://localhost:3000"
echo "📍 http://localhost:3000/admin"
echo ""
echo "IMPORTANTE:"
echo "1. Ejecuta el SQL de SETUP_ADMIN_TABLES.sql en Supabase primero"
echo "2. Presiona Ctrl+C para detener el servidor"
echo "3. Consulta DATABASE_SETUP.md si hay errores"
echo ""

npm run dev
