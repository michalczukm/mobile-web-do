FROM node:latest

ARG AUTH_CLIENT_ID
ARG AUTH_DOMAIN
ARG AUTH_CALLBACK_URL
ARG AUTH_WHITELISTED_DOMAIN
ARG PRESENTATION_HOST_URL

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
# for client-presentation
COPY client-presentation/package.json /tmp/client-presentation/package.json
RUN cd /tmp/client-presentation && npm install
# for client-admin
COPY client-admin/package.json /tmp/client-admin/package.json
RUN cd /tmp/client-admin && npm install
# for server
COPY server/package.json /tmp/server/package.json
RUN cd /tmp/server && npm install

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app

RUN cp -a /tmp/client-presentation/node_modules /usr/app/client-presentation
RUN cp -a /tmp/client-admin/node_modules /usr/app/client-admin
RUN cp -a /tmp/server/node_modules /usr/app/server


ENV AUTH_CLIENT_ID ${AUTH_CLIENT_ID}
ENV AUTH_DOMAIN ${AUTH_DOMAIN}
ENV AUTH_CALLBACK_URL ${AUTH_CALLBACK_URL}
ENV AUTH_WHITELISTED_DOMAIN ${AUTH_WHITELISTED_DOMAIN}
ENV PRESENTATION_HOST_URL ${PRESENTATION_HOST_URL}

RUN (cd client-presentation && npm run build && cp -r dist/ ../server/src/client-dist/presentation/)
RUN (cd client-admin && npm run build -- --base-href /admin/ && cp -r dist/ ../server/src/client-dist/admin/)

WORKDIR server

EXPOSE 3000
CMD npm start