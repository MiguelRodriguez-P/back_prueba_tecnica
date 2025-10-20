# En Desarrollo
FROM node:22-alpine AS builder

# Crear carpeta de la app
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del codigo
COPY . .


# En Produccion
FROM node:22-alpine

WORKDIR /app

# Copiar solo lo necesario desde la etapa anterior
COPY --from=builder /app ./

# Exponer el puerto
EXPOSE 3000

# Comando de incio
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

