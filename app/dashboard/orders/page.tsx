import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import prisma from '@/lib/db';

const getOrders = async () => {
  const orders = await prisma.order.findMany({
    select: {
      createdAt: true,
      status: true,
      id: true,
      amount: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
};

const OrdersPage = async () => {
  const orders = await getOrders();

  return (
    <Card>
      <CardHeader className='px-7'>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store!</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className='font-medium'>
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                    <p className='hidden md:flex text-sm text-muted-foreground'>
                      {order.user?.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className='font-medium'>Order</p>
                  </TableCell>
                  <TableCell>
                    <p className='font-medium'>{order.status}</p>
                  </TableCell>
                  <TableCell>
                    <p className='font-medium'>
                      {new Intl.DateTimeFormat('en-US').format(order.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell className='text-right'>
                    <p className='font-medium'>
                      $
                      {new Intl.NumberFormat('en-US').format(
                        order.amount / 100
                      )}
                    </p>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersPage;
