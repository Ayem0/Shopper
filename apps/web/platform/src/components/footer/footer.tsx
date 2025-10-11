import { Separator } from '@shopify-clone/ui';
import Link from 'next/link';

const footerItems = [
  { link: '/contact', name: 'Contact' },
  { link: '/legal-notice', name: 'Legal stuff' },
  { link: '/terms-of-service', name: 'Terms of service' },
];

export function Footer() {
  return (
    <footer className="flex flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-3">
      <Separator className="mb-3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {footerItems.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            className="text-lg font-medium"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </footer>
  );
}
