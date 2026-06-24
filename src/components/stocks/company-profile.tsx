import { BriefcaseBusiness, Building2, MapPin, UserRound } from "lucide-react";
import type { CompanyProfile as CompanyProfileType } from "@/lib/stocks";

type CompanyProfileProps = {
  profile: CompanyProfileType;
};

export function CompanyProfile({ profile }: CompanyProfileProps) {
  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Company Profile</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {profile.description}
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <ProfileFact icon={<BriefcaseBusiness className="h-4 w-4" />} label="Industry">
          {profile.industry}
        </ProfileFact>
        <ProfileFact icon={<Building2 className="h-4 w-4" />} label="Sector">
          {profile.sector}
        </ProfileFact>
        <ProfileFact icon={<MapPin className="h-4 w-4" />} label="Headquarters">
          {profile.headquarters}
        </ProfileFact>
        <ProfileFact icon={<UserRound className="h-4 w-4" />} label="CEO">
          {profile.ceo}
        </ProfileFact>
      </dl>
    </section>
  );
}

function ProfileFact({
  children,
  icon,
  label
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border bg-background p-3">
      <dt className="mt-0.5 text-primary">{icon}</dt>
      <dd className="min-w-0">
        <p className="text-xs font-medium uppercase text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium">{children}</p>
      </dd>
    </div>
  );
}

export function CompanyProfileSkeleton() {
  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <div className="h-6 w-36 animate-pulse rounded bg-muted" />
        <div className="mt-2 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="rounded-lg border bg-background p-3" key={index}>
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}
