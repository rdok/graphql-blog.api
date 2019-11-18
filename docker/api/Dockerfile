FROM rdok/graphql-blog-api:build

RUN npm install -g prisma

COPY --chown=node:node package.json package-lock.json ./

RUN npm install --production

COPY --chown=node:node . /app

RUN npm run build
