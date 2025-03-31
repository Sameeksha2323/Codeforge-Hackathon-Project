
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Bell,
  Settings,
  PieChart,
  Package,
  Map,
  Heart,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  mobileNavOpen: boolean;
  setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileNavOpen, setMobileNavOpen }) => {
  const location = useLocation();

  const tabs = [
    {
      name: "Dashboard",
      path: "/ngo-dashboard",
      icon: <Home className="h-5 w-5" />,
      exact: true,
    },
    {
      name: "Available Medicines",
      path: "/ngo-dashboard/available-medicines",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Medicine Requests",
      path: "/ngo-dashboard/medicine-requests",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Donors Near Me",
      path: "/ngo-dashboard/donors-near-me",
      icon: <Map className="h-5 w-5" />,
    },
    {
      name: "Impact Reports",
      path: "/ngo-dashboard/impact",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      path: "/ngo-dashboard/analytics",
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      name: "Beneficiaries",
      path: "/ngo-dashboard/beneficiaries",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Notifications",
      path: "/ngo-dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/ngo-dashboard/profile",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/ngo-dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out sm:translate-x-0 sm:relative sm:shadow-none",
        mobileNavOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/45a81f67-90b3-43d3-9499-2a874a4d48be.png" 
              alt="MediShare Logo" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-xl text-medishare-blue">MediShare</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="px-2 space-y-1">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? location.pathname === tab.path
                : location.pathname.startsWith(tab.path);

              return (
                <Link key={tab.name} to={tab.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive
                        ? "bg-medishare-blue/10 text-medishare-blue"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    onClick={() => {
                      if (mobileNavOpen) {
                        setMobileNavOpen(false);
                      }
                    }}
                  >
                    {React.cloneElement(tab.icon, {
                      className: cn(
                        "mr-2 h-5 w-5",
                        isActive ? "text-medishare-blue" : "text-gray-400"
                      ),
                    })}
                    {tab.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t text-xs text-center text-gray-500">
          © {new Date().getFullYear()} MediShare
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
