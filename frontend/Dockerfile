# Desarrollo con Vite dev server
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

#Para compartir mi página en internet a través de ngrok y cloudflared
#ngrok http --pooling-enabled --url=pyromania-overpay-extended.ngrok-free.dev 5173 
#npx cloudflared tunnel --url http://localhost:8000