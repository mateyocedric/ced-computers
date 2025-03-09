import {BentoGrid, BentoGridItem, BentoZoomedItem} from './ui/bento-grid';
import {Await, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from '@tabler/icons-react';

export function FeaturedProducts({data}: any) {
  console.log('data', data)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-1 md:px-3 lg:px-4 mt-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4 lg:ml-11">{data.title}</h2>
          <Link to={`/collections/${data.handle}`}>
            <div className="flex flex-row gap-1">
              <h2 className="text-md font-bold mb-4">SEE MORE</h2>
              <IconArrowNarrowRight />
            </div>
          </Link>
        </div>
        <BentoGrid
          className="w-auto mx-auto md:auto-rows-[20rem] lg:auto-rows-[35rem]"
          grid={4}
        >
          <Await resolve={data}>
            {(response) =>
              response
                ? response.products.nodes.map((product: any, key: any) => (
                    <BentoZoomedItem
                      key={key}
                      title={product.title}
                      image={product.images.nodes[0]}
                      price={product.priceRange.minVariantPrice}
                      compareAt={product.compareAtPriceRange.minVariantPrice}
                      available={product.availableForSale}
                      handle={product.handle}
                    />
                  ))
                : null
            }
          </Await>
        </BentoGrid>
      </div>
    </Suspense>
  );
}
