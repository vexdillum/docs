---
title: Бэкенд
---

# Работа с бэкендом

Backend находится в папке `lost-last/`. Он обслуживает CTF-платформу Lost Last:
пользовательский API, административные сценарии, проверку флагов, пересчет
рейтинга, кэширование, очередь событий и мониторинг.

## Требования

- Docker.
- Docker Compose.
- Go 1.25 для локальных проверок без контейнеров.

## Быстрый запуск

Создайте локальный `.env` из примера и запустите сервисы.

macOS/Linux:

```bash
cp .env.example .env
docker compose up -d --build
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

PostgreSQL, Redis, RabbitMQ и flagchecker работают внутри Docker-сети.
С хоста доступны HTTP API и сервисы мониторинга.

## Сервисы compose

| Сервис | Назначение | Доступ с хоста |
| --- | --- | --- |
| `api` | HTTP API на Hertz | `127.0.0.1:8080` |
| `flagchecker` | gRPC-сервис проверки флагов | внутри compose |
| `db` | PostgreSQL | внутри compose |
| `redis` | Redis cache | внутри compose |
| `rabbitmq` | Очередь scoring/outbox events | внутри compose |
| `prometheus` | Сбор метрик | `127.0.0.1:9090` |
| `grafana` | Дашборды | `127.0.0.1:3000` |

## Проверка API

macOS/Linux:

```bash
docker compose ps
curl -fsS http://127.0.0.1:8080/ping
```

Windows PowerShell:

```powershell
docker compose ps
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8080/ping
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

## Swagger

Swagger для backend API лежит в `docs/swagger.html`.

Открыть локально:

```bash
open docs/swagger.html
```

Перегенерировать OpenAPI и Swagger:

```bash
go run ./cmd/docs
```

После генерации меняются:

- `docs/openapi.json`;
- `docs/swagger.html`.

Эти файлы публикуются в разделе [API](../api/swagger).

## Логи и диагностика

Приложения пишут structured logs в stdout и в файл внутри контейнера.

```bash
docker compose logs --tail=120 api flagchecker
docker compose exec -T api sh -c "tail -n 80 /tmp/lost-last/api.log"
docker compose exec -T flagchecker sh -c "tail -n 80 /tmp/lost-last/flagchecker.log"
```

Health monitoring-сервисов:

```bash
curl -fsS http://127.0.0.1:9090/-/ready
curl -fsS http://127.0.0.1:3000/api/health
```

## Monitoring

Локальный monitoring-контур состоит из Prometheus и Grafana.

| Сервис | URL |
| --- | --- |
| Grafana | `http://127.0.0.1:3000` |
| Prometheus | `http://127.0.0.1:9090` |
| API metrics | `http://127.0.0.1:8080/metrics` |
| FlagChecker metrics | `http://flagchecker:9091/metrics` внутри Docker-сети |

Dashboard `Lost Last Overview` показывает RPS, p95 latency, 5xx ratio,
in-flight requests, состояние scrape targets, backlog outbox/scoring jobs,
глубину очереди RabbitMQ и hit ratio кеша leaderboard.

Полезные PromQL-запросы:

```promql
sum(rate(lost_last_http_requests_total[5m]))
```

```promql
histogram_quantile(0.95, sum by (le) (rate(lost_last_http_request_duration_seconds_bucket[5m])))
```

```promql
lost_last_outbox_events_pending + lost_last_outbox_events_retry
```

```promql
rabbitmq_queue_messages{queue="scoring.events"}
```

## Проверки качества

Перед merge request выполните:

```bash
gofmt -w main.go router.go router_gen.go biz cmd internal
go vet ./...
golangci-lint run ./... --timeout 5m
go test ./...
go run ./cmd/docs
git diff --check
```

Форк `kCTF` проверяется отдельно из своего Go-модуля:

```bash
cd kctf/kctf-operator
golangci-lint run ./... --timeout 5m
```

Если нужен security-oriented запуск `golangci-lint`:

```bash
golangci-lint run ./... --timeout 5m --enable gosec --enable sqlclosecheck --enable bodyclose --enable noctx
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

HTML-отчет:

```bash
go tool cover -html coverage.out -o coverage.html
```

## Ручной smoke-сценарий

Минимальная ручная проверка backend:

1. Зарегистрировать пользователя через `POST /api/v1/auth/register`.
2. Создать команду через `POST /api/v1/team`.
3. От имени администратора создать challenge через `POST /api/v1/admin/challenges`.
4. Стартовать contest через `POST /api/v1/admin/contest/start`.
5. Получить каталог через `GET /api/v1/catalog/challenges`.
6. Отправить неверный флаг и получить `status=wrong`.
7. Отправить верный флаг и получить `status=correct`.
8. Проверить, что повторная отправка того же solve не начисляет очки повторно.
9. Проверить `GET /api/v1/leaderboard`.
10. Проверить `GET /api/v1/team/dashboard`.
11. Проверить audit через `GET /api/v1/admin/audit`.

## Остановка

Остановить сервисы без удаления данных:

```bash
docker compose down
```

Остановить сервисы и удалить volume-данные:

```bash
docker compose down -v
```
