
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  medicineName: z.string().min(2, {
    message: "Medicine name must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a medicine category.",
  }),
  quantity: z.coerce.number().positive({
    message: "Quantity must be a positive number.",
  }),
  expiryDate: z.date().optional(),
  condition: z.string({
    required_error: "Please select the medicine condition.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// These would typically come from an API or database
const medicineCategories = [
  "Antibiotics",
  "Analgesics",
  "Antidiabetics",
  "Cardiovascular",
  "Respiratory",
  "Gastrointestinal",
  "Neurological",
  "Dermatological",
  "Nutritional Supplements",
  "Other",
];

const medicineConditions = [
  "New/Sealed",
  "Opened but Unused",
  "Partially Used (>50% remaining)",
  "Partially Used (<50% remaining)",
];

interface DonateFormProps {
  donorEntityId: string;
  onSuccess: () => void;
}

const DonateForm = ({ donorEntityId, onSuccess }: DonateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicineName: "",
      category: "",
      quantity: 1,
      condition: "",
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match('image/jpeg|image/jpg|image/png')) {
        toast({
          title: "Invalid File",
          description: "Please upload a JPG, JPEG, or PNG image",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if image is uploaded
      if (!imageFile) {
        toast({
          title: "Missing Image",
          description: "Please upload an image of the medicine",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Get current user
      const user = getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to donate medicines",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Generate a unique file path for storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${donorEntityId}/${Date.now()}.${fileExt}`;
      
      // Upload image to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ocr-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast({
          title: "Upload failed",
          description: "Failed to upload medicine image",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('ocr-images')
        .getPublicUrl(fileName);
      
      const imageUrl = publicUrlData.publicUrl;
      
      // Create donation object
      const donation = {
        donor_entity_id: donorEntityId,
        medicine_name: values.medicineName,
        category: values.category,
        quantity: values.quantity,
        expiry_date: values.expiryDate ? format(values.expiryDate, 'yyyy-MM-dd') : null,
        condition: values.condition,
        description: values.description || "",
        status: "uploaded",
        date_added: new Date().toISOString().split('T')[0],
        image_url: imageUrl,
        ingredients: "",
      };

      // Insert donation into the database
      const { error: donationError } = await supabase
        .from('donated_meds')
        .insert(donation);
      
      if (donationError) {
        console.error('Error submitting donation:', donationError);
        toast({
          title: "Submission failed",
          description: "Failed to submit medicine donation",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      toast({
        title: "Donation submitted successfully",
        description: "Thank you for your contribution!",
      });
      
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      onSuccess();
      
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast({
        title: "Failed to submit medicine donation",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="medicineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicine Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter medicine name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicineCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicineConditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Medicine Image</label>
          <Input 
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Medicine Preview" 
                className="rounded-md max-h-40 object-contain" 
              />
            </div>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional details about the medicine"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full bg-medishare-orange hover:bg-medishare-gold" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Donate Medicine"}
        </Button>
      </form>
    </Form>
  );
};

export default DonateForm;
