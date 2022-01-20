FROM node:lts-alpine3.12

COPY public/.     public

WORKDIR /app
COPY build/.      .
COPY node_modules ./node_modules

CMD node server/serve