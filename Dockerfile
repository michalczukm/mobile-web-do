FROM node:latest
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app
RUN (cd client-presentation && npm i && npm run build && cp -r dist/ ../server/src/client-dist/presentation/)
RUN (cd client-admin && npm i && npm run build -- --base-href /dasadmin/ && cp -r dist/ ../server/src/client-dist/admin/)

WORKDIR server
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]