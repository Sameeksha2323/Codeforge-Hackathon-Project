
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { UserType } from "@/utils/auth";

interface RegistrationSuccessProps {
  userType: UserType | null;
  email?: string;
}

const RegistrationSuccess = ({ userType }: RegistrationSuccessProps) => {
  // Different messages based on user type
  const verificationMessages = {
    donor: "We're verifying your GST ID. You can now sign in with your credentials.",
    ngo: "We're verifying your UID. You can now sign in with your credentials.",
    recipient: "We're verifying your DigiLocker information. You can now sign in with your credentials.",
    admin: "We're verifying your admin credentials. You can now sign in with your credentials.",
  };

  return (
    <div className="text-center p-8 bg-green-50 rounded-xl border border-green-100">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Registration Successful!</h2>
      
      <p className="text-gray-600 mb-6">
        Thank you for registering with MediShare. {userType && verificationMessages[userType]}
      </p>
      
      <Link to="/sign-in" className="mt-6 inline-block">
        <Button className="bg-medishare-orange hover:bg-medishare-gold mt-4">
          Proceed to Sign In
        </Button>
      </Link>
    </div>
  );
};

export default RegistrationSuccess;
