-- DropForeignKey
ALTER TABLE "Clicks" DROP CONSTRAINT "Clicks_urlShortenerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomAlias" DROP CONSTRAINT "CustomAlias_urlShortenerId_fkey";

-- DropForeignKey
ALTER TABLE "Topics" DROP CONSTRAINT "Topics_userId_fkey";

-- DropForeignKey
ALTER TABLE "UrlShortener" DROP CONSTRAINT "UrlShortener_userId_fkey";

-- DropIndex
DROP INDEX "aliasIndex";

-- DropIndex
DROP INDEX "longUrlIndex";

-- CreateIndex
CREATE INDEX "expirationIndex" ON "UrlShortener"("expiration");

-- AddForeignKey
ALTER TABLE "Topics" ADD CONSTRAINT "Topics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomAlias" ADD CONSTRAINT "CustomAlias_urlShortenerId_fkey" FOREIGN KEY ("urlShortenerId") REFERENCES "UrlShortener"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlShortener" ADD CONSTRAINT "UrlShortener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clicks" ADD CONSTRAINT "Clicks_urlShortenerId_fkey" FOREIGN KEY ("urlShortenerId") REFERENCES "UrlShortener"("id") ON DELETE CASCADE ON UPDATE CASCADE;
