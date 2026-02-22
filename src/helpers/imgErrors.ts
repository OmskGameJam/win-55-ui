type ImageErrorCallback = (img: HTMLImageElement, event: Event) => void;

export function registerGlobalImageErrorHandler(
  callback: ImageErrorCallback
): void {
  document.addEventListener(
    "error",
    (event: Event) => {
      const target = event.target;

      if (target instanceof HTMLImageElement) {
        callback(target, event);
      }
    },
    true // IMPORTANT: use capture phase since error doesn't bubble
  );
}