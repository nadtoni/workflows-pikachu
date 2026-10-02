import type { ReactNode } from 'react';
import {
  PButtonPure,
  PCrest,
  PDivider,
  PLinkPure,
  PTabsBar,
  PText,
  PWordmark,
} from '@porsche-design-system/components-react';
import type { HeaderAction } from './HeaderSimple';

export interface SubmenuItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface HeaderWithSubmenuProps {
  brandMark?: 'wordmark' | 'crest' | 'auto';
  actions?: HeaderAction[];
  /** Optional top announcement bar text. Renders a dark band above the main bar. */
  announcement?: string;
  /** Submenu items rendered as a PTabsBar below the main bar. */
  submenu: SubmenuItem[];
  /** Optional custom slot rendered before the brand mark (e.g. drilldown). */
  menuSlot?: ReactNode;
}

const RIGHT_ACTIONS: Record<HeaderAction, ReactNode> = {
  search: (
    <PButtonPure
      key="search"
      className="p-static-xs -m-static-xs max-sm:hidden"
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
      className="p-static-xs -m-static-xs max-sm:hidden"
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

export function HeaderWithSubmenu({
  brandMark = 'auto',
  actions = ['search', 'favorites', 'cart', 'user'],
  announcement,
  submenu,
  menuSlot,
}: HeaderWithSubmenuProps) {
  return (
    <header className="grid-template gap-y-0">
      {announcement && (
        <div className="scheme-dark col-full flex justify-center py-static-xs px-static-md bg-surface">
          <PText size="x-small">{announcement}</PText>
        </div>
      )}

      <div className="col-wide grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-fluid-md items-center min-h-[80px]">
        <div className="flex flex-wrap gap-static-md items-center justify-start">
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
          <PButtonPure
            className="p-static-xs -m-static-xs sm:hidden"
            title="Search"
            icon="search"
            hideLabel
          >
            Search
          </PButtonPure>
        </div>
        {brandMark !== 'wordmark' && (
          <PCrest className={brandMark === 'auto' ? 'sm:hidden' : undefined} href="#" />
        )}
        {brandMark !== 'crest' && (
          <PWordmark className={brandMark === 'auto' ? 'max-sm:hidden' : undefined} href="#" />
        )}
        <div className="flex flex-wrap gap-static-md items-center justify-end">
          {actions.map((a) => RIGHT_ACTIONS[a])}
        </div>
      </div>

      <div className="col-full flex justify-center p-static-md border-t-thin border-contrast-low">
        <PTabsBar compact>
          <a href="#">All categories</a>
          <PDivider className="mx-static-md" direction="vertical" />
          {submenu.map((s, i) =>
            s.current ? (
              <a key={i} href={s.href ?? '#'} className="selected" aria-current="page">
                {s.label}
              </a>
            ) : (
              <a key={i} href={s.href ?? '#'}>
                {s.label}
              </a>
            )
          )}
        </PTabsBar>
      </div>
    </header>
  );
}
