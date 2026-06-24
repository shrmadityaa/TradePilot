"use client";

import { useState } from "react";
import { TrendingUp, GraduationCap, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIGNUP_ROLES, type SignupRole } from "@/lib/validations/auth";

const ROLE_CONFIG: Record<
  SignupRole,
  { label: string; description: string; icon: typeof TrendingUp }
> = {
  RETAIL_INVESTOR: {
    label: "Retail Investor",
    description: "Understand stocks and market events",
    icon: TrendingUp
  },
  TRADER: {
    label: "Trader",
    description: "Track signals and alerts",
    icon: LineChart
  },
  LEARNER: {
    label: "Learner",
    description: "Understand trading concepts",
    icon: GraduationCap
  }
};

type RoleSelectorProps = {
  error?: string;
};

export function RoleSelector({ error }: RoleSelectorProps) {
  const [selected, setSelected] = useState<SignupRole | "">("");

  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium">I am a</legend>
      <input type="hidden" name="role" value={selected} />
      <div className="grid grid-cols-3 gap-2">
        {SIGNUP_ROLES.map((role) => {
          const config = ROLE_CONFIG[role];
          const Icon = config.icon;
          const isSelected = selected === role;

          return (
            <button
              key={role}
              type="button"
              onClick={() => setSelected(role)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
              <span className="text-xs font-medium">{config.label}</span>
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="text-xs text-muted-foreground">
          {ROLE_CONFIG[selected].description}
        </p>
      )}
      {error ? (
        <span className="text-xs text-destructive">{error}</span>
      ) : null}
    </fieldset>
  );
}
