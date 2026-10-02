import type { ReactNode } from 'react';
import {
  PCanvas,
  PHeading,
} from '@porsche-design-system/components-react';

export interface AdminPanelProps {
  /** Title shown in the top bar / browser tab. */
  title: string;
  /** Sidebar content — typically a nav. */
  sidebar?: ReactNode;
  /** Top bar right slot (user menu, notifications, etc). */
  topRight?: ReactNode;
  /** Page content. */
  children: ReactNode;
}

/**
 * Admin / tool / dashboard template based on `<PCanvas>`.
 *
 * `<PCanvas>` provides app chrome (sidebar, top bar, scheme switcher) so
 * pages built with this template do NOT need a separate header/footer.
 *
 * Content children can use any grid layout — `<PCanvas>` does not impose
 * the `grid-template` page system.
 */
export function AdminPanel({ title, sidebar, topRight, children }: AdminPanelProps) {
  return (
    <PCanvas>
      {sidebar && <div slot="sidebar-start">{sidebar}</div>}
      <PHeading slot="header-start" size="small" tag="h1">
        {title}
      </PHeading>
      {topRight && <div slot="header-end">{topRight}</div>}
      {children}
    </PCanvas>
  );
}
