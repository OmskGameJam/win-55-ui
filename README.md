# win-55-ui

Библиотека UI-компонентов для Vue 3 в стиле Windows 95. Пиксельная эстетика, 9-patch рамки, bitmap-шрифты и все привычные контролы эпохи.

> **Дисклеймер.** Часть кода и документации этого проекта написана при участии нейросетей (Claude, GitHub Copilot). Все результаты проверялись и редактировались вручную.

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

Props: `baseType` (BoxType, по умолчанию `panel-d-1`), `extraStyles`, `extraClass`, `disabled`.
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

Props: `title` (обязательный), `icon`, `resizable`, `resizableHorizontally`, `resizableVertically`, `minWidth`, `minHeight`, `placeholderButtons`, `disabled`, `gradientColorA`, `gradientColorB`, `faux`, `extraStyles`, `extraClass`.

`faux` — режим встроенного div без drag/resize (titlebar становится серым).

---

### Balloon

Всплывающее уведомление с «хвостиком».

```vue
<Balloon side="bottom" bias="right" v-model:shown="isVisible">
  <Button>Триггер</Button>
  <template #content>
    Текст уведомления
  </template>
</Balloon>
```

Props: `side` (`top` | `bottom` | `left` | `right`), `bias` (`left` | `right` | `up` | `down`), `text`, `shown` (v-model).

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
<Titlebar title="Заголовок" icon="/win-55-ui/icons/program.png" placeholder-buttons />
```

Props: `title`, `icon`, `placeholderButtons`, `disabled`, `gradientColorA`, `gradientColorB`.
Slot `#buttons` — кнопки справа.

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

---

## Лицензия

[MIT](LICENSE)
