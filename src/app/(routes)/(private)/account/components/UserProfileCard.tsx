"use client";

import { User as UserIcon, Calendar } from "lucide-react";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { User } from "@supabase/auth-js";

export const UserProfileCard = ({ user }: { user: User }) => {
  return (
    <PrelineCard variant="outlined" className="mb-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-text-on-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {user.user_metadata.name}
          </h2>
          <p className="text-text-secondary">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-text-tertiary" />
            <span className="text-sm text-text-tertiary">
              {/* TODO: Add the user's join date */}
              Member since 01/07/2025
            </span>
          </div>
        </div>
      </div>
    </PrelineCard>
  );
};
