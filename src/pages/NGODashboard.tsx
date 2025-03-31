import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WelcomeMessage from "@/components/WelcomeMessage";
import DashboardUserInfo from "@/components/DashboardUserInfo";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserCircle,
  Package2,
  Search,
  Clock,
  Bell,
  BarChart3,
  MapPin,
  CheckCircle2,
  Truck,
  Users,
  AlertTriangle,
  Check
} from "lucide-react";
import DonorsMap from "@/components/maps/DonorsMap";
import ImpactChart from "@/components/charts/ImpactChart";
import DonationChart from "@/components/charts/DonationChart";
import DonorsNearMeTab from "@/components/ngo-dashboard/DonorsNearMeTab";
import MedicineRequestsTab from "@/components/ngo-dashboard/MedicineRequestsTab";
import AvailableMedicinesTab from "@/components/ngo-dashboard/AvailableMedicinesTab";
import DistributionTab from "@/components/ngo-dashboard/DistributionTab";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DonatedMedicine {
  id: string;
  medicine_name: string | null;
  quantity: number | null;
  donor_entity_id: string;
  ngo_entity_id: string | null;
  expiry_date: string | null;
  status: string | null;
  date_added: string | null;
  ingredients: string | null;
  image_url: string | null;
  donor_name?: string;
}

const distributionHistory = [
  {
    id: "DIST001",
    medicine: "Paracetamol",
    quantity: "50 tablets",
    recipient: "City Hospital",
    date: "2023-12-01",
    status: "Delivered"
  },
  {
    id: "DIST002",
    medicine: "Antibiotics",
    quantity: "20 capsules",
    recipient: "Rural Health Camp",
    date: "2023-12-05",
    status: "In Transit"
  },
  {
    id: "DIST003",
    medicine: "Insulin",
    quantity: "5 vials",
    recipient: "Private Clinic",
    date: "2023-12-10",
    status: "Processing"
  }
];

