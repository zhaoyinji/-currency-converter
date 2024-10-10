FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
RUN npm run build

COPY . .

EXPOSE 4000
CMD ["npm", "run", "serve"]