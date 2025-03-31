
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DonorActivityChart from "@/components/charts/DonorActivityChart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Sample data for medicine category distribution
const medicineCategoryData = [
  { name: "Antibiotics", value: 35 },
  { name: "Painkillers", value: 25 },
  { name: "First Aid", value: 15 },
  { name: "Vitamins", value: 10 },
  { name: "Insulin", value: 15 }
];

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Donation Analytics</CardTitle>
          <CardDescription>View insights about your donation activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donation Activity Chart */}
            <DonorActivityChart title="Monthly Donation Activity" className="col-span-1 md:col-span-2" />

            {/* Medicine Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Medicine Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={medicineCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {medicineCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Donation Impact Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Donation Impact Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">42</p>
                      <p className="text-sm text-gray-600">Total Donations</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">126</p>
                      <p className="text-sm text-gray-600">People Helped</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">8</p>
                      <p className="text-sm text-gray-600">NGOs Supported</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-amber-600">₹45,000</p>
                      <p className="text-sm text-gray-600">Estimated Value</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
