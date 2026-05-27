---
title: Фронтенд
---

# Работа с фронтендом

Фронтенд находится в папке `lost-last-frontend/`. Это Angular-приложение для CTF-платформы:
страницы заданий, команд, пользователей, рейтинга, профилей и авторизации.

## Требования

- Node.js 24 или новее.
- npm 10 или новее.

Рекомендуемая версия Node.js зафиксирована в `.nvmrc`, `.node-version`, `package.json`
и GitLab CI.

## Установка

```bash
nvm use
npm ci
```

Если `nvm` не установлен, поставьте Node.js 24+ вручную и затем выполните `npm ci`.

## Локальный запуск

```bash
npm start
```

По умолчанию Angular запускает приложение на `http://localhost:4200`.
Базовый URL backend API настраивается в `src/shared/config/api.config.ts`.
Для локального проксирования backend используется `proxy.conf.json`.

## Сборка

Production-сборка:

```bash
npm run build
```

Результат появляется в `dist/CTFast/browser`.

Development-сборка:

```bash
npm run build:development
```

## Проверки

Перед merge request нужно выполнить:

```bash
npm run lint
npm run test:coverage
npm run build
```

Назначение команд:

| Команда | Что делает |
| --- | --- |
| `npm run lint` | Проверяет TypeScript и Angular-шаблоны |
| `npm test` | Запускает unit-тесты |
| `npm run test:coverage` | Запускает unit-тесты с покрытием |
| `npm run activity:check` | Проверяет Git-активность для технической защиты |
| `npm run docs` | Генерирует Compodoc в `documentation/` |

## Структура фронтенда

```text
src/app/              Bootstrap Angular-приложения, маршруты и providers
src/pages/            Страницы верхнего уровня
src/widgets/          Переиспользуемые UI-виджеты
src/entities/         Общие TypeScript-интерфейсы
src/utils/            API-клиенты, guards и interceptors
src/shared/config/    Runtime-конфигурация
src/assets/i18n/      Словари локализации
public/               Статические файлы для сборки
```

## Генерация фронтенд-документации

```bash
npm run docs
```

Команда генерирует Compodoc HTML в `documentation/`. При сборке общего сайта
`docs-site` также строит Docusaurus-native справочник по компонентам, сервисам,
интерфейсам и маршрутам.
