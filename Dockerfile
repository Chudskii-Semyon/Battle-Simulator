FROM node:14.8.0-alpine3.12 As development
#FROM node:latest As development

WORKDIR /usr/src/app

COPY package.json ./

RUN apk add --no-cache make gcc g++ python3
RUN yarn
RUN yarn add --force bcrypt
RUN apk del make gcc g++ python3

COPY . .

RUN yarn run build

CMD ["yarn", "run", "start:dev"]
#FROM node:latest as production
#
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
#
#WORKDIR /usr/src/app
#
#COPY package.json ./
#COPY yarn.lock ./
#
#RUN yarn install --audit
#RUN yarn add bcrypt
#
#COPY . .
#
#COPY --from=development /usr/src/app/dist ./dist

#CMD ["yarn", "start:dev"]
#CMD ["node", "dist/main"]