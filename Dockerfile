FROM node:latest

WORKDIR /app
COPY package.json .
RUN yarn install

COPY . .

ENV PORT=3000

EXPOSE ${PORT}

CMD [ "npm", "run", "dev" ]