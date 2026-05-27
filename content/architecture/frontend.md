---
title: Frontend
---

# Архитектура frontend

Frontend построен на Angular 21 и TypeScript. Он отвечает за пользовательский и
административный интерфейс CTF-платформы: задания, команды, пользователей,
профили, рейтинг, авторизацию и административные страницы.

## Основные зоны

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

## Стек

| Часть | Технологии |
| --- | --- |
| Framework | Angular 21 |
| Language | TypeScript 5.9 |
| UI | Carbon Design System, Tailwind CSS |
| Localization | Transloco |
| Charts | ECharts |
| Tests | Vitest и Angular test runner |
| Quality | ESLint и angular-eslint |

## Runtime-конфигурация

Базовый URL API задается в `src/shared/config/api.config.ts`. Для локального
проксирования backend используется `proxy.conf.json`.

## Автодокументация

Автоматически сгенерированная справка по компонентам, сервисам, интерфейсам и
маршрутам находится в разделе `Руководство -> Frontend`.
