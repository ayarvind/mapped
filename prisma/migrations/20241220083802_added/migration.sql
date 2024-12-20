/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Topics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Topics_name_key" ON "Topics"("name");
