
FROM node:8-alpine

EXPOSE 3000

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

COPY . .

CMD ["node", "server/server.js"]

