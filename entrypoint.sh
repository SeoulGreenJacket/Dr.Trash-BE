if [ "${NODE_ENV}" -eq "production" ] then
    npm run start
elif [ "${NODE_ENV}" -eq "development" ] then
    npm run start:dev
else
    echo "NODE_ENV is not set"
    exit 1
fi
