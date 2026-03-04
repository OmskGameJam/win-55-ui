# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — запуск Vite dev-сервера с HMR
- `npm run build` — проверка типов (`tsc -b`) + production-сборка Vite
- `npm run lint` — ESLint
- `npm run preview` — предпросмотр production-сборки

## Project Overview

Библиотека UI-компонентов в стиле Windows 95, построенная на React 19 + TypeScript + Vite. `App.tsx` — kitchen sink демо всех компонентов.

## Architecture

### Компоненты (`src/components/`)

- **Box** — центральный layout-компонент с 9-patch border-image (CSS `border-image` + PNG). Тип `BoxType` определяет визуальный стиль рамки.
- **BaseInput** — использует `contentEditable` div вместо HTML input. Поддерживает maxLength, paste (plain text only), блокировку Enter/Tab.
- **BaseDropdown / MenuDropdown** — dropdown-система с portal-рендерингом для предотвращения clipping. Автоматически переворачивается вверх при overflow.
- **Checkbox, RadioButton** — скрытый нативный input + кастомная иконка (img).
- **Button, Titlebar, HDivider** — базовые UI-элементы. Titlebar рендерит Bayer-dithered градиент на canvas.

### Helpers (`src/helpers/`)

- **typography.ts** — `typographyStyles()` возвращает `React.CSSProperties`. Маппит размеры шрифтов на custom @font-face (LiberationSans Regular12, Bold12). Поддерживает shorthand: `"Bold12"`.
- **bayerMatrix.ts** — 8x8 Bayer dithering для canvas-градиентов.
- **useSineWave.ts** — хук для анимированных sine/cosine значений с configurable FPS.
- **registerGlobalImageErrorHandler** — глобальный fallback на `broken-image.png` при ошибках загрузки изображений.

## Conventions

### Props-паттерн компонентов

Кастомизация через `extraStyles` (React.CSSProperties) и `extraClass` (string). Компоненты, которым нужен DOM-доступ, используют `React.forwardRef`.

### Стилизация

Plain CSS (`index.css`) + inline `React.CSSProperties`. Без CSS-модулей, препроцессоров или CSS-in-JS. Все изображения используют `image-rendering: pixelated` для пиксельной эстетики.

### Ассеты

Все UI-ассеты (PNG-рамки, шрифты, иконки) в `/public/win-55-ui/`.

### TypeScript

Strict mode включён. ESLint запрещает unused locals/parameters, fallthrough switch cases.
