import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Check, Search } from "lucide-react";

interface DonatedMedicine {
  id: string;
  medicine_name: string | null;
  quantity: number | null;
  expiry_date: string | null;
  status: string | null;
  donor_entity_id: string;
  ngo_entity_id: string | null;
  date_added: string | null;
  ingredients: string | null;
  image_url: string | null;
  donor_name?: string;
  similarity?: number;
}

interface AvailableMedicinesTabProps {
  ngoEntityId: string;
}

const AvailableMedicinesTab = ({ ngoEntityId }: AvailableMedicinesTabProps) => {
  const [medicines, setMedicines] = useState<DonatedMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingIds, setAcceptingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState<DonatedMedicine[]>([]);
  const [similarMedicines, setSimilarMedicines] = useState<DonatedMedicine[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    } else {
      setFilteredMedicines(medicines);
      setSimilarMedicines([]);
    }
  }, [searchQuery, medicines]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('donated_meds')
        .select('*')
        .eq('status', 'uploaded')
        .is('ngo_entity_id', null);
      
      if (error) throw error;
      
      let medicinesList: DonatedMedicine[] = data ? data.map(med => ({
        ...med,
        id: med.id.toString()
      })) : [];
      
      for (let i = 0; i < medicinesList.length; i++) {
        const { data: donorData, error: donorError } = await supabase
          .from('donors')
          .select('name, org_name')
          .eq('entity_id', medicinesList[i].donor_entity_id)
          .single();
        
        if (!donorError && donorData) {
          medicinesList[i].donor_name = donorData.org_name || donorData.name;
        }
      }
      
      setMedicines(medicinesList);
      setFilteredMedicines(medicinesList);
    } catch (error) {
      console.error("Error fetching available medicines:", error);
      toast({
        title: "Error",
        description: "Failed to load available medicines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateIngredientSimilarity = (ingredients1: string | null, ingredients2: string | null): number => {
    if (!ingredients1 || !ingredients2) {
      return 0;
    }

    const ingredientsArray1 = ingredients1.toLowerCase().split(',').map(i => i.trim());
    const ingredientsArray2 = ingredients2.toLowerCase().split(',').map(i => i.trim());

    const matchingIngredients = ingredientsArray1.filter(ingredient => 
      ingredientsArray2.some(i => i.includes(ingredient) || ingredient.includes(i))
    );

    const totalUniqueIngredients = new Set([...ingredientsArray1, ...ingredientsArray2]).size;
    return (matchingIngredients.length / totalUniqueIngredients) * 100;
  };

  const performSearch = () => {
    setIsSearching(true);
    
    try {
      const searchTermLower = searchQuery.toLowerCase();
      const matched = medicines.filter(medicine => 
        medicine.medicine_name?.toLowerCase().includes(searchTermLower)
      );
      
      setFilteredMedicines(matched);
      
      if (matched.length > 0) {
        const targetMedicine = matched[0];
        
        if (targetMedicine.ingredients) {
          const similar: DonatedMedicine[] = [];
          
          for (const medicine of medicines) {
            if (medicine.id !== targetMedicine.id) {
              const similarity = calculateIngredientSimilarity(
                targetMedicine.ingredients, 
                medicine.ingredients
              );
              
              if (similarity >= 70 && similarity <= 80) {
                similar.push({
                  ...medicine,
                  similarity: Math.round(similarity)
                });
              }
            }
          }
          
          similar.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
          
          setSimilarMedicines(similar);
        }
      } else {
        setSimilarMedicines([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAcceptMedicine = async (medicineId: string) => {
    if (!ngoEntityId) {
      toast({
        title: "Error",
        description: "NGO information not found",
        variant: "destructive",
      });
      return;
    }
    
    setAcceptingIds(prev => new Set(prev).add(medicineId));
    
    try {
      const { data: medicineData, error: checkError } = await supabase
        .from('donated_meds')
        .select('status')
        .eq('id', parseInt(medicineId))
        .single();
      
      if (checkError) {
        throw checkError;
      }
      
      if (medicineData && medicineData.status === 'rejected') {
        toast({
          title: "Cannot Accept",
          description: "This medicine has been rejected by an administrator and cannot be accepted.",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('donated_meds')
        .update({
          ngo_entity_id: ngoEntityId,
          status: 'approved'
        })
        .eq('id', parseInt(medicineId));
        
      if (error) {
        console.error("Error accepting medicine:", error);
        throw error;
      }
      
      toast({
        title: "Medicine Accepted",
        description: "You have successfully accepted this medicine donation.",
      });
      
      const removeFromList = (list: DonatedMedicine[]) => 
        list.filter(medicine => medicine.id !== medicineId);
      
      setMedicines(removeFromList);
      setFilteredMedicines(removeFromList(filteredMedicines));
      setSimilarMedicines(removeFromList(similarMedicines));
    } catch (error) {
      console.error("Error accepting medicine:", error);
      toast({
        title: "Error",
        description: "Failed to accept medicine donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAcceptingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(medicineId);
        return newSet;
      });
    }
  };

  const renderMedicineTable = (medicines: DonatedMedicine[], showSimilarity = false, isSimilarMedicines = false) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medicine Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Donor</TableHead>
          <TableHead>Date Added</TableHead>
          {showSimilarity && <TableHead>Similarity</TableHead>}
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medicines.map((medicine) => (
          <TableRow 
            key={medicine.id} 
            className={isSimilarMedicines ? "bg-orange-50 hover:bg-orange-100" : ""}
          >
            <TableCell>{medicine.medicine_name || 'N/A'}</TableCell>
            <TableCell>{medicine.quantity || 'N/A'}</TableCell>
            <TableCell>
              {medicine.expiry_date 
                ? new Date(medicine.expiry_date).toLocaleDateString() 
                : 'N/A'}
            </TableCell>
            <TableCell>{medicine.donor_name || 'Unknown'}</TableCell>
            <TableCell>
              {medicine.date_added 
                ? new Date(medicine.date_added).toLocaleDateString() 
                : 'N/A'}
            </TableCell>
            {showSimilarity && (
              <TableCell>
                <span className="text-amber-600 font-medium">{medicine.similarity}% match</span>
              </TableCell>
            )}
            <TableCell>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  medicine.status === "uploaded"
                    ? "bg-green-100 text-green-800"
                    : medicine.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {medicine.status 
                  ? medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1) 
                  : 'Unknown'}
              </span>
            </TableCell>
            <TableCell>
              <Button 
                size="sm" 
                className="bg-medishare-blue hover:bg-medishare-blue/90"
                onClick={() => handleAcceptMedicine(medicine.id)}
                disabled={acceptingIds.has(medicine.id) || medicine.status === 'rejected'}
              >
                {acceptingIds.has(medicine.id) ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Accept
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Medicines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for medicines..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medishare-blue"></div>
          </div>
        ) : isSearching ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medishare-blue mr-2"></div>
            <p>Searching medicines...</p>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-8">
            {searchQuery ? (
              <p>No medicines found matching "{searchQuery}"</p>
            ) : (
              <p>No medicines available at this time</p>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="overflow-x-auto">
              <h3 className="text-lg font-medium mb-4">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Available Medicines"}
              </h3>
              {renderMedicineTable(filteredMedicines)}
            </div>

            {similarMedicines.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-medium mb-2">Similar Medicines (70-80% ingredient match)</h3>
                <p className="text-sm text-gray-500 mb-4">
                  These medicines have similar ingredients to {filteredMedicines[0]?.medicine_name}
                </p>
                {renderMedicineTable(similarMedicines, true, true)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableMedicinesTab;
