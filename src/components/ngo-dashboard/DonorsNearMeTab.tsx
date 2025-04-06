import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const DonorsNearMeTab = () => {
  const iframeUrl = "https://giving-compass-nearby-angels-39.lovable.app/"; // Replace with your actual URL

  return (
    <Card>
      <CardContent className="p-0">
        <iframe
          src={iframeUrl}
          title="Donors Near Me Map"
          width="100%"
          height="700px"
          style={{ border: "none" }}
        />
      </CardContent>
    </Card>
  );
};

export default DonorsNearMeTab;
// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import DonorsMap from "@/components/maps/DonorsMap";

// // Define proximity filter options
// const proximityOptions = [
//   { value: "all", label: "All Distances" },
//   { value: "1", label: "Within 1 km" },
//   { value: "3", label: "Within 3 km" },
//   { value: "5", label: "Within 5 km" },
//   { value: "10", label: "Within 10 km" }
// ];

// // Sample donors data with distances
// const sampleDonors = [
//   {
//     id: 1,
//     name: "John Doe Pharmaceuticals",
//     distance: 2.5,
//     medicines: ["Antibiotics", "Painkillers", "Insulin"],
//   },
//   {
//     id: 2,
//     name: "MediCare Hospital",
//     distance: 1.8,
//     medicines: ["Asthma Inhalers", "Diabetes Medication"],
//   },
//   {
//     id: 3,
//     name: "HealthPlus Clinic",
//     distance: 3.2,
//     medicines: ["Vitamin C", "Antibiotic Ointment"],
//   },
//   {
//     id: 4,
//     name: "City Pharmacy",
//     distance: 4.7,
//     medicines: ["Painkillers", "First Aid Supplies"],
//   },
//   {
//     id: 5,
//     name: "Medical Supplies Co.",
//     distance: 7.1,
//     medicines: ["Surgical Items", "Bandages", "Antiseptics"],
//   }
// ];

// const DonorsNearMeTab = () => {
//   const [proximityFilter, setProximityFilter] = useState("all");
  
//   // Filter donors based on selected proximity
//   const filteredDonors = sampleDonors.filter(donor => {
//     if (proximityFilter === "all") return true;
//     return donor.distance <= parseInt(proximityFilter);
//   });
  
//   // Sort by distance (nearest first)
//   const sortedDonors = [...filteredDonors].sort((a, b) => a.distance - b.distance);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Donors Near Me</CardTitle>
//         <CardDescription>Find donors in your area that have medicines available</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <DonorsMap title="Nearby Donors" className="mb-6" />
        
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
//           <h3 className="text-lg font-medium">Nearby Donors List</h3>
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-500">Filter by distance:</span>
//             <Select 
//               value={proximityFilter} 
//               onValueChange={setProximityFilter}
//             >
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select distance" />
//               </SelectTrigger>
//               <SelectContent>
//                 {proximityOptions.map(option => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b">
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Donor Name</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Distance</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Available Medicines</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedDonors.length > 0 ? (
//                 sortedDonors.map(donor => (
//                   <tr key={donor.id} className="border-b hover:bg-gray-50">
//                     <td className="px-4 py-4 text-sm font-medium">{donor.name}</td>
//                     <td className="px-4 py-4 text-sm">{donor.distance} km</td>
//                     <td className="px-4 py-4 text-sm">{donor.medicines.join(', ')}</td>
//                     <td className="px-4 py-4 text-sm">
//                       <Button variant="ghost" size="sm" className="text-medishare-blue">
//                         Contact
//                       </Button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
//                     No donors found within the selected distance.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default DonorsNearMeTab;
