import { deleteBanner } from '@/actions';
import { SubmitButton } from '@/components/submit-buttons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import Link from 'next/link';

interface DeleteBannerPageProps {
  params: {
    id: string;
  };
}

const DeleteBannerPage = ({ params: { id } }: DeleteBannerPageProps) => {
  return (
    <div className='h-[80vh] w-full flex items-center justify-center'>
      <Card className='max-w-xl'>
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            banner and remove all data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className='w-full flex justify-between'>
          <Button variant='secondary' asChild>
            <Link href='/dashboard/banner'>Cancel</Link>
          </Button>
          <form action={deleteBanner}>
            <input value={id} type='hidden' name='bannerId' />
            <SubmitButton variant='destructive' text='Delete Banner' />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteBannerPage;
