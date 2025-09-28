"use client";

import { X, AlertTriangle } from "lucide-react";
import { PrelineButton } from "./PrelineButton";
import { PrelineIconButton } from "./PrelineIconButton";
import { useEffect, useRef } from "react";

interface PrelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  // Controls whether clicking on the backdrop closes the modal
  closeOnBackdrop?: boolean;
  // Vertical placement: 'top' | 'center' | number (0..1 -> fraction of viewport height)
  placement?: "top" | "center" | number;
  // Custom width classes, e.g. 'w-full max-w-2xl'
  widthClass?: string;
}

export function PrelineModal({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  placement = "center",
  widthClass = "sm:max-w-lg sm:w-full",
}: PrelineModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Show the modal by removing hidden class and adding open class
      modalRef.current.classList.remove("hidden");
      modalRef.current.classList.add("hs-overlay-open");
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else if (modalRef.current) {
      // Hide the modal by adding hidden class and removing open class
      modalRef.current.classList.add("hidden");
      modalRef.current.classList.remove("hs-overlay-open");
      // Restore body scroll
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getOverlayClasses = () => {
    // Applied to the main overlay container for proper centering
    if (placement === "center") {
      return "flex items-center justify-center";
    }
    if (placement === "top") {
      return "flex items-start justify-center pt-7";
    }
    if (typeof placement === "number") {
      return "flex items-start justify-center";
    }
    return "flex items-center justify-center";
  };

  const getPositionWrapper = () => {
    // Wrapper controls the vertical placement of the dialog container
    if (placement === "center") {
      return "";
    }
    if (placement === "top") {
      return "";
    }
    if (typeof placement === "number") {
      // Use inline style via style prop below; return class for spacing/x-centering only
      return "";
    }
    return "";
  };

  const fractionOffset =
    typeof placement === "number"
      ? Math.max(0, Math.min(1, placement))
      : undefined;

  return (
    <div
      ref={modalRef}
      className={`hs-overlay hidden w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto ${getOverlayClasses()}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop: intercepts clicks to prevent page interaction */}
      <div
        className="fixed inset-0 z-0 opacity-100 transition-opacity duration-300 bg-[color:var(--color-overlay)] backdrop-blur-md"
        onClick={() => closeOnBackdrop && onClose()}
      ></div>

      <div
        className={`relative z-10 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 transition-all ease-in-out duration-300 ${widthClass} m-3 ${getPositionWrapper()}`}
        style={
          fractionOffset !== undefined
            ? { marginTop: `${fractionOffset * 100}vh` }
            : undefined
        }
      >
        <div
          ref={dialogRef}
          className="flex flex-col bg-bg-primary border border-border-primary shadow-lg rounded-xl pointer-events-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Subcomponents
interface HeaderProps {
  title?: string;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

function PrelineModalHeader({
  title,
  onClose,
  className = "",
  children,
}: HeaderProps) {
  return (
    <div
      className={`flex justify-between items-center py-3 px-4 border-b border-border-primary ${className}`}
    >
      {title ? (
        <h3 className="font-bold text-text-primary">{title}</h3>
      ) : (
        children
      )}
      {onClose && (
        <PrelineIconButton
          title="Close"
          size="md"
          variant="secondary"
          icon={<X className="w-4 h-4" />}
          onClick={onClose}
        />
      )}
    </div>
  );
}

interface BodyProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

function PrelineModalBody({
  children,
  className = "",
  noPadding = false,
}: BodyProps) {
  return (
    <div className={`${noPadding ? "" : "p-4"} overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}

interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

function PrelineModalFooter({ children, className = "" }: FooterProps) {
  return (
    <div
      className={`flex justify-end items-center gap-x-2 py-3 px-4 border-t border-border-primary ${className}`}
    >
      {children}
    </div>
  );
}

// Compound component pattern
PrelineModal.Header = PrelineModalHeader;
PrelineModal.Body = PrelineModalBody;
PrelineModal.Footer = PrelineModalFooter;

// Legacy confirmation modal component
interface PrelineConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function PrelineConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: PrelineConfirmationModalProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-error",
        };
      case "warning":
        return {
          icon: "text-warning",
        };
      case "info":
        return {
          icon: "text-info",
        };
      default:
        return {
          icon: "text-error",
        };
    }
  };

  const variantClasses = getVariantClasses();

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "danger":
        return "danger" as const;
      case "warning":
        return "warning" as const;
      case "info":
      default:
        return "primary" as const;
    }
  };

  return (
    <PrelineModal isOpen={isOpen} onClose={onClose}>
      <PrelineModal.Header title={title} onClose={onClose} />
      <PrelineModal.Body>
        <div className="flex items-center gap-x-3">
          <div className={`flex-shrink-0 ${variantClasses.icon}`}>
            <AlertTriangle className="flex-shrink-0 w-8 h-8" />
          </div>
          <div className="grow">
            <div className="text-sm text-text-primary">{message}</div>
          </div>
        </div>
      </PrelineModal.Body>
      <PrelineModal.Footer>
        <PrelineButton variant="secondary" onClick={onClose}>
          {cancelText}
        </PrelineButton>
        <PrelineButton variant={getConfirmButtonVariant()} onClick={onConfirm}>
          {confirmText}
        </PrelineButton>
      </PrelineModal.Footer>
    </PrelineModal>
  );
}
