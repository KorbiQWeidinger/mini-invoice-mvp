"use client";

import { forwardRef, useId } from "react";

interface PrelineTextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
  name?: string;
  maxLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

function TextareaLabel({
  label,
  required,
  textareaId,
}: {
  label: string;
  required: boolean;
  textareaId: string;
}) {
  return (
    <label
      htmlFor={textareaId}
      className="block text-sm font-medium text-text-secondary"
    >
      {label}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
}

function TextareaError({
  error,
  textareaId,
}: {
  error: string;
  textareaId: string;
}) {
  return (
    <p id={`${textareaId}-error`} className="text-sm text-error" role="alert">
      {error}
    </p>
  );
}

function CharacterCount({
  value,
  maxLength,
}: {
  value: string;
  maxLength: number;
}) {
  return (
    <div className="text-xs text-text-tertiary text-right">
      {value.length}/{maxLength}
    </div>
  );
}

function getTextareaClasses(error?: string) {
  const baseClasses =
    "py-2 px-4 block w-full border rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary placeholder-text-secondary";

  if (error) {
    return `${baseClasses} border-error focus:border-error focus:ring-error`;
  }

  return `${baseClasses} border-border-primary`;
}

function getResizeClasses(resize: string) {
  switch (resize) {
    case "none":
      return "resize-none";
    case "vertical":
      return "resize-y";
    case "horizontal":
      return "resize-x";
    case "both":
      return "resize";
    default:
      return "resize-y";
  }
}

export const PrelineTextarea = forwardRef<
  HTMLTextAreaElement,
  PrelineTextareaProps
>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      rows = 3,
      required = false,
      disabled = false,
      error,
      className = "",
      id,
      name,
      maxLength,
      resize = "vertical",
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || name || generatedId;

    const textareaClasses = `${getTextareaClasses(error)} ${getResizeClasses(
      resize
    )}`;

    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <TextareaLabel
            label={label}
            required={required}
            textareaId={textareaId}
          />
        )}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className={textareaClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : undefined}
        />

        {error && <TextareaError error={error} textareaId={textareaId} />}
        {maxLength && <CharacterCount value={value} maxLength={maxLength} />}
      </div>
    );
  }
);

PrelineTextarea.displayName = "PrelineTextarea";
