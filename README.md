# win-55-ui

Библиотека UI-компонентов для Vue 3 в стиле Windows 95. Пиксельная эстетика, 9-patch рамки, bitmap-шрифты и все привычные контролы эпохи.

> **Дисклеймер.** Часть кода и документации этого проекта написана при участии нейросетей (Claude, Codex, GitHub Copilot). Все результаты проверялись и редактировались вручную.

---

## Установка

```bash
npm install github:<owner>/win-55-ui
```

`prepare` скрипт автоматически соберёт библиотеку при установке.

**Требования:** Node.js 20.19+ или 22.12+, Vue 3.5+.

### Подключение

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import 'win-55-ui-vue/style.css'

createApp(App).mount('#app')
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { win55ui } from 'win-55-ui-vue/plugin'

export default defineConfig({
  plugins: [vue(), win55ui()],
})
```

Vite-плагин `win55ui()` автоматически раздаёт ассеты из `public/win-55-ui/` (шрифты, иконки, PNG-рамки) — в dev-режиме через middleware, при сборке через `emitFile`.

---

## Компоненты

### Box

Базовый layout-компонент. Все визуальные рамки в стиле Win95 строятся через него — CSS `border-image` + 9-patch PNG.

```vue
<Box type="panel-d-1">Контент</Box>
```

Доступные типы (`BoxType`): `indent`, `indent-dark`, `panel-d-1`, `panel-d-2`, `textarea`, `border-groove`, `white-box`, `notification`.

Props: `type` (обязательный), `extraStyles` (`CSSProperties`), `extraClass` (`string`).
Exposит `el` — ref на корневой div.

---

### Typography

Применяет bitmap-шрифт LiberationSans с отключённым сглаживанием. По умолчанию рендерится как `<span style="display: contents">`, тег меняется через prop `element`.

```vue
<Typography shorthand="Bold12" font-color="black">
  Текст
</Typography>

<Typography :font-size="12" :is-bold="true" font-shadow-color="#a5a5a5">
  Текст с тенью
</Typography>
```

Props соответствуют `TypographySettings`: `font-size`, `is-bold`, `is-italic`, `font-color`, `font-shadow-color`, `shorthand`, `element`.

**Доступные bitmap-страйки** (реальные TTF-файлы в поставке): `Regular12`, `Bold12`, `Regular24`.
Остальные комбинации (Regular10, Bold14, Regular16 и т.д.) будут отрисованы фоллбэком Arial/sans-serif — без пиксельной эстетики.

---

### Button

```vue
<Button @click="handleClick">Нажать</Button>
<Button disabled>Недоступно</Button>
```

Props: `boxType` (BoxType, по умолчанию `panel-d-1`), `extraStyles`, `extraClass`, `disabled`.
Emit: `click` (только если мышь была отпущена внутри кнопки).

---

### BaseInput

Однострочный и многострочный ввод текста на базе `contenteditable` div.

```vue
<BaseInput v-model="text" :extra-styles="{ width: '320px' }" />

<!-- Многострочный -->
<BaseInput v-model="text" multiline style="width: 320px; height: 200px; white-space: pre;" />
```

Props: `modelValue`, `maxLength`, `multiline`, `extraStyles`, `extraClass`.
Emit: `change` (новое значение строкой). Вставка приводится к plain text, Enter и Tab блокируются в однострочном режиме.

---

### Checkbox

```vue
<Checkbox v-model="checked" label="Опция" />
```

Props: `modelValue` (boolean), `label`, `extraStyles`, `extraClass`.
Emit: `change`.

---

### RadioButton

```vue
<RadioButton v-model="selected" value="a" label="Вариант A" />
<RadioButton v-model="selected" value="b" label="Вариант B" />
```

Props: `modelValue`, `value`, `label`, `extraStyles`, `extraClass`.
Emit: `change`.

---

### Window

Перемещаемое и ресайзабельное окно с абсолютным позиционированием.

```vue
<Window
  title="Заголовок"
  icon="/win-55-ui/icons/program.png"
  resizable
  v-model:x="x"
  v-model:y="y"
  v-model:width="w"
  v-model:height="h"
>
  Контент окна
  <template #titlebar-buttons>
    <!-- кнопки в titlebar -->
  </template>
</Window>
```

Props: `title` (обязательный), `icon`, `resizable`, `resizableHorizontally`, `resizableVertically`, `minWidth`, `minHeight`, `showPlaceholderButtons`, `gradientColorA`, `gradientColorB`, `faux`, `extraStyles`, `extraClass`, `overflow`, `overflowX`, `overflowY`, `forgiveVerticalOverflow`.

`faux` — режим встроенного div без drag/resize (titlebar становится серым).

Позиция окна при перетаскивании привязывается к сетке 2px (`x`/`y` всегда чётные). При ресайзе границы тоже снапаются к сетке: ширина/высота остаются чётными, а неподвижные края не дрейфуют.

Тело окна прокручивается через `Box`: `overflow`/`overflowX`/`overflowY` принимают `BoxOverflow` (`auto` по умолчанию) и используют штатные скроллбары кита.

---

### Balloon

Всплывающее уведомление с «хвостиком».

```vue
<Balloon side="bottom" bias="right" v-model:open="isVisible">
  <Button>Триггер</Button>
  <template #content>
    Текст уведомления
  </template>
</Balloon>
```

Props: `side` (`top` | `bottom` | `left` | `right`), `bias` (`left` | `right` | `up` | `down`), `text`, `open` (v-model).

---

### Tooltip

Тултип, следующий за курсором. Появляется с задержкой 400 мс.

```vue
<Tooltip text="Подсказка">
  <Button>Навести</Button>
