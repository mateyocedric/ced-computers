import {useState} from 'react';
import {cn} from '~/lib/utils';
import {Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {ShoppingCart} from 'lucide-react';
import {Lens} from './lens';

import {motion} from 'framer-motion';
export const BentoGrid = ({
  className,
  children,
  grid = 3,
}: {
  className?: string;
  grid?: number;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `grid md:auto-rows-[18rem] grid-cols-${
          grid || '1'
        } md:grid-cols-${grid} lg:grid-cols-${grid} gap-2`,
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridFeatured = ({
  available,
  className,
  title,
  description,
  price,
  compareAt,
  image,
  handle,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  price?: any | React.ReactNode;
  compareAt?: any | React.ReactNode;
  image?: any | React.ReactNode;
  handle?: any | React.ReactNode;
}) => {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      className={cn(
        'row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-[#f5f5f5] border border-transparent flex flex-row gap-10 space-y-4',
        'backdrop-filter backdrop-blur-lg bg-opacity-30',
        className,
      )}
    >
      <Lens hovering={hovering} setHovering={setHovering}>
        <Image
          data={image}
          alt="image"
          width={700}
          height={700}
          aspectRatio="1:1"
          className="rounded-2xl"
        />
      </Lens>
      <motion.div
        animate={{
          filter: hovering ? 'blur(2px)' : 'blur(0px)',
        }}
        className="py-4 relative z-20"
      >
        <div className="flex flex-col">
          <div className="group-hover/bento:translate-x-2 transition duration-200">
            <div className="text-neutral-600 dark:text-neutral-200 text-2xl text-left font-bold mb-2 mt-2">
              {title}
            </div>
            <p className="font-sans font-normal text-neutral-600 dark:text-neutral-200 mb-3 mt-2">
              {description}
            </p>
            <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300 flex flex-row">
              <Money data={price} />
              {compareAt.amount !== '0.0' && (
                <span className="ml-2 text-neutral-500 dark:text-neutral-400 line-through">
                  <Money data={compareAt} />
                </span>
              )}
            </div>

            {available ? (
              <Link to={`/products/${handle}`}>
                <button className="bg-slate-800 mt-3 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                    <span>Add to cart</span>
                    <ShoppingCart size={10} />
                  </div>
                  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                </button>
              </Link>
            ) : (
              <button
                className="bg-slate-800 mt-3 no-underline group cursor-not-allowed relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block opacity-50"
                disabled
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500" />
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
                  <span>Out of stock</span>
                  <ShoppingCart size={10} />
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 opacity-0 transition-opacity duration-500" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  price,
  compareAt,
  image,
  handle,
}: {
  className?: string;
  title?: string | React.ReactNode;
  price?: any | React.ReactNode;
  compareAt?: any | React.ReactNode;
  image?: any | React.ReactNode;
  handle?: any | React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-[#f5f5f5] border border-transparent justify-between flex flex-col space-y-4',
        'backdrop-filter backdrop-blur-lg bg-opacity-30',
        className,
      )}
    >
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
        <Image
          data={image}
          className="rounded-xl object-fit w-auto h-auto"
          aspectRatio="1/1"
          sizes="(min-width: 45em) 20vw, 50vw"
        />
      </div>
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300 flex flex-row">
          <Money data={price} />
          {compareAt.amount !== '0.0' && (
            <span className="ml-2 text-neutral-500 dark:text-neutral-400 line-through">
              <Money data={compareAt} />
            </span>
          )}
        </div>

        <Link to={`/products/${handle}`}>
          <button className="bg-slate-800 mt-3 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
              <span>Add to cart</span>
              <ShoppingCart size={10} />
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export const BentoZoomedItem = ({
  available,
  title,
  price,
  compareAt,
  image,
  handle,
}: {
  available?: boolean;
  className?: string;
  title?: string | React.ReactNode;
  price?: any | React.ReactNode;
  compareAt?: any | React.ReactNode;
  image?: any | React.ReactNode;
  handle?: any | React.ReactNode;
}) => {
  const [hovering, setHovering] = useState(false);
  return (
    <div>
      <div className="w-full relative rounded-lg lg:rounded-3xl overflow-hidden max-w-md mx-auto bg-[#f5f5f5] border border-transparent backdrop-filter backdrop-blur-lg bg-opacity-30 p-2 lg:p-8 my-2">
        {/* <Rays />
        <Beams /> */}
        <div className="relative z-10">
          <Lens hovering={hovering} setHovering={setHovering}>
            <Image
              data={image}
              alt="image"
              width={'100%'}
              height={'100%'}
              aspectRatio="1:1"
              className="rounded-2xl"
            />
          </Lens>
          <motion.div
            animate={{
              filter: hovering ? 'blur(2px)' : 'blur(0px)',
            }}
            className="py-4 relative z-20"
          >
            <h2 className="w-24 lg:w-64 text-neutral-600 dark:text-neutral-200 text-sm lg:text-2xl text-left font-bold truncate">
              {title}
            </h2>
            <div className="text-neutral-600 text-xs dark:text-neutral-300 text-left mt-2 lg:mt-4 flex flex-row">
              <Money data={price} />
              {compareAt.amount !== '0.0' && (
                <span className="ml-2 text-neutral-500 dark:text-neutral-400 line-through">
                  <Money data={compareAt} />
                </span>
              )}
            </div>

            {available ? (
              <Link to={`/products/${handle}`}>
                <button className="bg-slate-800 mt-3 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                    <span>Add to cart</span>
                    <ShoppingCart size={10} />
                  </div>
                  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                </button>
              </Link>
            ) : (
              <button
                className="bg-slate-800 mt-3 no-underline group cursor-not-allowed relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block opacity-50"
                disabled
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500" />
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
                  <span>Out of stock</span>
                  <ShoppingCart size={10} />
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 opacity-0 transition-opacity duration-500" />
              </button>
            )}
            {/* <p className="text-neutral-200 text-left  mt-4">
              The all new apple vision pro was the best thing that happened
              around 8 months ago, not anymore.
            </p> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
