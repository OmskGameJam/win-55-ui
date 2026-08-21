# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — запуск Vite dev-сервера с HMR
- `npm run build` — проверка типов (`vue-tsc -b`) + production-сборка Vite (демо-приложение)
- `npm run build:lib` — library build: Vite (ESM bundle + CSS) + vue-tsc (декларации типов) → `dist/`
- `npm run lint` — ESLint
- `npm run preview` — предпросмотр production-сборки
- `npm run emoji -- <command>` — обслуживание `public/win-55-ui/emoji/emoji-registry.csv` (`add`, `replace`, `remove`, `list`, `sort`, `check`, `classify`, `import`)
- `npm run font -- <command>` - генерация bitmap-шрифтов: одиночные (`strike`, `fallback`, `merge`, `build`, `all`, `check`) и манифест-driven, по `src-font/fonts.json` (`strike-all`, `fallback-all`, `merge-all`, `build-all`, `push-fonts`, `update-register`), см. «Битмап-шрифты» ниже
- `npm run charedit -- <bdf> [glyph]` - интерактивный TUI-редактор битмапа одного глифа BDF (стрелки - курсор, space - переключить пиксель, `[`/`]` - соседний глиф, `g` - перейти к глифу по имени/кодпоинту/символу, `s` - сохранить, `q`/`Esc` - выход); только битмап - остальные поля (BBX, DWIDTH, свойства) правятся прямо в текстовом `.bdf`. `<bdf>` без абсолютного пути резолвится относительно `src-font/`. При выходе, если была хоть одна сохранённая правка, для каждой грани `fonts.json`, ссылающейся на этот BDF, автоматически перезапускается remerge (если нужен) + build + tofu + push-fonts - `npm run dev` увидит новый TTF сразу (Vite сам делает full-reload на изменения в `public/`)
- `npm run release` — `scripts/release.js`: `build:lib` + `git add -A` + коммит `Publish <version>` (версия берётся из `package.json`, бампается вручную перед запуском)

