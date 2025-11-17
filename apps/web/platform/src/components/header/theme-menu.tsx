'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@shopify-clone/ui';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { MouseEvent } from 'react';

interface ThemeMenuProps {
  isSubMenu: boolean;
}
export function ThemeMenu(props: ThemeMenuProps) {
  const { setTheme } = useTheme();
  const set = (e: MouseEvent, t: 'light' | 'dark' | 'system') => {
    e.preventDefault();
    setTheme(t);
  };

  if (props.isSubMenu) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <div className="flex items-center gap-2">
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-muted-foreground" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-muted-foreground" />
            Theme
          </div>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={(e) => set(e, 'light')}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => set(e, 'dark')}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => set(e, 'system')}>
            System
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
