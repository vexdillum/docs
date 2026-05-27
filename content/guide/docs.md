---
title: Документация
---

# Работа с документацией

Единый сайт документации находится в папке `docs-site/`.
Он собирает руководство, contribution, архитектурную справку, frontend/backend
автодокументацию и Swagger в один статический HTML-сайт.

## Установка зависимостей

```bash
npm ci
```

## Локальный запуск

```bash
npm run start
```

Docusaurus поднимет локальный dev server. Перед запуском команда подготовит
контент из исходников проекта.

## Обновление автодокументации

```bash
npm run generate:sources
```

Команда запускает генераторы в frontend и backend:

- `npm run docs` в `lost-last-frontend/`;
- `go run ./cmd/docs` в `lost-last/`.

Backend reference для раздела архитектуры строится без `go list`: генератор читает
`.go` файлы напрямую, поэтому он работает даже если Go toolchain не может собрать
полный список пакетов.

## Production-сборка

```bash
npm run build
```

Результат сборки:

```text
docs-site/docs/
```

Эта папка содержит готовый статический HTML.

## Публикация на GitHub Pages

Текущая сборка рассчитана на адрес:

```text
https://vexdillum.github.io/docs/
```

В `docusaurus.config.js` для этого указан `baseUrl: '/docs/'`.

Если GitHub Pages настроен как `Deploy from a branch`, выберите корень репозитория:

```text
Branch: main
Folder: / (root)
```

Папка `docs/` лежит в репозитории как опубликованный статический сайт, а URL-префикс
`/docs/` задается настройкой Docusaurus.