`paths.config.json` (корень репозитория) — расположение ключевых директорий/файлов (`src-font/`, `public/win-55-ui/font/`, `public/win-55-ui/emoji/`, ...) как JSON, единый источник для обоих build-инструментов: `scripts/font/src/paths.ts` и `scripts/emoji-cli.js` читают его независимо друг от друга (первый компилируется через tsc, второй — обычный JS, запускается как есть, шарить между ними код напрямую не выйдет). Переименование директории — правка одной строки в конфиге, а не grep по двум CLI.

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
- **Typography** — обёрточный компонент, применяющий `typographyStyles()`. Принимает props из `TypographySettings` напрямую (kebab-case в шаблонах: `font-color`, `font-shadow-color`). По умолчанию рендерится как `<span style="display: contents">`, с опциональным prop `element` для смены тега. `isBold`/`isItalic`/`fontSize` и `shorthand` резолвятся в реально существующий `@font-face` через registry в `typography.ts` (см. ниже) — запрошенная комбинация, для которой нет битмап-шрифта (например курсив), молча деградирует до ближайшей поддерживаемой, а не рендерится «пустым» системным шрифтом. Опциональный prop `font-name` выбирает семейство шрифта (по умолчанию `"Standard"` — единственное семейство, которое пока реально существует); незнакомое имя деградирует до `Standard` тем же образом.
- **BaseInput** — использует `contentEditable` div (обёрнут в Box) вместо HTML input. Поддерживает maxLength, paste (plain text only), блокировку Enter/Tab, Discord-style `:shortcode:` emoji-автокомплит (popup через `Balloon`, данные из `helpers/shortcodes.ts`). Emit `change` с новым значением. Опциональный prop `showEmojiButton` добавляет кнопку внутри поля (видна при фокусе или когда пикер таргетит именно этот инпут), открывающую глобальный `EmojiPickerWindow` и вставляющую выбранный эмодзи в последнюю известную позицию каретки.
- **EmojiPickerWindow** — full-size emoji picker: глобальный singleton (один `Window` на всё приложение, монтируется один раз, например в `App.vue`), состояние — `helpers/emojiPickerStore.ts` (open/position/size только в памяти, сбрасываются при перезагрузке; активный `BaseInput`-таргет через `shallowRef`, а не `ref`, чтобы не терять identity объекта под reactive Proxy). Категории эмодзи — `helpers/emojiCategories.ts` (`emoji-by-category.json`). Закрывается по клику вне себя. Иконка тайтлбара перевыбирается при каждом открытии.
- **RichText / RichTextNode** — рендерит ограниченный BBCode ( `[b] [i] [u] [s]/[strike] [color=] [size=] [url]/[url=] [br]` ) плюс `:shortcode:` эмодзи из **собственного текстового содержимого** slot'а (не через text-prop) в дерево `Typography`/span/`<a>`. Парсер — `helpers/richText.ts`, лениентный к неизвестным/незакрытым тегам (передаются как литеральный текст). `[url]` рендерится только при `allow-links` (по умолчанию `false`); без него — тег молча «не работает», рендерится только текст внутри. Ссылки всегда `target="_blank"`. `RichTextNode` — рекурсивный внутренний компонент, не экспортируется отдельно.
- **BaseDropdown / MenuDropdown** — dropdown-система с `<Teleport to="body">` для предотвращения clipping. Автоматически переворачивается вверх при overflow. Используют named slots: `#trigger` и `#items`.
- **Checkbox, RadioButton** — скрытый нативный input + кастомная иконка (img). Emit `change`. RadioButton сравнивает `target` с `value` для определения checked-состояния.
- **Button** — кастомная обработка mousedown/mouseup (глобальный listener на window). Меняет BoxType на `indent` при нажатии. Emit `click` только если мышь внутри при отпускании.
- **Window** — перемещаемое/ресайзабельное окно с абсолютным позиционированием. Использует `defineModel` для `x`, `y`, `width`, `height`. Поддерживает направленный resize (по краям окна, 6px зона) и drag строго за titlebar-полосу (исключая иконку и кнопки тайтлбара — клик по ним не должен таскать окно). Во время drag/resize на `document.body` временно ставится `user-select: none`, чтобы жест не выделял текст. Props `resizable`, `resizableHorizontally`, `resizableVertically`.
- **Balloon** — всплывающее уведомление с «хвостиком» (треугольная стрелка). Позиционирование: `side` (top/bottom/left/right) + `bias` (left/right/up/down) для смещения. Использует `defineModel` для `shown`. Контент через `#content` слот или prop `text`.
- **Tooltip** — тултип, следующий за курсором. Появляется с задержкой 400ms при наведении. Props: `text`, `offsetX`, `offsetY`. Оборачивает контент через default slot.
- **HDivider** — горизонтальный разделитель (Box type `border-groove` с нулевой высотой).
- **NamedPanel** — Box с `border-groove` и плавающим лейблом сверху (абсолютно позиционированный `<div class="label">`). Props: `label`, `backgroundColorHint` (по умолчанию `#CBCBCB`). Контент через default slot.
- **Titlebar** — рендерит Bayer-dithered градиент на canvas с ResizeObserver для адаптивной перерисовки.
- **Custom Emoji directive** (`src/directives/emoji.ts`) — Vue-директива для замены emoji в текстовых нодах на GIF-изображения из `/win-55-ui/emoji/`. Регистрируется как `app.directive('emoji', emojiDirective)` и используется как `v-emoji`, обычно один раз на верхнем компоненте приложения. Внутри есть `MutationObserver`, поэтому динамический текст и `BaseInput` тоже обрабатываются. Emoji wrapper — один non-editable inline-atom с оригинальным Unicode emoji в `data-win55-emoji` для копирования/сериализации; GIF всегда следует 2x масштабу UI kit: 15px ассет → 30px на экране. Тот же визуальный конвеншн (`.win55-emoji` / `.win55-emoji-image`) переиспользуется в `RichTextNode` и в emoji picker.

### Helpers (`src/helpers/`)

