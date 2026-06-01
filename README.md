## Run the app

```bash
$ docker compose up -d --build
```

## Compile and run the specific service 

### Project setup

```bash
$ npm install
```

```bash
# development
$ npm run start *service_name*

# watch mode
$ npm run start:dev *service_name*
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```