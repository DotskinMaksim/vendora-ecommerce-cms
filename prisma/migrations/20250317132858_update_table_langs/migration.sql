/*
  Warnings:

  - You are about to drop the column `lang_code` on the `langs` table. All the data in the column will be lost.
  - You are about to drop the column `lang_flag_image_url` on the `langs` table. All the data in the column will be lost.
  - Added the required column `code` to the `langs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `langs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "langs" DROP COLUMN "lang_code",
DROP COLUMN "lang_flag_image_url",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "flag_image_url" TEXT,
ADD COLUMN     "is_using" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL;
