import db from "~/db.server";

export async function top10ConvertingWishedProducts(shopDomain: string) {
    const convertingProductsByTotalWishlists = await db.wishedProducts.groupBy({
        _count: {
            productId: true
        },
        where: {
            shopDomain,
            isPurchased: true
        },
        by: ['productId'],
        orderBy: {
            _count: {
                productId: 'desc'
            }
        },
        take: 10
    });
    const productIds = convertingProductsByTotalWishlists.map(item => item.productId);
    const topWishlists = await db.wishedProducts.findMany({
        where: {
            productId: {
                in: productIds
            },
            shopDomain
        },
        select: {
            productId: true,
            customerId: true,
            shopDomain: true,
            createdAt: true,
            isAddedToCart: true,
            addToCartDate: true,
            isPurchased: true,
            purchaseDate: true
        }
    });

    const top10WishlistedProducts = convertingProductsByTotalWishlists.map(countItem => {
        const row = topWishlists.find(item => item.productId === countItem.productId);
        return {
            ...row,
            totalWishlists: countItem._count.productId
        }
    });
    return top10WishlistedProducts;
}

export async function top10MostWishedProducts(shopDomain: string) {
    const productsByTotalWishlists = await db.wishedProducts.groupBy({
        _count: {
            productId: true
        },
        where: {
            shopDomain
        },
        by: ['productId'],
        orderBy: {
            _count: {
                productId: 'desc'
            }
        },
        take: 10
    });
    const productIds = productsByTotalWishlists.map(item => item.productId);
    const topWishlists = await db.wishedProducts.findMany({
        where: {
            productId: {
                in: productIds
            },
            shopDomain
        },
        select: {
            productId: true,
            customerId: true,
            shopDomain: true,
            createdAt: true,
            isAddedToCart: true,
            addToCartDate: true,
            isPurchased: true,
            purchaseDate: true
        }
    });

    const top10WishlistedProducts = productsByTotalWishlists.map(countItem => {
        const row = topWishlists.find(item => item.productId === countItem.productId);
        return {
            ...row,
            totalWishlists: countItem._count.productId
        }
    });
    return top10WishlistedProducts;
}

export async function top10LeastWishedProducts(shopDomain: string) {
    const productsByTotalWishlists = await db.wishedProducts.groupBy({
        _count: {
            productId: true
        },
        where: {
            shopDomain
        },
        by: ['productId'],
        orderBy: {
            _count: {
                productId: 'asc'
            }
        },
        take: 10
    });
    const productIds = productsByTotalWishlists.map(item => item.productId);
    const topWishlists = await db.wishedProducts.findMany({
        where: {
            productId: {
                in: productIds
            },
            shopDomain
        },
        select: {
            productId: true,
            customerId: true,
            shopDomain: true,
            createdAt: true,
            isAddedToCart: true,
            addToCartDate: true,
            isPurchased: true,
            purchaseDate: true
        }
    });

    const top10WishlistedProducts = productsByTotalWishlists.map(countItem => {
        const row = topWishlists.find(item => item.productId === countItem.productId);
        return {
            ...row,
            totalWishlists: countItem._count.productId
        }
    });
    return top10WishlistedProducts;
}
