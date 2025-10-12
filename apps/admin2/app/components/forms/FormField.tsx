// components/FormField.tsx

import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  type?: 'text' | 'number' | 'textarea';
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  // Prop para deshabilitar la edición (modo "solo ver")
  disabled?: boolean;
}

export default function FormField({
  label,
  id,
  name,
  value,
  type = 'text',
  onChange,
  disabled = false
}: FormFieldProps) {

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  // Estilos de modo oscuro de Tailwind
  const baseClasses = "mt-1 block w-full rounded-md shadow-sm transition duration-150";
  const enabledClasses = "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500";
  const disabledClasses = "bg-gray-900 border-gray-700 text-gray-400 cursor-not-allowed";

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <InputComponent
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        type={type !== 'textarea' ? type : undefined}
        rows={type === 'textarea' ? 4 : undefined}
        className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
      />
    </div>
  );
}
