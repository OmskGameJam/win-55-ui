import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  value?: string;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  value,
  checkedIcon = <img draggable='false' src='/win-55-ui/whole-components/checkbox-checked.png'/>,
  uncheckedIcon = <img draggable='false' src='/win-55-ui/whole-components/checkbox-unchecked.png'/>,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(event.target.checked);
  };

  const toggleCheckbox = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <div 
      className={`checkbox-container ${disabled ? 'disabled' : ''}`}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        marginBottom: '2px'
      }}
      onClick={toggleCheckbox}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {checked ? checkedIcon : uncheckedIcon}
      </div>
      
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        value={value}
        style={{ display: 'none' }}
      />
      
      {label && (
        <span style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Checkbox;