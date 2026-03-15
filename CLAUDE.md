# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — запуск Vite dev-сервера с HMR
- `npm run build` — проверка типов (`vue-tsc -b`) + production-сборка Vite (демо-приложение)
- `npm run build:lib` — library build: Vite (ESM bundle + CSS) + vue-tsc (декларации типов) → `dist/`
- `npm run lint` — ESLint
- `npm run preview` — предпросмотр production-сборки

Требуется Node.js 20.19+ или 22.12+ (указан в `.nvmrc`).

## npm-пакет

Устанавливается из git: `npm install github:<owner>/win-55-ui`. `prepare` скрипт автоматически запускает `build:lib`.

Точки входа:
- `win-55-ui-vue` — компоненты и хелперы (ESM)
- `win-55-ui-vue/style.css` — CSS (reset, font-face, классы компонентов)
- `win-55-ui-vue/plugin` — Vite-плагин `win55ui()` для раздачи ассетов из `public/win-55-ui/` (dev: middleware, build: emitFile)

`vite.config.lib.ts` — отдельный конфиг для library build (`publicDir: false`, `transformAssetUrls: false`, `external: ['vue']`).

## Project Overview

Библиотека UI-компонентов в стиле Windows 95, построенная на Vue 3 + TypeScript + Vite. Все компоненты используют `<script setup lang="ts">` (Composition API). `App.vue` — kitchen sink демо всех компонентов.

## Architecture

### Компоненты (`src/components/`)

- **Box** — центральный layout-компонент с 9-patch border-image (CSS `border-image` + PNG из `/public/win-55-ui/`). Тип `BoxType` (`indent`, `indent-dark`, `panel-d-1`, `panel-d-2`, `textarea`, `border-groove`, `white-box`, `notification`) определяет визуальный стиль рамки. Пробрасывает `$attrs` на корневой div.
- **Typography** — обёрточный компонент, применяющий `typographyStyles()`. Принимает props из `TypographySettings` напрямую (kebab-case в шаблонах: `font-color`, `font-shadow-color`). По умолчанию рендерится как `<span style="display: contents">`, с опциональным prop `element` для смены тега.
- **BaseInput** — использует `contentEditable` div (обёрнут в Box) вместо HTML input. Поддерживает maxLength, paste (plain text only), блокировку Enter/Tab. Emit `change` с новым значением.
- **BaseDropdown / MenuDropdown** — dropdown-система с `<Teleport to="body">` для предотвращения clipping. Автоматически переворачивается вверх при overflow. Используют named slots: `#trigger` и `#items`.
- **Checkbox, RadioButton** — скрытый нативный input + кастомная иконка (img). Emit `change`. RadioButton сравнивает `target` с `value` для определения checked-состояния.
- **Button** — кастомная обработка mousedown/mouseup (глобальный listener на window). Меняет BoxType на `indent` при нажатии. Emit `click` только если мышь внутри при отпускании.
- **Window** — перемещаемое/ресайзабельное окно с абсолютным позиционированием. Использует `defineModel` для `x`, `y`, `width`, `height`. Поддерживает направленный resize (по краям окна, 6px зона) и drag за Titlebar. Props `resizable`, `resizableHorizontally`, `resizableVertically`.
- **Balloon** — всплывающее уведомление с «хвостиком» (треугольная стрелка). Позиционирование: `side` (top/bottom/left/right) + `bias` (left/right/up/down) для смещения. Использует `defineModel` для `shown`. Контент через `#content` слот или prop `text`.
- **Tooltip** — тултип, следующий за курсором. Появляется с задержкой 400ms при наведении. Props: `text`, `offsetX`, `offsetY`. Оборачивает контент через default slot.
- **HDivider** — горизонтальный разделитель (Box type `border-groove` с нулевой высотой).
- **NamedPanel** — Box с `border-groove` и плавающим лейблом сверху (абсолютно позиционированный `<div class="label">`). Props: `label`, `backgroundColorHint` (по умолчанию `#CBCBCB`). Контент через default slot.
- **Titlebar** — рендерит Bayer-dithered градиент на canvas с ResizeObserver для адаптивной перерисовки.

### Helpers (`src/helpers/`)

- **typography.ts** — `typographyStyles()` возвращает `CSSProperties` (из Vue). Маппит размеры шрифтов на custom @font-face (LiberationSans Regular12, Bold12 и т.д.). Поддерживает shorthand: `"Bold12"`.
- **bayerMatrix.ts** — 8x8 Bayer dithering для canvas-градиентов.
- **useSineWave.ts** — composable (`ref` + `requestAnimationFrame`) для анимированных sine/cosine значений с configurable FPS. Нормализует высоты для постоянной суммы.
- **imgErrors.ts** — `registerGlobalImageErrorHandler` — глобальный fallback на `broken-image.png` при ошибках загрузки изображений (capture phase listener).

## Conventions

### Vue-паттерн компонентов

- Все компоненты используют `<script setup lang="ts">` с `defineProps`/`withDefaults`/`defineEmits`.
- Кастомизация внешнего вида через props `extraStyles` (`CSSProperties`) и `extraClass` (`string`).
- Компоненты, которым нужен DOM-доступ извне, используют `defineExpose`.
- Состояние управляется через `v-model` (`defineModel`). Компоненты форм (BaseInput, Checkbox, RadioButton) используют `modelValue`/`update:modelValue`. Window использует именованные модели (`x`, `y`, `width`, `height`). Balloon — `shown`.

### Стилизация

Plain CSS (`index.css`, `scrollbar.css`) + inline `CSSProperties`. Без CSS-модулей, препроцессоров или CSS-in-JS. Все изображения используют `image-rendering: pixelated` для пиксельной эстетики.

### Ассеты

Все UI-ассеты (PNG-рамки, шрифты, иконки) в `/public/win-55-ui/`.

### TypeScript

Strict mode включён. ESLint запрещает unused locals/parameters, fallthrough switch cases.
