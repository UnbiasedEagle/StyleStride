import Link from 'next/link';
import { Button } from '../ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className='rounded-lg'>
      <Carousel className='w-full mx-auto'>
        <CarouselContent>
          {product.images.map((item, index) => (
            <CarouselItem key={index}>
              <div className='relative h-[330px]'>
                <Image
                  src={item}
                  alt='Product Image'
                  fill
                  className='object-cover object-center w-full h-full rounded-lg'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='ml-16' />
        <CarouselNext className='mr-16' />
      </Carousel>

      <div className='flex justify-between items-center mt-2'>
        <h1 className='font-semibold text-xl'>{product.name}</h1>
        <h3 className='inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/10'>
          ${product.price}
        </h3>
      </div>
      <p className='text-gray-600 text-sm mt-2 line-clamp-2'>
        {product.description}
      </p>

      <Button asChild className='w-full mt-5'>
        <Link href={`/product/${product.id}`}>Learn More</Link>
      </Button>
    </div>
  );
};

ProductCard.Skeleton = function ProductCardSkeleton() {
  return (
    <div className='flex flex-col'>
      <Skeleton className='w-full h-[330px]' />
      <div className='flex flex-col mt-2 gap-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='w-full h-6' />
      </div>
      <Skeleton className='w-full h-10 mt-5' />
    </div>
  );
};
