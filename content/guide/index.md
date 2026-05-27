---
title: Руководство
---

# Руководство по работе с Lost Last

Lost Last — CTF-платформа с отдельным backend API, Angular-интерфейсом и
Telegram-ботом поддержки. Этот раздел нужен для повседневной разработки:
подготовить окружение, запустить нужные сервисы, проверить изменения и собрать
артефакты перед merge request.

## Структура репозиториев

| Часть | Папка | Назначение |
| --- | --- | --- |
| Backend | `lost-last/` | Go API, flagchecker, фоновые процессы, хранилища и мониторинг |
| Frontend | `lost-last-frontend/` | Angular-приложение для участников, команд и администраторов |
| TG bot | `lost-last-tg-bot/` | Telegram-бот для обращений участников в поддержку |

## Быстрый порядок работы

1. Запустить backend через Docker Compose.
2. Установить зависимости frontend и поднять Angular-приложение.
3. Запустить TG bot локально или в контейнере.
4. Выполнить проверки для всех частей, которые затронуты в изменении.

## Основные команды

| Задача | Где выполнять | Команда |
| --- | --- | --- |
| Запустить бэкенд | `lost-last/` | `docker compose up -d --build` |
| Проверить API бэкенда | `lost-last/` | `curl http://127.0.0.1:8080/ping` |
| Установить зависимости фронтенда | `lost-last-frontend/` | `npm ci` |
| Запустить фронтенд | `lost-last-frontend/` | `npm start` |
| Собрать фронтенд | `lost-last-frontend/` | `npm run build` |
| Запустить TG bot локально | `lost-last-tg-bot/supportbot/` | `python -m app.main` |
| Запустить TG bot через Docker | `lost-last-tg-bot/supportbot/` | `docker compose up -d --build` |

## Что читать дальше

- [Backend](./backend): сервисы, API, мониторинг, Swagger и проверки качества.
- [Frontend](./frontend): Angular-приложение, локальный запуск, сборка и тесты.
- [TG bot](./tg-bot): настройка бота поддержки, запуск и проверка сценария обращения.
