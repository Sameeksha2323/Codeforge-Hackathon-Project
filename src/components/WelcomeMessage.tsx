
import React from "react";
import { UserData } from "@/utils/auth";

interface WelcomeMessageProps {
  user: UserData;
  userTypeTitle: string;
}

const WelcomeMessage = ({ user, userTypeTitle }: WelcomeMessageProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-medishare-dark">
        {userTypeTitle} Dashboard
      </h1>
      <p className="text-gray-600">
        Welcome, {user.name || user.email.split('@')[0]}
        {user.organization ? ` | ${user.organization}` : ''}
        {user.verified ? 
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span> : 
          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Pending Verification</span>
        }
      </p>
    </div>
  );
};

export default WelcomeMessage;
