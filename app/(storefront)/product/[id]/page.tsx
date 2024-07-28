import { addProductToCart } from '@/actions';
import { FeaturedProducts } from '@/components/storefront/featured-products';
import { ImageSlider } from '@/components/storefront/image-slider';
import { ShoppingBagButton } from '@/components/submit-buttons';
import prisma from '@/lib/db';
import { StarIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

interface StoreFrontProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      price: true,
      images: true,
      name: true,
      description: true,
      id: true,
    },
  });

  if (!product) {
    return notFound();
  }

  return product;
};

const StoreFrontProductPage = async ({
  params: { id },
}: StoreFrontProductPageProps) => {
  noStore();

  const product = await getProduct(id);

  const addProductToCartAction = addProductToCart.bind(null, product.id);

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6'>
        <ImageSlider images={product.images} />
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-gray-900'>
            {product.name}
          </h1>
          <p className='text-3xl mt-2 text-gray-900'>${product.price}</p>
          <div className='mt-3 flex items-center gap-1'>
            <StarIcon className='h-4 w-4 text-yellow-500 fill-yellow-500' />
            <StarIcon className='h-4 w-4 text-yellow-500 fill-yellow-500' />
            <StarIcon className='h-4 w-4 text-yellow-500 fill-yellow-500' />
            <StarIcon className='h-4 w-4 text-yellow-500 fill-yellow-500' />
            <StarIcon className='h-4 w-4 text-yellow-500 fill-yellow-500' />
          </div>
          <p className='text-base text-gray-700 mt-6'>{product.description}</p>

          <form action={addProductToCartAction}>
            <ShoppingBagButton />
          </form>
        </div>
      </div>
      <div className='mt-16'>
        <FeaturedProducts />
      </div>
    </>
  );
};

export default StoreFrontProductPage;
