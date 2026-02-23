import React from 'react';

interface RadioButtonProps {
  target: any;  // The current selected value from the group
  value: any;   // The value this radio button represents
  onChange: (value: any) => void;  // Called with this radio's value when selected
  label?: React.ReactNode;
  disabled?: boolean;
  name?: string;  // Optional name for the radio group (for accessibility)
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  target,
  value,
  onChange,
  label,
  disabled = false,
  name,
  checkedIcon = <img draggable='false' src='/win-55-ui/whole-components/radio-checked.png'/>,
  uncheckedIcon = <img draggable='false' src='/win-55-ui/whole-components/radio-unchecked.png'/>,
}) => {
  const isChecked = target === value;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.target.checked) {
      onChange(value);
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (disabled) return;
    if (!isChecked) {  // Only trigger onChange if not already checked
      onChange(value);
    }
  };

  return (
    <div 
      className={`radio-container ${disabled ? 'disabled' : ''}`}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none'
      }}
    >
      <div 
        onClick={handleClick}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {isChecked ? checkedIcon : uncheckedIcon}
      </div>
      
      <input
        type="radio"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        value={value}
        name={name}
        style={{ display: 'none' }}
      />
      
      {label && (
        <label 
          onClick={handleClick}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default RadioButton;