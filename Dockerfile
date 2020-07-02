FROM node:13-slim
LABEL AUTHOR=uhsjcl

RUN apt-get -qy update
RUN apt-get -qy install openssl

RUN mkdir /app
COPY . /app

WORKDIR /app

RUN yarn global add prisma2
RUN yarn install

RUN yarn build

CMD ["yarn", "serve"]

EXPOSE 8080