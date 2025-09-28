"use client";

import { forwardRef, useId } from "react";

interface PrelineInputProps {
  type?: "text" | "email" | "number" | "date" | "password";
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  id?: string;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
}

function InputLabel({
  label,
  required,
  inputId,
}: {
  label: string;
  required: boolean;
  inputId: string;
}) {
  return (
    <label
      htmlFor={inputId}
      className="block text-sm font-medium text-text-secondary"
    >
      {label}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
}

function InputIcon({ icon, error }: { icon: React.ReactNode; error?: string }) {
  return (
    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
      <div className={error ? "text-error" : "text-text-secondary"}>{icon}</div>
    </div>
  );
}

function InputError({ error, inputId }: { error: string; inputId: string }) {
  return (
    <p id={`${inputId}-error`} className="text-sm text-error" role="alert">
      {error}
    </p>
  );
}

function getInputClasses(error?: string, hasIcon?: boolean) {
  const baseClasses =
    "py-2 px-4 block w-full border rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary placeholder-text-secondary";

  const iconPadding = hasIcon ? "ps-10" : "";

  if (error) {
    return `${baseClasses} ${iconPadding} border-error focus:border-error focus:ring-error`;
  }

  return `${baseClasses} ${iconPadding} border-border-primary`;
}

export const PrelineInput = forwardRef<HTMLInputElement, PrelineInputProps>(
  (
    {
      type = "text",
      label,
      placeholder,
      value,
      onChange,
      required = false,
      disabled = false,
      error,
      className = "",
      icon,
      id,
      name,
      min,
      max,
      step,
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;

    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <InputLabel label={label} required={required} inputId={inputId} />
        )}

        <div className="relative">
          <input
            ref={ref}
            type={type}
            id={inputId}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={getInputClasses(error, !!icon)}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          {icon && <InputIcon icon={icon} error={error} />}
        </div>

        {error && <InputError error={error} inputId={inputId} />}
      </div>
    );
  }
);

PrelineInput.displayName = "PrelineInput";
