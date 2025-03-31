
import React from "react";
import { UserData } from "@/utils/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardUserInfoProps {
  user: UserData;
  userTypeTitle: string;
}

const DashboardUserInfo = ({ user, userTypeTitle }: DashboardUserInfoProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{userTypeTitle} Information</CardTitle>
        <CardDescription>Your account details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-base">{user.name || "Not provided"}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-base">{user.email}</p>
          </div>
          
          {user.organization && (
            <div>
              <p className="text-sm font-medium text-gray-500">Organization</p>
              <p className="text-base">{user.organization}</p>
            </div>
          )}
          
          {user.address && (
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-base">{user.address}</p>
            </div>
          )}
          
          {user.phoneNumber && (
            <div>
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="text-base">{user.phoneNumber}</p>
            </div>
          )}
          
          {user.verificationId && (
            <div>
              <p className="text-sm font-medium text-gray-500">
                {user.userType === "donor" ? "GST Number" : 
                 user.userType === "ngo" ? "UID Number" : 
                 user.userType === "recipient" ? "DigiLocker ID" : 
                 "Verification ID"}
              </p>
              <p className="text-base">{user.verificationId}</p>
            </div>
          )}
          
          {user.department && (
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-base">{user.department}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-500">Account Created</p>
            <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Verification Status</p>
            <p className={`text-base ${user.verified ? "text-green-600" : "text-amber-600"}`}>
              {user.verified ? "Verified" : "Pending Verification"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardUserInfo;
