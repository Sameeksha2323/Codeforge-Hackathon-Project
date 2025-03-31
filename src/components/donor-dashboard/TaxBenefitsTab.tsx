
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TaxBenefitsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Benefits for Medicine Donations</CardTitle>
        <CardDescription>Learn how your donations can help reduce your tax burden</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Income Tax Deductions Under Section 80G</h3>
          <p className="text-gray-600">
            When you donate medicines through our platform to registered NGOs, you can claim tax deductions under Section 80G of the Income Tax Act. The deduction amount depends on the category of the organization and the type of donation.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Benefits for Corporate Donors</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Donations are eligible for Corporate Social Responsibility (CSR) spending as mandated under Companies Act, 2013.</li>
            <li>Tax benefits under section 80G - 50% to 100% deduction depending on the receiving organization.</li>
            <li>Reduced tax liability while making a positive social impact.</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Documentation Required</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Donation receipt from the receiving NGO (automatically generated through our platform).</li>
            <li>80G certificate of the receiving organization (available for download).</li>
            <li>Your PAN details must be correctly provided during donation.</li>
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <h3 className="text-amber-800 font-medium mb-2">Important Note</h3>
          <p className="text-amber-700 text-sm">
            Tax benefits may vary based on changes in tax laws and the status of the receiving organization. We recommend consulting with a tax professional for specific advice related to your situation. The information provided here is for general guidance only and does not constitute professional tax advice.
          </p>
        </div>
        
        <div>
          <Button variant="outline" className="mt-2">
            Download Tax Benefit Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxBenefitsTab;
