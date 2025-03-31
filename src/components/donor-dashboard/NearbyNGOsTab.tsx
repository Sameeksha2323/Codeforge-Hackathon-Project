
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DonationMap from "@/components/maps/DonationMap";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define proximity filter options
const proximityOptions = [
  { value: "all", label: "All Distances" },
  { value: "1", label: "Within 1 km" },
  { value: "3", label: "Within 3 km" },
  { value: "5", label: "Within 5 km" },
  { value: "10", label: "Within 10 km" }
];

// Sample NGO data with distances
const nearbyNGOs = [
  {
    id: 1,
    name: "City Hospital",
    distance: 2.3,
    medicineneeds: "Antibiotics, Painkillers",
    contact: "+91 9876543210"
  },
  {
    id: 2,
    name: "Community Clinic",
    distance: 1.7,
    medicineneeds: "First Aid Supplies, Diabetes Medication",
    contact: "+91 9876543211"
  },
  {
    id: 3,
    name: "Rural Health Center",
    distance: 4.5,
    medicineneeds: "Asthma Inhalers, Vitamins",
    contact: "+91 9876543212"
  },
  {
    id: 4,
    name: "General Hospital",
    distance: 8.2,
    medicineneeds: "Antibiotics, Surgical Supplies",
    contact: "+91 9876543213"
  },
  {
    id: 5,
    name: "Family Care Center",
    distance: 3.1,
    medicineneeds: "Pediatric Medication, Vitamins",
    contact: "+91 9876543214"
  }
];

const NearbyNGOsTab = () => {
  const [proximityFilter, setProximityFilter] = useState("all");
  
  // Filter NGOs based on selected proximity
  const filteredNGOs = nearbyNGOs.filter(ngo => {
    if (proximityFilter === "all") return true;
    return ngo.distance <= parseInt(proximityFilter);
  });
  
  // Sort by distance (nearest first)
  const sortedNGOs = [...filteredNGOs].sort((a, b) => a.distance - b.distance);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NGOs Near Me</CardTitle>
          <CardDescription>Find NGOs in your area that need donations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <DonationMap title="NGOs Near You" className="w-full" />

            <div className="mt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
                <h3 className="text-lg font-medium">Nearby NGOs List</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filter by distance:</span>
                    <Select 
                      value={proximityFilter} 
                      onValueChange={setProximityFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select distance" />
                      </SelectTrigger>
                      <SelectContent>
                        {proximityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm">Refresh</Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Distance</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine Needs</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedNGOs.length > 0 ? (
                      sortedNGOs.map((ngo) => (
                        <tr key={ngo.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm">{ngo.name}</td>
                          <td className="px-4 py-4 text-sm">{ngo.distance} km</td>
                          <td className="px-4 py-4 text-sm">{ngo.medicineneeds}</td>
                          <td className="px-4 py-4 text-sm">{ngo.contact}</td>
                          <td className="px-4 py-4 text-sm">
                            <Button size="sm">Donate</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                          No NGOs found within the selected distance.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NearbyNGOsTab;
