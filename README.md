# 🎨 Frontend - Agenda Personal

Aplicación web interactiva construida con React, Vite y Tailwind CSS para gestionar eventos de manera visual e intuitiva.

## 📋 Descripción

Interfaz de usuario moderna y responsive que permite visualizar, crear, editar y eliminar eventos en un calendario interactivo. Diseñada para ser rápida, intuitiva y agradable a la vista.

## 🏗️ Arquitectura

```
┌─────────────────────────────────┐
│  Navegador del Usuario          │
│  (Chrome, Firefox, Safari, etc) │
└────────────┬────────────────────┘
             │ HTTP
             ↓
┌─────────────────────────────────┐
│  Nginx (Servidor Web)           │
│  Puerto 80                      │
│  Sirve archivos estáticos       │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  React App (SPA)                │
│  Componentes + Estado           │
└────────────┬────────────────────┘
             │ Fetch API
             ↓
┌─────────────────────────────────┐
│  Backend API                    │
│  http://backend-ip:3000/api     │
└─────────────────────────────────┘
```

## 🚀 Stack Tecnológico

- **React 18.2** - Librería de UI
- **Vite 5.0** - Build tool ultrarrápido
- **Tailwind CSS 3.4** - Framework de utilidades CSS
- **Lucide React 0.263** - Iconos SVG optimizados
- **Nginx Alpine** - Servidor web ligero
- **Docker** - Containerización

## ✨ Características

### 🎯 Interfaz de Usuario

- ✅ **Calendario Mensual** - Navegación por meses con indicadores visuales
- ✅ **Vista Diaria** - Panel lateral con eventos del día seleccionado
- ✅ **Modal de Creación/Edición** - Formulario intuitivo
- ✅ **Código de Colores** - Por prioridad (Urgente, Importante, Normal, Leve)
- ✅ **Estadísticas** - Contador de eventos totales, del día, completados
- ✅ **Responsive Design** - Optimizado para móvil, tablet y desktop
- ✅ **Animaciones Suaves** - Transiciones y hover effects

### ⚡ Rendimiento

- ✅ **Build Multi-Stage** - Imagen Docker optimizada (~50MB)
- ✅ **Code Splitting** - Carga solo lo necesario
- ✅ **Lazy Loading** - Componentes bajo demanda
- ✅ **Gzip Compression** - Archivos comprimidos por Nginx
- ✅ **Cache de Assets** - Cacheo de JS/CSS estáticos
- ✅ **Actualización Automática** - Refresco cada 30 segundos

### 🎨 Diseño

- **Gradientes Modernos** - Púrpura a rosa
- **Glassmorphism** - Efectos de vidrio esmerilado
- **Sombras Suaves** - Profundidad visual
- **Iconografía Clara** - Lucide Icons
- **Tipografía Legible** - Sans-serif optimizada

## 📁 Estructura del Proyecto

```
agenda-frontend/
├── public/
│   └── (assets estáticos)
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales Tailwind
├── Dockerfile           # Build multi-stage
├── nginx.conf           # Configuración del servidor
├── .dockerignore        # Archivos ignorados
├── .env.production      # Variables de producción
├── package.json         # Dependencias
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
├── postcss.config.js    # PostCSS plugins
├── index.html           # HTML base
└── README.md            # Esta documentación
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.production`:

```env
VITE_API_URL=http://TU_BACKEND_IP:3000/api
```

⚠️ **IMPORTANTE:** Reemplazar `TU_BACKEND_IP` con la IP pública de tu instancia EC2 del backend.

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Nginx Configuration

El archivo `nginx.conf` configura:
- Servidor en puerto 80
- Serving de archivos estáticos
- Fallback a index.html (SPA routing)
- Compression Gzip
- Headers de seguridad
- Cache de assets estáticos

---

## 🚀 Despliegue en AWS EC2

### Paso 1: Crear Instancia EC2

#### 1.1 Configuración Básica

1. Ve a **AWS Console** → **EC2** → **Lanzar instancia**
2. **Nombre:** `agenda-frontend`
3. **AMI:** Ubuntu Server 22.04 LTS (Free Tier)
4. **Tipo de instancia:** t2.micro (Free Tier)
5. **Par de claves:** Usar existente `agenda-keys` o crear uno nuevo

#### 1.2 Configuración de Red

**Firewall (grupo de seguridad):**

Crear nuevo: `agenda-frontend-sg`

**Reglas de entrada:**
- **SSH:** Puerto 22, desde Mi IP
- **HTTP:** Puerto 80, desde 0.0.0.0/0 (acceso público)
- **HTTPS:** Puerto 443, desde 0.0.0.0/0 (opcional, para SSL)

**Almacenamiento:** 8 GB SSD

#### 1.3 Lanzar Instancia

Clic en **"Lanzar instancia"**

Esperar 1-2 minutos hasta estado **"running"**.

**Obtener y guardar IP pública:** Ejemplo: `18.217.1.160`

---

### Paso 2: Conectarse a EC2

#### Opción A: EC2 Instance Connect (Recomendado)

