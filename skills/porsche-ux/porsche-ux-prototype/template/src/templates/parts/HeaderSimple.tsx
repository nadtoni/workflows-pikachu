import type { ReactNode } from 'react';
import {
  PButtonPure,
  PCrest,
  PLinkPure,
  PWordmark,
} from '@porsche-design-system/components-react';

export type HeaderAction = 'search' | 'favorites' | 'cart' | 'user';

export interface HeaderSimpleProps {
  /**
   * 'overlay' = transparent, sits over hero (use with a full-bleed first
   * section that supplies its own dark background). Adds `scheme-dark`.
   * 'solid' = normal opaque header at the top of the page.
   */
  variant?: 'overlay' | 'solid';
  brandMark?: 'wordmark' | 'crest' | 'auto';
  actions?: HeaderAction[];
  /** Optional custom slot rendered before the brand mark (e.g. drilldown). */
  menuSlot?: ReactNode;
}

const RIGHT_ACTIONS: Record<HeaderAction, ReactNode> = {
  search: (
    <PButtonPure
      key="search"
      className="p-static-xs -m-static-xs"
      title="Search"
      icon="search"
      hideLabel
    >
      Search
    </PButtonPure>
  ),
  favorites: (
    <PLinkPure
      key="favorites"
      className="p-static-xs -m-static-xs"
      title="Favorites"
      icon="heart"
      hideLabel
    >
      <a href="#">Favorites</a>
    </PLinkPure>
  ),
  cart: (
    <PLinkPure
      key="cart"
      className="p-static-xs -m-static-xs"
      title="Shopping cart"
      icon="shopping-cart"
      hideLabel
    >
      <a href="#">Shopping cart</a>
    </PLinkPure>
  ),
  user: (
    <PButtonPure
      key="user"
      className="p-static-xs -m-static-xs"
      title="User"
      icon="user"
      hideLabel
    >
      User
    </PButtonPure>
  ),
};

export function HeaderSimple({
  variant = 'solid',
  brandMark = 'auto',
  actions = ['search', 'user'],
  menuSlot,
}: HeaderSimpleProps) {
  const isOverlay = variant === 'overlay';

  const overlayClasses = isOverlay
    ? 'z-1 absolute inset-x-0 before:absolute before:inset-[0_0_-60px_0] before:-z-1 before:pointer-events-none before:bg-fade-to-b'
    : '';
  const schemeClasses = isOverlay ? 'scheme-dark' : '';

  return (
    <header className={`grid-template ${overlayClasses}`.trim()}>
      <div className="col-wide grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-fluid-md items-center min-h-[80px]">
        <div className={`${schemeClasses} flex flex-wrap gap-static-md items-center justify-start`.trim()}>
          <nav aria-label="Main">
            <PButtonPure
              className="p-static-xs -m-static-xs"
              type="button"
              icon="menu-lines"
              hideLabel={{ base: true, s: false }}
            >
              Menu
            </PButtonPure>
          </nav>
          {menuSlot}
        </div>
        {brandMark !== 'wordmark' && (
          <PCrest className={`${schemeClasses} ${brandMark === 'auto' ? 'sm:hidden' : ''}`.trim()} href="#" />
        )}
        {brandMark !== 'crest' && (
          <PWordmark className={`${schemeClasses} ${brandMark === 'auto' ? 'max-sm:hidden' : ''}`.trim()} href="#" />
        )}
        <div className={`${schemeClasses} flex flex-wrap gap-static-md items-center justify-end`.trim()}>
          {actions.map((a) => RIGHT_ACTIONS[a])}
        </div>
      </div>
    </header>
  );
}
