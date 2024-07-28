import { DollarSign, ShoppingBag, PartyPopper, User2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import prisma from '@/lib/db';

const getDashboardStats = async () => {
  const [users, products, order] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
      },
    }),

    prisma.product.findMany({
      select: {
        id: true,
      },
    }),

    prisma.order.findMany({
      select: {
        amount: true,
      },
    }),
  ]);

  return { users, products, order };
};

export const DashboardStats = async () => {
  const { users, products, order } = await getDashboardStats();

  const totalAmount = order.reduce((accumalator, currentValue) => {
    return accumalator + currentValue.amount;
  }, 0);

  return (
    <div className='grid md:grid-cols-2 md:gap-8 lg:grid-cols-4 gap-4'>
      <Card>
        <CardHeader className='flex items-center flex-row justify-between pb-2'>
          <CardTitle>Total Revenue</CardTitle>
          <DollarSign className='h-4 w-4 text-green-500' />
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold'>
            ${new Intl.NumberFormat('en-US').format(totalAmount / 100)}
          </p>
          <p className='text-xs text-muted-foreground'>
            Total revenue on StyleStride
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex items-center flex-row justify-between pb-2'>
          <CardTitle>Total Sales</CardTitle>
          <ShoppingBag className='h-4 w-4 text-blue-500' />
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold'>+{order.length}</p>
          <p className='text-xs text-muted-foreground'>
            Total sales on StyleStride
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex items-center flex-row justify-between pb-2'>
          <CardTitle>Total Products</CardTitle>
          <PartyPopper className='h-4 w-4 text-indigo-500' />
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold'>{products.length}</p>
          <p className='text-xs text-muted-foreground'>
            Total products created
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex items-center flex-row justify-between pb-2'>
          <CardTitle>Total Users</CardTitle>
          <User2 className='h-4 w-4 text-orange-500' />
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold'>{users.length}</p>
          <p className='text-xs text-muted-foreground'>Total Users Signed Up</p>
        </CardContent>
      </Card>
    </div>
  );
};