1. Ve a **EC2** → **Instancias** → Selecciona `agenda-frontend`
2. Clic en **"Conectar"**
3. Pestaña **"EC2 Instance Connect"**
4. Clic en **"Conectar"**

#### Opción B: SSH desde tu PC

```bash
ssh -i /ruta/a/agenda-keys.pem ubuntu@18.217.1.160
```

---

### Paso 3: Instalar Docker

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker ubuntu

# Salir y reconectar
exit
```

Reconecta para que tome efecto el grupo docker.

---

### Paso 4: Clonar Repositorio

```bash
# Instalar Git
sudo apt install git -y

# Clonar repositorio
git clone https://github.com/TU_USUARIO/agenda-personal.git

# Entrar a la carpeta del frontend
cd agenda-personal/agenda-frontend
```

---

### Paso 5: Configurar URL del Backend

⚠️ **CRÍTICO:** Debes tener la IP del backend antes de este paso.

```bash
# Crear archivo de producción
nano .env.production
```

Agregar (reemplaza con la IP real de tu backend):
```env
VITE_API_URL=http://3.145.78.90:3000/api
```

Guardar: `Ctrl+O`, Enter, `Ctrl+X`

---

### Paso 6: Construir Imagen Docker

```bash
# Construir imagen (tarda 3-5 minutos)
docker build -t agenda-frontend .

# Verificar que se creó
docker images | grep agenda-frontend
```

---

### Paso 7: Ejecutar Contenedor

```bash
# Ejecutar contenedor
docker run -d \
  --name agenda-frontend \
  --restart always \
  -p 80:80 \
  agenda-frontend:latest

# Verificar que esté corriendo
docker ps
```

**Salida esperada:**
```
CONTAINER ID   IMAGE                    STATUS          PORTS
abc123def456   agenda-frontend:latest   Up 10 seconds   0.0.0.0:80->80/tcp
```

---

### Paso 8: Verificar Despliegue

#### 8.1 Ver Logs

```bash
docker logs agenda-frontend -f
```

Deberías ver logs de Nginx iniciando.

#### 8.2 Probar en Navegador

Abre tu navegador en:
```
http://18.217.1.160
```

**Deberías ver:**
- ✅ Calendario interactivo
- ✅ Eventos cargados del backend
- ✅ Funcionalidad completa (crear, editar, eliminar)

---

## 🧪 Testing

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Modo desarrollo (hot reload)
npm run dev

# Abre automáticamente en http://localhost:5173
```

### Build de Producción Local

```bash
# Construir para producción
npm run build

# Los archivos compilados estarán en /dist

# Preview del build
npm run preview
```

### Testing con Docker Local

```bash
# Construir imagen
docker build -t agenda-frontend .

# Ejecutar localmente
docker run -d -p 8080:80 agenda-frontend:latest

# Probar en http://localhost:8080
```

---

## 🎨 Personalización

### Cambiar Colores del Tema

Editar `src/App.jsx`:

```javascript
// Cambiar gradiente de fondo
<div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-green-500">

// Cambiar colores de prioridad
const getColorPrioridad = (prioridad) => {
  const colores = {
    urgente: 'bg-orange-500',    // Cambia aquí
    importante: 'bg-purple-500', // Cambia aquí
    normal: 'bg-teal-500',       // Cambia aquí
    leve: 'bg-gray-500'          // Cambia aquí
  };
  return colores[prioridad];
};
```

### Cambiar Puerto de Nginx

Editar `nginx.conf`:

```nginx
server {
    listen 8080;  # Cambiar de 80 a 8080
    ...
}
```

Y en el `docker run`:
```bash
docker run -d -p 8080:8080 ...
```

### Agregar Dark Mode

En `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: 'class',
  // ...
}
```

---

## 🔐 Seguridad

### Headers de Seguridad (ya configurados en nginx.conf)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### HTTPS con Let's Encrypt (Recomendado para Producción)

#### Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### Obtener Certificado

```bash
# Necesitas un dominio apuntando a tu IP
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

#### Renovación Automática

```bash
# Certbot configura auto-renovación
sudo certbot renew --dry-run
```

### Content Security Policy

Agregar en `nginx.conf`:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

---

## 📊 Monitoreo

### Logs de Nginx

```bash
# Ver logs en tiempo real
docker logs -f agenda-frontend

# Últimas 100 líneas
docker logs --tail 100 agenda-frontend

# Logs de errores
docker exec agenda-frontend cat /var/log/nginx/error.log
```

### Métricas del Contenedor

```bash
# Ver uso de recursos
docker stats agenda-frontend

# Información detallada
docker inspect agenda-frontend
```

### Monitoreo de Rendimiento

```javascript
// Agregar en App.jsx para medir tiempos
useEffect(() => {
  const start = performance.now();
  // ... código ...
  const end = performance.now();
  console.log(`Tiempo de carga: ${end - start}ms`);
}, []);
```

---

## 🔄 Actualización

### Actualizar Código

```bash
# En EC2
cd agenda-personal
git pull

cd agenda-frontend

# Reconstruir imagen
docker build -t agenda-frontend .

