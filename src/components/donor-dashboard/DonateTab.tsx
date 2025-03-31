
import React from "react";
import { Button } from "@/components/ui/button";
import { UserData } from "@/utils/auth";
import { Plus } from "lucide-react";

interface DonateTabProps {
  user: UserData;
}

const DonateTab: React.FC<DonateTabProps> = ({ user }) => {
  // Get the entity_id from the user object
  const entityId = user.entity_id || '';

  // Function to open donation form in a new tab
  const openDonationInNewTab = () => {
    const donationUrl = `https://med-donor-dashboard-83.vercel.app?entity_id=${entityId}`;
    window.open(donationUrl, '_blank');
  };

  return (
    <div className="p-6">
      <div className="text-center my-10">
        <h2 className="text-2xl font-bold text-medishare-blue mb-4">Donate Medicines</h2>
        <p className="max-w-lg mx-auto text-gray-600 mb-8">
          Your unused medicines can save lives. We ensure they reach those who need them most.
          Simply click the button below to donate your medicines.
        </p>
        <div className="flex items-center justify-center">
          <Button
            className="bg-medishare-blue hover:bg-medishare-blue/80 text-white font-medium px-6 py-2"
            onClick={openDonationInNewTab}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Donations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonateTab;
