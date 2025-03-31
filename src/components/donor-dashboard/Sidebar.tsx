
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserCircle,
  Gift,
  Clock,
  FileText,
  TrendingUp,
  Settings,
  BarChart3,
  MapPin,
  Bell
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col h-auto items-stretch gap-2 bg-transparent p-1">
          <button 
            onClick={() => setActiveTab("profile")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "profile" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <UserCircle size={18} />
            <span>Profile</span>
          </button>
          <button 
            onClick={() => setActiveTab("donate")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "donate" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <Gift size={18} />
            <span>Donate Medicines</span>
          </button>
          <button 
            onClick={() => setActiveTab("history")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "history" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <Clock size={18} />
            <span>Donation History</span>
          </button>
          <button 
            onClick={() => setActiveTab("nearby")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "nearby" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <MapPin size={18} />
            <span>NGOs Near Me</span>
          </button>
          <button 
            onClick={() => setActiveTab("notifications")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "notifications" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
          <button 
            onClick={() => setActiveTab("impact")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "impact" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <TrendingUp size={18} />
            <span>Impact</span>
          </button>
          <button 
            onClick={() => setActiveTab("analytics")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "analytics" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </button>
          <button 
            onClick={() => setActiveTab("tax")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "tax" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <FileText size={18} />
            <span>Tax Benefits</span>
          </button>
          <button 
            onClick={() => setActiveTab("settings")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "settings" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Sidebar;