- **typography.ts** - `typographyStyles()` возвращает `CSSProperties` (из Vue). Маппит fontName+размер+начертание на custom @font-face. Физическое имя TTF-файла и CSS `font-family` всегда совпадают и следуют схеме `{fontName}-{style}-{size}` (например `Standard-Regular-12`, файл `public/win-55-ui/font/Standard-Regular-12.ttf`) - `"Standard"` это собственное имя шрифта UI-кита, не привязанное к тому, какой конкретно исходный векторный шрифт (сейчас Liberation Sans) использовался для генерации битмапа. Поддерживает shorthand: `"Bold12"` (только style+size, без fontName). Импортирует `SUPPORTED_FACES` из `generatedFonts.ts` (auto-generated, не редактировать руками - см. «Битмап-шрифты» ниже) и через fallback-цепочку (`BoldItalic->Bold->Italic->Regular` и т.д.) деградирует любую запрошенную комбинацию fontName/стиля/размера до ближайшей реально поддерживаемой (незнакомый `fontName` - до `Standard`).
- **richText.ts** — `parseRichText()`, парсер ограниченного BBCode + `:shortcode:` эмодзи в дерево `RichNode` для `RichText`/`RichTextNode`.
- **shortcodes.ts** — `loadShortcodeIndex()` (кэширующий fetch `emoji-categories.json`), `searchShortcodes()` (prefix-поиск для автокомплита в `BaseInput`), `resolveShortcode()` (точное совпадение `:name:`).
- **emojiCategories.ts** — `loadEmojiCategories()`, кэширующий loader `emoji-by-category.json` (эмодзи, сгруппированные по категориям для `EmojiPickerWindow`). Оба JSON генерируются CLI-командой `npm run emoji -- classify`, ручное редактирование не требуется.
- **emojiPickerStore.ts** — модульный (не Pinia) reactive singleton для глобального emoji picker: `pickerOpen`, `pickerPosition` (in-memory), `activeTarget` (`shallowRef`, не `ref` — иначе Vue задиповает объект-таргет в Proxy и `===`-сравнение сломается), `openPicker`/`closePicker`/`insertEmoji`, `pickNextButtonIcon` (циклическая, не случайная, общая для всех `BaseInput`).
- **emojiDom.ts** — DOM-хелперы для работы с contentEditable-содержимым `BaseInput`: `getTextWithCustomEmoji`, `getSelectionOffset`/`restoreSelectionOffset` (кодируют/восстанавливают позицию каретки в grapheme-офсетах, устойчивы к emoji-обёрткам).
- **caretPosition.ts** — `getCaretClientRect()`, экранные координаты каретки (для позиционирования popup автокомплита).
- **graphemes.ts** — `graphemeLength`/`sliceGraphemes`, Unicode-grapheme-aware операции над строками (эмодзи как «один символ»).
- **color.ts** — `parseHexPalette`/`findNearestColor`, используется в emoji-директиве для quantization канвас-фолбэка нераспознанных unicode emoji.
- **bayerMatrix.ts** — 8x8 Bayer dithering для canvas-градиентов.
- **useSineWave.ts** — composable (`ref` + `requestAnimationFrame`) для анимированных sine/cosine значений с configurable FPS. Нормализует высоты для постоянной суммы.
- **imgErrors.ts** — `registerGlobalImageErrorHandler` — глобальный fallback на `broken-image.png` при ошибках загрузки изображений (capture phase listener).
- **emoji.ts** — runtime emoji registry loader. Загружает `public/win-55-ui/emoji/emoji-registry.csv` в браузере через `fetch`, читает его как простой `emoji,code` key-value файл и кэширует результат. Не генерировать TS-реестр; для обновления CSV использовать `npm run emoji -- add/replace/remove/...`.
- **browser.ts** — `isFirefox()` (UA sniff). Используется в `emoji.ts`-директиве и `BaseInput` для Firefox-only костылей вокруг размещения каретки рядом с custom-emoji атомами (лишние пустые текстовые ноды, ручная обработка стрелок) — в Chrome эти костыли не нужны и мешают нативному OS emoji-панели.

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

Emoji GIF-ассеты и runtime registry лежат в `/public/win-55-ui/emoji/`. CSV должен публиковаться вместе с ассетами и читаться на runtime. `npm run emoji -- classify` дополнительно генерирует `emoji-categories.json` (плоский, для автокомплита/шорткодов) и `emoji-by-category.json` (сгруппированный по категориям, для `EmojiPickerWindow`) — оба публикуются рядом с CSV и не редактируются вручную.

`/public/win-55-ui/x-emoji/` — staging-папка для нестандартных emoji-гифок, названных по алиасу (например `rofl.gif`), а не по символу. `npm run emoji -- import` резолвит алиас → unicode-эмодзи через github/iamcal/joypixels shortcode-пресеты `emojibase-data`, копирует гифку в `emoji/` под новым кодом из зарезервированного диапазона `C00`–`FFF` (отдельного от секвенциального `000`–`BA1` основного реестра) и сразу перезапускает `classify`.

`scrollbar.css` — кастомные `::-webkit-scrollbar-*`. Кнопки-стрелки обязательно квалифицированы `:start`/`:end` (без этого WebKit рисует обе кнопки на обоих концах). Хелпер-классы для конфигурации стрелок: `.scrollbar-arrows-none`, `.scrollbar-arrows-normal`, `.scrollbar-arrows-start`, `.scrollbar-arrows-end`.

### Битмап-шрифты (`scripts/font/`, `src-font/`)

