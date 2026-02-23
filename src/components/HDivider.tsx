import { Box } from "./Box";

export function HDivider() {
  return <Box 
    type="border-groove" 
    extraStyles={{
      height: '-4px', 
      boxSizing: 'border-box',
      borderImageWidth: '0 0 6px 0',
      marginBottom: '6px',
    }} 
  />
}