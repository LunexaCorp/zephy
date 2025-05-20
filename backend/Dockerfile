# Imagen base de Node.js
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición del proyecto
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando que se ejecutará al iniciar el contenedor
CMD ["node", "index.js"]
