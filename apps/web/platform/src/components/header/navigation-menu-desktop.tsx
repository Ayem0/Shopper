'use client';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@shopify-clone/ui';
import Link from 'next/link';

export const menuItems = [
  { link: '/', name: 'Home' },
  { link: '/pricing', name: 'Pricing' },
  { link: '/about', name: 'About' },
];

interface NavigationMenuDesktopProps {
  className: string;
}
export function NavigationMenuDesktop(props: NavigationMenuDesktopProps) {
  return (
    <NavigationMenu viewport={false} className={props.className}>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.link}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={item.link} className="text-lg font-medium">
                {item.name}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
