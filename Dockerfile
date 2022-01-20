FROM node:lts-alpine

RUN apk update
RUN apk add git

WORKDIR /app

COPY public     ./public
COPY src        ./src
COPY *          ./

RUN npm ci && npm run build

CMD node server/serve