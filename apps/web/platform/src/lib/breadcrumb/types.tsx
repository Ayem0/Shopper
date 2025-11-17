/**
 *
 */
export type BreadcrumbData = Record<
  string,
  | { id: string; name: string; link: string; static: false }
  | { name: string; link: string; static: true }
>;
