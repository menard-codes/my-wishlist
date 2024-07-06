import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
    await authenticate.admin(request);

    const { shopDomain } = params;

    if (!shopDomain) {
        return json({ error: 'Bad request', message: 'shopDomain URL param is required' }, { status: 400 });
    }

    try {
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
        return json({ data: top10WishlistedProducts });
    } catch (error) {
        // TODO: Logger
        console.error(error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}
