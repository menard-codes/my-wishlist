import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
// import { authenticate } from "~/shopify.server";
import { getURLSearchParams, checkRequiredObjectProps } from "~/utils/route-utils.server";
import db from "~/db.server";
import { cors } from "remix-utils/cors";

export async function action({ request }: ActionFunctionArgs) {
    // await authenticate.admin(request);
    
    switch (request.method) {
        case "POST": {
            // TODO: I think I should rethink this and see if the existing required searchParams is more ideal in the body

            const searchParams = getURLSearchParams(request.url);
            const {errors} = checkRequiredObjectProps(searchParams, ["productId", "customerId", "shopDomain"]);
            if (Object.keys(errors).length > 0) {
                return json({ errors }, { status: 400 });
            }

            let body;
            try {
                body = await request.json();
            } catch (error) {
                return json({ error: '400 - Bad Request', message: 'Invalid request body' }, { status: 400 });
            }

            if (!body.productName) {
                return json({ error: 'productName is required in the request body json' }, { status: 400 });
            }

            try {
                const wishlishtedProduct = await db.wishedProducts.create({
                    data: {
                        productId: String(searchParams.productId),
                        customerId: String(searchParams.customerId),
                        shopDomain: String(searchParams.shopDomain),
                        productName: String(body.productName)
                    }
                });
                const response = json({ data: wishlishtedProduct }, { status: 201 });
                return cors(request, response);
            } catch (error) {
                // TODO: Logger
                console.error(error);
                return json({ error: 'Internal server error' }, { status: 500 });
            }
        }
        case "DELETE": {
            const searchParams = getURLSearchParams(request.url);
            const {errors} = checkRequiredObjectProps(searchParams, ["productId", "customerId", "shopDomain"]);
            if (Object.keys(errors).length > 0) {
                return json({ errors }, { status: 400 });
            }

            try {
                await db.wishedProducts.deleteMany({
                    where: {
                        productId: String(searchParams.productId),
                        customerId: String(searchParams.customerId),
                        shopDomain: String(searchParams.shopDomain),
                    }
                });
                const respones = json({});
                return cors(request, respones);
            } catch (error) {
                // TODO: Logger
                console.error(error);
                return json({ error: 'Internal server error' }, { status: 500 });
            }
        }
        default: {
            return json({ error: 'Not implemented' }, { status: 501 });
        }
    }
}

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const searchParams = getURLSearchParams(request.url);
        const {errors} = checkRequiredObjectProps(searchParams, ["productId", "customerId", "shopDomain"]);
        if (Object.keys(errors).length > 0) {
            return json({ errors }, { status: 400 });
        }

        const totalRecord = await db.wishedProducts.count({
            where: {
                productId: String(searchParams.productId),
                customerId: String(searchParams.customerId),
                shopDomain: String(searchParams.shopDomain)
            }
        });
        const response = json({ wishlisted: totalRecord >= 1 });
        return cors(request, response);
    } catch (error) {
        // TODO: Logger
        console.error(error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * To do:
 * 1. Learn CORS in the context of Shopify Remix, especially for apps
 * 2. Where to get the productName, and can it be sent by the app block
 * 3. Proxy
 */
