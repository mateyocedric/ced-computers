'use client';
import 'react-range-slider-input/dist/style.css';
import {useState, Suspense, useEffect} from 'react';
import {Link, Await} from '@remix-run/react';
import {Sidebar, SidebarBody, SidebarContent} from './ui/sidebar';
import {
  BentoGrid,
  BentoGridItem,
  BentoGridFeatured,
  BentoZoomedItem,
} from './ui/bento-grid';
import {
  IconArrowLeft,
  IconCashBanknote,
  IconSeparator,
  IconCategory2,
  IconCircle,
  IconFilter,
  IconTallymark4,
  IconTallymark3,
  IconTallymark2,
  IconTallymark1,
} from '@tabler/icons-react';
import {motion} from 'framer-motion';
import {cn} from '~/lib/utils';

import {useMediaQuery} from 'react-responsive';

import RangeSlider from 'react-range-slider-input';

export function SidebarDemo({
  collectionsData,
  productsData,
}: {
  collectionsData: any;
  productsData: any;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto overflow-hidden mt-5',
        'h-full', // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 ">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* {open ? <Logo /> : <LogoIcon />} */}
            <div className="flex flex-col gap-2">
              <SidebarContent
                label="Price"
                icon={
                  <IconCashBanknote className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
                }
                content={<PriceFilter />}
              />
              <SidebarContent
                label="Collection"
                icon={
                  <IconCategory2 className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
                }
                content={<Collections collections={collectionsData} />}
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard products={productsData} />
    </div>
  );
}
export const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <IconFilter className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      <motion.span
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        className="font-medium text-black dark:text-white"
      >
        Product Filters
      </motion.span>
    </div>
  );
};
export const LogoIcon = () => {
  return (
    <IconFilter className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
  );
};

// Dummy dashboard component with content
const Dashboard = ({products}: any) => {
  const [grid, setGrid] = useState(4);
  const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'});

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isTabletOrMobile);
  }, [isTabletOrMobile]);
  const columns = [
    {
      icon: (
        <IconTallymark4 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      value: 4,
    },
    {
      icon: (
        <IconTallymark3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      value: 3,
    },
    {
      icon: (
        <IconTallymark2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      value: 2,
    },

    {
      icon: (
        <IconTallymark1 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      value: 1,
    },
  ];
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl bg-white flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex justify-between">
          <div className="text-neutral-600 dark:text-neutral-200 text-3xl text-left font-bold">
            Products
          </div>
          {!isMobile && (
            <div className="inline-flex gap-1" role="group">
              {columns.map((column) => (
                <button
                  key={column.value}
                  onClick={() => setGrid(column.value)}
                  className="w-10 h-10 rounded-full border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 flex items-center justify-center"
                >
                  {column.icon}
                </button>
              ))}
            </div>
          )}
        </div>
        <Suspense
          fallback={
            <div className="grid md:grid-cols-4 grid-cols-1 gap-2">
              {[...new Array(8)].map((_, key) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={key}
                  className="h-[20rem] w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
                ></div>
              ))}
            </div>
          }
        >
          {!isMobile && (
            <BentoGrid
              className={`w-full mx-auto md:auto-rows-[${
                grid === 4
                  ? '23rem'
                  : grid === 3
                  ? '24rem'
                  : grid === 2
                  ? '26rem'
                  : '20rem'
              }]`}
              grid={grid}
            >
              <Await resolve={products}>
                {(response) =>
                  response
                    ? response.products.nodes.map((product: any, key: any) => {
                        return grid === 1 ? (
                          <BentoGridFeatured
                            key={key}
                            title={product.title}
                            description={product.description}
                            image={product.featuredImage}
                            price={product.priceRange.minVariantPrice}
                            compareAt={
                              product.compareAtPriceRange.minVariantPrice
                            }
                            handle={product.handle}
                            available={product.availableForSale}
                          />
                        ) : (
                          <BentoZoomedItem
                            key={key}
                            title={product.title}
                            image={product.featuredImage}
                            price={product.priceRange.minVariantPrice}
                            compareAt={
                              product.compareAtPriceRange.minVariantPrice
                            }
                            handle={product.handle}
                            available={product.availableForSale}
                          />
                        );
                      })
                    : null
                }
              </Await>
            </BentoGrid>
          )}

          {isMobile && (
            <BentoGrid grid={2}>
              <Await resolve={products}>
                {(response) =>
                  response
                    ? response.products.nodes.map((product: any, key: any) => {
                        return (
                          <BentoZoomedItem
                            key={key}
                            title={product.title}
                            image={product.featuredImage}
                            price={product.priceRange.minVariantPrice}
                            compareAt={
                              product.compareAtPriceRange.minVariantPrice
                            }
                            available={product.availableForSale}
                            handle={product.handle}
                          />
                        );
                      })
                    : null
                }
              </Await>
            </BentoGrid>
          )}
        </Suspense>
      </div>
    </div>
  );
};

const PriceFilter = () => {
  const [value, setValue] = useState([1, 100000]);

  const handleMinPriceChange = (e: any) => {
    const newValue = e.target.value ? parseInt(e.target.value, 10) : 1;
    setValue([newValue, value[1]]);
  };

  const handleMaxPriceChange = (e: any) => {
    const newValue = e.target.value ? parseInt(e.target.value, 10) : 1;
    setValue([value[0], newValue]);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className="mr-2">
      <div className="flex flex-row items-center gap-1 mb-2">
        <input
          type="number"
          id="minPrice"
          name="min_price"
          placeholder="min"
          value={value[0]}
          onChange={handleMinPriceChange}
          className="mt-1 w-24 h-8 p-2 rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
        />
        <IconSeparator />
        <input
          type="number"
          id="maxPrice"
          name="max_price"
          placeholder="max"
          value={value[1]}
          onChange={handleMaxPriceChange}
          className="mt-1 w-24 h-8 p-2 rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
        />
      </div>
      <RangeSlider
        id="range-slider-gradient"
        value={value}
        min={1}
        max={100000}
        onInput={(newValue: any) => setValue(newValue)}
        step={1}
      />
      <div className="flex justify-between mt-2">
        <p className="text-sm">{formatNumber(value[0])}</p>
        <p className="text-sm">{formatNumber(value[1])}</p>
      </div>
    </div>
  );
};

const Collections = ({collections}: any) => {
  return (
    <div className="w-auto">
      <div className="flex flex-col gap-2">
        {collections.nodes.map((collection: any) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            style={{
              textDecoration: 'none',
            }}
            // className="group relative flex cursor-pointer rounded-lg bg-black/5 py-4 px-5 text-black shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-black/10"
          >
            <div className="flex w-full items-center justify-between">
              <div className="text-sm/5">
                <div className="flex flex-row gap-1 items-center">
                  <IconCircle className="text-black/60 dark:text-neutral-200 h-4 w-4 flex-shrink-0" />
                  <p className="font-normal text-black/60 hover:text-black/50">
                    {collection.title}
                  </p>
                </div>
              </div>
              <IconArrowLeft className="size-6 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
