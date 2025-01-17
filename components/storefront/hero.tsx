import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import prisma from '@/lib/db';
import Image from 'next/image';

const getBanners = async () => {
  const banners = await prisma.banner.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return banners;
};

export const StoreFrontHero = async () => {
  const banners = await getBanners();

  return (
    <Carousel>
      <CarouselContent>
        {banners.map((banner) => {
          return (
            <CarouselItem key={banner.id}>
              <div className='relative h-[60vh] lg:h-[80vh]'>
                <Image
                  src={banner.image}
                  alt='banner'
                  fill
                  className='object-cover w-full h-full rounded-xl'
                />
                <div className='absolute top-6 left-6 bg-opacity-75 bg-black text-white p-6 rounded-xl shadow-lg transition-transform hover:scale-105'>
                  <h1 className='text-xl lg:text-4xl font-bold'>
                    {banner.title}
                  </h1>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className='ml-16' />
      <CarouselNext className='mr-16' />
    </Carousel>
  );
};
