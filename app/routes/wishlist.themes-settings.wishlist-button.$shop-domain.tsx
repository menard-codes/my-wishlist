import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
    await authenticate.admin(request);

    const { shopDomain } = params;

    if (!shopDomain) {
        return json({ error: 'Bad request' }, { status: 400 });
    }

    try {
        const wishlistBtnSettings = await db.wishlistButtonSettings.findFirst({
            where: { shopDomain }
        });
        return json({ data: wishlistBtnSettings });
    } catch (error) {
        // TODO: Logger
        console.error(error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}
