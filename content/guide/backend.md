---
title: Бэкенд
---

# Работа с бэкендом

Бэкенд находится в папке `lost-last/`. Это Go-платформа для Jeopardy CTF:
пользовательский API, административный контур, flagchecker, очередь событий,
кэширование и интеграция с динамическими заданиями.

## Требования

- Docker.
- Docker Compose.
- Go 1.25 для локальных проверок без контейнеров.

## Быстрый запуск

Создайте локальный `.env` из примера и поднимите сервисы:

```bash
cp .env.example .env
docker compose up -d --build
```

По умолчанию PostgreSQL, Redis, RabbitMQ и flagchecker доступны внутри Docker-сети.
Наружу публикуются пользовательские HTTP-точки и мониторинг на localhost.

## Проверка API

```bash
curl http://127.0.0.1:8080/ping
```

Ожидаемый ответ:

```json
{"message":"pong"}
```

## Основные компоненты

| Компонент | Назначение |
| --- | --- |
| `api` | Основной HTTP API для участников и администраторов |
| `flagchecker` | Изолированная проверка флагов и запись solve-событий |
| `db` | Пользователи, команды, задания, solve log, audit |
| `redis` | Кэш leaderboard, dashboard и каталога заданий |
| `rabbitmq` | Очередь событий для асинхронного пересчета scoring |
| `prometheus` / `grafana` | Метрики и дашборды |

## Проверки

Перед merge request желательно выполнить:

```bash
gofmt -w .
go vet ./...
golangci-lint run ./... --timeout 5m
go test ./...
```

Форк `kCTF` проверяется отдельно из своего Go-модуля:

```bash
cd kctf/kctf-operator
golangci-lint run ./... --timeout 5m
```

## Coverage

Coverage считается по основным backend-пакетам:

```bash
go test -covermode=atomic -coverprofile coverage.out \
  ./internal/config \
  ./internal/flagcheckerapi \
  ./internal/infra/... \
  ./internal/scoring \
  ./internal/service/... \
  ./internal/transport/grpc/flagchecker \
  ./internal/transport/httpx \
  ./internal/transport/mw \
  ./internal/util/slug

go tool cover -func coverage.out
```

## Генерация Swagger

```bash
go run ./cmd/docs
```

Команда обновляет:

- `docs/swagger.html`;
- `docs/openapi.json`.

Эти файлы затем встраиваются в общий сайт документации в разделе [API](../api/swagger).
