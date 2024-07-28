'use client';

import { createBanner } from '@/actions';
import { UploadDropzone } from '@/app/utils/uploadthing';
import { SubmitButton } from '@/components/submit-buttons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bannerSchema } from '@/lib/zodSchemas';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useFormState } from 'react-dom';

const CreateBannerPage = () => {
  const [image, setImage] = useState<string | undefined>();

  const [lastResult, action] = useFormState(createBanner, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bannerSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className='flex items-center gap-x-4'>
        <Button variant='outline' size='icon' asChild>
          <Link href='/dashboard/banner'>
            <ChevronLeft />
          </Link>
        </Button>
        <h1 className='text-xl font-semibold tracking-tight'>New Banner</h1>
      </div>
      <Card className='mt-5'>
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
          <CardDescription>Create your banner right here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-y-6'>
            <div className='flex flex-col gap-3'>
              <Label>Name</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={fields.title.initialValue}
                type='text'
                placeholder='Create title for banner'
              />
              <p className='text-red-500'>{fields.title.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Image</Label>
              <input
                type='hidden'
                value={image}
                key={fields.image.key}
                name={fields.image.name}
                defaultValue={fields.image.initialValue}
              />
              {image !== undefined ? (
                <Image
                  src={image}
                  alt='banner'
                  height={200}
                  width={200}
                  className='w-[200px] h-[200px] border rounded-lg object-cover'
                />
              ) : (
                <UploadDropzone
                  onClientUploadComplete={(response) => {
                    setImage(response[0].url);
                  }}
                  onUploadError={() => {
                    alert('Something went wrong');
                  }}
                  endpoint='bannerImageUploader'
                />
              )}
              <p className='text-red-500'>{fields.image.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text='Create Banner' />
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreateBannerPage;
