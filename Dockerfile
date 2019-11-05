FROM node:12-alpine

LABEL maintainer="Rizart Dokollari <r.dokollari@gmail.com>" \
    version="1.0"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

COPY . /app

RUN npm install --production

ENTRYPOINT ["npm", "run", "production"]