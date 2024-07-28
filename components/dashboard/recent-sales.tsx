import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import prisma from '@/lib/db';

async function getRecentSales() {
  const data = await prisma.order.findMany({
    select: {
      amount: true,
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 7,
  });

  return data;
}

export const RecentSales = async () => {
  const recentSales = await getRecentSales();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent sales</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-8'>
        {recentSales.map((sale) => (
          <div className='flex items-center gap-4' key={sale.id}>
            <Avatar className='hidden sm:flex h-9 w-9'>
              <AvatarImage src={sale.user?.profileImage} alt='Avatar Image' />
              <AvatarFallback>
                {sale.user?.firstName.slice(0, 3)}
              </AvatarFallback>
            </Avatar>
            <div className='grid gap-1'>
              <p className='text-sm font-medium'>
                {sale.user?.firstName} {sale.user?.lastName}
              </p>
              <p className='text-sm text-muted-foreground'>
                {sale.user?.email}
              </p>
            </div>
            <p className='ml-auto font-medium'>
              +${new Intl.NumberFormat('en-US').format(sale.amount / 100)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
