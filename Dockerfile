# Etapa 1: Build
FROM node:22.16.0-alpine AS build

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Etapa 2: Producción
FROM node:22.16.0-alpine AS production

WORKDIR /usr/src/app

# Copiar archivos necesarios desde build
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Definir variable de entorno para producción
ENV NODE_ENV=development

# Puerto donde corre la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "dist/main.js"]