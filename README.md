# ЖК Minvest — лендинг

Прототип лендинга со scroll-driven анимацией: 20 кадров 3D-модели дома закрепляются на экране (sticky) и проигрываются по мере скролла. Стиль — Apple-style pinned scroll (как у AirPods Pro / iPad Pro).

## Стек

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3**
- **sharp** — оптимизация исходных PNG в WebP-секвенцию
- **Canvas 2D** + `requestAnimationFrame` — для плавного рендера 20 кадров

## Структура

```
minvestlanding/
├─ 3d modeling/           # исходные PNG-кадры 1.png … 20.png (~7-8 МБ каждый)
├─ Realistic/             # реалистичные рендеры (пока не используются)
├─ app/                   # Next App Router: layout, page, globals
├─ components/
│  └─ ScrollHouseAnimation.tsx   # canvas + pinned scroll + подписи
├─ public/frames/         # сгенерированные WebP 01.webp … 20.webp (gitignored)
├─ scripts/
│  └─ optimize-frames.ts  # PNG → WebP оптимизатор
└─ …
```

## Запуск

```bash
# 1. зависимости
npm install

# 2. один раз — оптимизировать кадры из «3d modeling/» в public/frames/
npm run optimize:frames

# 3. dev
npm run dev          # http://localhost:3000
```

## Как обновить кадры (например, после рендера новой версии модели)

1. Замените файлы `3d modeling/1.png … 20.png` (нумерация должна идти подряд).
2. Перезапустите `npm run optimize:frames` — папка `public/frames/` пересоберётся.
3. Если кадров стало больше/меньше — поменяйте константу `FRAME_COUNT` в `components/ScrollHouseAnimation.tsx`.

## Как настроить скорость анимации

В `components/ScrollHouseAnimation.tsx`:

- `SECTION_VH` — длина секции в `vh`. Больше → дольше скроллить → плавнее анимация. Текущее значение `520` ≈ 4 экрана скролла на 20 кадров.

## Как настроить подписи

Массив `CAPTIONS` в том же файле. Каждая подпись привязана к диапазону прогресса `[from, to]` ∈ `[0, 1]` и плавно фейдится на границах.

## Production build

```bash
npm run build
npm run start
```

Кадры `public/frames/*.webp` отдаются Next.js как статика, лениво подгружаются предзагрузчиком в компоненте.

## Дальше

- Подключить остальные секции (фасад, гаражи, площадка, контакты) из папки `Realistic/`.
- Добавить мобильную версию (сейчас тоже работает, но текст можно полировать).
- Заменить плейсхолдер-тексты и контакты.
