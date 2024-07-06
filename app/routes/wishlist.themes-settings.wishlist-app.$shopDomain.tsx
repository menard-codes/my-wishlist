import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";
import { checkRequiredFormFields } from "~/utils/route-utils.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
    await authenticate.admin(request);

    const { shopDomain } = params;

    if (!shopDomain) {
        return json({ error: 'Bad request' }, { status: 400 });
    }

    try {
        const wishlistSettings = await db.wishlistSettings.findFirst({
            where: {
                shopDomain
            }
        });
        return json({ data: wishlistSettings });
    } catch (error) {
        // TODO: Logger
        console.error(error);
        return json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    await authenticate.admin(request);

    const { shopDomain } = params;

    if (!shopDomain) {
        return json({ error: 'Bad request' }, { status: 400 });
    }

    const formData = await request.formData();

    switch (request.method) {
        case "POST": {
            try {
                const {errors} = checkRequiredFormFields(formData, ["shopDomain", "format"]);
                if (Object.keys(errors).length > 0) {
                    return json({ errors }, { status: 400 });
                }

                const format = String(formData.get("format")).toLowerCase();
                const checkFormatValue = ["list", "grid"].includes(format);
                if (!checkFormatValue) {
                    return json({ error: 'Bad request', message: 'format value must be either: list or grid' }, { status: 400 });
                }

                const wishlistSettings = await db.wishlistSettings.create({
                    data: {
                        shopDomain,
                        format
                    }
                });
                return json({ data: wishlistSettings }, { status: 201 });
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
