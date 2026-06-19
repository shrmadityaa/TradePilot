import { BriefcaseBusiness, Building2, MapPin, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyProfile as CompanyProfileType } from "@/lib/stocks";

type CompanyProfileProps = {
  profile: CompanyProfileType;
};

export function CompanyProfile({ profile }: CompanyProfileProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20 pb-5">
        <CardTitle>Company Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase text-muted-foreground">
            Overview
          </p>
          <p className="leading-7 text-muted-foreground">{profile.description}</p>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
      </CardContent>
    </Card>
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
    <div className="flex gap-3 rounded-lg border bg-background p-3.5">
      <dt className="mt-0.5 text-primary">{icon}</dt>
      <dd className="min-w-0">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold leading-5">{children}</p>
      </dd>
    </div>
  );
}

export function CompanyProfileSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20 pb-5">
        <div className="h-7 w-44 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="rounded-lg border bg-background p-3.5" key={index}>
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-5 w-32 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
