FROM rdok/graphql-blog-api:build

RUN npm install -g prisma

COPY --chown=node:node package.json package-lock.json ./
RUN npm install --production

COPY --chown=node:node . /home/node/workbench
RUN npm run build && mv dist /home/node/app && rm -rf /home/node/workbench

WORKDIR /home/node/app
CMD ["npm", "run", "production"]
