"use client";

import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";

interface PrelineDropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
  name?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

function DropdownLabel({
  label,
  required,
  buttonId,
}: {
  label: string;
  required: boolean;
  buttonId: string;
}) {
  return (
    <label
      htmlFor={buttonId}
      className="block text-sm font-medium text-text-secondary"
    >
      {label}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
}

function DropdownButton({
  buttonId,
  buttonClasses,
  buttonClassName,
  selectedOption,
  displayText,
  disabled,
  dropdownId,
  error,
  label,
}: {
  buttonId: string;
  buttonClasses: string;
  buttonClassName: string;
  selectedOption?: { value: string; label: string; icon?: React.ReactNode };
  displayText: string;
  disabled: boolean;
  dropdownId: string;
  error?: string;
  label?: string;
}) {
  return (
    <button
      id={buttonId}
      type="button"
      className={`${buttonClasses} w-full justify-between ${buttonClassName}`}
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label={label || "Dropdown selector"}
      disabled={disabled}
      aria-describedby={error ? `${dropdownId}-error` : undefined}
    >
      <div className="flex items-center gap-x-2">
        {selectedOption?.icon && (
          <span className="w-4 h-4">{selectedOption.icon}</span>
        )}
        <span>{displayText}</span>
      </div>
      <ChevronDown className="hs-dropdown-open:rotate-180 w-4 h-4" />
    </button>
  );
}

function DropdownMenu({
  menuClasses,
  buttonId,
  placeholder,
  value,
  onChange,
  options,
}: {
  menuClasses: string;
  buttonId: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
}) {
  return (
    <div
      className={menuClasses}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={buttonId}
    >
      <div className="space-y-0.5">
        {placeholder && (
          <button
            onClick={() => onChange("")}
            className={`w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary ${
              value === "" ? "bg-bg-hover" : ""
            }`}
            role="menuitem"
          >
            {placeholder}
          </button>
        )}
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary ${
              value === option.value ? "bg-bg-hover" : ""
            }`}
            role="menuitem"
          >
            {option.icon && <span className="w-4 h-4">{option.icon}</span>}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DropdownError({
  error,
  dropdownId,
}: {
  error: string;
  dropdownId: string;
}) {
  return (
    <p id={`${dropdownId}-error`} className="text-sm text-error" role="alert">
      {error}
    </p>
  );
}

function getButtonClasses(error?: string) {
  const baseClasses =
    "hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border bg-bg-primary text-text-primary shadow-sm hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none";

  if (error) {
    return `${baseClasses} border-error focus:border-error focus:ring-error`;
  }

  return `${baseClasses} border-border-primary`;
}

function getMenuClasses(menuClassName: string) {
  return `hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-bg-primary shadow-md rounded-lg p-2 mt-2 border border-border-primary z-50 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full ${menuClassName}`;
}

export const PrelineDropdown = forwardRef<HTMLDivElement, PrelineDropdownProps>(
  (
    {
      label,
      value,
      onChange,
      options,
      placeholder,
      required = false,
      disabled = false,
      error,
      className = "",
      id,
      name,
      buttonClassName = "",
      menuClassName = "",
    },
    ref
  ) => {
    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const buttonId = `hs-dropdown-${dropdownId}`;

    const selectedOption = options.find((option) => option.value === value);
    const displayText =
      selectedOption?.label || placeholder || "Select an option";

    return (
      <div className={`space-y-2 ${className}`} ref={ref}>
        {label && (
          <DropdownLabel
            label={label}
            required={required}
            buttonId={buttonId}
          />
        )}

        <div className="hs-dropdown relative inline-flex w-full">
          <DropdownButton
            buttonId={buttonId}
            buttonClasses={getButtonClasses(error)}
            buttonClassName={buttonClassName}
            selectedOption={selectedOption}
            displayText={displayText}
            disabled={disabled}
            dropdownId={dropdownId}
            error={error}
            label={label}
          />
          <DropdownMenu
            menuClasses={getMenuClasses(menuClassName)}
            buttonId={buttonId}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            options={options}
          />
        </div>

        {error && <DropdownError error={error} dropdownId={dropdownId} />}
      </div>
    );
  }
);

PrelineDropdown.displayName = "PrelineDropdown";
