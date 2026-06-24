-- Create the new enum with all desired values
CREATE TYPE "UserRole_new" AS ENUM ('RETAIL_INVESTOR', 'TRADER', 'LEARNER', 'ANALYST', 'PLATFORM_ADMIN');

-- Add a temporary column with the new enum type
ALTER TABLE "User" ADD COLUMN "role_new" "UserRole_new";

-- Map old values to new values
UPDATE "User" SET "role_new" = CASE
  WHEN "role"::text = 'ADMIN' THEN 'PLATFORM_ADMIN'::"UserRole_new"
  ELSE 'RETAIL_INVESTOR'::"UserRole_new"
END;

-- Set NOT NULL after populating
ALTER TABLE "User" ALTER COLUMN "role_new" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "role_new" SET DEFAULT 'RETAIL_INVESTOR'::"UserRole_new";

-- Drop the old column and enum
ALTER TABLE "User" DROP COLUMN "role";
DROP TYPE "UserRole";

-- Rename new enum and column to original names
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
ALTER TABLE "User" RENAME COLUMN "role_new" TO "role";
