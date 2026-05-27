# Lost Last Docs Site

Единый Docusaurus-портал для руководства по работе с проектом Lost Last.

## Что входит

- руководство по запуску, проверкам, сборке и публикации;
- единый contribution guide;
- архитектурный раздел с frontend и backend автодокументацией;
- Swagger UI и OpenAPI JSON в разделе API.

## Обновление исходной автодокументации

```bash
npm run generate:sources
```

Команда запускает:

- `npm run docs` в `lost-last-frontend`;
- `go run ./cmd/docs` в `lost-last`.

Backend reference для Docusaurus генерируется на шаге `prepare:content` напрямую
из исходников Go. Для него не нужен рабочий `go list`.

## Локальный запуск

```bash
npm install
npm run start
```

## Production-сборка

```bash
npm run build
```

Статический сайт будет собран в:

```text
docs/
```

Для GitHub Pages в режиме `Deploy from a branch` выберите корень репозитория:

```text
Branch: main
Folder: / (root)
```

Готовый сайт лежит в `docs/` и открывается по адресу `/docs/`.
Если выбрать `Folder: /docs`, GitHub Pages сделает эту папку корнем сайта, и
тогда `baseUrl` должен быть `/`, а не `/docs/`.

Внутренние Docusaurus-исходники генерируются в `generated-docs/`, чтобы папка
`docs/` была занята только готовым статическим сайтом для GitHub Pages.
