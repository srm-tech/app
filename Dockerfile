FROM node:12.18.3

WORKDIR /usr/src/app

COPY package*.json ./

ENV MONGO_URL "mongodb://mongo:27017"
ENV DB_NAME guru
ENV COL_NAME dataGuru

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "dev"]