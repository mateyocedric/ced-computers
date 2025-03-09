import type {ReactNode} from 'react';
import {motion} from 'framer-motion';

export function FeaturesSectionDemo() {
  return <BouncyCardsFeatures />;
}

export const BouncyCardsFeatures = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-5 text-slate-800">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:px-8">
        <h2 className="max-w-lg text-4xl font-bold md:text-5xl">
          Gameiun Technology
          <span className="text-slate-400"> Experience Excellence</span>
        </h2>
      </div>
      <div className="mb-4 grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-4">
          <div className="flex flex-col gap-1">
            <h3 className="mx-auto text-center text-3xl font-semibold italic">
              Swift Delivery
            </h3>
            <span className="block text-center font-semibold text-neutral-500">
              Fast and Smooth Delivery Service
            </span>
          </div>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-violet-400 to-indigo-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-indigo-50">
              Fast and Smooth Delivery Service
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-8">
          <div className="flex flex-col gap-1">
            <h3 className="mx-auto text-center text-3xl font-semibold">
              24/7 Customer Support
            </h3>
            <span className="block text-center font-semibold text-neutral-500">
              Consistent and Invariable Chat Support System
            </span>
          </div>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-amber-400 to-orange-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-orange-50">
              FEATURE DEMO HERE
            </span>
          </div>
        </BounceCard>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-6">
          <div className="flex flex-col gap-1">
            <h3 className="mx-auto text-center text-3xl font-semibold">
              BIG Discounts
            </h3>
            <span className="block text-center font-semibold text-neutral-500">
              Top-tier Quality at the MOST Reasonable Deals
            </span>
          </div>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-green-400 to-emerald-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-emerald-50">
              FEATURE DEMO HERE
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-3">
          <div className="flex flex-col gap-1">
            <h3 className="mx-auto text-center text-2xl font-semibold">
              Premier Products
            </h3>
            <span className="block text-center text-sm font-semibold text-neutral-500">
              Finest and Leading Quality Products
            </span>
          </div>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-pink-400 to-red-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-red-50">
              FEATURE DEMO HERE
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-3">
          <div className="flex flex-col gap-1">
            <h3 className="mx-auto text-center text-lg font-semibold">
              Satisfaction Guaranteed
            </h3>
            <span className="block text-center  text-sm font-semibold text-neutral-500">
              Customer Appeasement is a Top Priority
            </span>
          </div>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-pink-400 to-red-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-red-50">
              FEATURE DEMO HERE
            </span>
          </div>
        </BounceCard>
      </div>
    </section>
  );
};

const BounceCard = ({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{scale: 0.95, rotate: '-1deg'}}
      className={`group relative min-h-[300px] cursor-pointer overflow-hidden rounded-2xl bg-slate-100 p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const CardTitle = ({children}: {children: ReactNode}) => {
  return (
    <h3 className="mx-auto text-center text-3xl font-semibold">{children}</h3>
  );
};
