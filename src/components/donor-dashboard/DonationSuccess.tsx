
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface DonationSuccessProps {
  onDonateAnother: () => void;
}

const DonationSuccess = ({ onDonateAnother }: DonationSuccessProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="bg-green-100 p-3 rounded-full mb-4">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-xl font-medium mb-2">Donation Complete!</h3>
      <p className="text-gray-600 mb-6">
        Your medicine has been added to our database and will be matched with someone in need.
      </p>
      <Button onClick={onDonateAnother}>Donate Another Medicine</Button>
    </div>
  );
};

export default DonationSuccess;
