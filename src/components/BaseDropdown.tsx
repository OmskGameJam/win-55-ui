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
  itemWrapper?: (children: ReactNode) => ReactNode;
  matchTriggerWidth?: boolean; // NEW
}

export const BaseDropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  itemWrapper,
  matchTriggerWidth = false,
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width?: number;
  } | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    const triggerEl = triggerRef.current;
    const dropdownEl = dropdownRef.current;
    if (!triggerEl || !dropdownEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = dropdownEl.offsetHeight;

    let top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;

    const wouldOverflow = rect.bottom + dropdownHeight > viewportHeight;

    if (wouldOverflow) {
      top = rect.top + window.scrollY - dropdownHeight;
    }

    setPosition({
      top,
      left,
      width: matchTriggerWidth ? rect.width : undefined,
    });
  };

  useLayoutEffect(() => {
    if (open) {
      calculatePosition();
    }
  }, [open, matchTriggerWidth]);

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
    onClick: (e: React.MouseEvent) => {
      trigger.props.onClick?.(e);
      setOpen(prev => !prev);
    },
  });

  const content = (
    <>
      {items.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </>
  );

  const wrappedContent = itemWrapper ? itemWrapper(content) : content;

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
              width: matchTriggerWidth ? position?.width : "auto",
            }}
          >
            {wrappedContent}
          </div>,
          document.body
        )}
    </>
  );
};