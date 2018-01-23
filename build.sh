(cd client-presentation && npm i && npm run build && cp -r dist/ ../server/src/client-dist/presentation/)
(cd client-admin && npm i && npm run build -- --base-href /dasadmin/ && cp -r dist/ ../server/src/client-dist/admin/)
