ARG AUTH_CLIENT_ID
ARG AUTH_DOMAIN
ARG AUTH_CALLBACK_URL
ARG AUTH_WHITELISTED_DOMAIN
ARG PRESENTATION_HOST_URL

FROM node:latest
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app

ENV AUTH_CLIENT_ID ${AUTH_CLIENT_ID}
ENV AUTH_DOMAIN ${AUTH_DOMAIN}
ENV AUTH_CALLBACK_URL ${AUTH_CALLBACK_URL}
ENV AUTH_WHITELISTED_DOMAIN ${AUTH_WHITELISTED_DOMAIN}
ENV PRESENTATION_HOST_URL ${PRESENTATION_HOST_URL}

RUN (cd client-presentation && npm i && npm run build && cp -r dist/ ../server/src/client-dist/presentation/)
RUN (cd client-admin && npm i && npm run build -- --base-href /admin/ && cp -r dist/ ../server/src/client-dist/admin/)

WORKDIR server
RUN npm install

EXPOSE 3000
CMD npm start