/*
  Warnings:

  - Added the required column `productName` to the `WishedProducts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishedProducts" (
    "productId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAddedToCart" BOOLEAN NOT NULL,
    "addToCartDate" DATETIME,
    "isPurchased" BOOLEAN NOT NULL,
    "purchaseDate" BOOLEAN,

    PRIMARY KEY ("productId", "customerId", "shopDomain")
);
INSERT INTO "new_WishedProducts" ("addToCartDate", "createdAt", "customerId", "isAddedToCart", "isPurchased", "productId", "purchaseDate", "shopDomain") SELECT "addToCartDate", "createdAt", "customerId", "isAddedToCart", "isPurchased", "productId", "purchaseDate", "shopDomain" FROM "WishedProducts";
DROP TABLE "WishedProducts";
ALTER TABLE "new_WishedProducts" RENAME TO "WishedProducts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
