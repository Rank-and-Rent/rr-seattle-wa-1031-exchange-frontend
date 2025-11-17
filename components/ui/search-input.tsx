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

  const padding = size === "sm" ? "py-2 px-3 text-sm" : "py-3 px-4";

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
        className={`w-full rounded-full border border-[#4DA49B]/40 bg-white/90 ${padding} pr-24 text-sm text-[#0E2536] shadow-sm focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/50`}
        type="search"
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-20 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-[#1F3C58]/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#1F3C58]"
        >
          x
        </button>
      )}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#4DA49B] to-[#7BC5BD] px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#0E2536]"
      >
        Search
      </button>
    </form>
  );
};
