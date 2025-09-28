"use client";

import { useId } from "react";

interface PrelineToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
}

function ToggleLabel({ label, toggleId }: { label: string; toggleId: string }) {
  return (
    <label
      htmlFor={toggleId}
      className="block text-sm font-medium text-text-secondary"
    >
      {label}
    </label>
  );
}

function ToggleDescription({ description }: { description: string }) {
  return <p className="text-sm text-text-tertiary">{description}</p>;
}

function getSizeClasses(size: string) {
  switch (size) {
    case "sm":
      return "h-4 w-7";
    case "lg":
      return "h-7 w-12";
    case "md":
    default:
      return "h-6 w-11";
  }
}

function getThumbSizeClasses(size: string) {
  switch (size) {
    case "sm":
      return "h-3 w-3";
    case "lg":
      return "h-6 w-6";
    case "md":
    default:
      return "h-4 w-4";
  }
}

function getThumbPositionClasses(size: string, checked: boolean) {
  switch (size) {
    case "sm":
      return checked ? "translate-x-3" : "translate-x-0.5";
    case "lg":
      return checked ? "translate-x-6" : "translate-x-0";
    case "md":
    default:
      return checked ? "translate-x-6" : "translate-x-1";
  }
}

export function PrelineToggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className = "",
  id,
}: PrelineToggleProps) {
  const generatedId = useId();
  const toggleId = id || generatedId;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <ToggleLabel label={label} toggleId={toggleId} />}
      {description && <ToggleDescription description={description} />}

      <button
        type="button"
        id={toggleId}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex ${getSizeClasses(
          size
        )} items-center rounded-full border border-border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${
          checked ? "bg-brand-primary" : "bg-bg-hover"
        }`}
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? toggleId : undefined}
        aria-describedby={description ? `${toggleId}-description` : undefined}
      >
        <span
          className={`inline-block ${getThumbSizeClasses(
            size
          )} transform rounded-full bg-white transition-transform ${getThumbPositionClasses(
            size,
            checked
          )}`}
        />
      </button>

      {description && (
        <p id={`${toggleId}-description`} className="sr-only">
          {description}
        </p>
      )}
    </div>
  );
}
