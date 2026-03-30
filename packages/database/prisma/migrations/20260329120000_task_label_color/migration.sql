-- CreateEnum
CREATE TYPE "TaskLabelColor" AS ENUM ('NONE', 'SLATE', 'RED', 'ORANGE', 'AMBER', 'GREEN', 'BLUE', 'VIOLET', 'ROSE');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN "labelColor" "TaskLabelColor" NOT NULL DEFAULT 'NONE';
