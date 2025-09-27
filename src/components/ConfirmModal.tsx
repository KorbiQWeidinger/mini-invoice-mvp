"use client";

import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getVariantClasses = () => {
    switch (variant) {
      case "danger":
        return {
          button: "bg-error hover:bg-error focus:ring-error",
          icon: "text-error",
          textColor: "text-text-on-error",
        };
      case "warning":
        return {
          button: "bg-warning hover:bg-warning focus:ring-warning",
          icon: "text-warning",
          textColor: "text-text-on-warning",
        };
      case "info":
        return {
          button: "bg-info hover:bg-info focus:ring-info",
          icon: "text-info",
          textColor: "text-text-on-primary",
        };
      default:
        return {
          button: "bg-error hover:bg-error focus:ring-error",
          icon: "text-error",
          textColor: "text-text-on-error",
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <div
      className="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 size-full fixed top-0 start-0 z-[80] opacity-0 overflow-x-hidden overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all ease-in-out duration-300 fixed inset-0 flex items-center min-h-screen px-4">
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all ease-in-out duration-300 relative flex flex-col bg-bg-primary w-full max-w-md border border-border-primary shadow-lg rounded-xl">
          {/* Header */}
          <div className="flex justify-between items-center py-3 px-4 border-b border-border-primary">
            <h3 className="font-bold text-text-primary">{title}</h3>
            <button
              type="button"
              className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-border-primary text-text-secondary hover:bg-bg-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="flex-shrink-0 w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto">
            <div className="flex items-center gap-x-3">
              <div className={`flex-shrink-0 ${variantClasses.icon}`}>
                <AlertTriangle className="flex-shrink-0 w-8 h-8" />
              </div>
              <div className="grow">
                <div className="text-sm text-text-primary">{message}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-border-primary">
            <button
              type="button"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-border-primary text-text-secondary bg-bg-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent ${variantClasses.textColor} ${variantClasses.button} disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
