
import React, { useEffect, useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LocationPermission = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if location permission has been asked before
    const locationPermissionAsked = localStorage.getItem("locationPermissionAsked");
    
    if (!locationPermissionAsked) {
      setOpen(true);
    }
  }, []);

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location access granted",
            description: "We can now show you nearby services.",
          });
          localStorage.setItem("locationPermissionAsked", "true");
          localStorage.setItem("userLatitude", position.coords.latitude.toString());
          localStorage.setItem("userLongitude", position.coords.longitude.toString());
          setOpen(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location access denied",
            description: "Some features may not work properly without location access.",
            variant: "destructive",
          });
          localStorage.setItem("locationPermissionAsked", "true");
          setOpen(false);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      localStorage.setItem("locationPermissionAsked", "true");
      setOpen(false);
    }
  };

  const handleDeny = () => {
    toast({
      title: "Location access denied",
      description: "You can enable location access later in settings.",
    });
    localStorage.setItem("locationPermissionAsked", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Enable Location Services</DialogTitle>
          <DialogDescription>
            MediShare needs your location to show you nearby NGOs, donors, and recipients.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="bg-medishare-blue/10 p-4 rounded-full mb-4">
            <MapPin className="h-12 w-12 text-medishare-blue" />
          </div>
          <p className="text-center text-sm text-gray-500">
            Your location information is only used to provide you with relevant services and will not be shared with third parties.
          </p>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleDeny}>
            Not Now
          </Button>
          <Button className="bg-medishare-blue hover:bg-medishare-blue/90" onClick={handleAllow}>
            Allow Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPermission;
