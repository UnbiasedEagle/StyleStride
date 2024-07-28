'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
  },
  {
    name: 'Products',
    href: '/dashboard/products',
  },
  {
    name: 'Banner Picture',
    href: '/dashboard/banner',
  },
];

export const DashboardNavigation = () => {
  const pathName = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            className={cn(
              link.href === pathName
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            key={link.href}
            href={link.href}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
};
