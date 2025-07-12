"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Shield, 
  Bell, 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  Settings, 
  Save,
  Loader2,
  Check,
  AlertTriangle,
  MessageSquare,
  Calendar,
  Users,
  Lock,
  Globe,
  Smartphone
} from "lucide-react";

export interface SettingsData {
  account: {
    emailNotifications: boolean;
    profileVisibility: 'public' | 'private' | 'friends';
    twoFactorAuth: boolean;
    activityStatus: boolean;
  };
  notifications: {
    skillRequests: boolean;
    messages: boolean;
    weeklyActivity: boolean;
    emailFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
    pushNotifications: boolean;
  };
  profile: {
    publicVisibility: boolean;
    skillsVisibility: 'public' | 'private' | 'matches';
    availabilityStatus: 'available' | 'busy' | 'away';
    showOnlineStatus: boolean;
  };
}

interface SettingsPageProps {
  initialSettings?: Partial<SettingsData>;
  onSave: (settings: SettingsData) => Promise<void>;
  onExportData: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

export const SettingsPage = ({ 
  initialSettings = {}, 
  onSave, 
  onExportData, 
  onDeleteAccount 
}: SettingsPageProps) => {
  const [settings, setSettings] = useState<SettingsData>({
    account: {
      emailNotifications: true,
      profileVisibility: 'public',
      twoFactorAuth: false,
      activityStatus: true,
      ...initialSettings.account
    },
    notifications: {
      skillRequests: true,
      messages: true,
      weeklyActivity: false,
      emailFrequency: 'daily',
      pushNotifications: true,
      ...initialSettings.notifications
    },
    profile: {
      publicVisibility: true,
      skillsVisibility: 'public',
      availabilityStatus: 'available',
      showOnlineStatus: true,
      ...initialSettings.profile
    }
  });

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await onDeleteAccount();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Customize your Skill Swap experience</p>
        </div>

        {/* Save Button - Fixed at top */}
        <div className="sticky top-4 z-10 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Account Settings */}
        <Card className="shadow-sm border border-slate-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Shield className="w-5 h-5 text-slate-600" />
              Account & Security
            </CardTitle>
            <CardDescription>
              Manage your account preferences and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-600" />
                    <Label className="text-sm font-medium">Email Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.account.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        account: { ...prev.account, emailNotifications: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-slate-600" />
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                  </div>
                  <Switch
                    checked={settings.account.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        account: { ...prev.account, twoFactorAuth: checked }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Profile Visibility</Label>
                  <Select 
                    value={settings.account.profileVisibility}
                    onValueChange={(value: 'public' | 'private' | 'friends') =>
                      setSettings(prev => ({
                        ...prev,
                        account: { ...prev.account, profileVisibility: value }
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Public
                        </div>
                      </SelectItem>
                      <SelectItem value="friends">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Friends Only
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4" />
                          Private
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-slate-600" />
                    <Label className="text-sm font-medium">Show Activity Status</Label>
                  </div>
                  <Switch
                    checked={settings.account.activityStatus}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        account: { ...prev.account, activityStatus: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="shadow-sm border border-slate-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Bell className="w-5 h-5 text-slate-600" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Control what notifications you receive and how often
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Notification Types</h4>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-slate-600" />
                    <Label className="text-sm font-medium">Skill Swap Requests</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.skillRequests}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, skillRequests: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-slate-600" />
                    <Label className="text-sm font-medium">Messages</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.messages}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, messages: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <Label className="text-sm font-medium">Weekly Activity Summary</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyActivity}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, weeklyActivity: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-slate-600" />
                    <Label className="text-sm font-medium">Push Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, pushNotifications: checked }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Email Frequency</h4>
                <Select 
                  value={settings.notifications.emailFrequency}
                  onValueChange={(value: 'immediate' | 'daily' | 'weekly' | 'never') =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, emailFrequency: value }
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Notification Tips</p>
                      <p>Enable skill swap requests to never miss opportunities. You can always adjust these settings later.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="shadow-sm border border-slate-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <User className="w-5 h-5 text-slate-600" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Control how others can see and interact with your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-600" />
                    <Label className="text-sm font-medium">Public Profile</Label>
                  </div>
                  <Switch
                    checked={settings.profile.publicVisibility}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, publicVisibility: checked }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Skills Visibility</Label>
                  <Select 
                    value={settings.profile.skillsVisibility}
                    onValueChange={(value: 'public' | 'private' | 'matches') =>
                      setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, skillsVisibility: value }
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Everyone</SelectItem>
                      <SelectItem value="matches">Potential Matches Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Availability Status</Label>
                  <Select 
                    value={settings.profile.availabilityStatus}
                    onValueChange={(value: 'available' | 'busy' | 'away') =>
                      setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, availabilityStatus: value }
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Available
                        </div>
                      </SelectItem>
                      <SelectItem value="busy">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          Busy
                        </div>
                      </SelectItem>
                      <SelectItem value="away">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                          Away
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-sm border border-slate-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Settings className="w-5 h-5 text-slate-600" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export your data or delete your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-300 hover:bg-slate-50"
                onClick={onExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      Delete Account
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers, including your profile, skills, and all conversation history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Yes, Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important</p>
                  <p>Account deletion is permanent and cannot be undone. Make sure to export your data first if you want to keep any information.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {saveSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <Check className="w-4 h-4" />
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};