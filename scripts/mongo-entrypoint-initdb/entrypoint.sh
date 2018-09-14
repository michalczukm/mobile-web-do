#!/usr/bin/env bash
echo 'Application user and database'

mongo ${APP_DB} \
        -u ${DB_ADMIN_USERNAME} \
        -p ${DB_ADMIN_PASS} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${DB_APP_USERNAME}', pwd: '${DB_APP_PASS}', roles:[{role:'dbOwner', db: '${APP_DB}'}]});"