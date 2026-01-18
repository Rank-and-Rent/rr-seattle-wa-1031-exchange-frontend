"use client";

import { FormEvent, useEffect, useId, useState } from "react";

interface SearchInputProps {
  label: string;
  placeholder: string;
  onSearch: (value: string) => void;
  onClear?: () => void;
  initialValue?: string;
  size?: "sm" | "md";
}

export const SearchInput = ({
  label,
  placeholder,
  onSearch,
  onClear,
  initialValue = "",
  size = "md",
}: SearchInputProps) => {
  const [value, setValue] = useState(initialValue);
  const inputId = useId();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    onClear?.();
  };

  const padding = size === "sm" ? "py-2 px-4 text-sm" : "py-3 px-4";

  return (
    <form onSubmit={handleSubmit} className="relative">
      <label htmlFor={inputId} className="visually-hidden">
        {label}
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className={`w-full border border-gray-200 bg-white ${padding} pr-28 text-sm text-[#2c3e50] focus:border-[#b8a074] focus:outline-none`}
        type="search"
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-20 top-1/2 h-6 w-6 -translate-y-1/2 flex items-center justify-center text-[#6b7c8a] hover:text-[#2c3e50] transition-colors"
        >
          <span className="sr-only">Clear</span>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#2c3e50] px-4 py-2 text-xs tracking-[0.15em] uppercase text-white hover:bg-[#1a3a52] transition-colors"
      >
        Search
      </button>
    </form>
  );
};
