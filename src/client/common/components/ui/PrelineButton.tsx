"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface PrelineButtonProps {
  variant?: "primary" | "secondary" | "danger" | "warning" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  href?: string;
  target?: string;
}

function getVariantClasses(variant: string) {
  switch (variant) {
    case "primary":
      return "bg-brand-primary text-text-on-primary hover:bg-brand-primary-hover focus:ring-brand-primary border-transparent";
    case "secondary":
      return "bg-bg-primary text-text-secondary hover:bg-bg-tertiary focus:ring-brand-primary border-border-primary";
    case "danger":
      return "bg-error text-text-on-error hover:bg-error-hover focus:ring-error border-transparent";
    case "warning":
      return "bg-warning text-text-on-warning hover:bg-warning-hover focus:ring-warning border-transparent";
    case "ghost":
      return "bg-transparent text-text-primary hover:bg-bg-hover focus:ring-brand-primary border-transparent";
    default:
      return "bg-brand-primary text-text-on-primary hover:bg-brand-primary-hover focus:ring-brand-primary border-transparent";
  }
}

function getSizeClasses(size: string) {
  switch (size) {
    case "sm":
      return "py-1.5 px-3 text-sm";
    case "md":
      return "py-2 px-4 text-sm";
    case "lg":
      return "py-3 px-6 text-base";
    default:
      return "py-2 px-4 text-sm";
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

function ButtonContent({
  loading,
  icon,
  children,
  iconSizeClasses,
}: {
  loading: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  iconSizeClasses: string;
}) {
  return (
    <>
      {loading && (
        <Loader2 className={`${iconSizeClasses} animate-spin flex-shrink-0`} />
      )}
      {!loading && icon && (
        <span
          className={`${iconSizeClasses} flex-shrink-0 flex items-center justify-center`}
        >
          {icon}
        </span>
      )}
      {children}
    </>
  );
}

export const PrelineButton = forwardRef<HTMLButtonElement, PrelineButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      onClick,
      disabled = false,
      loading = false,
      icon,
      className = "",
      type = "button",
      href,
      target,
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center gap-x-2 font-semibold rounded-lg border focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200 cursor-pointer";
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    const iconSizeClasses = getIconSizeClasses(size);

    const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;
    const isDisabled = disabled || loading;

    if (href) {
      return (
        <a
          href={href}
          target={target}
          className={buttonClasses}
          aria-disabled={isDisabled}
        >
          <ButtonContent
            loading={loading}
            icon={icon}
            iconSizeClasses={iconSizeClasses}
          >
            {children}
          </ButtonContent>
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={buttonClasses}
        aria-disabled={isDisabled}
      >
        <ButtonContent
          loading={loading}
          icon={icon}
          iconSizeClasses={iconSizeClasses}
        >
          {children}
        </ButtonContent>
      </button>
    );
  }
);

PrelineButton.displayName = "PrelineButton";
