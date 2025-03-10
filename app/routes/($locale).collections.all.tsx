import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import {SidebarDemo} from '~/components/CollectionLayout';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | Products`}];
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
// async function loadCriticalData({context, request}: LoaderFunctionArgs) {
//   const {storefront} = context;
//   const paginationVariables = getPaginationVariables(request, {
//     pageBy: 8,
//   });

//   const [{products}] = await Promise.all([
//     storefront.query(CATALOG_QUERY, {
//       variables: {...paginationVariables},
//     }),
//     // Add other queries here, so that they are loaded in parallel
//   ]);
//   return {products};
// }

async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [collectionsResponse] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY),
  ]);

  const collections = collectionsResponse.collections;

  return {
    collectionsData: collections,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */

function loadDeferredData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const productsData = context.storefront
    .query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    productsData,
  };
}

export default function Collection() {
  const {collectionsData, productsData} = useLoaderData<typeof loader>();

  return (
    // <div className="collection">
      // <h1>Productsss</h1>
    //   <Pagination connection={products}>
    //     {({nodes, isLoading, PreviousLink, NextLink}) => (
    //       <>
    //         <PreviousLink>
    //           {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
    //         </PreviousLink>
    //         <ProductsGrid products={nodes} />
    //         <br />
    //         <NextLink>
    //           {isLoading ? 'Loading...' : <span>Load more ↓</span>}
    //         </NextLink>
    //       </>
    //     )}
    //   </Pagination>
    // </div>
    <SidebarDemo
      collectionsData={collectionsData}
      productsData={productsData}
    />
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    description
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
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
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

const COLLECTIONS_QUERY = `#graphql
fragment Collections on Collection {
  id
  title
  handle
}

query Collections($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  collections(
    first: 100
    sortKey: UPDATED_AT
    reverse: true
    query: "NOT title:'MSI' AND NOT title:'AMD' AND NOT title:'Intel' AND NOT title:'Featured Collection' AND NOT title:'Top Sellers' AND NOT title:'New Arrivals'"
  ) {
    nodes {
      ...Collections
    }
  }
}
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2024-01/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      
    }
    
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
