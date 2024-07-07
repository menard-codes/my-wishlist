import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Page,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../../shopify.server";
import { useLoaderData } from "@remix-run/react";
import {
  top10ConvertingWishedProducts,
  top10MostWishedProducts,
  top10LeastWishedProducts
} from "./analytics.server";

// chart
import BarChart from "./BarChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  try {
    const mostConverting = top10ConvertingWishedProducts(session.shop);
    const mostWished = top10MostWishedProducts(session.shop);
    const leastWished = top10LeastWishedProducts(session.shop);
    return json({
      mostConverting,
      mostWished,
      leastWished
    });
  } catch (error) {
      // TODO: Logger
      console.error(error);
      return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export default function Index() {
  // const data = useLoaderData<typeof loader>();
  // console.log(data);

  return (
    <Page>
      <Text as="h2" variant="headingXl">Dashboard</Text>
      <BarChart
        label="Wishlists"
        title="Most popular wishlists"
        chartData={[
          {
            label: "Skateboard",
            data: 15
          },
          {
            label: "T-shirt",
            data: 8
          },
          {
            label: "Phone case",
            data: 5
          }
        ]}
      />
    </Page>
  );
}
