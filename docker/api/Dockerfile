FROM node:12-alpine

RUN npm install -g prisma

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . /app

RUN npm run build
