FROM node:12-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . /app

RUN npm run build

ENTRYPOINT ["npm", "run", "production"]