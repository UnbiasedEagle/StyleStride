import prisma from '@/lib/db';
import { ProductCard } from './product-card';
import { Suspense } from 'react';
import { unstable_noStore as noStore } from 'next/cache';

const getFeaturedProducts = async () => {
  const featuredProducts = await prisma.product.findMany({
    where: {
      status: 'published',
      isFeatured: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: true,
    },
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return featuredProducts;
};

export const FeaturedProducts = () => {
  return (
    <>
      <h2 className='text-2xl font-extrabold tracking-tight'>
        Featured Products
      </h2>
      <Suspense fallback={<FeaturedProducts.LoadingSkeletons />}>
        <FeaturedProductsRow />
      </Suspense>
    </>
  );
};

const FeaturedProductsRow = async () => {
  noStore();

  const featuredProducts = await getFeaturedProducts();

  return (
    <div className='mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {featuredProducts.map((product) => {
        return <ProductCard product={product} key={product.id} />;
      })}
    </div>
  );
};

FeaturedProducts.LoadingSkeletons = function LoadingSkeletons() {
  return (
    <div className='mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      <ProductCard.Skeleton />
      <ProductCard.Skeleton />
      <ProductCard.Skeleton />
    </div>
  );
};
