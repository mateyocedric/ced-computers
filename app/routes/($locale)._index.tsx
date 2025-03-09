import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import type {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {WobbleCard} from '~/components/ui/wobble-card';
import {FeaturedProducts} from '~/components/FeaturedProducts';
import {RecommendedCollection} from '~/components/RecommendedCollection';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {FeaturesSectionDemo} from '~/components/FeaturesSectionDemo';
import {Hero} from '~/components/Hero';
import HoverDevCards from '~/components/ui/hover-cards';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [featuredResponse, recommendedResponse, featuredCollectionProducts] =
    await Promise.all([
      context.storefront.query(FEATURED_COLLECTION_QUERY),
      context.storefront.query(RECOMMENDED_COLLECTION_QUERY),
      context.storefront.query(FEATURED_COLLECTION_PRODUCTS),
    ]);

  const featuredCollections = featuredResponse.collections;
  const recommendedCollections = recommendedResponse.collections;
  const featuredProductsCollections = featuredCollectionProducts.collections;

  return {
    featuredCollection: featuredCollections,
    recommendedCollection: recommendedCollections,
    featuredProductsCollection: featuredProductsCollections,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] mt-10">
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedCollection collection={data.recommendedCollection} />
      <FeaturedProducts data={data.featuredProductsCollection.nodes[0]} />
      {/* <HoverDevCards /> */}
      <FeaturesSectionDemo />
      <FeaturedProducts data={data.featuredProductsCollection.nodes[1]} />
      {/* <Hero /> */}
    </div>
  );
}

function FeaturedCollection({collection}: {collection: any}) {
  if (!collection) return null;

  const colPosition = (key: any) => {
    switch (key) {
      case 0:
        return 'col-span-1 lg:col-span-2 h-full bg-gradient-to-r from-red-500 to-orange-500 min-h-[500px] lg:min-h-[300px]';
      case 1:
        return 'col-span-1 min-h-[300px]';
      case 2:
        return 'col-span-1 lg:col-span-3 bg-gradient-to-r from-pink-500 to-rose-500 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]';
      default:
        return 'col-span-1 lg:col-span-2 h-full bg-gradient-to-r from-slate-900 to-slate-700 min-h-[500px] lg:min-h-[300px]';
    }
  };

  const featuredCollection = collection?.nodes.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      {featuredCollection.map(
        (
          node: {
            title:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | null
              | undefined;
            description:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | null
              | undefined;
            handle: any;
            image: {url: string | undefined};
          },
          index: any,
        ) => (
          <WobbleCard
            key={index}
            containerClassName={colPosition(index)}
            // className="[background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))]"
          >
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                {node.title}
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                {node.description}
              </p>
              <Link
                className="mt-5 relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                to={`/collections/${node.handle}`}
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Browse
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
              </Link>
            </div>
            {index % 2 === 0 && (
              <Image
                src={node?.image?.url}
                alt="linear demo image"
                height={300}
                width={500}
                className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
              />
            )}
          </WobbleCard>
        ),
      )}
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
fragment FeaturedCollection on Collection {
  id
  title
  description
  image {
    id
    url
    altText
    width
    height
  }
  handle
}
query FeaturedCollection($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  collections(first: 3, sortKey: UPDATED_AT, reverse: true, query: "(title:AMD) OR (title:Intel) OR (title:MSI)") {
    nodes {
      ...FeaturedCollection
    }
  }
}
` as const;

const RECOMMENDED_COLLECTION_QUERY = `#graphql
fragment RecommendedCollection on Collection {
  id
  title
  description
  image {
    id
    url
    altText
    width
    height
  }
  handle
}
query RecommendedCollection($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  collections(first: 100, sortKey: UPDATED_AT, reverse: true, query: "NOT title:'MSI' AND NOT title:'AMD' AND NOT title:'Intel' AND NOT title:'Featured Collection'") {
    nodes {
      ...RecommendedCollection
    }
  }
}
` as const;

const FEATURED_COLLECTION_PRODUCTS = `#graphql
fragment FeaturedCollectionProducts on Collection {
  id
  title
  description
  image {
    id
    url
    altText
    width
    height
  }
  products(first: 7) {
    nodes {
      id
      title
      handle
      availableForSale
      priceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      compareAtPriceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      images(first: 1) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      endCursor
      startCursor
    }
  }
  handle
}

query FeaturedCollectionProducts($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  collections(
    first: 100
    sortKey: UPDATED_AT
    reverse: true
    query: "(title:'Top Sellers') OR (title:'New Arrivals')"
  ) {
    nodes {
      ...FeaturedCollectionProducts
    }
  }
}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      maxVariantPrice {
        currencyCode
        amount
      }
      minVariantPrice {
        currencyCode
        amount
      }
    }
    compareAtPriceRange {
      maxVariantPrice {
        currencyCode
        amount
      }
      minVariantPrice {
        currencyCode
        amount
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 5, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
