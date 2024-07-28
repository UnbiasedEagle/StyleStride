'use client';

import { editProduct } from '@/actions';
import { UploadDropzone } from '@/app/utils/uploadthing';
import { categories } from '@/lib/categories';
import { productSchema } from '@/lib/zodSchemas';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ChevronLeft, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { SubmitButton } from '../submit-buttons';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Product } from '@prisma/client';

interface EditProductFormProps {
  product: Product;
}

export const EditProductForm = ({ product }: EditProductFormProps) => {
  const [images, setImages] = useState<string[]>(product.images);
  const [lastResult, action] = useFormState(editProduct, undefined);

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
      <input type='hidden' name='productId' value={product.id} />
      <div className='flex items-center gap-4'>
        <Button size='icon' variant='outline' asChild>
          <Link href='/dashboard/products'>
            <ChevronLeft />
          </Link>
        </Button>
        <h1 className='text-xl font-semibold tracking-tight'>Edit Product</h1>
      </div>
      <Card className='mt-5'>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            In this form you can edit your product
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
                defaultValue={product.name}
              />
              <p className='text-red-500'>{fields.name.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Description</Label>
              <Textarea
                key={fields.description.key}
                name={fields.description.name}
                defaultValue={product.description}
                placeholder='Write your description right here...'
              />
              <p className='text-red-500'>{fields.description.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Price</Label>
              <Input
                defaultValue={product.price}
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
                defaultChecked={product.isFeatured}
              />
              <p className='text-red-500'>{fields.isFeatured.errors}</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Status</Label>
              <Select
                defaultValue={product.status}
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
                defaultValue={product.category}
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
          <SubmitButton text='Edit Product' />
        </CardFooter>
      </Card>
    </form>
  );
};