</Tooltip>
```

Props: `text`, `offsetX`, `offsetY`.

---

### BaseDropdown / MenuDropdown

Выпадающие списки с `<Teleport to="body">` — не обрезаются родительским overflow. Автоматически переворачиваются вверх при нехватке места.

```vue
<BaseDropdown>
  <template #trigger>
    <Button>Открыть</Button>
  </template>
  <template #items>
    <Button>Пункт 1</Button>
    <Button>Пункт 2</Button>
  </template>
</BaseDropdown>
```

`MenuDropdown` — стилизованный вариант для меню-бара (пункты как строки текста, с разделителем через `<HDivider />`).

---

### NamedPanel

Box с плавающим лейблом сверху.

```vue
<NamedPanel label="Группа">
  Контент
</NamedPanel>
```

Props: `label`, `backgroundColorHint` (цвет фона лейбла, по умолчанию `#CBCBCB`).

---

### HDivider

Горизонтальный разделитель (использовать внутри `MenuDropdown`).

```vue
<HDivider />
```

---

### Titlebar

Canvas-градиент с Bayer-dithering, используется внутри `Window`. Можно использовать отдельно.

```vue
<Titlebar title="Заголовок" icon="/win-55-ui/icons/program.png" show-placeholder-buttons />
```

Props: `title`, `icon`, `showPlaceholderButtons`, `gradientColorA`, `gradientColorB`.
Slot `#buttons` — кнопки справа.

---

### Custom Emoji

Директива `v-emoji` заменяет emoji в текстовых нодах на GIF-ассеты из `public/win-55-ui/emoji/`. Её достаточно повесить один раз на верхний компонент приложения: внутри работает `MutationObserver`, поэтому emoji будут подменяться и в динамически появившемся тексте, включая `BaseInput`.

```ts
// main.ts
import { createApp } from 'vue'
import { emojiDirective } from 'win-55-ui-vue'

createApp(App)
  .directive('emoji', emojiDirective)
  .mount('#app')
```

```vue
<main v-emoji>
  <div>Hello ☀ 🌈 😄 🚀</div>
  <BaseInput v-model="message" />
</main>
```

Реестр загружается в браузере из `/win-55-ui/emoji/emoji-registry.csv` и читается как простой `emoji,code` key-value файл. Генерировать TypeScript-реестр для emoji больше не нужно.

Подмена хранит оригинальный Unicode emoji в `data-win55-emoji`, поэтому копирование и `BaseInput` возвращают обычный текст. GIF рендерится как один non-editable inline-atom в масштабе UI kit: 15px ассет → 30px на экране.

Для обслуживания реестра:

```bash
npm run emoji -- add 😀 123
npm run emoji -- replace 😀 ./emoji.gif
npm run emoji -- check
```

---

## Хелперы

### `typographyStyles(settings)`

Возвращает `CSSProperties` для прямого применения на элемент без компонента `Typography`.

```ts
import { typographyStyles } from 'win-55-ui-vue'

const style = typographyStyles({ shorthand: 'Bold12', fontColor: 'black' })
```

### `useSineWave(count, options?)`

Composable для анимированных значений на основе синуса/косинуса. Возвращает `{ values }` — массив объектов `{ sin, cos }`, нормализованных так, чтобы сумма высот оставалась постоянной.

### `drawAngledBayerDitherGradient(ctx, ...)`

Рисует градиент с Bayer-dithering на canvas-контексте. Используется внутри `Titlebar`.

### `registerGlobalImageErrorHandler()`

Регистрирует глобальный fallback: при ошибке загрузки любого `<img>` подставляет `broken-image.png`.

---

## Разработка

```bash
npm install
npm run dev       # dev-сервер с HMR
npm run build:lib # сборка библиотеки → dist/
npm run lint      # ESLint
npm run build     # type-check + сборка демо-приложения
```

`src/App.vue` — kitchen sink со всеми компонентами. Это основная площадка для ручного тестирования и визуальной проверки изменений.

### `src/fun/` — отдельный репозиторий

Демка Bad Apple и её ассеты (~35 МБ) лежат в `src/fun/`, который этот репозиторий игнорирует (`# no fun allowed` в `.gitignore`) и который версионируется отдельно, в [win-55-ui-fun](https://github.com/OmskGameJam/win-55-ui-fun). Рабочее дерево остаётся на месте: правка `src/fun/BadApple.vue` — это правка того репозитория, переносить и подтягивать ничего не нужно.

```bash
npm run fun:pull              # склонировать src/fun или догнать fast-forward'ом
npm run fun -- status         # любая git-команда внутри src/fun
npm run fun -- commit -am "…"
npm run fun -- push
npm run fun:pop               # удалить src/fun, ассеты остаются на remote
npm run fun:pop -- --force    # то же, выбросив незакоммиченное/неотправленное
```

Без `src/fun/` проект полностью собирается: `App.vue` подставляет заглушку вместо демки. Всё остальное (`npm run lint`, type-check, `git status` родителя) про `src/fun/` не знает.

---

## Документация для AI-агентов

- `CLAUDE.md` — рабочий контекст для Claude Code.
- `CODEX.md` — рабочий контекст для Codex.

Оба файла должны оставаться синхронизированными с архитектурой, командами сборки и проектными соглашениями.

---

## Лицензия

[MIT](LICENSE.md) - за исключением части GIF-ассетов в `public/win-55-ui/emoji/`: диапазон кодов `000`-`BA1` представляет собой исторические артефакты стороннего происхождения и не покрывается лицензией проекта, тогда как диапазон `C00` и выше - собственная отрисовка проекта и лицензии подчиняется (см. [NOTICE](public/win-55-ui/emoji/NOTICE.md)).
