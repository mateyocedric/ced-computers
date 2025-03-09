import {Suspense, useState} from 'react';
import {motion} from 'framer-motion';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  Link,
  useLoaderData,
  type MetaFunction,
  type FetcherWithComponents,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
  type OptimisticCartLine,
  Analytics,
  type CartViewPayload,
  useAnalytics,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/lib/variants';
import {useAside} from '~/components/Aside';
import {Lens} from '~/components/ui/lens';
import {Carousel} from '~/components/ui/apple-cards-carousel';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
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
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    variants,
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;
  const [activeImage, setActiveImage] = useState(null);

  const handleImageChange = (image: string) => {
    //@ts-ignore
    setActiveImage(image);
  };

  return (
    <div className="h-auto p-5 lg:p-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex flex-col items-start">
          <ProductImage image={activeImage || selectedVariant?.image} />
          {selectedVariant.product.images && (
            <ImageCollections
              handleImageChange={handleImageChange}
              images={selectedVariant.product.images.nodes}
            />
          )}
        </div>
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
        />
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

function ImageCollections({
  images,
  handleImageChange,
}: {
  images: any[];
  handleImageChange: (image: any) => void;
}) {
  const card = images.map((image, idx) => (
    <ImageCard handleImageChange={handleImageChange} image={image} key={idx} />
  ));

  return <Carousel items={card} />;
}

function ImageCard({
  image,
  handleImageChange,
}: {
  image: any;
  handleImageChange: (image: any) => void;
}) {
  return (
    <motion.div
      onClick={() => handleImageChange(image)}
      style={{
        rotate: Math.random() * 20 - 10,
      }}
      whileHover={{
        scale: 1.1,
        rotate: 0,
        zIndex: 100,
      }}
      whileTap={{
        scale: 1.1,
        rotate: 0,
        zIndex: 100,
      }}
      className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
    >
      <Image
        data={image}
        alt="bali images"
        width="500"
        height="500"
        className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
      />
    </motion.div>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  const [hovering, setHovering] = useState(false);
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="lg:w-[500px] lg:height-[500px]">
      <Lens hovering={hovering} setHovering={setHovering}>
        <Image
          alt={image.altText || 'Product Image'}
          aspectRatio="1/1"
          data={image}
          key={image.id}
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </Lens>
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery | null>;
}) {
  const {title, descriptionHtml} = product;
  return (
    // <div className="product-main">
    //   <h1>{title}</h1>
    //   <ProductPrice selectedVariant={selectedVariant} />
    //   <br />
    //   <Suspense
    //     fallback={
    //       <ProductForm
    //         product={product}
    //         selectedVariant={selectedVariant}
    //         variants={[]}
    //       />
    //     }
    //   >
    //     <Await
    //       errorElement="There was a problem loading product variants"
    //       resolve={variants}
    //     >
    //       {(data) => (
    //         <ProductForm
    //           product={product}
    //           selectedVariant={selectedVariant}
    //           variants={data?.product?.variants.nodes || []}
    //         />
    //       )}
    //     </Await>
    //   </Suspense>
    //   <br />
    //   <br />
    //   <p>
    //     <strong>Description</strong>
    //   </p>
    //   <br />
    //   <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
    //   <br />
    // </div>
    <div className="lg:w-3/5">
      <div className="flex flex-col items-start gap-2">
        <div className="text-3xl text-neutral-600 font-semibold">{title}</div>
        <ProductPrice selectedVariant={selectedVariant} />
        <div className="text-xl text-neutral-600 font-semibold">
          Available: &nbsp;
          <span
            className={`${
              selectedVariant?.availableForSale
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {selectedVariant?.availableForSale ? 'Instock' : 'Out of stock'}
          </span>
        </div>
        <div className="w-full h-[1px] bg-slate-200 mt-5" />
        <div className="text-3xl text-neutral-600 font-semibold">
          Description
        </div>
        <div
          className="text-lg text-neutral-600"
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
        <Suspense
          fallback={
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={[]}
            />
          }
        >
          <Await
            errorElement="There was a problem loading product variants"
            resolve={variants}
          >
            {(data) => (
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={data?.product?.variants.nodes || []}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div>
      {selectedVariant?.compareAtPrice ? (
        <div className="flex flex-row gap-2">
          {selectedVariant ? (
            <div className="text-2xl text-neutral-600 font-semibold">
              <Money data={selectedVariant.price} />
            </div>
          ) : null}
          <div className="text-lg text-neutral-400 font-semibold line-through">
            <Money data={selectedVariant.compareAtPrice} />
          </div>
        </div>
      ) : (
        selectedVariant?.price && (
          <div className="text-2xl text-neutral-600 font-semibold">
            <Money data={selectedVariant?.price} />
          </div>
        )
      )}
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
          publish('cart_viewed', {
            cart,
            prevCart,
            shop,
            url: window.location.href || '',
          } as CartViewPayload);
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="flex flex-col gap-2 mt-5" key={option.name}>
      <div className="text-lg font-semibold">{option.name}</div>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={`px-4 py-2 rounded-md border text-sm transform transition duration-200 
            ${
              isActive
                ? 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                : 'border-neutral-300 bg-neutral-100 text-neutral-500'
            }
            hover:shadow-md hover:-translate-y-1`}
              key={`${option.name}-${value}`}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                textDecoration: 'none',
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLine>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              {children}
            </span>
          </button>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
