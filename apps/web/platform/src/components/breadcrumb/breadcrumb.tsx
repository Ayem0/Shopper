'use client';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shopify-clone/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Return a new string to Titlecase
 * @param s string to update
 * @returns new string to Titlecase
 */
function toTitle(s: string) {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

export function AppBreadcrumb() {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter(Boolean);
  const isLong = pathnames.length > 3;

  const buildSegment = (index: number) =>
    '/' + pathnames.slice(0, index + 1).join('/');

  const renderDropdown = (middleItems: string[]) => (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1">
          <BreadcrumbEllipsis className="size-4" />
          <span className="sr-only">Toggle menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {middleItems.map((mi, i) => {
            const miSegment = buildSegment(i + 1);
            return (
              <DropdownMenuItem key={mi} asChild>
                <Link href={miSegment}>{toTitle(mi)}</Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnames.map((p, i) => {
          const isFirst = i === 0;
          const isLast = i === pathnames.length - 1;

          // For long paths: show first, dropdown for middle, and last two items
          if (isLong && !isFirst && i < pathnames.length - 2) return null;

          const segment = buildSegment(i);
          const title = toTitle(p);

          return (
            <div key={p} className="contents">
              {/* First item with dropdown if long */}
              {isLong && isFirst ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={segment}>{title}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  {renderDropdown(pathnames.slice(1, -2))}
                  <BreadcrumbSeparator />
                </>
              ) : (
                <>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={segment}>{title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
