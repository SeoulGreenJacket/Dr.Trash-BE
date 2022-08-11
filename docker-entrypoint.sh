#!/bin/sh

if [[ "${NODE_ENV}" == "production" ]]
then
    echo "Running in production mode"
    npm run start
elif [[ "${NODE_ENV}" == "development" ]]
then
    echo "Running in development mode"
    npm run start:dev
else
    echo "NODE_ENV is not set"
    exit 1
fi

exec "$@"
