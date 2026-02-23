import type { ReactNode } from "react";
import React from "react";

export type BoxType =
  | "indent"
  | "panel-d-1"
  | "panel-d-2"
  | "indent"
  | "textarea"
  | "border-groove";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  type: BoxType;
  extraStyles?: React.CSSProperties;
  children?: ReactNode | ReactNode[];
  extraClass?: string;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ type, extraStyles, extraClass, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        {...rest}
        className={`border-9-base ${extraClass ?? ""}`}
        style={
          {
            "--img": `url(/public/win-55-ui/${type}.png)`,
            ...extraStyles,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    );
  }
);

Box.displayName = 'Box';