`npm run font -- <command>` - TypeScript-инструмент (единственный в `scripts/`, написанный на TS - компилируется через собственный `scripts/font/tsconfig.json` перед запуском, `npm run font:build`) для генерации pixel-perfect bitmap-шрифтов, заменяющий ручной процесс FontForge + AutoTrace. Ни FontForge, ни AutoTrace, ни Python не нужны - но **растеризация Windows-only**: `strike`/`fallback` (`rasterize.ts`) рисуют через DirectWrite (`directwrite.ts`), системный `dwrite.dll`, вызываемый напрямую через FFI (`koffi`, ручной COM vtable dispatch) - без нативных аддонов и без build-тулчейна, но и без переносимости на другие ОС. Обратная векторизация (`build`) - через собственный контурный трейсер (`contours.ts`, 4-connected boundary tracing) + `svg2ttf` (не `opentype.js` - см. `FONTS.md`). Почему именно DirectWrite и как устроен vtable dispatch - там же.

Одиночный пайплайн (по одному шрифту за раз): `strike` (растеризация исходного TTF в `.bdf` для конкретного pixel size; опционально авто-кернинг, см. `FONTS.md`) -> опционально `fallback` + `merge` (добор недостающих глифов из другого, более полного TTF) -> ручной просмотр/правка `.bdf` (простой текстовый формат - редактировать можно прямо в нём, отдельного preview/PNG-шага нет) -> `build` (BDF -> outline TTF; `unitsPerEm = pixelSize * 100`, поэтому каждая пиксельная граница кратна 100 юнитам "по построению" - не нужно вручную сверять em-size, как в старом FontForge-процессе; мягкие находки самопроверки пишутся в `<out>.report.json`, не блокируя сборку) -> `tofu` (строит из `?`-глифа этого же BDF однострочный fallback-шрифт `{name}-TofuMaker.ttf`, см. ниже). `strike`/`fallback`/`all` отказываются перезаписывать существующий `.bdf` без `--force`, т.к. он может быть вручную отредактирован. `npm run font -- check <bdf>` - быстрая структурная проверка (битые/дублирующиеся глифы) без полной сборки.

Манифест-driven пайплайн (по всем шрифтам сразу, источник истины - `src-font/fonts.json`): `strike-all`/`fallback-all`/`merge-all`/`build-all`/`tofu-all` повторяют те же шаги для каждой записи манифеста, у которой ещё нет соответствующего выходного файла - существующий файл не перезаписывается, а пропускается с предупреждением (можно свободно перегенерировать только недостающие части набора). `push-fonts` копирует готовые TTF (основной + TofuMaker) из `src-font/` в `public/win-55-ui/font/` (всегда перезаписывает - это финальный шаг публикации). `update-register` полностью перегенерирует `src/helpers/generatedFonts.ts` (`SUPPORTED_FACES`) и `src/generated-fonts.css` (по два `@font-face`-блока на грань: основной шрифт + его TofuMaker) из `fonts.json` - оба файла помечены как auto-generated, руками не редактируются. `full-pipeline-all` прогоняет все семь шагов подряд с progress bar по стадиям. Полная схема `fonts.json`, авто-кернинг (`--generate-kerning` и связанные флаги `strike`/`fallback`) и TofuMaker - см. `FONTS.md`.

**TofuMaker**: каждая грань получает шрифт-компаньон `{fontName}-{style}-{size}-TofuMaker`, состоящий из ровно одного глифа (символ `?` из BDF этой самой грани), сопоставленного через cmap format 13 буквально каждому валидному Unicode-кодпоинту разом, без дублирования контура. Прописан в CSS font-family стеке в `typography.ts` сразу после основного шрифта, перед `Arial, sans` - гарантирует, что для любого символа, для которого нет своего пиксельного глифа, браузер отрисует наш собственный пиксельный `?`, а не соскочит на гладкий системный шрифт.

`src-font/` - staging-директория пайплайна: `liberation_sans/`, `noto_sans_jp/` (исходные векторные TTF, не редактируются), `fonts.json` (манифест), плюс сгенерированные `.bdf`/`.ttf` по размеру/начертанию - все текущие `.bdf`/`.ttf` в этой папке порождены самим пайплайном (`full-pipeline-all`), не унаследованы из старого ручного FontForge-процесса.

### TypeScript

Strict mode включён. ESLint запрещает unused locals/parameters, fallthrough switch cases.

## Workflow

Claude does not run/observe the dev server or take screenshots to verify UI changes — the user does that themselves (visual observation, feedback, iteration is their job, not Claude's). After making a change, it's enough to type-check (`vue-tsc -b`) and lint; add demo entries to `App.vue`'s kitchen sink so the user can look at the change, then stop and let them look.
