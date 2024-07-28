'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Loader2, ShoppingBag } from 'lucide-react';

interface SubmitButtonProps {
  text: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
}

export const SubmitButton = ({ text, variant }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button variant={variant} disabled>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Please Wait
        </Button>
      ) : (
        <Button variant={variant} type='submit'>
          {text}
        </Button>
      )}
    </>
  );
};

export const ShoppingBagButton = () => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size='lg' className='w-full mt-5'>
          <Loader2 className='mr-4 h-5 w-5 animate-spin' /> Please Wait
        </Button>
      ) : (
        <Button size='lg' className='w-full mt-5' type='submit'>
          <ShoppingBag className='mr-4 h-5 w-5' /> Add to Cart
        </Button>
      )}
    </>
  );
};

export const DeleteItem = () => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <button disabled className='font-medium text-primary text-end'>
          Removing...
        </button>
      ) : (
        <button type='submit' className='font-medium text-primary text-end'>
          Delete
        </button>
      )}
    </>
  );
};

export const ChceckoutButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled size='lg' className='w-full mt-5'>
          <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Please Wait
        </Button>
      ) : (
        <Button type='submit' size='lg' className='w-full mt-5'>
          Checkout
        </Button>
      )}
    </>
  );
};
