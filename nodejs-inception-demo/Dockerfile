FROM node:8.6-alpine

RUN apk --update add libc6-compat

WORKDIR /usr/src/classifier-ui

COPY package.json .
RUN npm install
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
