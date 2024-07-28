import { DashboardChart } from '@/components/dashboard/dashboard-chart';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentSales } from '@/components/dashboard/recent-sales';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import prisma from '@/lib/db';

const getChartData = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const data = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return data;
};

const DashboardPage = async () => {
  const chartData = await getChartData();
  return (
    <>
      <DashboardStats />
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-10'>
        <Card className='xl: col-span-2'>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Recent Transactions from the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardChart data={chartData} />
          </CardContent>
        </Card>
        <RecentSales />
      </div>
    </>
  );
};

export default DashboardPage;
