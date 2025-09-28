"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

interface PrelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "centered" | "fullscreen";
  className?: string;
}

function ModalHeader({
  title,
  actions,
  onClose,
}: {
  title?: string;
  actions?: ReactNode;
  onClose: () => void;
}) {
  if (!title && !actions) return null;

  return (
    <div className="flex items-center justify-between p-6 border-b border-border-primary">
      {title && (
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      )}
      <div className="flex items-center gap-2">
        {actions}
        <button
          onClick={onClose}
          className="p-1 hover:bg-bg-hover rounded-lg transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>
      </div>
    </div>
  );
}

function getSizeClasses(size: string) {
  switch (size) {
    case "sm":
      return "max-w-sm";
    case "lg":
      return "max-w-2xl";
    case "xl":
      return "max-w-4xl";
    case "md":
    default:
      return "max-w-md";
  }
}

function getVariantClasses(variant: string) {
  switch (variant) {
    case "fullscreen":
      return "h-full w-full max-w-none rounded-none";
    case "default":
      return "rounded-xl";
    case "centered":
    default:
      return "rounded-xl";
  }
}

export function PrelineModal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = "md",
  variant = "centered",
  className = "",
}: PrelineModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-bg-primary border border-border-primary shadow-2xl w-full ${getSizeClasses(
          size
        )} ${getVariantClasses(variant)} ${className}`}
      >
        <ModalHeader title={title} actions={actions} onClose={onClose} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
