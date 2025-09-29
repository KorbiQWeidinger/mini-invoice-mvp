"use client";

import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { GoogleAuthButton } from "@/client/features/auth/components/GoogleAuthButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome to Invoice Buddy
          </h1>
          <p className="text-text-secondary">
            Sign in or create an account to get started
          </p>
        </div>

        <PrelineCard variant="elevated" padding="lg" className="space-y-6">
          {/* Google Authentication */}
          <div className="text-center space-y-4">
            <p className="text-text-secondary">
              Get started with your Google account
            </p>
            <GoogleAuthButton text="Continue with Google" />
          </div>
        </PrelineCard>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-text-secondary">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
