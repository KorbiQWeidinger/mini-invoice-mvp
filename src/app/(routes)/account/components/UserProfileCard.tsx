"use client";

import { User, Calendar } from "lucide-react";
import { PrelineCard } from "../../../../client/common/components/ui/PrelineCard";

interface UserProfileCardProps {
  user: {
    name: string;
    email: string;
    avatar: string | null;
    joinDate: string;
  };
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  return (
    <PrelineCard variant="outlined" className="mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-text-on-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {user.name}
          </h2>
          <p className="text-text-secondary">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-text-tertiary" />
            <span className="text-sm text-text-tertiary">
              Member since {user.joinDate}
            </span>
          </div>
        </div>
      </div>
    </PrelineCard>
  );
};
