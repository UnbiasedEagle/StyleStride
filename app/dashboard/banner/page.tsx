import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, User2 } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import Image from 'next/image';

const getBanners = async () => {
  const banners = await prisma.banner.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return banners;
};

const BannerPage = async () => {
  const banners = await getBanners();

  return (
    <>
      <div className='flex items-center justify-end'>
        <Button asChild className='flex gap-x-2'>
          <Link href='/dashboard/banner/create'>
            <PlusCircle className='h-3.5 w-3.5' />
            <span>Add Banner</span>
          </Link>
        </Button>
      </div>
      <Card className='mt-5'>
        <CardHeader>
          <CardTitle>Banners</CardTitle>
          <CardDescription>Manage your banners</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className='text-end'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => {
                return (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <Image
                        src={banner.image}
                        alt='banner'
                        height={64}
                        width={64}
                        className='h-16 w-16 object-cover rounded-lg'
                      />
                    </TableCell>
                    <TableCell className='font-medium'>
                      {banner.title}
                    </TableCell>
                    <TableCell className='text-end'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size='icon' variant='ghost'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/banner/${banner.id}/delete`}
                            >
                              Delete
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default BannerPage;
