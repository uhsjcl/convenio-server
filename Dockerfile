FROM node:lts-alpine
LABEL AUTHOR=uhsjcl

RUN mkdir /app
COPY . /app

WORKDIR /app

RUN yarn install

EXPOSE 8080