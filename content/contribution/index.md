---
title: Contribution
---

# Contribution

Раздел описывает правила участия в разработке Lost Last. Проект использует
GitLab Flow: рабочие ветки создаются от `dev`, изменения попадают в `dev` через
merge request, стабильная версия переносится в `main`.

## Ветки

Backend использует короткие рабочие ветки по смыслу задачи:

| Префикс | Назначение |
| --- | --- |
| `feature/<name>` | Новая функциональность |
| `fix/<name>` | Исправление ошибки |
| `docs/<name>` | Документация |
| `infra/<name>` | Инфраструктура и деплой |

Frontend использует более строгий формат с номером issue:

| Префикс | Назначение |
| --- | --- |
| `feature/<issue-number>-<short-name>` | Новая пользовательская функциональность |
| `fix/<issue-number>-<short-name>` | Исправление ошибки |
| `test/<issue-number>-<short-name>` | Изменения только в тестах |
| `docs/<issue-number>-<short-name>` | Изменения только в документации |
| `chore/<issue-number>-<short-name>` | Инструменты, конфигурация или cleanup |

Примеры:

```text
feature/24-rating-page
fix/31-auth-token-refresh
docs/45-deploy-guide
```

## Issues

Задачи ведутся в GitLab Issues. Для задачи указывается:

- понятный заголовок;
- краткое описание ожидаемого результата;
- критерии приемки, если они нужны;
- исполнитель;
- labels;
- срок или milestone, если он применим;
- ссылки на связанные merge requests.

Issue закрывается после merge связанного merge request.

## Коммиты

Один коммит должен относиться к одной логической задаче или небольшому связанному
набору изменений.

Для frontend используется формат:

```text
#<issue-number> <imperative action>
```

Примеры:

```text
#24 add rating page tests
#31 fix auth token header
```

Для backend используется формат:

```text
area: short action
```

Примеры:

```text
auth: add login validation
leaderboard: fix cache invalidation
admin: add user ban endpoint
```

Не используйте сообщения без контекста: `upd`, `fix`, `changes`, `final`.

## Merge Request

Merge request сначала вливается в `dev`. После интеграционного тестирования
`dev` вливается в `main` для релиза.

Перед review проверьте:

- ветка создана от актуального `dev`;
- изменения относятся к заявленной задаче;
- в diff нет секретов, локальных файлов, логов и временных артефактов;
- CI проходит без ошибок;
- если изменение затрагивает API, обновлен Swagger/OpenAPI;
- если изменение затрагивает UI, приложены скриншоты.

## Проверки frontend

```bash
npm run lint
npm run test:coverage
npm run build
```

## Проверки backend

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

## Секреты

В репозиторий нельзя добавлять реальные секреты:

- `.env`;
- токены;
- пароли;
- приватные kubeconfig-файлы;
- production-ключи.

Для примеров используются только `.env.example` и другие шаблоны без реальных значений.

## Сгенерированные файлы

Сгенерированные файлы коммитятся только если они нужны для запуска, проверки
или публикации проекта. Перед коммитом нужно убедиться, что в diff
нет случайных временных файлов, локальных отчетов и IDE-настроек.
