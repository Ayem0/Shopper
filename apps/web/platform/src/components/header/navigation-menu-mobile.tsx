'use client';

import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shopify-clone/ui';
import { MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { menuItems } from './navigation-menu-desktop';

interface NavigationMenuMobileProps {
  className: string;
}

export function NavigationMenuMobile(props: NavigationMenuMobileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavigationMenu className={props.className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                {isOpen ? <X /> : <MenuIcon />}
                <span className="text-lg font-medium">Menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              className="bg-background/90 backdrop-blur p-6 border-0 rounded-none shadow-none h-[calc(100vh-56px)] w-screen flex flex-col gap-6 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <Link
                    href={item.link}
                    className="text-lg font-medium hover:underline"
                    key={item.link}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
