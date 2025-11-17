'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@shopify-clone/ui';
import { NavStore } from './nav-store';
import { NavUser } from './nav-user';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div>Hello world</div>
      </SidebarHeader>
      <SidebarContent>
        <NavStore />
      </SidebarContent>
      <SidebarFooter>
        <NavUser isInSidebar={true} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
