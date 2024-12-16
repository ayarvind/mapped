/*
  Warnings:

  - You are about to drop the column `geoLocationid` on the `Clicks` table. All the data in the column will be lost.
  - You are about to drop the `GeoLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clicks" DROP CONSTRAINT "Clicks_geoLocationid_fkey";

-- AlterTable
ALTER TABLE "Clicks" DROP COLUMN "geoLocationid";

-- DropTable
DROP TABLE "GeoLocation";
