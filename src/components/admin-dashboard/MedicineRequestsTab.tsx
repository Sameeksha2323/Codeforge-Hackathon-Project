
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Check, X, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const MedicineRequestsTab = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(
        (request) =>
          request.medicine_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  }, [searchTerm, requests]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("requested_meds")
        .select(`
          *,
          recipients:recipient_entity_id (name),
          intermediary_ngo:ngo_entity_id (name)
        `)
        .order("need_by_date", { ascending: false });

      if (error) {
        throw error;
      }

      // Process the data to include recipient names
      const processedData = data.map((request) => ({
        ...request,
        recipient_name: request.recipients?.name || "Unknown",
        ngo_name: request.intermediary_ngo?.name || "Not assigned"
      }));

      setRequests(processedData);
      setFilteredRequests(processedData);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch medicine requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Add ID to processing set
    setProcessingIds(prev => new Set(prev).add(id));
    
    try {
      console.log(`Updating request ${id} status to ${newStatus}`);
      
      const { error } = await supabase
        .from("requested_meds")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
        throw error;
      }

      // Update local state
      const updatedRequests = requests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      );
      setRequests(updatedRequests);
      setFilteredRequests(
        filteredRequests.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );

      toast({
        title: "Success",
        description: `Request status updated to ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Error updating request status:", error);
      toast({
        title: "Error",
        description: `Failed to update request status: ${error.message || error}`,
        variant: "destructive",
      });
    } finally {
      // Remove ID from processing set
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Medicine Requests</CardTitle>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search requests..."
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
        {isLoading ? (
          <div className="text-center py-10">Loading requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No medicine requests found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>NGO</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Need By Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.medicine_name || "N/A"}</TableCell>
                  <TableCell>{request.recipient_name}</TableCell>
                  <TableCell>{request.ngo_name}</TableCell>
                  <TableCell>{request.quantity || "N/A"}</TableCell>
                  <TableCell>
                    {request.need_by_date
                      ? format(new Date(request.need_by_date), "PPP")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : request.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {request.status || "uploaded"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {request.status !== "approved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingIds.has(request.id)}
                          className="h-8 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          onClick={() => handleStatusChange(request.id, "approved")}
                        >
                          {processingIds.has(request.id) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-700 border-t-transparent mr-1"/>
                          ) : (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Approve
                        </Button>
                      )}
                      {request.status !== "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingIds.has(request.id)}
                          className="h-8 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                          onClick={() => handleStatusChange(request.id, "rejected")}
                        >
                          {processingIds.has(request.id) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-700 border-t-transparent mr-1"/>
                          ) : (
                            <X className="h-4 w-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      )}
                      {request.status !== "uploaded" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingIds.has(request.id)}
                          className="h-8"
                          onClick={() => handleStatusChange(request.id, "uploaded")}
                        >
                          {processingIds.has(request.id) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-700 border-t-transparent mr-1"/>
                          ) : (
                            "Reset"
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicineRequestsTab;
