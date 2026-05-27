---
title: Swagger
---

# API

Раздел содержит Swagger UI и OpenAPI JSON для backend API Lost Last.

Backend генерирует эти файлы командой:

```bash
go run ./cmd/docs
```

Файлы публикуются в портале как статические артефакты:

- `generated/swagger/openapi.json`
- `generated/swagger/swagger.html`

<p>
  <a className="button button--primary" href="/docs/generated/swagger/" target="_blank">
    Открыть Swagger UI в новой вкладке
  </a>
  <a className="button button--secondary margin-left--sm" href="/docs/generated/swagger/openapi.json" target="_blank">
    Открыть OpenAPI JSON
  </a>
</p>

<iframe className="embeddedDocsFrame" src="/docs/generated/swagger/" title="Swagger UI"></iframe>
