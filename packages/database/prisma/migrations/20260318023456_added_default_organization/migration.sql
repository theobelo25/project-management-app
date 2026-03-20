-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultOrganizationId" UUID;

-- CreateIndex
CREATE INDEX "User_defaultOrganizationId_idx" ON "User"("defaultOrganizationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultOrganizationId_fkey" FOREIGN KEY ("defaultOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
