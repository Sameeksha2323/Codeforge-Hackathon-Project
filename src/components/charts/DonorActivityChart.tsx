
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Jan", donations: 5 },
  { name: "Feb", donations: 8 },
  { name: "Mar", donations: 12 },
  { name: "Apr", donations: 6 },
  { name: "May", donations: 10 },
  { name: "Jun", donations: 15 },
];

interface DonorActivityChartProps {
  title: string;
  className?: string;
}

const DonorActivityChart: React.FC<DonorActivityChartProps> = ({ title, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="donations" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DonorActivityChart;
