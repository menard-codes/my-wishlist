import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
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

export async function action({ request, params }: ActionFunctionArgs) {
    await authenticate.admin(request);

    const { shopDomain } = params;

    if (!shopDomain) {
        return json({ error: 'Bad request' }, { status: 400 });
    }

    const formData = await request.formData();

    switch (request.method) {
        case "POST": {
            const {errors} = checkRequiredFormFields(formData, [
                "shopDomain",
                "inactiveColor",
                "activeColor",
                "marginTop",
                "marginBottom",
                "marginRight",
                "marginLeft",
                "alignment"
            ]);
            if (Object.keys(errors).length > 0) {
                return json({ error: 'Bad request' }, { status: 400 });
            }
            const checkAlignmentValue = ["left", "center", "right"].includes(String(formData.get("alignment")).toLowerCase());
            if (!checkAlignmentValue) {
                return json({ error: 'Bad request', message: 'alignment value must be either: left, center, or right' }, { status: 400 });
            }

            try {
                const data = Object.fromEntries(formData);
                const wishlistBtnSettings = await db.wishlistButtonSettings.create({
                    data: {
                        shopDomain: data.shopDomain.toString(),
                        label: data.label.toString(),
                        inactiveColor: data.inactiveColor.toString(),
                        activeColor: data.activeColor.toString(),
                        marginTop: Number(data.marginTop) || 0,
                        marginBottom: Number(data.marginBottom) || 0,
                        marginLeft: Number(data.marginLeft) || 0,
                        marginRight: Number(data.marginRight) || 0,
                        alignment: data.alignment.toString().toLowerCase()
                    }
                });
                return json({ data: wishlistBtnSettings }, { status: 201 });
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