const impactData = {
  totalMedicinesReceived: 1250,
  totalMedicinesDistributed: 850,
  beneficiariesServed: 345,
  activeDonors: 24
};

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState<Partial<UserData>>({});
  const [loading, setLoading] = useState(true);
  const [ngoEntityId, setNgoEntityId] = useState<string | null>(null);
  const [availableMedicines, setAvailableMedicines] = useState<DonatedMedicine[]>([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      
      if (!isAuth) {
        navigate("/sign-in");
        return;
      }
      
      const userData = getUser();
      if (!userData || userData.userType !== "ngo") {
        navigate("/sign-in");
        return;
      }
      
      setUser(userData);
      setEditableUserData({
        name: userData.name,
        organization: userData.organization,
        address: userData.address,
        phoneNumber: userData.phoneNumber
      });

      const { data: userEntityData, error: userError } = await supabase
        .from('users')
        .select('entity_id')
        .eq('email', userData.email)
        .single();
      
      if (userError) {
        console.error('Error fetching entity_id:', userError);
        toast({
          title: "Error",
          description: "Failed to fetch NGO data",
          variant: "destructive"
        });
      } else if (userEntityData) {
        setNgoEntityId(userEntityData.entity_id);
        
        await updateNGOInfo(userEntityData.entity_id, userData);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const updateNGOInfo = async (entityId: string, userData: UserData) => {
    try {
      const { data: existingNgoData, error: fetchError } = await supabase
        .from('intermediary_ngo')
        .select('*')
        .eq('entity_id', entityId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing NGO data:', fetchError);
        return;
      }
      
      const ngoData = {
        entity_id: entityId,
        name: userData.organization || userData.name,
        address: userData.address,
        phone: userData.phoneNumber
      };
      
      if (existingNgoData) {
        const { error: updateError } = await supabase
          .from('intermediary_ngo')
          .update(ngoData)
          .eq('entity_id', entityId);
          
        if (updateError) {
          console.error('Error updating NGO information:', updateError);
        }
      } else {
        const { error: insertError } = await supabase
          .from('intermediary_ngo')
          .insert(ngoData);
          
        if (insertError) {
          console.error('Error inserting NGO information:', insertError);
        }
      }
    } catch (error) {
      console.error('Error updating NGO information:', error);
    }
  };

  const fetchAvailableMedicines = async () => {
    setLoadingMedicines(true);
    try {
      const { data, error } = await supabase
        .from('donated_meds')
        .select('*')
        .eq('status', 'uploaded')
        .is('ngo_entity_id', null);
    
      if (error) throw error;
      
      let medicines: DonatedMedicine[] = data ? data.map(med => ({
        ...med,
        id: med.id.toString()
      })) : [];
      
      for (let i = 0; i < medicines.length; i++) {
        const { data: donorData, error: donorError } = await supabase
          .from('donors')
          .select('name, org_name')
          .eq('entity_id', medicines[i].donor_entity_id)
          .single();
        
        if (!donorError && donorData) {
          medicines[i].donor_name = donorData.org_name || donorData.name;
        }
      }
      
      setAvailableMedicines(medicines);
    } catch (error) {
      console.error('Error fetching available medicines:', error);
      toast({
        title: "Error",
        description: "Failed to load available medicines",
        variant: "destructive"
      });
    } finally {
      setLoadingMedicines(false);
    }
  };

  const handleRequestMedicine = async (medicineId: string) => {
    if (!ngoEntityId) {
      toast({
        title: "Error",
        description: "NGO information not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('donated_meds')
        .update({
          ngo_entity_id: ngoEntityId,
          status: 'approved'
        })
        .eq('id', parseInt(medicineId))
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Medicine request submitted successfully",
        variant: "default"
      });
      
      setAvailableMedicines(prev => prev.filter(med => med.id !== medicineId));
    } catch (error) {
      console.error('Error requesting medicine:', error);
      toast({
        title: "Error",
        description: "Failed to request medicine",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailableMedicines();
    }
  }, [activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (user && ngoEntityId) {
      const updatedUser = { 
        ...user, 
        ...editableUserData 
      };
      
      localStorage.setItem('medishare_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      await updateNGOInfo(ngoEntityId, updatedUser);
      
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default"
      });
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditableUserData({
        name: user.name,
        organization: user.organization,
        address: user.address,
        phoneNumber: user.phoneNumber
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <WelcomeMessage user={user} userTypeTitle="NGO Partner" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-0">
                  <div className="flex flex-col h-auto items-stretch gap-2 bg-transparent p-1">
                    <button 
                      onClick={() => setActiveTab("profile")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "profile" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <UserCircle size={18} />
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("available")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "available" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Search size={18} />
                      <span>Available Medicines</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("distribution")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "distribution" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Truck size={18} />
                      <span>Distribution</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("requests")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "requests" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Clock size={18} />
                      <span>Request Status</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("impact")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "impact" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <BarChart3 size={18} />
                      <span>Impact Metrics</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("donors")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "donors" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <MapPin size={18} />
                      <span>Donors Near Me</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("notifications")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "notifications" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Bell size={18} />
                      <span>Notifications</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-9">
              {activeTab === "profile" && (
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl">NGO Partner Information</CardTitle>
                        <CardDescription>Your account details</CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleCancelEdit}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveProfile}
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        {isEditing ? (
                          <Input
                            name="name"
                            value={editableUserData.name || ""}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-base">{user.name || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base">{user.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Organization</p>
                        {isEditing ? (
                          <Input
                            name="organization"
                            value={editableUserData.organization || ""}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-base">{user.organization || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        {isEditing ? (
                          <Input
                            name="address"
                            value={editableUserData.address || ""}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-base">{user.address || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                        {isEditing ? (
                          <Input
                            name="phoneNumber"
                            value={editableUserData.phoneNumber || ""}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-base">{user.phoneNumber || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">UID Number</p>
                        <p className="text-base">{user.verificationId || "Not provided"}</p>
                      </div>
                      
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
              )}
              
              {activeTab === "available" && <AvailableMedicinesTab ngoEntityId={ngoEntityId || ""} />}
              
              {activeTab === "distribution" && <DistributionTab ngoEntityId={ngoEntityId || ""} />}
              
              {activeTab === "requests" && <MedicineRequestsTab ngoEntityId={ngoEntityId || ""} />}
              
              {activeTab === "impact" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Metrics</CardTitle>
                    <CardDescription>Track your organization's impact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-medishare-blue">{impactData.totalMedicinesReceived}</p>
                            <p className="text-sm text-gray-500 mt-1">Medicines Received</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-medishare-orange">{impactData.totalMedicinesDistributed}</p>
                            <p className="text-sm text-gray-500 mt-1">Medicines Distributed</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{impactData.beneficiariesServed}</p>
                            <p className="text-sm text-gray-500 mt-1">Beneficiaries Served</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-purple-600">{impactData.activeDonors}</p>
                            <p className="text-sm text-gray-500 mt-1">Active Donors</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <ImpactChart title="Medicines by Category" />
                      <DonationChart title="Monthly Donation Trends" />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "donors" && <DonorsNearMeTab />}
              
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Stay updated with the latest alerts and information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <CheckCircle2 size={18} className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-800">Medicine Request Approved</h4>
                            <p className="text-sm text-gray-600 mt-1">Your request for Paracetamol from John Doe Pharmaceuticals has been approved.</p>
                            <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NGODashboard;
