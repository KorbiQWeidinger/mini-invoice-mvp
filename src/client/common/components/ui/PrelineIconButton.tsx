"use client";

import { forwardRef } from "react";

interface PrelineIconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "warning" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  title?: string;
  className?: string;
}

function getVariantClasses(variant: string) {
  switch (variant) {
    case "primary":
      return "text-brand-primary hover:text-brand-primary-hover hover:bg-brand-primary/10";
    case "secondary":
      return "text-text-secondary hover:text-text-primary hover:bg-bg-hover";
    case "danger":
      return "text-error hover:text-error-text hover:bg-error-bg";
    case "warning":
      return "text-warning hover:text-warning-text hover:bg-warning-bg";
    case "ghost":
      return "text-text-secondary hover:text-text-primary hover:bg-bg-hover";
    default:
      return "text-brand-primary hover:text-brand-primary-hover hover:bg-brand-primary/10";
  }
}

function getSizeClasses(size: string) {
  switch (size) {
    case "sm":
      return "p-1.5";
    case "md":
      return "p-2";
    case "lg":
      return "p-3";
    default:
      return "p-2";
  }
}

function getIconSizeClasses(size: string) {
  switch (size) {
    case "sm":
      return "w-3 h-3";
    case "md":
      return "w-4 h-4";
    case "lg":
      return "w-5 h-5";
    default:
      return "w-4 h-4";
  }
}

export const PrelineIconButton = forwardRef<
  HTMLButtonElement,
  PrelineIconButtonProps
>(
  (
    {
      icon,
      onClick,
      variant = "primary",
      size = "md",
      disabled = false,
      title,
      className = "",
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    const iconSizeClasses = getIconSizeClasses(size);

    const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={buttonClasses}
        title={title}
        aria-label={title}
      >
        <span className={iconSizeClasses}>{icon}</span>
      </button>
    );
  }
);

PrelineIconButton.displayName = "PrelineIconButton";
