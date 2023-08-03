

## (Rabbit's Store) test assignment for green-api.com

### Запустить rabbitmq 

```bash
# образ rabbitmq:latest
docker pull rabbitmq
# и запускаем его
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:latest
```

### Установить npm зависимости
```bash
# из корня репозитория (./greenapi-test-assignment)
npm install
```

### Запустить сервер из папки "server"

```bash
cd ./server
./index.js
```

### Запустить handler из папки "handler"

```bash
cd ./handler
./index.js
```

### Редактировать и отсылать POST запросы на localhost:3000 c помощью файла test_post_order.sh

```bash
./test_post_order.sh
```
