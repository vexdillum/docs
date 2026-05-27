---
title: Swagger
---

# Swagger / OpenAPI

Backend генерирует OpenAPI JSON и Swagger UI командой:

```bash
go run ./cmd/docs
```

Файлы встраиваются в общий портал как статические артефакты:

- `generated/swagger/openapi.json`
- `generated/swagger/swagger.html`

<p>
  <a className="button button--primary" href="/generated/swagger/" target="_blank">
    Открыть Swagger UI в новой вкладке
  </a>
  <a className="button button--secondary margin-left--sm" href="/generated/swagger/openapi.json" target="_blank">
    Открыть OpenAPI JSON
  </a>
</p>

<iframe className="embeddedDocsFrame" src="/generated/swagger/" title="Swagger UI"></iframe>
