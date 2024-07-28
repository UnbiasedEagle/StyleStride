'use client';

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

interface DashboardChartProps {
  data: {
    createdAt: Date;
    amount: number;
  }[];
}

const aggregateChartData = (data: any) => {
  const chartData = data.reduce((acc: any, curr: any) => {
    const formattedDate = new Intl.DateTimeFormat('en-US').format(
      curr.createdAt
    );
    if (acc[formattedDate]) {
      acc[formattedDate] += curr.amount / 100;
    } else {
      acc[formattedDate] = curr.amount / 100;
    }
    return acc;
  }, {});

  return Object.keys(chartData).map((date) => ({
    date,
    revenue: chartData[date],
  }));
};

export const DashboardChart = ({ data }: DashboardChartProps) => {
  const chartData = aggregateChartData(data);

  return (
    <ResponsiveContainer width='100%' height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type='monotone'
          stroke='#3b82f6'
          activeDot={{ r: 8 }}
          dataKey='revenue'
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
