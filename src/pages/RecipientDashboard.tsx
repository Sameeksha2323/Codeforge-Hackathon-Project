import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { Loader2, ChevronDown, ChevronUp, UserCircle, Search, Clock, Bell, FileText, Package, MapPin } from "lucide-react";
import WelcomeMessage from "@/components/WelcomeMessage";

interface MedicineRequest {
  id: string;
  medicine_name: string;
  quantity: number;
  need_by_date: string;
  status: string;
  recipient_entity_id: string;
  ngo_entity_id: string | null;
  // Optional properties that will be added after fetching NGO data
  ngo_name?: string;
  ngo_address?: string;
  ngo_phone?: string;
}

interface RecipientProfile {
  entity_id: string;
  name: string;
  org_name: string | null;
  address: string | null;
  phone: string | null;
  latitude: string | null;
  longitude: string | null;
}

const RecipientDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [medicineRequests, setMedicineRequests] = useState<MedicineRequest[]>([]);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<RecipientProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfileData, setEditedProfileData] = useState<Partial<RecipientProfile>>({});
  const [newRequest, setNewRequest] = useState({
    medicine_name: "",
    quantity: 0,
    need_by_date: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        navigate("/sign-in");
        return;
      }
      
      const currentUser = getUser();
      if (!currentUser || currentUser.userType !== "recipient") {
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
        await fetchMedicineRequests(entityId);
        await fetchRecipientProfile(entityId);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const fetchMedicineRequests = async (recipientId: string) => {
    try {
      console.log('Fetching medicine requests for recipient ID:', recipientId);
      
      const { data, error } = await supabase
        .from('requested_meds')
        .select('*')
        .eq('recipient_entity_id', recipientId);
      
      if (error) {
        throw error;
      }
      
      console.log('Fetched medicine requests:', data);
      
      let requests: MedicineRequest[] = data || [];
      
      // For each request, fetch NGO details if available
      for (let i = 0; i < requests.length; i++) {
        if (requests[i].ngo_entity_id) {
          const { data: ngoData, error: ngoError } = await supabase
            .from('intermediary_ngo')
            .select('*')
            .eq('entity_id', requests[i].ngo_entity_id)
            .single();
          
          if (!ngoError && ngoData) {
            requests[i].ngo_name = ngoData.name || '';
            requests[i].ngo_address = ngoData.address || '';
            requests[i].ngo_phone = ngoData.phone || '';
          }
        }
      }
      
      setMedicineRequests(requests as MedicineRequest[]);
    } catch (error) {
      console.error('Error fetching medicine requests:', error);
      toast({
        title: "Error",
        description: "Failed to load your medicine requests",
        variant: "destructive"
      });
    }
  };

  const fetchRecipientProfile = async (entityId: string) => {
    try {
      console.log('Fetching recipient profile for entity ID:', entityId);
      
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('entity_id', entityId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, create one
          const newProfile: RecipientProfile = {
            entity_id: entityId,
            name: user?.name || '',
            org_name: null,
            address: null,
            phone: null,
            latitude: null,
            longitude: null
          };
          
          const { error: insertError } = await supabase
            .from('recipients')
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
        console.log('Fetched recipient profile:', data);
        setProfileData(data);
        setEditedProfileData(data || {});
      }
    } catch (error) {
      console.error('Error fetching recipient profile:', error);
      toast({
        title: "Error",
        description: "Failed to load your profile",
        variant: "destructive"
      });
    }
  };

  const handleRequestStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('requested_meds')
        .update({ status: newStatus })
        .eq('id', requestId);
      
      if (error) {
        throw error;
      }
      
      setMedicineRequests((prev) => 
        prev.map((req) => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Medicine request status updated to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  const handleNewRequestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setNewRequest(prev => ({
      ...prev,
      need_by_date: date ? date.toISOString().split('T')[0] : ''
    }));
  };

  const handleSubmitNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.medicine_name || !newRequest.quantity || !newRequest.need_by_date) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (!user) return;
      
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
        .from('requested_meds')
        .insert({
          medicine_name: newRequest.medicine_name,
          quantity: newRequest.quantity,
          need_by_date: newRequest.need_by_date,
          recipient_entity_id: entityId,
          status: "uploaded"
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Medicine request submitted successfully"
      });
      
      // Reset form and refresh data
      setNewRequest({
        medicine_name: "",
        quantity: 0,
        need_by_date: ""
      });
      
      await fetchMedicineRequests(entityId);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit medicine request",
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
        .from('recipients')
        .update({
          name: editedProfileData.name,
          org_name: editedProfileData.org_name,
          address: editedProfileData.address,
          phone: editedProfileData.phone
        })
        .eq('entity_id', entityId);
      
      if (error) {
        throw error;
      }
      
      setProfileData({
        ...profileData,
        ...editedProfileData as RecipientProfile
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
          {user && <WelcomeMessage user={user} userTypeTitle="Recipient" />}
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-0">
                  <div className="flex flex-col h-auto items-stretch gap-2 bg-transparent p-1">
                    <button 
                      onClick={() => setActiveTab("requests")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "requests" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Package size={18} />
                      <span>My Medicine Requests</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("new-request")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "new-request" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Search size={18} />
                      <span>Request New Medicine</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("history")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "history" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Clock size={18} />
                      <span>Request History</span>
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
              {activeTab === "requests" && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Medicine Requests</CardTitle>
                    <CardDescription>View and manage your medicine requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {medicineRequests.length > 0 ? (
                      <div className="space-y-4">
                        {medicineRequests.map((request) => (
                          <div key={request.id} className="border rounded-lg overflow-hidden">
                            <div 
                              className={`p-4 cursor-pointer ${
                                request.status === 'uploaded' ? 'bg-amber-50' : 
                                request.status === 'approved' ? 'bg-blue-50' :
                                request.status === 'received' ? 'bg-green-50' : 'bg-white'
                              }`}
                              onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg">{request.medicine_name}</h3>
                                    <span 
                                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        request.status === 'uploaded' ? 'bg-amber-100 text-amber-800' : 
                                        request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                        request.status === 'received' ? 'bg-green-100 text-green-800' : 
                                        'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </span>
                                  </div>
                                  <div className="mt-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Quantity:</span> {request.quantity}</p>
                                    <p><span className="font-medium">Needed by:</span> {new Date(request.need_by_date).toLocaleDateString()}</p>
                                    <p><span className="font-medium">NGO Assigned:</span> {request.ngo_entity_id ? (request.ngo_name || 'Yes') : 'No NGO assigned yet'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Select 
                                    value={request.status} 
                                    onValueChange={(value) => handleRequestStatusChange(request.id, value)}
                                    disabled={request.status === 'approved' && !request.ngo_entity_id}
                                  >
                                    <SelectTrigger className="w-[130px]">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="uploaded">Uploaded</SelectItem>
                                      {request.ngo_entity_id && <SelectItem value="approved">Approved</SelectItem>}
                                      <SelectItem value="received">Received</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {expandedRequest === request.id ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {expandedRequest === request.id && (
                              <div className="p-4 border-t bg-gray-50">
                                <h4 className="font-medium text-sm text-gray-700 mb-2">NGO Details</h4>
                                {request.ngo_entity_id && request.ngo_name ? (
                                  <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">NGO Name:</span> {request.ngo_name}</p>
                                    {request.ngo_address && <p><span className="font-medium">Address:</span> {request.ngo_address}</p>}
                                    {request.ngo_phone && <p><span className="font-medium">Contact:</span> {request.ngo_phone}</p>}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No NGO has been assigned to this request yet.</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>You haven't requested any medicines yet.</p>
                        <Button 
                          className="mt-4 bg-medishare-blue" 
                          onClick={() => setActiveTab("new-request")}
                        >
                          Request Medicine
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "new-request" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request New Medicine</CardTitle>
                    <CardDescription>Submit a request for medicine</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitNewRequest} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="medicine_name" className="text-sm font-medium">Medicine Name</label>
                        <Input 
                          id="medicine_name" 
                          name="medicine_name" 
                          value={newRequest.medicine_name}
                          onChange={handleNewRequestChange}
                          placeholder="Enter medicine name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="quantity" className="text-sm font-medium">Quantity Needed</label>
                        <Input 
                          id="quantity" 
                          name="quantity" 
                          type="number"
                          value={newRequest.quantity || ''}
                          onChange={handleNewRequestChange}
                          placeholder="Enter quantity"
                          min={1}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="need_by_date" className="text-sm font-medium">Needed By Date</label>
                        <DatePicker 
                          date={newRequest.need_by_date ? new Date(newRequest.need_by_date) : undefined}
                          onSelect={handleDateChange}
                          disabled={(date) => date < new Date()}
                        />
                      </div>
                      
                      <Button type="submit" className="bg-medishare-blue">
                        Submit Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "history" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request History</CardTitle>
                    <CardDescription>View history of all your medicine requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {medicineRequests.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Needed By</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO</th>
                            </tr>
                          </thead>
                          <tbody>
                            {medicineRequests.map((request) => (
                              <tr key={request.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm">{request.id}</td>
                                <td className="px-4 py-4 text-sm">{request.medicine_name}</td>
                                <td className="px-4 py-4 text-sm">{request.quantity}</td>
                                <td className="px-4 py-4 text-sm">{new Date(request.need_by_date).toLocaleDateString()}</td>
                                <td className="px-4 py-4 text-sm">
                                  <span 
                                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                                      request.status === 'uploaded' ? 'bg-amber-100 text-amber-800' : 
                                      request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                      request.status === 'received' ? 'bg-green-100 text-green-800' : 
                                      'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">{request.ngo_entity_id ? (request.ngo_name || "Assigned") : "Not assigned"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No request history available.</p>
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
                        <CardTitle>Recipient Profile</CardTitle>
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

export default RecipientDashboard;
