"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <PrelineCard variant="elevated" padding="lg" className="space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-status-error-bg rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-status-error" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-text-primary">
              Oops! Something went wrong
            </h1>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link href="/dashboard">
              <PrelineButton
                variant="primary"
                size="lg"
                className="w-full justify-center"
                icon={<ArrowLeft />}
              >
                Back to App
              </PrelineButton>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-text-secondary">
            If this problem persists, please{" "}
            <Link
              href="/contact"
              className="text-brand-primary hover:text-brand-primary-hover underline"
            >
              contact support
            </Link>
          </p>
        </PrelineCard>
      </div>
    </div>
  );
}
