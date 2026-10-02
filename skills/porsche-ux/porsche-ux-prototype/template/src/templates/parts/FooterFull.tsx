import {
  PHeading,
  PLinkPure,
  PText,
  PWordmark,
} from '@porsche-design-system/components-react';

export interface FooterColumn {
  title: string;
  links: { label: string; href?: string }[];
}

export interface FooterFullProps {
  columns?: FooterColumn[];
  legalLinks?: { label: string; href?: string }[];
  copyright?: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Legal Services',
    links: [
      { label: 'Terms and Conditions' },
      { label: 'Privacy Notice' },
      { label: 'Imprint and Legal Notice' },
      { label: 'Accessibility Statement' },
      { label: 'Open Source Software Notice' },
    ],
  },
  {
    title: 'Porsche Design',
    links: [
      { label: 'Press' },
      { label: 'Jobs and Careers' },
      { label: 'Studio F. A. Porsche' },
      { label: 'Data Privacy' },
    ],
  },
  {
    title: 'Online Services',
    links: [
      { label: 'My Orders' },
      { label: 'Porsche Homepage' },
      { label: 'Porsche Car Configurator' },
      { label: 'Find a dealer' },
    ],
  },
];

const DEFAULT_LEGAL = [
  { label: 'Legal notice' },
  { label: 'Privacy notice' },
  { label: 'Accessibility Statement' },
];

export function FooterFull({
  columns = DEFAULT_COLUMNS,
  legalLinks = DEFAULT_LEGAL,
  copyright = `© ${new Date().getFullYear()} Porsche AG`,
}: FooterFullProps) {
  return (
    <footer className="grid-template py-fluid-lg bg-surface">
      <nav
        className="col-extended grid xs:grid-cols-2 md:grid-cols-3 gap-x-fluid-md gap-y-fluid-lg mt-fluid-sm mb-fluid-lg"
        aria-label="Footer"
      >
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-fluid-sm">
            <PHeading tag="h3" size="2xs" color="contrast-medium">
              {col.title}
            </PHeading>
            <ul className="grid gap-fluid-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <PLinkPure icon="none">
                    <a href={l.href ?? '#'}>{l.label}</a>
                  </PLinkPure>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="col-extended grid gap-fluid-md justify-items-center mt-fluid-md">
        <PWordmark />
        <PText size="xx-small" color="contrast-medium">
          {copyright}
        </PText>
        <ul className="flex flex-wrap justify-center gap-fluid-md">
          {legalLinks.map((l) => (
            <li key={l.label}>
              <PLinkPure icon="none" size="x-small" underline>
                <a href={l.href ?? '#'}>{l.label}</a>
              </PLinkPure>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
