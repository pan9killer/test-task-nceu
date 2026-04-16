# Task Manager SPA

Одностраничное приложение для управления задачами, выполненное на **React + TypeScript**.

## Стек

- React 19 (совместимо с требованиями React 18+)
- TypeScript
- Vite
- React Router
- Redux Toolkit + RTK Query
- react-hook-form + zod
- MUI
- json-server

## Возможности

- список задач в виде карточек
- CRUD для задач
- отдельный PATCH-запрос для обновления статуса
- список тегов и создание новых тегов
- фильтрация по статусу, приоритету и тегу
- поиск по названию
- сортировка по дате создания и дедлайну
- обычная пагинация
- страница подробной информации по задаче
- удаление с подтверждением через модальное окно
- форма создания и редактирования с валидацией
- визуальное выделение просроченных задач
- быстрый переход по тегу к фильтрации

## Структура проекта

```text
src/
  components/      // карточки, фильтры, форма, диалог подтверждения
  pages/           // страницы списка, деталей и формы
  shared/          // общий layout
  store/           // RTK Query API
  styles/          // глобальные стили
  utils/           // форматирование и вспомогательная логика
```

## Архитектура

Приложение разделено на три основных слоя:

1. **UI-слой** — страницы и компоненты на MUI.
2. **Data-слой** — RTK Query для запросов к `json-server`.
3. **Domain/helpers** — типы, константы и утилиты для задач.

### Особенности решений

- `tasks.tags` хранит массив `id` тегов, а отображение имени тега происходит через справочник `tags`.
- Для быстрого изменения статуса используется отдельная мутация `PATCH /tasks/:id`.
- В форме тегов работает `Autocomplete` с множественным выбором и возможностью создать новый тег на лету.
- Поля `createdAt` и `updatedAt` выставляются автоматически в коде.

## Запуск проекта

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск frontend и mock-backend одновременно

```bash
npm run start
```

После этого будут доступны:

- frontend: `http://localhost:5173`
- json-server: `http://localhost:3001`

### Раздельный запуск

```bash
npm run server
npm run dev
```

## Доступные скрипты

```bash
npm run dev
npm run build
npm run preview
npm run server
npm run start
```

## API mock-сервера

### Task

```ts
{
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Tag

```ts
{
  id: string;
  name: string;
}
```

## Что можно улучшить

- синхронизация фильтров с query params
- серверная пагинация
- optimistic update для смены статуса
- unit/integration тесты
- Storybook для UI-компонентов

## Репозиторий

Для сдачи тестового проекта достаточно загрузить содержимое этой папки в публичный GitHub/GitLab репозиторий.
