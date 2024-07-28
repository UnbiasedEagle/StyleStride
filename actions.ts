'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import { bannerSchema, productSchema } from './lib/zodSchemas';
import prisma from './lib/db';
import { redis } from './lib/reddis';
import { Cart } from './lib/types';
import { revalidatePath } from 'next/cache';
import { stripe } from './lib/stripe';
import Stripe from 'stripe';

export const createProduct = async (prevState: unknown, formData: FormData) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== 'imsaurabhsingh007@gmail.com') {
    return redirect('/');
  }

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((item) => {
    return item.split(',').map((curr) => curr.trim());
  });

  await prisma.product.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      status: submission.value.status,
      price: submission.value.price,
      images: flattenUrls,
      category: submission.value.category,
      isFeatured: submission.value.isFeatured === true ? true : false,
    },
  });

  redirect('/dashboard/products');
};

export const editProduct = async (prevState: unknown, formData: FormData) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== 'imsaurabhsingh007@gmail.com') {
    return;
  }

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const productId = formData.get('productId') as string;

  const flattenUrls = submission.value.images.flatMap((item) => {
    return item.split(',').map((curr) => curr.trim());
  });

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: submission.value.name,
      description: submission.value.description,
      status: submission.value.status,
      price: submission.value.price,
      images: flattenUrls,
      category: submission.value.category,
      isFeatured: submission.value.isFeatured === true ? true : false,
    },
  });

  redirect('/dashboard/products');
};

export const deleteProduct = async (formData: FormData) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== 'imsaurabhsingh007@gmail.com') {
    return redirect('/');
  }

  const productId = formData.get('productId') as string;

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  redirect('/dashboard/products');
};

export const createBanner = async (prevState: any, formData: FormData) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== 'imsaurabhsingh007@gmail.com') {
    return redirect('/');
  }

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  await prisma.banner.create({
    data: {
      title: submission.value.title,
      image: submission.value.image,
    },
  });

  redirect('/dashboard/banner');
};

export async function deleteBanner(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== 'imsaurabhsingh007@gmail.com') {
    return redirect('/');
  }

  await prisma.banner.delete({
    where: {
      id: formData.get('bannerId') as string,
    },
  });

  redirect('/dashboard/banner');
}

export const addProductToCart = async (productId: string) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect('/');
  }

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  const selectedProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
    },
  });

  if (!selectedProduct) {
    throw new Error(`No product with this id: ${productId}`);
  }

  let myCart = {} as Cart;

  if (!cart || !cart.items) {
    myCart = {
      userId: user.id,
      items: [
        {
          id: selectedProduct.id,
          price: selectedProduct.price,
          name: selectedProduct.name,
          quantity: 1,
          image: selectedProduct.images[0],
        },
      ],
    };
  } else {
    let productPresent = false;

    myCart = {
      userId: user.id,
      items: cart.items.map((item) => {
        if (item.id === selectedProduct.id) {
          productPresent = true;
          return { ...item, quantity: item.quantity + 1 };
        }
        return { ...item };
      }),
    };

    if (!productPresent) {
      myCart.items.push({
        id: selectedProduct.id,
        price: selectedProduct.price,
        name: selectedProduct.name,
        quantity: 1,
        image: selectedProduct.images[0],
      });
    }
  }

  await redis.set(`cart-${user.id}`, myCart);

  revalidatePath('/', 'layout');
};

export const removeProductFromCart = async (formData: FormData) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect('/');
  }

  const productId = formData.get('productId');

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (cart && cart.items) {
    const updateCart: Cart = {
      userId: user.id,
      items: cart.items.filter((item) => item.id !== productId),
    };

    await redis.set(`cart-${user.id}`, updateCart);
  }

  revalidatePath('/cart', 'page');
};

export const checkout = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect('/');
  }

  const cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (cart && cart.items) {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cart.items.map((item) => {
        return {
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: item.price * 100,
            product_data: {
              name: item.name,
              images: [item.image],
            },
          },
        };
      });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.BASE_URL}/payment/success`,
      cancel_url: `${process.env.BASE_URL}/payment/cancel`,
      metadata: {
        userId: user.id,
      },
    });

    return redirect(session.url!);
  }
};
