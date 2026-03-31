-- CreateEnum
CREATE TYPE "ThemeMode" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ColorScheme" AS ENUM ('DEFAULT', 'PASTEL_WARM', 'PASTEL_COOL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "colorScheme" "ColorScheme",
ADD COLUMN     "themeMode" "ThemeMode";
