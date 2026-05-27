---
title: Contribution
---

# Backend Contribution

В backend-репозитории пока нет отдельного `CONTRIBUTING.md`, поэтому эта страница создаётся как fallback для единого портала документации.

Перед merge backend должен проходить основные проверки качества:

```bash
gofmt -w .
go vet ./...
golangci-lint run ./... --timeout 5m
go test ./...
go run ./cmd/docs
```

Для kCTF-operator проверки выполняются из отдельного Go-модуля:

```bash
cd kctf/kctf-operator
golangci-lint run ./... --timeout 5m
```

OpenAPI/Swagger-документация должна быть актуальной: после изменения API нужно выполнить `go run ./cmd/docs` и закоммитить обновлённые `docs/openapi.json` и `docs/swagger.html`.
