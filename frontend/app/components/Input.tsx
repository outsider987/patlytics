import React, { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  placeholder: string;
  register: UseFormRegister<any>;
  requiredMessage: string;
  errors: FieldErrors;
  suggestions: string[];
  setValue: (name: string, value: any) => void;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  placeholder,
  register,
  requiredMessage,
  errors,
  suggestions,
  setValue,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="flex flex-col gap-2 relative">
      <label htmlFor={id} className="text-white">
        {label}
      </label>
      <input
        id={id}
        {...register(id, { required: requiredMessage })}
        placeholder={placeholder}
        className="p-2 rounded text-black"
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto top-full">
          {suggestions.map((match, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
              onClick={() => setValue(id, match)}
            >
              {match}
            </li>
          ))}
        </ul>
      )}
      {errors[id] && (
        <span className="text-orange-500">{String(errors[id]?.message)}</span>
      )}
    </div>
  );
};

export default Input;
