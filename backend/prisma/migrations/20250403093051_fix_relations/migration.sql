/*
  Warnings:

  - You are about to drop the `_ClassGroupToStudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `class` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ClassGroupToStudent" DROP CONSTRAINT "_ClassGroupToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassGroupToStudent" DROP CONSTRAINT "_ClassGroupToStudent_B_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "class" TEXT NOT NULL,
ADD COLUMN     "classGroupId" INTEGER,
ADD COLUMN     "fullName" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ClassGroupToStudent";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classGroupId_fkey" FOREIGN KEY ("classGroupId") REFERENCES "ClassGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
