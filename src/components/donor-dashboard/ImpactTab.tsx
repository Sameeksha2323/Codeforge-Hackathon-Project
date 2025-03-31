
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImpactChart from "@/components/charts/ImpactChart";
import { Coins, UserCircle, Gift } from "lucide-react";

// Sample impact data
const impactData = {
  medicinesDonated: "500+",
  patientsHelped: "100+",
  ngosSupported: "10+"
};

// Custom card body component
const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props} />
  )
);
CardBody.displayName = "CardBody";

const ImpactTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Impact</CardTitle>
          <CardDescription>See the difference you're making</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardBody className="flex flex-col items-center justify-center p-4">
                <Coins className="h-6 w-6 text-green-600 mb-2" />
                <CardTitle className="text-2xl font-bold text-green-700">{impactData.medicinesDonated}</CardTitle>
                <CardDescription className="text-sm text-gray-600">Medicines Donated</CardDescription>
              </CardBody>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardBody className="flex flex-col items-center justify-center p-4">
                <UserCircle className="h-6 w-6 text-blue-600 mb-2" />
                <CardTitle className="text-2xl font-bold text-blue-700">{impactData.patientsHelped}</CardTitle>
                <CardDescription className="text-sm text-gray-600">Patients Helped</CardDescription>
              </CardBody>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardBody className="flex flex-col items-center justify-center p-4">
                <Gift className="h-6 w-6 text-orange-600 mb-2" />
                <CardTitle className="text-2xl font-bold text-orange-700">{impactData.ngosSupported}</CardTitle>
                <CardDescription className="text-sm text-gray-600">NGOs Supported</CardDescription>
              </CardBody>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <ImpactChart title="Medicines Donated by Category" className="w-full" />
    </div>
  );
};

export default ImpactTab;
