import type { ReactNode } from 'react';
import { HeaderSimple, type HeaderSimpleProps } from './parts/HeaderSimple';
import {
  HeaderWithSubmenu,
  type HeaderWithSubmenuProps,
} from './parts/HeaderWithSubmenu';
import { FooterFull, type FooterFullProps } from './parts/FooterFull';

type SimpleVariant = {
  headerVariant: 'simple';
  header?: Omit<HeaderSimpleProps, 'variant'> & { variant?: HeaderSimpleProps['variant'] };
};

type SubmenuVariant = {
  headerVariant: 'with-submenu';
  header: HeaderWithSubmenuProps;
};

export type LandingPageProps = {
  footer?: FooterFullProps | 'none';
  children: ReactNode;
} & (SimpleVariant | SubmenuVariant);

/**
 * Default page template: <Header> + <main> + <Footer>.
 *
 * Header variants:
 *   - `simple`         : single nav row, optional `variant: 'overlay'` for
 *                        transparent header over a hero section.
 *   - `with-submenu`   : announcement bar (optional) + nav row + tabs bar.
 *
 * The `<main>` element uses `grid-template` (no built-in vertical gap) so
 * full-bleed sections (`col-full bg-...`) can butt against each other
 * without a stripe of canvas colour showing through. Each section is
 * responsible for its own `py-fluid-*` padding.
 */
export function LandingPage(props: LandingPageProps) {
  const { footer, children } = props;

  return (
    <>
      {props.headerVariant === 'simple' ? (
        <HeaderSimple {...(props.header ?? {})} />
      ) : (
        <HeaderWithSubmenu {...props.header} />
      )}

      <main className="grid-template gap-y-0">{children}</main>

      {footer !== 'none' && <FooterFull {...(footer ?? {})} />}
    </>
  );
}
