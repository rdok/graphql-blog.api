FROM node:12-alpine

RUN yarn global add prisma

WORKDIR /app

COPY package.json package-lock.json ./

ARG environment

RUN npm install "${environment}"

COPY . /app

RUN npm run build
