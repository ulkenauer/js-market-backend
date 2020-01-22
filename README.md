# Backend

Generate RSA keys:

``` bash
mkdir keys && cd keys
openssl genrsa -out private.pem 512
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

Dependencies and migrations:
``` bash
    npm install # install dependecies
    npx sequelize-cli db:migrate # run migrations
    npm start # run in development mode
    npm run prod # run in production mode
    npm run cli # run cli command

```