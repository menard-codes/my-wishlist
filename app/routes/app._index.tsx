import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  return (
    <Page>
      <Text as="h2" variant="headingXl">Dashboard</Text>
    </Page>
  );
}
