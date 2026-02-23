import type { ReactElement, ReactNode } from "react";
import { BaseDropdown } from "./BaseDropdown";
import { Box } from "./Box";

interface DropdownProps {
  trigger: ReactElement<{ onClick?: React.MouseEventHandler<unknown> }>;
  items: ReactNode[];
}

export function MenuDropdown({trigger, items}: DropdownProps) {
  return <BaseDropdown 
    items={items}
    trigger={trigger}
    itemWrapper={ (items) =>
      <Box type="panel-d-1">
        {items}
      </Box>
    }
  />
}