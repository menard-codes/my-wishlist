import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
    await authenticate.admin(request);

    const { customerId } = params;

    if (!customerId) {
        return json({ error: 'Bad request', message: 'customerId URL param is required' }, { status: 400 });
    }

    try {
        const wishlist = await db.wishedProducts.findMany({
            where: { customerId }
        });
        return json({ data: wishlist });
    } catch (error) {
        // TODO: Logger
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}
