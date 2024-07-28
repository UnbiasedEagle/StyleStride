'use client';

import { createProduct } from '@/actions';
import { UploadDropzone } from '@/app/utils/uploadthing';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@conform-to/react';
import { ChevronLeft, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useFormState } from 'react-dom';

import { productSchema } from '@/lib/zodSchemas';
import { parseWithZod } from '@conform-to/zod';
import Image from 'next/image';
import { useState } from 'react';
import { categories } from '@/lib/categories';
import { SubmitButton } from '@/components/submit-buttons';

const CreateProductPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [lastResult, action] = useFormState(createProduct, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: productSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  const handleDelete = (index: number) => {
    setImages(images.filter((_, idx) => index !== idx));
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className='flex items-center gap-4'>
        <Button size='icon' variant='outline' asChild>
          <Link href='/dashboard/products'>
            <ChevronLeft />
          </Link>
        </Button>
        <h1 className='text-xl font-semibold tracking-tight'>New Product</h1>
      </div>
      <Card className='mt-5'>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            In this form you can create your product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-3'>
              <Label>Name</Label>
              <Input
                key={fields.name.key}
                name={fields.name.name}
                type='text'
                className='w-full'
                placeholder='Product Name'
              />
              <p className='text-red-500'>{fields.name.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Description</Label>
              <Textarea
                key={fields.description.key}
                name={fields.description.name}
                placeholder='Write your description right here...'
              />
              <p className='text-red-500'>{fields.description.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Price</Label>
              <Input
                name={fields.price.name}
                key={fields.price.key}
                type='number'
                placeholder='$55'
              />
              <p className='text-red-500'>{fields.price.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Featured Product</Label>
              <Switch
                key={fields.isFeatured.key}
                name={fields.isFeatured.name}
                defaultValue={fields.isFeatured.initialValue}
              />
              <p className='text-red-500'>{fields.isFeatured.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Status</Label>
              <Select
                defaultValue={fields.status.initialValue}
                key={fields.status.key}
                name={fields.status.name}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='draft'>Draft</SelectItem>
                  <SelectItem value='published'>Published</SelectItem>
                  <SelectItem value='archived'>Archived</SelectItem>
                </SelectContent>
              </Select>
              <p className='text-red-500'>{fields.status.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Category</Label>
              <Select
                defaultValue={fields.category.initialValue}
                key={fields.category.key}
                name={fields.category.name}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => {
                    return (
                      <SelectItem key={category.id} value={category.name}>
                        {category.title}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className='text-red-500'>{fields.category.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Images</Label>
              <input
                type='hidden'
                value={images}
                key={fields.images.key}
                name={fields.images.name}
              />
              {images.length === 0 && (
                <UploadDropzone
                  endpoint='imageUploader'
                  onClientUploadComplete={(response) => {
                    setImages(response.map((res) => res.url));
                  }}
                  onUploadError={() => {
                    alert('Something went wrong');
                  }}
                />
              )}

              {images.length > 0 && (
                <div className='flex gap-5'>
                  {images.map((image, idx) => {
                    return (
                      <div className='relative w-[100px] h-[100px]' key={image}>
                        <Image
                          src={image}
                          height={100}
                          width={100}
                          className='w-full h-full object-cover rounded-lg border'
                          alt='product'
                        />
                        <button
                          type='button'
                          onClick={() => handleDelete(idx)}
                          className='absolute -top-3 -right-3 bg-red-500 p-2 rounded-lg text-white'
                        >
                          <XIcon className='w-3 h-3' />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className='text-red-500'>{fields.images.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text='Create Product' />
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreateProductPage;
