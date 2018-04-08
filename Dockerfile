FROM node:latest
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app
RUN (cd client-presentation && npm i && npm run build && cp -r dist/ ../server/src/client-dist/presentation/)
RUN (cd client-admin && npm i && npm run build -- --base-href /admin/ && cp -r dist/ ../server/src/client-dist/admin/)

WORKDIR server
RUN npm install

EXPOSE 3000
CMD AUTH_CLIENT_ID=$AUTH_CLIENT_ID AUTH_DOMAIN=$AUTH_DOMAIN AUTH_CALLBACK_URL=$AUTH_CALLBACK_URL npm start