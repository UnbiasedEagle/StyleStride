import { ProductCard } from '@/components/storefront/product-card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadCategory = () => {
  return (
    <div>
      <Skeleton className='h-10 w-56 my-5' />

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
      </div>
    </div>
  );
};

export default LoadCategory;
