
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

const MedicineDonationsTab = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDonations(donations);
    } else {
      const filtered = donations.filter(
        (donation) =>
          donation.medicine_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDonations(filtered);
    }
  }, [searchTerm, donations]);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("donated_meds")
        .select(`
          *,
          donors:donor_entity_id (name),
          intermediary_ngo:ngo_entity_id (name)
        `)
        .order("date_added", { ascending: false });

      if (error) {
        throw error;
      }

      // Process the data to include donor names
      const processedData = data.map((donation) => ({
        ...donation,
        donor_name: donation.donors?.name || "Unknown",
        ngo_name: donation.intermediary_ngo?.name || "Not assigned"
      }));

      setDonations(processedData);
      setFilteredDonations(processedData);
    } catch (error: any) {
      console.error("Error fetching donations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch medicine donations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    // Add ID to processing set
    setProcessingIds(prev => new Set(prev).add(id));
    
    try {
      console.log(`Updating donation ${id} status to ${newStatus}`);
      
      const { error } = await supabase
        .from("donated_meds")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
        throw error;
      }

      // Update local state
      const updatedDonations = donations.map((donation) =>
        donation.id === id ? { ...donation, status: newStatus } : donation
      );
      setDonations(updatedDonations);
      setFilteredDonations(
        filteredDonations.map((donation) =>
          donation.id === id ? { ...donation, status: newStatus } : donation
        )
      );

      toast({
        title: "Success",
        description: `Donation status updated to ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Error updating donation status:", error);
      toast({
        title: "Error",
        description: `Failed to update donation status: ${error.message || error}`,
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
          <CardTitle>Medicine Donations</CardTitle>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search donations..."
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
          <div className="text-center py-10">Loading donations...</div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No medicine donations found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>NGO</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Added Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.id}</TableCell>
                  <TableCell>{donation.medicine_name || "N/A"}</TableCell>
                  <TableCell>{donation.donor_name}</TableCell>
                  <TableCell>{donation.ngo_name}</TableCell>
                  <TableCell>{donation.quantity || "N/A"}</TableCell>
                  <TableCell>
                    {donation.date_added
                      ? format(new Date(donation.date_added), "PPP")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {donation.expiry_date
                      ? format(new Date(donation.expiry_date), "PPP")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        donation.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : donation.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {donation.status || "uploaded"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {donation.status !== "approved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingIds.has(donation.id)}
                          className="h-8 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          onClick={() => handleStatusChange(donation.id, "approved")}
                        >
                          {processingIds.has(donation.id) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-700 border-t-transparent mr-1"/>
                          ) : (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Approve
                        </Button>
                      )}
                      {donation.status !== "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingIds.has(donation.id)}
                          className="h-8 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                          onClick={() => handleStatusChange(donation.id, "rejected")}
                        >
                          {processingIds.has(donation.id) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-700 border-t-transparent mr-1"/>
                          ) : (
                            <X className="h-4 w-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      )}
                      {donation.status !== "uploaded" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingIds.has(donation.id)}
                          className="h-8"
                          onClick={() => handleStatusChange(donation.id, "uploaded")}
                        >
                          {processingIds.has(donation.id) ? (
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

export default MedicineDonationsTab;
