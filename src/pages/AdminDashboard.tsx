import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Filter, Search, UserPlus, Check, X, Clock } from "lucide-react";
import MedicineDonationsTab from "@/components/admin-dashboard/MedicineDonationsTab";
import MedicineRequestsTab from "@/components/admin-dashboard/MedicineRequestsTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/sign-in");
      return;
    }

    const userData = getUser();
    if (!userData || userData.userType !== "admin") {
      navigate("/sign-in");
      return;
    }

    fetchUsers();

    const usersChannel = supabase
      .channel('public:users')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users' 
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          setUsers(prevUsers => {
            const updatedUsers = prevUsers.map(user => {
              if (user.id === payload.new.id) {
                return {
                  ...user,
                  verification: payload.new.verification
                };
              }
              return user;
            });
            setFilteredUsers(updatedUsers);
            return updatedUsers;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
    };
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Could not fetch users. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      const processedUsers = usersData.map((user) => ({
        id: user.id,
        name: user.entity_type === 'Donor' ? 'Donor' : 
             user.entity_type === 'Recipient' ? 'Recipient' : 
             user.entity_type === 'Intermediary NGO' ? 'NGO' : 'Admin',
        email: user.email,
        userType: user.entity_type,
        createdAt: user.created_at,
        verification: user.verification || 'Waiting approval',
        verificationId: user.verification_id
      }));

      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleVerifyUser = async (status: string) => {
    if (!selectedUser) return;
    
    setProcessingUser(selectedUser.id);
    setStatusError(null);
    
    try {
      let verificationStatus: string;
      
      switch(status) {
        case 'Verified':
          verificationStatus = 'Verified';
          break;
        case 'Rejected':
          verificationStatus = 'Rejected';
          break;
        default:
          verificationStatus = 'Waiting approval';
      }
      
      console.log(`Updating user ${selectedUser.id} with status: ${verificationStatus}`);
      
      const { error } = await supabase
        .from('users')
        .update({ 
          verification: verificationStatus
        })
        .eq('id', selectedUser.id);

      if (error) {
        console.error("Error updating user status:", error);
        setStatusError(`Failed to update status: ${error.message}`);
        toast({
          title: "Error",
          description: `Failed to update status: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, verification: verificationStatus } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: `User status has been ${verificationStatus === 'Waiting approval' ? 'reset to waiting approval' : verificationStatus.toLowerCase()}.`,
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setProcessingUser(null);
    }
  };

  const getVerificationStatusBadge = (status: string) => {
    if (status === 'Verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          <Check className="h-3 w-3" />
          Verified
        </span>
      );
    } else if (status === 'Rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
          <X className="h-3 w-3" />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
          <Clock className="h-3 w-3" />
          Waiting Approval
        </span>
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-medishare-dark">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage users, medicines, and monitor platform activity
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              variant={activeTab === "users" ? "default" : "outline"}
              onClick={() => handleTabChange("users")}
              className={activeTab === "users" ? "bg-medishare-orange" : ""}
            >
              Users Management
            </Button>
            <Button
              variant={activeTab === "donations" ? "default" : "outline"}
              onClick={() => handleTabChange("donations")}
              className={activeTab === "donations" ? "bg-medishare-orange" : ""}
            >
              Medicine Donations
            </Button>
            <Button
              variant={activeTab === "requests" ? "default" : "outline"}
              onClick={() => handleTabChange("requests")}
              className={activeTab === "requests" ? "bg-medishare-orange" : ""}
            >
              Medicine Requests
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "outline"}
              onClick={() => handleTabChange("analytics")}
              className={activeTab === "analytics" ? "bg-medishare-orange" : ""}
            >
              Analytics
            </Button>
          </div>

          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Registered Users</CardTitle>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Name/Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Verification ID</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleUserClick(user)}
                      >
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.userType === "Donor"
                                ? "bg-blue-100 text-blue-700"
                                : user.userType === "Recipient"
                                ? "bg-green-100 text-green-700"
                                : user.userType === "Intermediary NGO"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.userType}
                          </span>
                        </TableCell>
                        <TableCell>{user.verificationId}</TableCell>
                        <TableCell>
                          {user.createdAt
                            ? format(new Date(user.createdAt), "PPP")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {getVerificationStatusBadge(user.verification)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "donations" && <MedicineDonationsTab />}

          {activeTab === "requests" && <MedicineRequestsTab />}

          {activeTab === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  Analytics information will be displayed here.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p>{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User Type</p>
                  <p>{selectedUser.userType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p>{selectedUser.verification || "Waiting approval"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Verification ID
                  </p>
                  <p>{selectedUser.verificationId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Registration Date
                  </p>
                  <p>
                    {selectedUser.createdAt
                      ? format(new Date(selectedUser.createdAt), "PPP")
                      : "N/A"}
                  </p>
                </div>
              </div>

              {statusError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {statusError}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                {selectedUser.verification !== 'Verified' && (
                  <Button
                    onClick={() => handleVerifyUser('Verified')}
                    disabled={processingUser === selectedUser.id}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {processingUser === selectedUser.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-1"/>
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    Verify User
                  </Button>
                )}
                
                {selectedUser.verification !== 'Rejected' && (
                  <Button
                    onClick={() => handleVerifyUser('Rejected')}
                    disabled={processingUser === selectedUser.id}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {processingUser === selectedUser.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-1"/>
                    ) : (
                      <X className="h-4 w-4 mr-1" />
                    )}
                    Reject User
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default AdminDashboard;
