FROM node:14-alpine

WORKDIR /app

RUN npm install express node-schedule axios

COPY . .

EXPOSE 3005

CMD ["node", "server.js"]