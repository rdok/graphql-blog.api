FROM rdok/graphql-blog-api:infrastructure

COPY --chown=node:node package.json package-lock.json ./
RUN npm install --production

COPY --chown=node:node . /home/node/app
RUN npm run build

CMD ["npm", "run", "production"]
