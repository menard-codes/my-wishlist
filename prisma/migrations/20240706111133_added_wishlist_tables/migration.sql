-- CreateTable
CREATE TABLE "WishedProducts" (
    "productId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAddedToCart" BOOLEAN NOT NULL,
    "addToCartDate" DATETIME,
    "isPurchased" BOOLEAN NOT NULL,
    "purchaseDate" BOOLEAN,

    PRIMARY KEY ("productId", "customerId", "shopDomain")
);

-- CreateTable
CREATE TABLE "WishlistButtonSettings" (
    "shopDomain" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT,
    "inactiveColor" TEXT NOT NULL,
    "activeColor" TEXT NOT NULL,
    "marginTop" INTEGER NOT NULL DEFAULT 0,
    "marginBottom" INTEGER NOT NULL DEFAULT 0,
    "marginLeft" INTEGER NOT NULL DEFAULT 0,
    "marginRight" INTEGER NOT NULL DEFAULT 0,
    "alignment" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WishlistSettings" (
    "shopDomain" TEXT NOT NULL PRIMARY KEY,
    "format" TEXT NOT NULL
);
