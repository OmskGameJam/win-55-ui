import { useEffect, useState, type ReactNode } from "react";
import { Box, type BoxType } from "./Box";

export interface ButtonProps {
  baseType?: BoxType;
  children?: ReactNode | ReactNode[];
  extraStyles?: React.CSSProperties;
  extraClass?: string;
  onClick?: () => void;
}

export function Button({
  extraClass,
  extraStyles,
  children,
  baseType = "panel-d-1",
  onClick,
}: ButtonProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isInside, setIsInside] = useState(false);

  const pressed = isMouseDown && isInside;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    setIsMouseDown(true);
    setIsInside(true);
  };

  const handleMouseEnter = () => setIsInside(true);
  const handleMouseLeave = () => setIsInside(false);

  // 🔥 Global mouseup listener
  useEffect(() => {
    const handleWindowMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;

      if (isMouseDown && isInside) {
        onClick?.(); // fire only if released inside
      }

      setIsMouseDown(false);
    };

    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isMouseDown, isInside, onClick]);

  return (
    <Box
      type={pressed ? "indent" : baseType}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      extraClass={extraClass}
      extraStyles={{
        userSelect: "none",
        width: "fit-content",
        paddingBottom: "4px",
        paddingRight: "4px",
        cursor: "default",
        ...extraStyles,
      }}
    >
      <div
        style={{
          transform: pressed ? "translate(2px, 2px)" : "translate(0, 0)",
        }}
      >
        {children}
      </div>
    </Box>
  );
}