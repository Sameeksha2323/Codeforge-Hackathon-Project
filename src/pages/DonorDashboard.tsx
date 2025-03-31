import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { Loader2, ChevronDown, ChevronUp, UserCircle, Bell, FileText, Package, MapPin } from "lucide-react";
import WelcomeMessage from "@/components/WelcomeMessage";
import DonateTab from "@/components/donor-dashboard/DonateTab";

interface DonatedMedicine {
  id: number;
  medicine_name: string;
  quantity: number;
  expiry_date: string;
  date_added: string;
  status: string;
  donor_entity_id: string;
  ngo_entity_id: string | null;
  image_url: string;
  ingredients: string;
  // Optional properties that will be added after fetching NGO data
  ngo_name?: string;
  ngo_address?: string;
  ngo_phone?: string;
}

interface DonorProfile {
  entity_id: string;
  name: string;
  org_name: string;
  address: string;
  phone: string | null;
  latitude: string | null;
  longitude: string | null;
}

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("donations");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [donatedMedicines, setDonatedMedicines] = useState<DonatedMedicine[]>([]);
  const [expandedDonation, setExpandedDonation] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<DonorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfileData, setEditedProfileData] = useState<Partial<DonorProfile>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        navigate("/sign-in");
        return;
      }
      
      const currentUser = getUser();
      if (!currentUser || currentUser.userType !== "donor") {
        navigate("/sign-in");
        return;
      }
      
      setUser(currentUser);
      
      // Get entity_id from users table based on email
      const { data: userEntityData, error: userError } = await supabase
        .from('users')
        .select('entity_id')
        .eq('email', currentUser.email)
        .single();
      
      if (userError) {
        console.error('Error fetching user entity_id:', userError);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const entityId = userEntityData?.entity_id;
      
      if (entityId) {
        await fetchDonatedMedicines(entityId);
        await fetchDonorProfile(entityId);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const fetchDonatedMedicines = async (donorId: string) => {
    try {
      console.log('Fetching donated medicines for donor ID:', donorId);
      
      const { data, error } = await supabase
        .from('donated_meds')
        .select('*')
        .eq('donor_entity_id', donorId);
      
      if (error) {
        throw error;
      }
      
      console.log('Fetched donated medicines:', data);
      
      // Convert all data to match the DonatedMedicine interface, ensuring id is a number
      let medicines = (data || []).map(item => ({
        ...item,
        id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id
      })) as DonatedMedicine[];
      
      // For each medicine, fetch NGO details if available
      for (let i = 0; i < medicines.length; i++) {
        if (medicines[i].ngo_entity_id) {
          const { data: ngoData, error: ngoError } = await supabase
            .from('intermediary_ngo')
            .select('*')
            .eq('entity_id', medicines[i].ngo_entity_id)
            .single();
          
          if (!ngoError && ngoData) {
            medicines[i].ngo_name = ngoData.name || '';
            medicines[i].ngo_address = ngoData.address || '';
            medicines[i].ngo_phone = ngoData.phone || '';
          }
        }
      }
      
      setDonatedMedicines(medicines);
    } catch (error) {
      console.error('Error fetching donated medicines:', error);
      toast({
        title: "Error",
        description: "Failed to load your donated medicines",
        variant: "destructive"
      });
    }
  };

  const fetchDonorProfile = async (entityId: string) => {
    try {
      console.log('Fetching donor profile for entity ID:', entityId);
      
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('entity_id', entityId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, create one
          const newProfile: DonorProfile = {
            entity_id: entityId,
            name: user?.name || '',
            org_name: user?.organization || '',
            address: user?.address || '',
            phone: user?.phoneNumber || null,
            latitude: null,
            longitude: null
          };
          
          const { error: insertError } = await supabase
            .from('donors')
            .insert(newProfile);
          
          if (insertError) {
            throw insertError;
          }
          
          setProfileData(newProfile);
          setEditedProfileData(newProfile);
        } else {
          throw error;
        }
      } else {
        console.log('Fetched donor profile:', data);
        setProfileData(data);
        setEditedProfileData(data || {});
      }
    } catch (error) {
      console.error('Error fetching donor profile:', error);
      toast({
        title: "Error",
        description: "Failed to load your profile",
        variant: "destructive"
      });
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      if (!user || !editedProfileData || !profileData) return;
      
      // Get entity_id from users table based on email
      const { data: userEntityData, error: userError } = await supabase
        .from('users')
        .select('entity_id')
        .eq('email', user.email)
        .single();
      
      if (userError) {
        throw userError;
      }
      
      const entityId = userEntityData?.entity_id;
      
      if (!entityId) {
        throw new Error('User entity ID not found');
      }
      
      const { error } = await supabase
        .from('donors')
        .update({
          name: editedProfileData.name || profileData.name,
          org_name: editedProfileData.org_name || profileData.org_name,
          address: editedProfileData.address || profileData.address,
          phone: editedProfileData.phone
        })
        .eq('entity_id', entityId);
      
      if (error) {
        throw error;
      }
      
      setProfileData({
        ...profileData,
        ...editedProfileData as DonorProfile
      });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {user && <WelcomeMessage user={user} userTypeTitle="Donor" />}
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-0">
                  <div className="flex flex-col h-auto items-stretch gap-2 bg-transparent p-1">
                    <button 
                      onClick={() => setActiveTab("donations")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "donations" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Package size={18} />
                      <span>My Donations</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("profile")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "profile" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <UserCircle size={18} />
                      <span>Profile</span>
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
              {activeTab === "donations" && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Medicine Donations</CardTitle>
                    <CardDescription>View and manage your medicine donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user && <DonateTab user={user} />}
                    
                    {donatedMedicines.length > 0 ? (
                      <div className="space-y-4">
                        {donatedMedicines.map((donation) => (
                          <div key={donation.id} className="border rounded-lg overflow-hidden">
                            <div 
                              className={`p-4 cursor-pointer ${
                                donation.status === 'uploaded' ? 'bg-amber-50' : 
                                donation.status === 'received' ? 'bg-green-50' : 'bg-white'
                              }`}
                              onClick={() => setExpandedDonation(expandedDonation === donation.id ? null : donation.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg">{donation.medicine_name}</h3>
                                    <span 
                                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        donation.status === 'uploaded' ? 'bg-amber-100 text-amber-800' : 
                                        donation.status === 'received' ? 'bg-green-100 text-green-800' : 
                                        'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                    </span>
                                  </div>
                                  <div className="mt-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Quantity:</span> {donation.quantity}</p>
                                    <p><span className="font-medium">Expiry Date:</span> {new Date(donation.expiry_date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {expandedDonation === donation.id ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {expandedDonation === donation.id && (
                              <div className="p-4 border-t bg-gray-50">
                                <h4 className="font-medium text-sm text-gray-700 mb-2">NGO Details</h4>
                                {donation.ngo_entity_id && donation.ngo_name ? (
                                  <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">NGO Name:</span> {donation.ngo_name}</p>
                                    {donation.ngo_address && <p><span className="font-medium">Address:</span> {donation.ngo_address}</p>}
                                    {donation.ngo_phone && <p><span className="font-medium">Contact:</span> {donation.ngo_phone}</p>}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No NGO has been assigned to this donation yet.</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>You haven't donated any medicines yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>Donor Profile</CardTitle>
                        <CardDescription>Manage your profile information</CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button onClick={() => setIsEditing(false)} variant="outline">
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfile} className="bg-medishare-blue">
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {profileData ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            {isEditing ? (
                              <Input 
                                name="name" 
                                value={editedProfileData.name || ''} 
                                onChange={handleProfileInputChange} 
                              />
                            ) : (
                              <p className="text-base">{profileData.name}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Organization Name</label>
                            {isEditing ? (
                              <Input 
                                name="org_name" 
                                value={editedProfileData.org_name || ''} 
                                onChange={handleProfileInputChange} 
                              />
                            ) : (
                              <p className="text-base">{profileData.org_name || 'Not provided'}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            {isEditing ? (
                              <Input 
                                name="phone" 
                                value={editedProfileData.phone || ''} 
                                onChange={handleProfileInputChange} 
                              />
                            ) : (
                              <p className="text-base">{profileData.phone || 'Not provided'}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <p className="text-base">{user?.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Address</label>
                          {isEditing ? (
                            <Textarea 
                              name="address" 
                              value={editedProfileData.address || ''} 
                              onChange={handleProfileInputChange} 
                              className="min-h-[80px]"
                            />
                          ) : (
                            <p className="text-base">{profileData.address || 'Not provided'}</p>
                          )}
                        </div>
                        
                        {(profileData.latitude && profileData.longitude) && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-medishare-blue" />
                              <p className="text-base">
                                Latitude: {profileData.latitude}, Longitude: {profileData.longitude}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Profile information not available.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Your recent notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <p>No notifications available at this time.</p>
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

export default DonorDashboard;
