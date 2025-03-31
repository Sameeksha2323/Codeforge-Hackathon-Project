
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/utils/auth";

const SettingsTab = () => {
  const navigate = useNavigate();
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    donationUpdates: true,
    marketingEmails: false,
    smsNotifications: false
  });

  // Security settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showDonationHistory: true,
    allowDataCollection: true
  });

  // Handle notification toggle changes
  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  // Handle privacy toggle changes
  const handlePrivacyChange = (setting: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
  };

  // Save notification settings
  const saveNotificationSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
      variant: "default",
    });
  };

  // Change password
  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would update the password through authentication service
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
      variant: "default",
    });

    // Clear the form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Save privacy settings
  const savePrivacySettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Privacy settings saved",
      description: "Your privacy preferences have been updated.",
      variant: "default",
    });
  };

  // Handle logout
  const handleLogout = async () => {
    const result = await logoutUser();
    
    if (result.success) {
      toast({
        title: "Logged out",
        description: result.message,
        variant: "default",
      });
      navigate("/sign-in");
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications">
          <TabsList className="mb-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-4">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <p className="text-sm text-gray-500 mb-4">Manage how you receive notifications</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive important updates via email</p>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationChange('emailNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="donation-updates">Donation Updates</Label>
                  <p className="text-sm text-gray-500">Get notified about your donation status changes</p>
                </div>
                <Switch 
                  id="donation-updates"
                  checked={notificationSettings.donationUpdates}
                  onCheckedChange={() => handleNotificationChange('donationUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-gray-500">Receive news, updates, and promotional content</p>
                </div>
                <Switch 
                  id="marketing-emails"
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={() => handleNotificationChange('marketingEmails')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive time-sensitive alerts via SMS</p>
                </div>
                <Switch 
                  id="sms-notifications"
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={() => handleNotificationChange('smsNotifications')}
                />
              </div>
              
              <Button onClick={saveNotificationSettings} className="mt-4">
                Save Notification Settings
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <h3 className="text-lg font-medium">Security Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Manage your account security</p>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <Button onClick={changePassword}>
                Change Password
              </Button>
              
              <div className="mt-8 pt-4 border-t">
                <h4 className="font-medium mb-2">Account Actions</h4>
                <Button variant="destructive" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <h3 className="text-lg font-medium">Privacy Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Control your privacy preferences</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                </div>
                <Switch 
                  id="profile-visibility"
                  checked={privacySettings.profileVisibility}
                  onCheckedChange={() => handlePrivacyChange('profileVisibility')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="donation-history">Donation History</Label>
                  <p className="text-sm text-gray-500">Show your donation history on your profile</p>
                </div>
                <Switch 
                  id="donation-history"
                  checked={privacySettings.showDonationHistory}
                  onCheckedChange={() => handlePrivacyChange('showDonationHistory')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-collection">Data Collection</Label>
                  <p className="text-sm text-gray-500">Allow us to collect usage data to improve services</p>
                </div>
                <Switch 
                  id="data-collection"
                  checked={privacySettings.allowDataCollection}
                  onCheckedChange={() => handlePrivacyChange('allowDataCollection')}
                />
              </div>
              
              <Button onClick={savePrivacySettings} className="mt-4">
                Save Privacy Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
