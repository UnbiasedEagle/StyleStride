import { ProductCard } from '@/components/storefront/product-card';
import prisma from '@/lib/db';
import { Category } from '@prisma/client';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

const getProductsByCategory = async (category: string) => {
  switch (category) {
    case 'all': {
      const products = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: 'published',
        },
      });

      return {
        title: 'All Products',
        products,
      };
    }
    case 'men': {
      const products = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: 'published',
          category: Category.men,
        },
      });

      return {
        title: 'Products for Men',
        products,
      };
    }
    case 'women': {
      const products = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: 'published',
          category: Category.women,
        },
      });

      return {
        title: 'Products for Women',
        products,
      };
    }
    case 'kids': {
      const products = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: 'published',
          category: Category.kids,
        },
      });

      return {
        title: 'Products for Kids',
        products,
      };
    }

    default: {
      notFound();
    }
  }
};

interface ProductsCategoryPageProps {
  params: {
    category: string;
  };
}

const ProductsCategoryPage = async ({
  params: { category },
}: ProductsCategoryPageProps) => {
  noStore();

  const { title, products } = await getProductsByCategory(category);

  return (
    <section>
      <h1 className='font-semibold text-3xl my-5'>{title}</h1>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {products.map((product) => {
          return <ProductCard product={product} key={product.id} />;
        })}
      </div>
    </section>
  );
};

export default ProductsCategoryPage;
