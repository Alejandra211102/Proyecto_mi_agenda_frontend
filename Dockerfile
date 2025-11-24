# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Configurar variable de entorno para el build
ENV VITE_API_URL=http://localhost:3000/api

RUN npm run build

# Etapa 2: Servidor de producción con Nginx
FROM nginx:alpine

# Copiar archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]