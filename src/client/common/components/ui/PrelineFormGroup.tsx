"use client";

import { useId } from "react";

interface PrelineFormGroupProps {
  label?: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  description?: string;
  id?: string;
}

function FormLabel({
  label,
  required,
  groupId,
}: {
  label: string;
  required: boolean;
  groupId: string;
}) {
  return (
    <label
      htmlFor={groupId}
      className="block text-sm font-medium text-text-secondary"
    >
      {label}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
}

function FormDescription({ description }: { description: string }) {
  return <p className="text-sm text-text-tertiary">{description}</p>;
}

function FormError({ error, groupId }: { error: string; groupId: string }) {
  return (
    <p id={`${groupId}-error`} className="text-sm text-error" role="alert">
      {error}
    </p>
  );
}

export function PrelineFormGroup({
  label,
  children,
  error,
  required = false,
  className = "",
  description,
  id,
}: PrelineFormGroupProps) {
  const generatedId = useId();
  const groupId = id || generatedId;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <FormLabel label={label} required={required} groupId={groupId} />
      )}
      {description && <FormDescription description={description} />}
      <div className="relative">{children}</div>
      {error && <FormError error={error} groupId={groupId} />}
    </div>
  );
}
