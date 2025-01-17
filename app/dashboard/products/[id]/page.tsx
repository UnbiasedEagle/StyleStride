import { EditProductForm } from '@/components/dashboard/edit-form';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return notFound();
  }

  return product;
};

const EditProductPage = async ({ params: { id } }: EditProductPageProps) => {
  noStore();

  const product = await getProduct(id);

  return <EditProductForm product={product} />;
};

export default EditProductPage;
