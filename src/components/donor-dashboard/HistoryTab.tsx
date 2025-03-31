
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";

// Mock data for the donation history
const mockDonations = [
  {
    id: "1",
    medicine_name: "Paracetamol",
    category: "Analgesics",
    quantity: 30,
    created_at: "2023-09-15T10:30:00Z",
    expiry_date: "2024-12-25",
    status: "approved",
    ngo: "Care Foundation"
  },
  {
    id: "2",
    medicine_name: "Amoxicillin",
    category: "Antibiotics",
    quantity: 20,
    created_at: "2023-09-10T14:20:00Z",
    expiry_date: null,
    status: "pending",
    ngo: null
  },
  {
    id: "3",
    medicine_name: "Vitamin C",
    category: "Nutritional Supplements",
    quantity: 50,
    created_at: "2023-09-05T09:15:00Z",
    expiry_date: "2025-03-10",
    status: "rejected",
    ngo: null
  },
  {
    id: "4",
    medicine_name: "Insulin",
    category: "Antidiabetics",
    quantity: 10,
    created_at: "2023-09-01T16:45:00Z",
    expiry_date: "2024-06-15",
    status: "delivered",
    ngo: "Diabetes Care Trust"
  },
  {
    id: "5",
    medicine_name: "Aspirin",
    category: "Analgesics",
    quantity: 100,
    created_at: "2023-08-25T11:20:00Z",
    expiry_date: null,
    status: "approved",
    ngo: "Health For All"
  }
];

const HistoryTab = () => {
  const [filter, setFilter] = useState("all");
  
  // Filter donations based on selected filter
  const filteredDonations = filter === "all" 
    ? mockDonations 
    : mockDonations.filter(donation => donation.status === filter);

  // Format date strings
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get appropriate status badge and icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return { 
          color: "bg-blue-100 text-blue-800", 
          icon: <CheckCircle className="h-4 w-4 mr-1 text-blue-600" />,
          text: "Approved"
        };
      case "pending":
        return { 
          color: "bg-amber-100 text-amber-800", 
          icon: <Clock className="h-4 w-4 mr-1 text-amber-600" />,
          text: "Pending"
        };
      case "rejected":
        return { 
          color: "bg-red-100 text-red-800", 
          icon: <XCircle className="h-4 w-4 mr-1 text-red-600" />,
          text: "Rejected"
        };
      case "delivered":
        return { 
          color: "bg-green-100 text-green-800", 
          icon: <Package className="h-4 w-4 mr-1 text-green-600" />,
          text: "Delivered"
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800", 
          icon: <AlertTriangle className="h-4 w-4 mr-1 text-gray-600" />,
          text: status
        };
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">My Donations</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "pending" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button 
              variant={filter === "approved" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("approved")}
            >
              Approved
            </Button>
            <Button 
              variant={filter === "rejected" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </Button>
            <Button 
              variant={filter === "delivered" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("delivered")}
            >
              Delivered
            </Button>
          </div>
          
          {filteredDonations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No donations found in this category.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date Donated</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.map((donation) => {
                    const statusBadge = getStatusBadge(donation.status);
                    
                    return (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">{donation.medicine_name}</TableCell>
                        <TableCell>{donation.category}</TableCell>
                        <TableCell>{donation.quantity}</TableCell>
                        <TableCell>{formatDate(donation.created_at)}</TableCell>
                        <TableCell>{donation.expiry_date ? formatDate(donation.expiry_date) : ""}</TableCell>
                        <TableCell>
                          <Badge className={`${statusBadge.color} flex items-center w-fit`}>
                            {statusBadge.icon}
                            {statusBadge.text}
                          </Badge>
                          {donation.ngo && (
                            <div className="text-xs text-gray-500 mt-1">
                              {donation.ngo}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
