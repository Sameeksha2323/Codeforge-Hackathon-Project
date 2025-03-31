
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface DonorRegistrationFormProps {
  form: UseFormReturn<any>;
  isVerifying: boolean;
  isRegistering: boolean;
}

const DonorRegistrationForm = ({ form, isVerifying, isRegistering }: DonorRegistrationFormProps) => {
  return (
    <Form {...form}>
      <h2 className="text-2xl font-semibold text-medishare-dark mb-6">Donor Registration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your organization name" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Create a password" type="password" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gstId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your 15-digit GST ID" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">Enter your 15-character GST Identification Number</p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6">
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-200">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isVerifying || isRegistering}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I accept the <a href="#" className="text-medishare-orange hover:underline">terms and conditions</a> and <a href="#" className="text-medishare-orange hover:underline">privacy policy</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default DonorRegistrationForm;
