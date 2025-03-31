
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";

interface MedicineRequest {
  id: string;
  medicine_name: string;
  quantity: number;
  medical_condition: string;
  status: string;
  requested_date: string;
  recipient_entity_id: string;
  ngo_entity_id?: string;
}

const MedicineRequestsTab = () => {
  const [requests, setRequests] = useState<MedicineRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const userEntityId = user?.entity_id || user?.id;

  useEffect(() => {
    // Fetch medicine requests
    const fetchRequests = async () => {
      try {
        // In a real app, this would be an API call to fetch from the database
        // For this demo, we'll use mock data
        const mockRequests: MedicineRequest[] = [
          {
            id: "req-1",
            medicine_name: "Amoxicillin",
            quantity: 30,
            medical_condition: "Bacterial infection",
            status: "pending",
            requested_date: "2023-06-15",
            recipient_entity_id: userEntityId || "",
          },
          {
            id: "req-2",
            medicine_name: "Paracetamol",
            quantity: 20,
            medical_condition: "Fever",
            status: "approved",
            requested_date: "2023-06-10",
            recipient_entity_id: userEntityId || "",
            ngo_entity_id: "ngo-123",
          },
          {
            id: "req-3",
            medicine_name: "Ibuprofen",
            quantity: 15,
            medical_condition: "Pain relief",
            status: "rejected",
            requested_date: "2023-06-05",
            recipient_entity_id: userEntityId || "",
          },
          {
            id: "req-4",
            medicine_name: "Omeprazole",
            quantity: 30,
            medical_condition: "Acid reflux",
            status: "delivered",
            requested_date: "2023-05-20",
            recipient_entity_id: userEntityId || "",
            ngo_entity_id: "ngo-456",
          },
        ];

        setRequests(mockRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medicine requests:", error);
        toast({
          title: "Error",
          description: "Failed to load medicine requests",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userEntityId]);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      // Check if the medicine request is rejected
      const request = requests.find((req) => req.id === requestId);
      if (!request) {
        toast({
          title: "Error",
          description: "Medicine request not found.",
          variant: "destructive",
        });
        return;
      }

      // Don't allow status changes for rejected requests
      if (request.status === "rejected") {
        toast({
          title: "Cannot update status",
          description: "Rejected medicine requests cannot be updated.",
          variant: "destructive",
        });
        return;
      }

      // Don't allow approved requests to be changed back to uploaded
      if (request.status === "approved" && newStatus === "uploaded") {
        toast({
          title: "Cannot update status",
          description: "Approved medicine requests cannot be changed back to uploaded.",
          variant: "destructive",
        });
        return;
      }

      // In a real app, this would be an API call to update the status in the database
      // Update the status in the Supabase database
      const { error } = await supabase
        .from('requested_meds')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        console.error("Error updating request status:", error);
        throw error;
      }

      // Update the local state
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );

      toast({
        title: "Status updated",
        description: `Medicine request status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  // Function to get the appropriate status options based on current status
  const getStatusOptions = (currentStatus: string) => {
    // If the status is rejected, don't allow changes
    if (currentStatus === "rejected") {
      return [{ value: "rejected", label: "Rejected" }];
    }
    
    // If the status is approved, only allow changing to "received"
    if (currentStatus === "approved") {
      return [
        { value: "approved", label: "Approved" },
        { value: "received", label: "Received" }
      ];
    }

    // For other statuses (like uploaded), allow appropriate options
    return [
      { value: "uploaded", label: "Uploaded" },
      { value: "received", label: "Received" }
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Medicine Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medishare-blue"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p>No medicine requests found</p>
            <Button className="mt-4" variant="outline">
              Request New Medicine
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Medicine Name</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Medical Condition</th>
                  <th className="px-4 py-2 text-left">Request Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{request.medicine_name}</td>
                    <td className="px-4 py-3">{request.quantity}</td>
                    <td className="px-4 py-3">{request.medical_condition}</td>
                    <td className="px-4 py-3">
                      {new Date(request.requested_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : request.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : request.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : request.status === "delivered"
                            ? "bg-purple-100 text-purple-800"
                            : request.status === "received"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Select
                          disabled={request.status === "rejected"}
                          onValueChange={(value) => handleStatusChange(request.id, value)}
                          defaultValue={request.status}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {getStatusOptions(request.status).map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicineRequestsTab;
