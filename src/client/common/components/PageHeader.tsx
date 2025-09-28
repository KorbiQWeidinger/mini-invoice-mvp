"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  variant?: "default" | "centered" | "compact";
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  className = "",
  variant = "default",
}: PageHeaderProps) {
  const getContainerClasses = () => {
    switch (variant) {
      case "centered":
        return "text-center mb-8";
      case "compact":
        return "mb-4";
      default:
        return "md:flex md:items-center md:justify-between mb-8";
    }
  };

  const getTitleClasses = () => {
    switch (variant) {
      case "centered":
        return "text-3xl font-bold text-text-primary mb-2";
      case "compact":
        return "text-xl font-bold text-text-primary";
      default:
        return "text-2xl font-bold leading-7 text-text-primary sm:text-3xl sm:truncate";
    }
  };

  const getSubtitleClasses = () => {
    switch (variant) {
      case "centered":
        return "text-text-secondary";
      case "compact":
        return "text-sm text-text-secondary mt-1";
      default:
        return "mt-1 text-sm text-text-secondary";
    }
  };

  const getActionsClasses = () => {
    switch (variant) {
      case "centered":
        return "mt-6 flex justify-center";
      case "compact":
        return "mt-2 flex";
      default:
        return "mt-4 flex md:mt-0 md:ml-4";
    }
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <div className={variant === "default" ? "flex-1 min-w-0" : ""}>
        <h1 className={getTitleClasses()}>{title}</h1>
        {subtitle && <p className={getSubtitleClasses()}>{subtitle}</p>}
      </div>
      {actions && <div className={getActionsClasses()}>{actions}</div>}
    </div>
  );
}
