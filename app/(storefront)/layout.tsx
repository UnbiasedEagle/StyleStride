import { StoreFrontFooter } from '@/components/storefront/footer';
import { Navbar } from '@/components/storefront/navbar';
import { PropsWithChildren } from 'react';

const StoreFrontLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>{children}</main>
      <StoreFrontFooter />
    </>
  );
};

export default StoreFrontLayout;
