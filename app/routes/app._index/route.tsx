import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Page,
  Text,
  Card
} from "@shopify/polaris";
import { authenticate } from "../../shopify.server";
import { useLoaderData, useRouteError } from "@remix-run/react";
import {
  top10ConvertingWishedProducts,
  top10MostWishedProducts,
  top10LeastWishedProducts
} from "./analytics.server";
import styles from "./styles.css?url";

// chart
import BarChart from "./BarChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles }
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  try {
    const mostConverting = await top10ConvertingWishedProducts(session.shop);
    const mostWished = await top10MostWishedProducts(session.shop);
    const leastWished = await top10LeastWishedProducts(session.shop);
    return json({
      mostConverting,
      mostWished,
      leastWished
    });
  } catch (error) {
      // TODO: Logger
      console.error(error);
      throw new Response("Internal Server Error", { status: 500 });
  }
};

export default function Index() {
  const { mostConverting, leastWished, mostWished } = useLoaderData<typeof loader>();

  const error = useRouteError();
  if (error) {
    return <h1>Something went wrong...</h1>
  }

  const mostConvertingDataset = mostConverting.map(({ productName, totalWishlists }) => ({ label: productName as string, data: totalWishlists }));
  const leastWishedDataset = leastWished.map(({ productName, totalWishlists }) => ({ label: productName as string, data: totalWishlists }));
  const mostWishedDataset = mostWished.map(({ productName, totalWishlists }) => ({ label: productName as string, data: totalWishlists }));

  return (
    <Page>
      <Text as="h2" variant="headingXl">Dashboard</Text>
      {
        mostConvertingDataset.length > 0
          ? (
            <BarChart
              label="Wishlists"
              title="Most converting wishlists"
              chartData={mostConvertingDataset}
            />
          ) : (
            <Card>
              <Text as="h3" variant="headingLg">Most Converting wishlists</Text>
              <Text as="p">No Data...</Text>
            </Card>
          )
      }
      <div className="popularity-graphs-container">
        {
          mostWishedDataset.length > 0
            ? (
              <BarChart
                label="Wishlists"
                title="Most popular wishlists"
                chartData={mostWishedDataset}
              />
            ) : (
              <Card>
                <Text as="h3" variant="headingLg">Most Popular wishlists</Text>
                <Text as="p">No Data...</Text>
              </Card>
            )
        }
        {
          leastWishedDataset.length > 0
            ? (
              <BarChart
                label="Wishlists"
                title="least popular wishlists"
                chartData={leastWishedDataset}
              />
            ) : (
              <Card>
                <Text as="h3" variant="headingLg">Least Converting wishlists</Text>
                <Text as="p">No Data...</Text>
              </Card>
            )
        }
      </div>
    </Page>
  );
}
