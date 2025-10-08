import AuthStatusDisplay from './auth-status-display';
import { NavigationMenuDesktop } from './navigation-menu-desktop';
import { NavigationMenuMobile } from './navigation-menu-mobile';
import { ThemeMenu } from './theme-menu';

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <div className="flex px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2.5">
        <NavigationMenuMobile className="flex lg:hidden" />
        <NavigationMenuDesktop className="hidden lg:flex" />
        <div className="ml-auto flex justify-center items-center flex-row gap-2">
          <ThemeMenu />
          <AuthStatusDisplay />
        </div>
      </div>
    </header>
  );
}
