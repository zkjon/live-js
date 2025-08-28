# Usar imagen oficial de Node.js con Bun
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Instalar Python para ejecución de código
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY package.json bun.lock ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN bun run build

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["bun", "run", "start"]