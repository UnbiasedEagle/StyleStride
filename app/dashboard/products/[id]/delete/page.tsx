import { deleteProduct } from '@/actions';
import { SubmitButton } from '@/components/submit-buttons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

interface DeleteProductPageProps {
  params: {
    id: string;
  };
}

const DeleteProductPage = ({ params: { id } }: DeleteProductPageProps) => {
  return (
    <div className='h-[80vh] w-full flex items-center justify-center'>
      <Card className='max-w-xl'>
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            product and remove all data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className='w-full flex justify-between'>
          <Button variant='secondary' asChild>
            <Link href='/dashboard/products'>Cancel</Link>
          </Button>
          <form action={deleteProduct}>
            <input value={id} type='hidden' name='productId' />
            <SubmitButton variant='destructive' text='Delete Product' />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteProductPage;
