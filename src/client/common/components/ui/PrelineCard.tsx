"use client";

import { forwardRef } from "react";

interface PrelineCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: "default" | "elevated" | "outlined" | "statistic";
  className?: string;
  hover?: boolean;
  icon?: React.ReactNode;
  iconColor?: "primary" | "success" | "warning" | "danger" | "neutral";
  padding?: "sm" | "md" | "lg";
}

function getVariantClasses(variant: string, hover: boolean) {
  const baseClasses = "bg-bg-secondary border border-border-primary rounded-xl";

  switch (variant) {
    case "elevated":
      return `${baseClasses} shadow-lg`;
    case "outlined":
      return `${baseClasses} border-2`;
    case "statistic":
      return `${baseClasses} shadow-lg transition-all duration-200 ${
        hover ? "hover:shadow-xl" : ""
      }`;
    default:
      return baseClasses;
  }
}

function getPaddingClasses(padding: string) {
  switch (padding) {
    case "sm":
      return "p-4";
    case "lg":
      return "p-8";
    default:
      return "p-6";
  }
}

function getIconColorClasses(iconColor: string) {
  switch (iconColor) {
    case "success":
      return "bg-gradient-to-r from-icon-success to-icon-success-hover";
    case "warning":
      return "bg-gradient-to-r from-icon-warning to-icon-warning-hover";
    case "danger":
      return "bg-gradient-to-r from-icon-danger to-icon-danger-hover";
    case "neutral":
      return "bg-gradient-to-r from-icon-neutral to-icon-neutral-hover";
    default:
      return "bg-gradient-to-r from-icon-primary to-icon-primary-hover";
  }
}

function getIconTextColor(iconColor: string) {
  switch (iconColor) {
    case "success":
      return "text-text-on-success";
    case "warning":
      return "text-text-on-warning";
    case "danger":
      return "text-text-on-danger";
    case "neutral":
      return "text-text-on-primary";
    default:
      return "text-text-on-primary";
  }
}

function CardHeader({
  title,
  subtitle,
  icon,
  iconColor,
  actions,
}: {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor: string;
  actions?: React.ReactNode;
}) {
  if (!title && !icon) return null;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={`w-12 h-12 ${getIconColorClasses(
              iconColor
            )} rounded-xl flex items-center justify-center shadow-lg`}
          >
            <div className={`w-6 h-6 ${getIconTextColor(iconColor)}`}>
              {icon}
            </div>
          </div>
        )}
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
}

export const PrelineCard = forwardRef<HTMLDivElement, PrelineCardProps>(
  (
    {
      title,
      subtitle,
      children,
      actions,
      variant = "default",
      className = "",
      hover = false,
      icon,
      iconColor = "primary",
      padding = "md",
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${getVariantClasses(variant, hover)} ${getPaddingClasses(
          padding
        )} ${className}`}
      >
        <CardHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          iconColor={iconColor}
          actions={actions}
        />
        <div className={title || icon ? "" : "space-y-4"}>{children}</div>
      </div>
    );
  }
);

PrelineCard.displayName = "PrelineCard";
