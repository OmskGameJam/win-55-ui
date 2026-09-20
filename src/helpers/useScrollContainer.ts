import type { CSSProperties, Ref } from 'vue'
import { computed, reactive, ref, watch } from 'vue'
import {
  isScrollContainer,
  resolveOverflow,
  SCROLLBAR_THICKNESS,
  snapEven,
  type BoxOverflow,
} from './scroll'

const VERTICAL_OVERFLOW_SLACK = 4
const SNAP_DEBOUNCE = 100

export interface ScrollContainerProps {
  overflow?: BoxOverflow
  overflowX?: BoxOverflow
  overflowY?: BoxOverflow
  forgiveVerticalOverflow?: boolean
}

/** Native scroller with hidden scrollbars, custom bar state, and scroll positions snapped to even integers. */
export function useScrollContainer(
  props: Readonly<ScrollContainerProps>,
  scrollTop: Ref<number | undefined>,
  scrollLeft: Ref<number | undefined>,
) {
  const wrapperRef = ref<HTMLDivElement | null>(null)
  const spacerRef = ref<HTMLDivElement | null>(null)

  const resolved = computed(() =>
    resolveOverflow(props.overflowX ?? props.overflow ?? 'visible', props.overflowY ?? props.overflow ?? 'visible'),
  )
  const scrollMode = computed(() => isScrollContainer(resolved.value.x) || isScrollContainer(resolved.value.y))

  const showV = ref(resolved.value.y === 'scroll')
  const showH = ref(resolved.value.x === 'scroll')

  const metrics = reactive({ top: 0, left: 0, clientW: 0, clientH: 0, scrollW: 0, scrollH: 0 })

  const rootStyle = computed<CSSProperties>(() => {
    if (!scrollMode.value) {
      return { overflowX: props.overflowX ?? props.overflow, overflowY: props.overflowY ?? props.overflow }
    }
    return {
      display: 'grid',
      gridTemplateColumns: showV.value ? `minmax(0, 1fr) ${SCROLLBAR_THICKNESS}px` : 'minmax(0, 1fr)',
      gridTemplateRows: showH.value ? `minmax(0, 1fr) ${SCROLLBAR_THICKNESS}px` : 'minmax(0, 1fr)',
    }
  })

  const wrapperStyle = computed<CSSProperties>(() => ({
    overflowX: resolved.value.x,
    overflowY: resolved.value.y,
  }))

  function syncMetrics(el: HTMLElement) {
    metrics.top = el.scrollTop
    metrics.left = el.scrollLeft
    metrics.clientW = el.clientWidth
    metrics.clientH = el.clientHeight
    metrics.scrollW = el.scrollWidth
    metrics.scrollH = el.scrollHeight
  }

  function snapScroll(el: HTMLElement) {
    const y = snapEven(el.scrollTop, el.scrollHeight - el.clientHeight)
    const x = snapEven(el.scrollLeft, el.scrollWidth - el.clientWidth)
    if (Math.abs(y - el.scrollTop) > 0.01) el.scrollTop = y
    if (Math.abs(x - el.scrollLeft) > 0.01) el.scrollLeft = x
  }

  let resizeObserver: ResizeObserver | null = null
  let mutationObserver: MutationObserver | null = null
  let frame = 0
  let snapTimer = 0

  function scheduleMeasure() {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      measure()
    })
  }

  function measure() {
    const el = wrapperRef.value
    const spacer = spacerRef.value
    if (!el || !spacer) return

    spacer.style.display = 'none'
    const sh = el.scrollHeight
    const sw = el.scrollWidth
    const ch = el.clientHeight
    const cw = el.clientWidth

    const g = SCROLLBAR_THICKNESS
    const { x, y } = resolved.value
    const slack = props.forgiveVerticalOverflow ? VERTICAL_OVERFLOW_SLACK : 0
    const fullW = cw + (showV.value ? g : 0)
    const fullH = ch + (showH.value ? g : 0)
    let v = y === 'scroll'
    let h = x === 'scroll'
    if (y === 'auto' && sh - slack > fullH) v = true
    if (x === 'auto' && sw > fullW - (v ? g : 0)) h = true
    if (y === 'auto' && !v && sh - slack > fullH - (h ? g : 0)) v = true
    const verticalFlipped = v !== showV.value
    showV.value = v
    if (!(verticalFlipped && x === 'auto')) showH.value = h

    const oddY = (sh - ch) % 2 !== 0
    const oddX = (sw - cw) % 2 !== 0
    if (oddY || oddX) {
      spacer.style.top = oddY ? `${sh}px` : '0px'
      spacer.style.left = oddX ? `${sw}px` : '0px'
      spacer.style.display = 'block'
    }
    mutationObserver?.takeRecords()

    for (const child of Array.from(el.children)) resizeObserver?.observe(child)
    snapScroll(el)
    syncMetrics(el)
  }

  function snapNow() {
    clearTimeout(snapTimer)
    const el = wrapperRef.value
    if (!el) return
    snapScroll(el)
    syncMetrics(el)
  }

  function onScroll() {
    const el = wrapperRef.value
    if (!el) return
    syncMetrics(el)
    const y = snapEven(el.scrollTop, el.scrollHeight - el.clientHeight)
    const x = snapEven(el.scrollLeft, el.scrollWidth - el.clientWidth)
    if (scrollTop.value !== y) scrollTop.value = y
    if (scrollLeft.value !== x) scrollLeft.value = x
    clearTimeout(snapTimer)
    snapTimer = window.setTimeout(snapNow, SNAP_DEBOUNCE)
  }

  function scrollToAxis(axis: 'x' | 'y', value: number) {
    const el = wrapperRef.value
    if (!el) return
    if (axis === 'y') el.scrollTop = snapEven(value, el.scrollHeight - el.clientHeight)
    else el.scrollLeft = snapEven(value, el.scrollWidth - el.clientWidth)
  }

  function scrollByAxis(axis: 'x' | 'y', delta: number) {
    const el = wrapperRef.value
    if (el) scrollToAxis(axis, (axis === 'y' ? el.scrollTop : el.scrollLeft) + delta)
  }

  function applyModel(axis: 'x' | 'y') {
    const el = wrapperRef.value
    const model = axis === 'y' ? scrollTop : scrollLeft
    if (!el || model.value === undefined) return
    const current = axis === 'y' ? el.scrollTop : el.scrollLeft
    const max = axis === 'y' ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth
    if (snapEven(current, max) === model.value) return
    scrollToAxis(axis, model.value)
    const snapped = snapEven(model.value, max)
    if (model.value !== snapped) model.value = snapped
  }

  watch(scrollTop, () => applyModel('y'))
  watch(scrollLeft, () => applyModel('x'))
  watch([resolved, () => props.forgiveVerticalOverflow], measure, { flush: 'post' })

  watch(
    wrapperRef,
    (el, _prev, onCleanup) => {
      if (!el) return
      resizeObserver = new ResizeObserver(scheduleMeasure)
      resizeObserver.observe(el)
      mutationObserver = new MutationObserver(scheduleMeasure)
      mutationObserver.observe(el, { childList: true, subtree: true, characterData: true, attributes: true })
      measure()
      applyModel('y')
      applyModel('x')
      onCleanup(() => {
        resizeObserver?.disconnect()
        mutationObserver?.disconnect()
        resizeObserver = null
        mutationObserver = null
        clearTimeout(snapTimer)
        cancelAnimationFrame(frame)
        frame = 0
      })
    },
    { flush: 'post' },
  )

  return {
    wrapperRef,
    spacerRef,
    scrollMode,
    showV,
    showH,
    metrics,
    rootStyle,
    wrapperStyle,
    onScroll,
    snapNow,
    scrollToAxis,
    scrollByAxis,
  }
}
