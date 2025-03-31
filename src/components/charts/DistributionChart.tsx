
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Jan", distributed: 20, received: 30 },
  { name: "Feb", distributed: 35, received: 45 },
  { name: "Mar", distributed: 50, received: 60 },
  { name: "Apr", distributed: 30, received: 40 },
  { name: "May", distributed: 45, received: 55 },
  { name: "Jun", distributed: 65, received: 75 },
];

interface DistributionChartProps {
  title: string;
  className?: string;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ title, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="distributed" stroke="#60a5fa" />
            <Line type="monotone" dataKey="received" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DistributionChart;
