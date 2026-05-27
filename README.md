# Lost Last Docs Site

Единый Docusaurus-портал для документации frontend и backend.

## Что входит

- README frontend и backend.
- CONTRIBUTING frontend и backend.
- Compodoc frontend.
- Backend reference, сгенерированный из `.go` файлов без `go list`.
- Swagger UI и OpenAPI JSON.

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

Для GitHub Pages в режиме `Deploy from a branch` в репозитории `docs-site` выберите:

```text
Branch: main
Folder: /docs
```

Внутренние Docusaurus-исходники генерируются в `generated-docs/`, чтобы папка
`docs/` была занята только готовым статическим сайтом для GitHub Pages.
