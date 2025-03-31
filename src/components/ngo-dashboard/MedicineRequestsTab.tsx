
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface MedicineRequest {
  id: string;
  medicine_name: string | null;
  quantity: number | null;
  need_by_date: string | null;
  status: string | null;
  recipient_entity_id: string;
  ngo_entity_id: string | null;
  recipient_name?: string;
}

interface MedicineRequestsTabProps {
  ngoEntityId: string;
}

const MedicineRequestsTab = ({ ngoEntityId }: MedicineRequestsTabProps) => {
  const [requests, setRequests] = useState<MedicineRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch all medicine requests that are not rejected
      const { data, error } = await supabase
        .from('requested_meds')
        .select('*')
        .not('status', 'eq', 'rejected');
      
      if (error) throw error;
      
      // Convert all requests to have proper formatting
      let requestsList: MedicineRequest[] = data || [];
      
      // Fetch recipient information for each request
      for (let i = 0; i < requestsList.length; i++) {
        const { data: recipientData, error: recipientError } = await supabase
          .from('recipients')
          .select('name, org_name')
          .eq('entity_id', requestsList[i].recipient_entity_id)
          .single();
        
        if (!recipientError && recipientData) {
          requestsList[i].recipient_name = recipientData.org_name || recipientData.name;
        }
      }
      
      setRequests(requestsList);
    } catch (error) {
      console.error("Error fetching medicine requests:", error);
      toast({
        title: "Error",
        description: "Failed to load medicine requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!ngoEntityId) {
      toast({
        title: "Error",
        description: "NGO information not found",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // First check if the request has been rejected by an admin
      const { data: requestData, error: checkError } = await supabase
        .from('requested_meds')
        .select('status')
        .eq('id', requestId)
        .single();
      
      if (checkError) throw checkError;
      
      // If request is rejected, prevent accepting it
      if (requestData && requestData.status === 'rejected') {
        toast({
          title: "Cannot Accept",
          description: "This request has been rejected by an administrator and cannot be accepted.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('requested_meds')
        .update({
          ngo_entity_id: ngoEntityId,
          status: 'approved'
        })
        .eq('id', requestId);
        
      if (error) throw error;
      
      toast({
        title: "Request Approved",
        description: "You have successfully approved this medicine request.",
      });
      
      // Update the request in the UI
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId 
            ? { ...req, status: 'approved', ngo_entity_id: ngoEntityId } 
            : req
        )
      );
    } catch (error) {
      console.error("Error approving medicine request:", error);
      toast({
        title: "Error",
        description: "Failed to approve medicine request",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medicine Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medishare-blue"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p>No medicine requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Need By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.medicine_name || 'N/A'}</TableCell>
                    <TableCell>{request.quantity || 'N/A'}</TableCell>
                    <TableCell>{request.recipient_name || 'Unknown'}</TableCell>
                    <TableCell>
                      {request.need_by_date 
                        ? new Date(request.need_by_date).toLocaleDateString() 
                        : 'Not specified'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getStatusBadgeClass(request.status)
                        }`}
                      >
                        {request.status 
                          ? request.status.charAt(0).toUpperCase() + request.status.slice(1) 
                          : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {(!request.ngo_entity_id || request.ngo_entity_id === ngoEntityId) && 
                       request.status !== 'fulfilled' && request.status !== 'rejected' && (
                        <Button 
                          size="sm" 
                          className="bg-medishare-blue hover:bg-medishare-blue/90"
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={request.status === 'approved'}
                        >
                          {request.status === 'approved' ? 'Approved' : 'Accept'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicineRequestsTab;
