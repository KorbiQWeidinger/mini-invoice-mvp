"use client";

import { ReactNode } from "react";

interface PrelineBadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getVariantClasses(variant: string) {
  switch (variant) {
    case "success":
      return "bg-success-bg text-success-text";
    case "warning":
      return "bg-warning-bg text-warning-text";
    case "danger":
      return "bg-error-bg text-error-text";
    case "info":
      return "bg-info-bg text-info-text";
    case "neutral":
    default:
      return "bg-bg-tertiary text-text-secondary";
  }
}

function getSizeClasses(size: string) {
  switch (size) {
    case "sm":
      return "px-2 py-1 text-xs";
    case "lg":
      return "px-4 py-2 text-sm";
    case "md":
    default:
      return "px-3 py-1 text-xs";
  }
}

export function PrelineBadge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}: PrelineBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${getVariantClasses(
        variant
      )} ${getSizeClasses(size)} ${className}`}
    >
      {children}
    </span>
  );
}
