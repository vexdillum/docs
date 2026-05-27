---
title: Обзор
---

# Единая документация Lost Last

Этот портал собирает документацию frontend и backend в один статический HTML-сайт в едином стиле.

Состав:

- README frontend;
- README backend;
- contribution guide frontend;
- contribution guide backend или сгенерированная fallback-страница, если файла нет;
- автосгенерированная Compodoc-документация frontend;
- автосгенерированный backend reference по `.go` файлам без `go list`;
- Swagger UI и OpenAPI JSON.

## Генерация

Из каталога `docs-site`:

```bash
npm run generate:sources
npm run build
```

`generate:sources` обновляет исходную автодокументацию в frontend и backend проектах, а `build` готовит контент и собирает Docusaurus в статический HTML.

Результат сборки:

```text
docs/
```
