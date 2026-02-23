import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  type ReactNode,
  type ReactElement,
  cloneElement,
} from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  trigger: ReactElement<{ onClick?: React.MouseEventHandler<unknown> }>;
  items: ReactNode[];
}

export const BaseDropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFirstOpen = useRef(true);

  const calculatePosition = () => {
    const triggerEl = triggerRef.current;
    const dropdownEl = dropdownRef.current;
    if (!triggerEl || !dropdownEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = dropdownEl.offsetHeight;

    let top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    const width = rect.width;

    const wouldOverflow = rect.bottom + dropdownHeight > viewportHeight;

    if (wouldOverflow) {
      top = rect.top + window.scrollY - dropdownHeight;
    }

    setPosition({ top, left, width });
  };

  // Use useLayoutEffect for immediate measurement after render
  useLayoutEffect(() => {
    if (open) {
      calculatePosition();
      isFirstOpen.current = false;
    }
  }, [open]);

  useEffect(() => {
    const handleResizeScroll = () => {
      if (open) calculatePosition();
    };

    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener("scroll", handleResizeScroll);

    return () => {
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll);
    };
  }, [open]);

  const enhancedTrigger = cloneElement(trigger, {
    onClick: () => setOpen((prev: boolean) => !prev),
  });

  return (
    <>
      <div ref={triggerRef} style={{ display: "inline-block" }}>
        {enhancedTrigger}
      </div>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              width: position?.width ?? "auto",
            }}
          >
            {items.map((item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};