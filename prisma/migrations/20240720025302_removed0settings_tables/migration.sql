/*
  Warnings:

  - You are about to drop the `WishlistButtonSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WishlistSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WishlistButtonSettings";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WishlistSettings";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishedProducts" (
    "productId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAddedToCart" BOOLEAN NOT NULL DEFAULT false,
    "addToCartDate" DATETIME,
    "isPurchased" BOOLEAN NOT NULL DEFAULT false,
    "purchaseDate" BOOLEAN,

    PRIMARY KEY ("productId", "customerId", "shopDomain")
);
INSERT INTO "new_WishedProducts" ("addToCartDate", "createdAt", "customerId", "isAddedToCart", "isPurchased", "productId", "productName", "purchaseDate", "shopDomain") SELECT "addToCartDate", "createdAt", "customerId", "isAddedToCart", "isPurchased", "productId", "productName", "purchaseDate", "shopDomain" FROM "WishedProducts";
DROP TABLE "WishedProducts";
ALTER TABLE "new_WishedProducts" RENAME TO "WishedProducts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
