# Тренажёр — дневник тренировок

Веб-приложение для зала: программы, подходы, таймер и статистика. UI на русском. Данные в `localStorage` на телефоне — компьютер в зале не нужен.

## Постоянный доступ с телефона (GitHub Pages)

**URL:** https://alexandrmikhailov1990.github.io/new-project/

Сборка уже публикуется в ветку `gh-pages` (base `/new-project/`, `.nojekyll`).  
Пока репозиторий **private**, эта ссылка отдаёт 404 — агент не может сменить visibility/Pages (нет прав API).

### Один раз включить (владелец репозитория)

1. Откройте https://github.com/AlexandrMikhailov1990/new-project/settings  
2. Внизу **Danger Zone** → **Change repository visibility** → **Make public** → подтвердите  
3. Откройте https://github.com/AlexandrMikhailov1990/new-project/settings/pages  
4. **Build and deployment** → Source: **Deploy from a branch**  
5. Branch: **gh-pages**, folder: **/ (root)** → **Save**  
6. Подождите 1–2 минуты и откройте на телефоне:  
   **https://alexandrmikhailov1990.github.io/new-project/**  
7. Меню браузера → **На экран «Домой»** / **Установить приложение**

После этого URL постоянный; обновления уходят через CI / `npm run deploy:pages`.

```bash
npm install
npm run deploy:pages
```

## Возможности

- Программы: Фулбади, Жим/Тяга/Ноги, Верх/Низ (редактируемые)
- Подходы: повторы, вес, работа/отдых + таймер
- Offline PWA (service worker + локальные шрифты)
- История, объём, рекорды, прошлые результаты в сессии

## Разработка на компьютере

```bash
npm install
npm run dev          # --host, обычно :5173
npm run build && npm run preview
```

Та же Wi‑Fi: адрес **Network** из вывода Vite.

## Данные

Ключ `trenazher-app-v1` в `localStorage` **этого** телефона/браузера.
