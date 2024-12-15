-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "googleSignInId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomAlias" (
    "id" SERIAL NOT NULL,
    "alias" TEXT NOT NULL,
    "urlShortenerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrlShortener" (
    "id" SERIAL NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "customAliasId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiration" TIMESTAMP(3),

    CONSTRAINT "UrlShortener_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoLocation" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GeoLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clicks" (
    "id" SERIAL NOT NULL,
    "userIp" TEXT NOT NULL,
    "userOs" TEXT NOT NULL,
    "userDevice" TEXT NOT NULL,
    "geoLocationid" INTEGER,
    "urlShortenerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TopicsToUrlShortener" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TopicsToUrlShortener_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleSignInId_key" ON "User"("googleSignInId");

-- CreateIndex
CREATE INDEX "nameIndex" ON "Topics"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomAlias_alias_key" ON "CustomAlias"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "CustomAlias_urlShortenerId_key" ON "CustomAlias"("urlShortenerId");

-- CreateIndex
CREATE INDEX "aliasIndex" ON "CustomAlias"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortener_shortUrl_key" ON "UrlShortener"("shortUrl");

-- CreateIndex
CREATE INDEX "shortUrlIndex" ON "UrlShortener"("shortUrl");

-- CreateIndex
CREATE INDEX "longUrlIndex" ON "UrlShortener"("longUrl");

-- CreateIndex
CREATE INDEX "latitudeIndex" ON "GeoLocation"("latitude");

-- CreateIndex
CREATE INDEX "longitudeIndex" ON "GeoLocation"("longitude");

-- CreateIndex
CREATE INDEX "urlShortenerIdIndex" ON "Clicks"("urlShortenerId");

-- CreateIndex
CREATE INDEX "userIpIndex" ON "Clicks"("userIp");

-- CreateIndex
CREATE INDEX "userOsIndex" ON "Clicks"("userOs");

-- CreateIndex
CREATE INDEX "userDeviceIndex" ON "Clicks"("userDevice");

-- CreateIndex
CREATE INDEX "createdAtIndex" ON "Clicks"("createdAt");

-- CreateIndex
CREATE INDEX "_TopicsToUrlShortener_B_index" ON "_TopicsToUrlShortener"("B");

-- AddForeignKey
ALTER TABLE "Topics" ADD CONSTRAINT "Topics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomAlias" ADD CONSTRAINT "CustomAlias_urlShortenerId_fkey" FOREIGN KEY ("urlShortenerId") REFERENCES "UrlShortener"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlShortener" ADD CONSTRAINT "UrlShortener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clicks" ADD CONSTRAINT "Clicks_geoLocationid_fkey" FOREIGN KEY ("geoLocationid") REFERENCES "GeoLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clicks" ADD CONSTRAINT "Clicks_urlShortenerId_fkey" FOREIGN KEY ("urlShortenerId") REFERENCES "UrlShortener"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TopicsToUrlShortener" ADD CONSTRAINT "_TopicsToUrlShortener_A_fkey" FOREIGN KEY ("A") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TopicsToUrlShortener" ADD CONSTRAINT "_TopicsToUrlShortener_B_fkey" FOREIGN KEY ("B") REFERENCES "UrlShortener"("id") ON DELETE CASCADE ON UPDATE CASCADE;
