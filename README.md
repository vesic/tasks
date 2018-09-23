# tasks

## how to

install

```
git clone git@github.com:vesic/tasks.git

cd tasks-api

composer install
```

rename .env.example file to .env and configure your local environment 

```
php artisan migrate

php artisan db:seed

php -S localhost:8000 -t public

open localhost:8000
```

move to the client

```
cd ../tasks-client

npm i

ng serve | npm start

open localhost:4200
```