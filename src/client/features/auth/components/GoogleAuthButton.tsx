"use client";

import { useState } from "react";
import { Chrome } from "lucide-react";
import { PrelineButton } from "../../../common/components/ui/PrelineButton";
import { signInWithGoogle } from "@/server/features/auth/actions";

interface GoogleAuthButtonProps {
  text?: string;
  className?: string;
}

export function GoogleAuthButton({
  text = "Sign in with Google",
  className = "w-full justify-center",
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PrelineButton
      variant="secondary"
      size="lg"
      className={className}
      onClick={handleGoogleAuth}
      loading={isLoading}
      icon={<Chrome />}
    >
      {text}
    </PrelineButton>
  );
}
