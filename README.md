# Favorit Parts — поиск автозапчастей

Клиент на React + Redux (без TypeScript) для двухэтапного подбора деталей через API Favorit Parts.

## Сценарий

1. Ввод артикула → список производителей
2. Выбор бренда → аналоги и предложения (название/бренд, цена, остаток)

Документация API: https://lk.favorit-parts.ru/static/wsprice.pdf

## Запуск

```bash
npm install
cp .env.example .env
```

В `.env` укажите ключ покупателя из личного кабинета Favorit Parts.

```bash
npm run dev
```

Vite проксирует запросы `/api/hsprice` → `http://api.favorit-parts.ru/hs/hsprice` (обход CORS в dev).

## Стек

- React
- Redux Toolkit + react-redux
- Bootstrap 5
- Vite
