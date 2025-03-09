import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {SearchProduct} from './SearchProduct';
import {IconLogin, IconUser, IconShoppingCart} from '@tabler/icons-react';
import {useMediaQuery} from 'react-responsive';
import {Image} from '@shopify/hydrogen';
interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'});

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isTabletOrMobile);
  }, [isTabletOrMobile]);

  return (
    <>
      {!isMobile && (
        <header className="h-42 px-10 bg-gradient-to-r from-red-500 to-orange-500">
          <div className="px-5 z-50">
            <div className="flex flex-row align-center justify-between mt-2">
              <div className="flex items-center flex-row gap-1">
                <Image
                  src={shop.brand?.logo?.image?.url || ''}
                  alt={shop.name}
                  width={70}
                  height={70}
                  className="cursor-pointer"
                  aspectRatio="1:1"
                />
                <h1 className="text-2xl font-bold text-center text-white">
                  {shop.name}
                </h1>
              </div>

              <div className="flex-grow flex items-center justify-center">
                <div className="w-10/12">
                  <SearchProduct isMobile={isMobile} />
                </div>
              </div>
              <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
            </div>

            <div className="mt-2 mb-4">
              <HeaderMenu
                menu={menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            </div>
          </div>
        </header>
      )}
      {isMobile && (
        <header className="h-52 p-6  md:p-5 lg:p-5 bg-gradient-to-r from-red-500 to-orange-500 top-0">
          <div className="flex justify-between mb-2 z-50">
            <Image
              src={shop.brand?.logo?.image?.url || ''}
              alt={shop.name}
              width={70}
              height={70}
              className="cursor-pointer"
              aspectRatio="1:1"
            />
            <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          </div>
          <SearchProduct isMobile={isMobile} />
          <div className="flex justify-center mt-4 md:mt-5 lg:mt-4">
            <HeaderMenu
              menu={menu}
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </div>
        </header>
      )}
    </>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  return (
    <nav role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            to={url}
            style={{textDecoration: 'none', position: 'relative'}} // Relative positioning on NavLink
            className={({isActive}) =>
              isActive
                ? 'text-[#EEEEEE] text-md md:text-lg lg:text-lg font-semibold font-sans px-5 before:content-[""] before:absolute before:left-[-1px] before:top-1/2 before:transform before:-translate-y-1/2 before:w-3 before:h-3 before:bg-orange-900 before:rounded-full before:opacity-100 before:transition-all before:duration-300 before:ease-in-out'
                : 'text-white/50 hover:text-white/80 text-md md:text-lg lg:text-lg font-semibold font-sans px-5 before:content-[""] before:absolute before:left-[-1px] before:top-1/2 before:transform before:-translate-y-1/2 before:w-3 before:h-3 before:bg-transparent before:rounded-full before:opacity-0 before:transition-all before:duration-300 before:ease-in-out'
            }
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      {/* <HeaderMenuMobileToggle /> */}
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) =>
              isLoggedIn ? (
                <IconUser className="text-[#EEEEEE] h-6 w-6 lg:h-8 lg:w-8 md:w-8 md:w-8 lg:h-8 lg:h-8 md:h-8 md:h-8 flex-shrink-0" />
              ) : (
                <IconLogin className="text-[#EEEEEE] h-6 w-6 lg:h-8 lg:w-8 md:w-8 md:w-8 lg:h-8 lg:h-8 md:h-8 md:h-8 flex-shrink-0" />
              )
            }
          </Await>
        </Suspense>
      </NavLink>
      {/* <SearchToggle /> */}
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative me-4"
    >
      <IconShoppingCart className="text-[#EEEEEE] h-6 w-6 lg:h-8 lg:w-8 md:w-8 md:w-8 lg:h-8 lg:h-8 md:h-8 md:h-8 flex-shrink-0" />
      <span className="bottom-4 start-8 inline-flex items-center justify-center absolute w-6 h-6 bg-red-500 text-white border-2 border-white dark:border-gray-800 rounded-full">
        {count}
      </span>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
