---
title: Архитектура
---

# Архитектура

Lost Last состоит из трех частей: бэкенд, фронтенд и TG bot. Вместе они образуют
CTF-платформу с пользовательским интерфейсом, backend API и сервисом поддержки.

## Общая схема

| Слой | Назначение |
| --- | --- |
| Backend API | HTTP API для пользовательского и административного контура |
| Flagchecker | Изолированная проверка флагов и запись solve-событий |
| PostgreSQL | Основное состояние платформы |
| Redis | Кэш leaderboard, dashboard и каталога заданий |
| RabbitMQ | Очередь событий для асинхронного пересчета scoring |
| kCTF / Kubernetes | Контур динамических task-инстансов |
| Prometheus / Grafana | Метрики и наблюдаемость |
| Фронтенд | Angular UI для участников и администраторов |
| TG bot | Telegram-сервис поддержки |

## Бэкенд

Бэкенд реализует серверную часть Jeopardy CTF. Основная идея: участники работают
с HTTP API, проверка флагов вынесена в отдельный gRPC-сервис, а scoring и
cache invalidation выполняются асинхронно через outbox и очередь.

### Runtime-компоненты

| Компонент | Путь | Роль |
| --- | --- | --- |
| API | `main.go` | HTTP API на Hertz для участников и администраторов |
| FlagChecker | `cmd/flagchecker` | gRPC-сервис проверки флагов и записи solves |
| PostgreSQL | external service | Основное хранилище пользователей, команд, заданий, solves, audit |
| Redis | external service | Кэш leaderboard, catalog, team dashboard |
| RabbitMQ | external service | Очередь событий для scoring/outbox |
| kCTF adapter | `internal/kctf` | Граница интеграции с Kubernetes/kCTF |

### Слои приложения

| Слой | Путь | Ответственность |
| --- | --- | --- |
| Transport | `biz/handler`, `internal/transport` | HTTP/gRPC handlers, middleware, cookies, CSRF, response mapping |
| Service | `internal/service` | Бизнес-логика: auth, team, flagchecker, scoring, contest, admin panel |
| Repository | `internal/repo` | SQL-запросы, транзакции, миграции |
| Cache | `internal/cache` | Redis/noop реализации кэшей |
| Infrastructure | `internal/app`, `internal/config`, `internal/logging` | Wiring, env config, logger setup |
| Integration | `internal/kctf`, `internal/messaging/rabbitmq` | Внешние системы: Kubernetes/kCTF и RabbitMQ |

### Submit flow

Основной поток отправки флага:

1. Участник отправляет `POST /catalog/challenges/:id/submit`.
2. HTTP API вызывает `SubmitFlag` в FlagChecker gRPC.
3. FlagChecker в транзакции проверяет пользователя, команду, challenge и flag.
4. При верном флаге записывается solve и создается scoring event.
5. API инвалидирует кеши team/catalog/leaderboard.
6. Outbox публикует scoring event в RabbitMQ.
7. Scoring worker пересчитывает score и повторно инвалидирует read-heavy кеши.

FlagChecker вынесен отдельно, чтобы изолировать проверку флагов и масштабировать
пиковую нагрузку независимо от основного HTTP API.

### Scoring и outbox

Scoring не пересчитывается полностью в HTTP handler. После записи solve создается
событие, которое обрабатывается worker-ом.

Ключевые модули:

- `internal/service/flagchecker` - проверка флага и запись solve.
- `internal/service/outbox` - публикация событий из outbox.
- `internal/service/scoring` - обработка scoring jobs.
- `internal/repo/postgres_scoring_repo.go` - пересчет score в PostgreSQL.
- `internal/messaging/rabbitmq` - RabbitMQ publisher/consumer.

### Кэширование

Redis используется для read-heavy частей:

| Кэш | Путь | Что хранит |
| --- | --- | --- |
| Leaderboard | `internal/cache/boardcache` | Готовые данные leaderboard |
| Challenge catalog | `internal/cache/challengecache` | Видимые пользователю задания |
| Team dashboard | `internal/cache/teamcache` | Dashboard команды |

Кэш инвалидируется после solve, изменения scoring-параметров, изменения команды
и административных действий, влияющих на отображение.

### Contest lifecycle и admin

Contest settings хранятся в PostgreSQL и управляют регистрацией, каталогом,
submit флагов, публичностью scoreboard и freeze/unfreeze leaderboard.

Админка закрыта цепочкой auth, admin-role и CSRF middleware. Она отвечает за
contest lifecycle, CRUD заданий, ban/unban/hard delete пользователей, просмотр
команд, solves, активных инстансов, audit log и управление dynamic challenges.

### Audit и логирование

Технические логи пишутся в stdout и файл, а бизнес-аудит админки хранится в
таблице `admin_audit_logs`. Технический лог нужен для диагностики процесса,
audit отвечает на вопрос, какой администратор какое бизнес-действие совершил.

### kCTF boundary

Backend не смешивает HTTP handlers и Kubernetes API напрямую. Для dynamic
challenges используется интерфейс `kctf.Client` с операциями `Deploy`, `Stop`,
`Access` и `Logs`. Если kubeconfig недоступен, используется stub-client, поэтому
admin API можно проверять без Kubernetes-кластера.

Автоматически сгенерированный backend reference находится в подразделе
[Бэкенд-автодокументация](./backend-reference).

## Фронтенд

Фронтенд построен на Angular 21 и TypeScript. Основные зоны исходников:

```text
src/app/              Bootstrap приложения, маршруты и providers
src/pages/            Страницы верхнего уровня
src/widgets/          Переиспользуемые UI-виджеты
src/entities/         Общие TypeScript-интерфейсы
src/utils/            API-клиенты, guards и interceptors
src/shared/config/    Runtime-конфигурация
src/assets/i18n/      Словари локализации
```

Автоматически сгенерированная справка по фронтенду находится в подразделе
[Фронтенд-автодокументация](./frontend).

## TG bot

TG bot находится в папке `lost-last-tg-bot/`. Это Python-сервис на aiogram,
который хранит обращения в SQLite и связывает личный чат участника с группой
операторов поддержки.

Подробнее: [Архитектура TG bot](./tg-bot).

## Автогенерация

В этот раздел входят две автогенерации:

- справочник бэкенда из `.go` файлов без `go list`.
- справочник фронтенда из Angular/TypeScript исходников;

Оригинальный Compodoc HTML также копируется как статический fallback и доступен
в `generated/frontend-compodoc/`, но основной frontend reference отображается в
стиле Docusaurus.
