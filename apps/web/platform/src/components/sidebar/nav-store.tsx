'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@shopify-clone/ui';
import {
  BookOpen,
  ChartNoAxesColumn,
  ChevronRight,
  Home,
  LayoutDashboard,
  LucideIcon,
  Package,
  Settings2,
  ShoppingBag,
  Store,
  Tag,
  Tags,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

interface navItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: navItem[];
}
const storeItems: navItem[] = [
  {
    title: 'Home',
    icon: Home,
    url: '',
  },
  {
    title: 'Orders',
    icon: ShoppingBag,
    url: '/orders',
  },
  {
    title: 'Products',
    icon: Tag,
    url: '/products',
    items: [
      { icon: Package, title: 'Stock', url: '/stock' },
      { title: 'Categories', url: '/categories', icon: Tags },
    ],
  },
  {
    title: 'Cutomers',
    icon: User,
    url: '/customers',
  },
  {
    title: 'Analytics',
    icon: ChartNoAxesColumn,
    url: '/analytics',
  },
  {
    title: 'Store',
    icon: Store,
    url: '',
    items: [
      { icon: BookOpen, title: 'Pages', url: '/pages' },
      { icon: LayoutDashboard, title: 'Templates', url: '/templates' },
      { icon: Settings2, title: 'Settings', url: '/settings' },
    ],
  },
];

export function NavStore() {
  const path = usePathname();
  const { shopId } = useParams<{ shopId: string }>();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {storeItems.map((item) => {
          const link = `/store/${shopId}${item.url}`;
          const isActiveRoute = path === link;
          const isActiveSubRoute = path.startsWith(link);
          if (item.items === undefined) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActiveRoute}
                  asChild
                >
                  <Link
                    href={link}
                    className="flex gap-2 size-full items-center"
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
          return (
            <Collapsible
              key={item.title}
              asChild
              open={isActiveSubRoute}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActiveRoute}
                    asChild
                  >
                    <Link
                      href={link}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </div>

                      {isActiveSubRoute && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const subLink = `${link}${subItem.url}`;
                      const isActiveSubRoute =
                        path === subLink || path.startsWith(subLink);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActiveSubRoute}
                          >
                            <Link href={subLink}>
                              <subItem.icon />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
