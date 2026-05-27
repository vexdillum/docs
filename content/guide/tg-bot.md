---
title: TG bot
---

# Работа с TG bot

TG bot находится в папке `lost-last-tg-bot/`. Это Telegram-бот поддержки
Lost Last: участник создает обращение в личном чате с ботом, а оператор
отвечает из Telegram-группы поддержки.

## Что делает бот

- Принимает обращения из личного чата Telegram.
- Поддерживает категории обращений: вход, команда, задача, флаг, окружение и другое.
- Отправляет обращения в группу поддержки.
- Пересылает ответы операторов пользователю.
- Хранит тикеты, сообщения и настройки в SQLite.
- Подключает группу поддержки командой `/setup_support`.

## Требования

- Python 3.12 или новее.
- Токен Telegram-бота от BotFather.
- Docker, если нужен контейнерный запуск.

## Структура

```text
supportbot/
  app/                    Код бота
  tests/                  Тесты pytest
  Dockerfile              Docker-образ
  docker-compose.example.yml
  requirements.txt
```

## Переменные окружения

Создайте `.env` из примера:

```bash
cd supportbot
cp .env.example .env
```

Заполните значения:

```bash
BOT_TOKEN=your_bot_token_here
SQLITE_PATH=/data/supportbot.db
LOG_LEVEL=INFO
ENV=production
TZ=Europe/Moscow
```

`SUPPORT_CHAT_ID` можно указать заранее. Также бот можно подключить через
Telegram: добавьте его в группу поддержки и отправьте `/setup_support`.

## Локальный запуск

```bash
cd supportbot
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

## Запуск через Docker

```bash
cd supportbot
cp docker-compose.example.yml docker-compose.yml
docker compose up -d --build
```

## Проверка работы

1. Откройте бота в Telegram и отправьте `/start`.
2. Добавьте бота в группу поддержки.
3. Отправьте `/setup_support` в группе.
4. Создайте тестовое обращение в личном чате с ботом.
5. Ответьте на обращение из группы поддержки.

## Тесты

```bash
cd supportbot
pytest
```
