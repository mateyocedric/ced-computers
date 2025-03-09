'use client';

import {PlaceholdersAndVanishInput} from './ui/placeholders-and-vanish-input';

import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';

export function SearchProduct({isMobile}: {isMobile: boolean}) {
  const placeholders = [
    'Start your search here!',
    'Looking for quality computer parts?',
    'Find the perfect components!',
    'Discover the best deals on computer hardware.',
    'Explore high-performance parts!',
  ];
  return (
    <div className="flex items-center flex-col">
      <PredictiveSearchForm className="max-w-xl mx-auto w-full">
        {({fetchResults, inputRef}) => (
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={fetchResults}
            onFocus={fetchResults}
            ref={inputRef}
            placeholder=""
            type="search"
          />
        )}
      </PredictiveSearchForm>
      <div
        className={`${
          !isMobile
            ? 'absolute top-14 w-full flex justify-center'
            : 'w-full flex justify-center fixed z-50 mt-10'
        }`}
      >
        <PredictiveSearchResults />
      </div>
    </div>
  );
}
