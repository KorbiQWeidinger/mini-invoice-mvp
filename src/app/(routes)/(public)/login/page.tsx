"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Chrome,
  ArrowRight,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { PrelineInput } from "@/client/common/components/ui/PrelineInput";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { login, signup, signUpWithGoogle } from "./actions";

export default function AuthPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validateSignupForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateSignupForm()) return;

    setIsSignupLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("fullName", formData.fullName);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);

      await signup(formDataObj);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSignupLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;

    setIsLoginLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);

      await login(formDataObj);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      await signUpWithGoogle();
    } catch (error) {
      console.error("Google auth error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome to Invoice Manager
          </h1>
          <p className="text-text-secondary">
            Create an account or sign in to get started
          </p>
        </div>

        <PrelineCard variant="elevated" padding="lg" className="space-y-6">
          {/* Signup Form */}
          <div className="space-y-4">
            {/* Full Name */}
            <PrelineInput
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(value) => updateFormData("fullName", value)}
              error={errors.fullName}
              icon={<User className="w-4 h-4" />}
              name="fullName"
            />

            {/* Email */}
            <PrelineInput
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(value) => updateFormData("email", value)}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
              name="email"
            />

            {/* Password */}
            <div className="relative">
              <PrelineInput
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(value) => updateFormData("password", value)}
                error={errors.password}
                icon={<Lock className="w-4 h-4" />}
                name="password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <PrelineButton
                variant="primary"
                size="lg"
                className="flex-1 justify-center"
                onClick={handleSignup}
                loading={isSignupLoading}
                icon={<ArrowRight />}
              >
                Sign Up
              </PrelineButton>
              <PrelineButton
                variant="secondary"
                size="lg"
                className="flex-1 justify-center"
                onClick={handleLogin}
                loading={isLoginLoading}
                icon={<LogIn />}
              >
                Log In
              </PrelineButton>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-primary" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-bg-secondary text-text-secondary">
                Or
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <PrelineButton
            variant="secondary"
            size="lg"
            className="w-full justify-center"
            onClick={handleGoogleAuth}
            loading={isGoogleLoading}
            icon={<Chrome />}
          >
            Sign in with Google
          </PrelineButton>

          {/* Terms and Privacy */}
          <p className="text-xs text-text-secondary text-center">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="text-brand-primary hover:text-brand-primary-hover underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-brand-primary hover:text-brand-primary-hover underline"
            >
              Privacy Policy
            </Link>
          </p>
        </PrelineCard>

        {/* Forgot Password Link */}
        <div className="text-center mt-6">
          <Link
            href="/forgot-password"
            className="text-sm text-brand-primary hover:text-brand-primary-hover transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