# Detener y eliminar contenedor viejo
docker stop agenda-frontend
docker rm agenda-frontend

# Ejecutar nuevo contenedor
docker run -d \
  --name agenda-frontend \
  --restart always \
  -p 80:80 \
  agenda-frontend:latest
```

### Actualizar Solo el Backend URL

Si cambió la IP del backend:

```bash
# Editar .env.production
nano .env.production
# Cambiar VITE_API_URL

# Reconstruir (necesario porque la URL se compila en el build)
docker build -t agenda-frontend .
docker stop agenda-frontend && docker rm agenda-frontend
docker run -d --name agenda-frontend --restart always -p 80:80 agenda-frontend:latest
```

### Rolling Update (Zero Downtime)

```bash
# Construir nueva versión
docker build -t agenda-frontend:v2 .

# Ejecutar nueva versión en puerto temporal
docker run -d --name agenda-frontend-new -p 8080:80 agenda-frontend:v2

# Probar: http://tu-ip:8080

# Si funciona, hacer swap
docker stop agenda-frontend
docker rm agenda-frontend
docker run -d --name agenda-frontend --restart always -p 80:80 agenda-frontend:v2

# Limpiar versión temporal
docker stop agenda-frontend-new
docker rm agenda-frontend-new
```

---

## 🐛 Troubleshooting

### Frontend no carga

```bash
# Ver logs
docker logs agenda-frontend

# Verificar que el contenedor esté corriendo
docker ps | grep agenda-frontend

# Verificar puerto 80
sudo netstat -tuln | grep :80

# Reiniciar contenedor
docker restart agenda-frontend
```

### Error: "Failed to fetch"

**Causa:** No puede conectarse al backend

**Solución:**
```bash
# 1. Verificar que el backend esté corriendo
curl http://BACKEND_IP:3000/api/eventos

# 2. Verificar CORS en backend
docker logs agenda-backend | grep CORS

# 3. Verificar .env.production
cat .env.production

# 4. Reconstruir si cambió la URL
docker build -t agenda-frontend .
```

### Cambios no se reflejan

**Causa:** Cache del navegador o imagen Docker vieja

**Solución:**
```bash
# Hard refresh en navegador
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Reconstruir sin cache
docker build --no-cache -t agenda-frontend .
```

### Error 502 Bad Gateway

**Causa:** Nginx no puede servir archivos

**Solución:**
```bash
# Entrar al contenedor
docker exec -it agenda-frontend sh

# Verificar archivos
ls -la /usr/share/nginx/html

# Verificar configuración nginx
nginx -t

# Salir
exit
```

### Problemas de caracteres especiales

**Causa:** Encoding incorrecto

**Solución:**

Verificar en `index.html`:
```html
<meta charset="UTF-8" />
```

Y en `nginx.conf`:
```nginx
charset utf-8;
```

---

## 💰 Costos AWS

### EC2 t2.micro

**Free Tier (12 meses):**
- ✅ 750 horas/mes GRATIS

**Post Free Tier:**
- 💵 ~$9/mes ($0.0116/hora)

### Ancho de Banda

- Primeros 100GB/mes: GRATIS
- Después: $0.09/GB

**Estimado total:** $9-15/mes después del Free Tier

---

## 📈 Optimizaciones

### Build Size

Imagen actual: ~50MB (excelente)

Para reducir más:
```dockerfile
# Usar alpine más específico
FROM nginx:1.25-alpine

# Eliminar archivos innecesarios
RUN rm -rf /usr/share/nginx/html/*.* && \
    rm -rf /etc/nginx/conf.d/default.conf
```

### Lazy Loading de Componentes

```javascript
import { lazy, Suspense } from 'react';

const Modal = lazy(() => import('./Modal'));

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Modal />
    </Suspense>
  );
}
```

### Service Worker (PWA)

Agregar soporte offline:

```bash
npm install vite-plugin-pwa -D
```

---

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 📝 Checklist de Despliegue

```
✅ Instancia EC2 creada (t2.micro)
✅ Grupo de seguridad configurado (puertos 22, 80, 443)
✅ Docker instalado
✅ Repositorio clonado
✅ .env.production configurado con IP del backend
✅ Imagen Docker construida
✅ Contenedor ejecutándose en puerto 80
✅ Frontend accesible desde navegador
✅ Comunicación exitosa con backend
✅ Eventos se cargan correctamente
✅ CRUD funciona (crear, editar, eliminar)
✅ Responsive en móvil y desktop
```

---

## 🎯 Features Futuras

- [ ] Dark mode toggle
- [ ] PWA (Progressive Web App)
- [ ] Drag and drop para eventos
- [ ] Vista semanal del calendario
- [ ] Búsqueda y filtros avanzados
- [ ] Exportar eventos a PDF
- [ ] Notificaciones push del navegador
- [ ] Soporte multi-idioma (i18n)
- [ ] Temas personalizables
- [ ] Integración con Google Calendar

---

**🎉 ¡Frontend desplegado y funcionando!**

Ahora tienes un sistema completo de agenda personal en la nube. 🚀
