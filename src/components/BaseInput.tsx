import React, { useRef, useEffect } from 'react';
import { Box, type BoxType } from './Box'; // Adjust import path as needed
import { typographyStyles } from '../helpers/typography';

interface ContentEditableInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  boxType?: BoxType;
  extraStyles?: React.CSSProperties;
}

export const BaseInput = React.forwardRef<HTMLDivElement, ContentEditableInputProps>(
  ({ 
    value, 
    onChange, 
    placeholder = '', 
    disabled = false, 
    maxLength,
    extraStyles,
    boxType = 'textarea' // default type,
  }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    
    // Combine the forwarded ref with internal ref
    const setRefs = (element: HTMLDivElement | null) => {
      internalRef.current = element;
      
      // Handle forwarded ref
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // Update content when value prop changes externally
    useEffect(() => {
      if (internalRef.current && internalRef.current.innerText !== value) {
        internalRef.current.innerText = value;
      }
    }, [value]);

    const handleInput = () => {
      if (!internalRef.current) return;
      
      let newValue = internalRef.current.innerText || '';
      
      // Apply maxLength if specified
      if (maxLength && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
        internalRef.current.innerText = newValue;
        // Place cursor at the end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(internalRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      
      onChange(newValue);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      // Prevent new lines (keep as single line input)
      if (e.key === 'Enter') {
        e.preventDefault();
      }
      
      // Prevent default behavior for other keys if needed
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      
      if (!internalRef.current) return;
      
      // Get current cursor position and insert text
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      
      if (range) {
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      
      handleInput();
    };

    const handleBlur = () => {
      // Clean up empty content for placeholder display
      if (internalRef.current && internalRef.current.innerText === '') {
        internalRef.current.innerHTML = '';
      }
    };

    return (
      <Box
        ref={setRefs}
        type={boxType}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline="false"
        aria-disabled={disabled}
        suppressContentEditableWarning={true}
        extraStyles={{...extraStyles, ...typographyStyles({fontColor: 'black'})}}
      />
    );
  }
);

BaseInput.displayName = 'ContentEditableInput';

export default BaseInput;