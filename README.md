# Backend

## Generate RSA keys:

``` bash
mkdir keys && cd keys
openssl genrsa -out private.pem 512
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

## Config

``` bash
cp config/db.example.json config/db.json
cp config/cors.example.json config/cors.json

nano config/db.json
nano config/cors.json
```

## Dependencies and migrations:
``` bash
    npm install # install dependecies
    npx sequelize-cli db:migrate # run migrations
    npx sequelize:seed:all # populate db with test records (insert products)
    npm start # run in development mode
    npm run prod # run in production mode
    npm run cli # run cli command

```