import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { checkRequiredFormFields } from "~/utils/route-utils.server";
import db from "~/db.server";

export async function action({ request, response }: LoaderFunctionArgs) {
    await authenticate.admin(request);

    const formData = await request.formData();

    switch (request.method) {
        case "POST": {
            const errors = checkRequiredFormFields(formData, ["productId", "customerId", "shopDomain"]);
            if (Object.keys(errors).length > 0) {
                return json({ errors }, { status: 400 });
            }

            try {
                const wishlishtedProduct = await db.wishedProducts.create({
                    data: {
                        productId: String(formData.get("productId")),
                        customerId: String(formData.get("customerId")),
                        shopDomain: String(formData.get("shopDomain")),
                        isAddedToCart: false,
                        isPurchased: false
                    }
                });
                return { data: wishlishtedProduct };
            } catch (error) {
                // TODO: Logger
                console.error(error);
                return json({ error: 'Internal server error' }, { status: 500 });
            }
        }
        case "DELETE": {
            const errors = checkRequiredFormFields(formData, ["productId", "customerId", "shopDomain"]);
            if (Object.keys(errors).length > 0) {
                return json({ errors }, { status: 400 });
            }

            try {
                await db.wishedProducts.delete({
                    where: {
                        productId_customerId_shopDomain:{
                            productId: String(formData.get("productId")),
                            customerId: String(formData.get("customerId")),
                            shopDomain: String(formData.get("shopDomain")),
                        }
                    }
                });
                return json({ message: 'No content' }, { status: 204 });
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
