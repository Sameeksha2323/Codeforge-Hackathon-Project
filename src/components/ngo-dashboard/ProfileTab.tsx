
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/utils/auth";

// Sample initial NGO data (in a real app, this would be fetched from the database)
const initialNGOData = {
  name: "Health For All Foundation",
  email: "contact@healthforall.org",
  phone: "+91 9876543210",
  address: "123 Charity Lane, Mumbai, Maharashtra, India",
  website: "www.healthforall.org",
  regNumber: "NGO12345",
  foundedYear: "2005",
  mission: "Providing medical aid to underserved communities across India with a focus on preventive healthcare and medicine accessibility.",
  areasServed: "Maharashtra, Gujarat, Karnataka",
  beneficiaries: "Low-income families, rural communities, elderly population",
};

const ProfileTab = () => {
  const [user, setUser] = useState(getUser());
  const [ngoData, setNgoData] = useState(initialNGOData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(ngoData);

  useEffect(() => {
    // In a real implementation, this would fetch data from the intermediary_ngo table
    // For now, we'll simulate that with our sample data
    setNgoData({
      ...initialNGOData,
      name: user?.organization || initialNGOData.name,
      email: user?.email || initialNGOData.email,
    });
    setFormData({
      ...initialNGOData,
      name: user?.organization || initialNGOData.name,
      email: user?.email || initialNGOData.email,
    });
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    // In a real implementation, this would update the intermediary_ngo table in the database
    setNgoData(formData);
    setIsEditing(false);
    
    // Update user data locally - in a real app, this would update the database
    const updatedUser = {
      ...user,
      organization: formData.name,
      email: formData.email,
    };
    setUser(updatedUser);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Organization Profile</CardTitle>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Organization Name</label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{ngoData.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                {isEditing ? (
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{ngoData.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{ngoData.phone}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                {isEditing ? (
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{ngoData.address}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Website</label>
                {isEditing ? (
                  <Input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{ngoData.website}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Registration Number</label>
                {isEditing ? (
                  <Input
                    name="regNumber"
                    value={formData.regNumber}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{ngoData.regNumber}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Founded Year</label>
                {isEditing ? (
                  <Input
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{ngoData.foundedYear}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Organization Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Mission</label>
                {isEditing ? (
                  <Textarea
                    name="mission"
                    value={formData.mission}
                    onChange={handleInputChange}
                    rows={4}
                  />
                ) : (
                  <p>{ngoData.mission}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Areas Served</label>
                {isEditing ? (
                  <Input
                    name="areasServed"
                    value={formData.areasServed}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{ngoData.areasServed}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Beneficiaries</label>
                {isEditing ? (
                  <Input
                    name="beneficiaries"
                    value={formData.beneficiaries}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{ngoData.beneficiaries}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
