-- AlterTable
ALTER TABLE "UrlShortener" ADD COLUMN     "clicksCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastAccessed" TIMESTAMP(3);
