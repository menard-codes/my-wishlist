import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";

export async function action({ request, response, params }: ActionFunctionArgs) {
    await authenticate.admin(request);

    const { customerId } = params;

    if (!customerId) {
        return json({ error: 'Bad request' }, { status: 400 });
    }

    switch (request.method) {
        case "GET": {
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
        default: {
            return json({ error: 'Not implemented' }, { status: 501 })
        }
    }
}
