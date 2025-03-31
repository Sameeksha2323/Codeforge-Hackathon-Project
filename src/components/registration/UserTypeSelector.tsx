
import React from "react";
import { UserType } from "@/utils/auth";
import { CheckCircle, UserPlus, Building, HeartHandshake, Shield } from "lucide-react";

interface UserTypeSelectorProps {
  selectedType: UserType | null;
  onSelectType: (type: UserType) => void;
}

const UserTypeSelector = ({ selectedType, onSelectType }: UserTypeSelectorProps) => {
  const userTypes = [
    {
      id: "donor" as UserType,
      title: "Donor",
      description: "Healthcare providers or suppliers with surplus medication",
      icon: <UserPlus className="h-10 w-10 text-medishare-orange mb-2" />,
      verification: "GST ID verification"
    },
    {
      id: "ngo" as UserType,
      title: "NGO",
      description: "Organizations that distribute medicines to those in need",
      icon: <HeartHandshake className="h-10 w-10 text-medishare-teal mb-2" />,
      verification: "UID verification"
    },
    {
      id: "recipient" as UserType,
      title: "Recipient",
      description: "Individuals who require medication assistance",
      icon: <Building className="h-10 w-10 text-medishare-blue mb-2" />,
      verification: "DigiLocker verification"
    },
    {
      id: "admin" as UserType,
      title: "Admin",
      description: "Platform administrators with full access",
      icon: <Shield className="h-10 w-10 text-medishare-gold mb-2" />,
      verification: "Admin verification code"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-medishare-dark">Choose account type</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={`
              p-6 rounded-xl cursor-pointer transition duration-300
              ${selectedType === type.id
                ? "border-2 border-medishare-orange bg-medishare-orange/5 shadow-md"
                : "border border-gray-200 hover:border-medishare-orange/70 hover:shadow"}
            `}
          >
            <div className="flex flex-col items-center text-center">
              {type.icon}
              <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{type.description}</p>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                {type.verification}
              </div>
              {selectedType === type.id && (
                <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-medishare-orange" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelector;
