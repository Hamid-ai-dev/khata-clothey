import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon,
  User,
  Building,
  Shield,
  Bell,
  Palette,
  Database,
  FileText,
  Printer,
  Mail,
  Globe,
  CreditCard,
  Lock,
  Key,
  Users,
  Package,
  DollarSign,
  Calendar,
  Clock,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
  Camera,
  Edit,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserAccessManagement } from "@/components/settings/UserAccessManagement";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Business Profile
    businessName: "Khata Management System",
    businessAddress: "123 Business Street, Lahore, Pakistan",
    businessPhone: "+92-300-1234567",
    businessEmail: "info@khatams.com",
    businessLicense: "BL-2024-001",
    taxId: "NTN-12345678",
    
    // User Profile
    userName: "Admin User",
    userEmail: "admin@khatams.com",
    userPhone: "+92-300-9876543",
    userRole: "Administrator",
    
    // System Preferences
    currency: "PKR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12-hour",
    language: "en",
    timezone: "Asia/Karachi",
    fiscalYearStart: "July",
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lowStockAlerts: true,
    paymentReminders: true,
    systemUpdates: true,
    securityAlerts: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: "30",
    autoLock: true,
    loginAttempts: "5",
    passwordExpiry: "90",
    
    // Display
    darkMode: false,
    compactMode: false,
    showTutorials: true,
    animationsEnabled: true,
    highContrast: false,
    
    // Business Operations
    autoBackup: true,
    backupFrequency: "daily",
    stockAlertThreshold: "10",
    defaultPaymentTerms: "30",
    invoicePrefix: "INV",
    receiptPrefix: "RCP",
    
    // Printing & Reports
    defaultPrinter: "PDF",
    paperSize: "A4",
    printQuality: "High",
    includeBarcode: true,
    includeLogo: true,
    reportFormat: "PDF",
    
    // Data Management
    dataRetention: "365",
    archiveOldData: true,
    exportFormat: "Excel",
    syncFrequency: "Real-time",
    
    // Advanced
    apiAccess: false,
    debugMode: false,
    betaFeatures: false,
    maintenanceMode: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'khata-settings.json';
    link.click();
    
    toast({
      title: "Settings Exported",
      description: "Settings have been exported successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Configure your business management platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportSettings} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Business Profile Tab */}
          <TabsContent value="business" className="space-y-6">
            {/* User Access Management - Only for Admins */}
            <UserAccessManagement />
            
            <Separator />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={settings.businessName}
                      onChange={(e) => handleSettingChange('businessName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={settings.businessEmail}
                      onChange={(e) => handleSettingChange('businessEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessPhone">Business Phone</Label>
                    <Input
                      id="businessPhone"
                      value={settings.businessPhone}
                      onChange={(e) => handleSettingChange('businessPhone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessLicense">Business License</Label>
                    <Input
                      id="businessLicense"
                      value={settings.businessLicense}
                      onChange={(e) => handleSettingChange('businessLicense', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxId">Tax ID / NTN</Label>
                    <Input
                      id="taxId"
                      value={settings.taxId}
                      onChange={(e) => handleSettingChange('taxId', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    value={settings.businessAddress}
                    onChange={(e) => handleSettingChange('businessAddress', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Logo & Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Profile Tab */}
          <TabsContent value="user" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userName">Full Name</Label>
                    <Input
                      id="userName"
                      value={settings.userName}
                      onChange={(e) => handleSettingChange('userName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email Address</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={settings.userEmail}
                      onChange={(e) => handleSettingChange('userEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userPhone">Phone Number</Label>
                    <Input
                      id="userPhone"
                      value={settings.userPhone}
                      onChange={(e) => handleSettingChange('userPhone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userRole">Role</Label>
                    <Select value={settings.userRole} onValueChange={(value) => handleSettingChange('userRole', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Cashier">Cashier</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Preferences Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PKR">Pakistani Rupee (PKR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select value={settings.timeFormat} onValueChange={(value) => handleSettingChange('timeFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12-hour">12 Hour</SelectItem>
                        <SelectItem value="24-hour">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Karachi">Pakistan (UTC+5)</SelectItem>
                        <SelectItem value="Asia/Dubai">UAE (UTC+4)</SelectItem>
                        <SelectItem value="Asia/Riyadh">Saudi Arabia (UTC+3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
                    <Select value={settings.fiscalYearStart} onValueChange={(value) => handleSettingChange('fiscalYearStart', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="July">July</SelectItem>
                        <SelectItem value="April">April</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('sessionTimeout', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Select value={settings.loginAttempts} onValueChange={(value) => handleSettingChange('loginAttempts', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Select value={settings.passwordExpiry} onValueChange={(value) => handleSettingChange('passwordExpiry', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Lock Screen</Label>
                      <p className="text-sm text-muted-foreground">Lock screen when inactive</p>
                    </div>
                    <Switch
                      checked={settings.autoLock}
                      onCheckedChange={(checked) => handleSettingChange('autoLock', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified of security events</p>
                    </div>
                    <Switch
                      checked={settings.securityAlerts}
                      onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert when products are low in stock</p>
                    </div>
                    <Switch
                      checked={settings.lowStockAlerts}
                      onCheckedChange={(checked) => handleSettingChange('lowStockAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Remind customers about due payments</p>
                    </div>
                    <Switch
                      checked={settings.paymentReminders}
                      onCheckedChange={(checked) => handleSettingChange('paymentReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified of system updates</p>
                    </div>
                    <Switch
                      checked={settings.systemUpdates}
                      onCheckedChange={(checked) => handleSettingChange('systemUpdates', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Display Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme</p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use compact layout</p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Tutorials</Label>
                      <p className="text-sm text-muted-foreground">Display helpful tutorials</p>
                    </div>
                    <Switch
                      checked={settings.showTutorials}
                      onCheckedChange={(checked) => handleSettingChange('showTutorials', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable UI animations</p>
                    </div>
                    <Switch
                      checked={settings.animationsEnabled}
                      onCheckedChange={(checked) => handleSettingChange('animationsEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Improve visibility with high contrast</p>
                    </div>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Business Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stockThreshold">Stock Alert Threshold</Label>
                    <Input
                      id="stockThreshold"
                      type="number"
                      value={settings.stockAlertThreshold}
                      onChange={(e) => handleSettingChange('stockAlertThreshold', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Default Payment Terms (days)</Label>
                    <Input
                      id="paymentTerms"
                      type="number"
                      value={settings.defaultPaymentTerms}
                      onChange={(e) => handleSettingChange('defaultPaymentTerms', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                    <Input
                      id="invoicePrefix"
                      value={settings.invoicePrefix}
                      onChange={(e) => handleSettingChange('invoicePrefix', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiptPrefix">Receipt Prefix</Label>
                    <Input
                      id="receiptPrefix"
                      value={settings.receiptPrefix}
                      onChange={(e) => handleSettingChange('receiptPrefix', e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-muted-foreground">Automatically backup data</p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Printing & Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultPrinter">Default Printer</Label>
                    <Select value={settings.defaultPrinter} onValueChange={(value) => handleSettingChange('defaultPrinter', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF Export</SelectItem>
                        <SelectItem value="System">System Default</SelectItem>
                        <SelectItem value="Thermal">Thermal Printer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paperSize">Paper Size</Label>
                    <Select value={settings.paperSize} onValueChange={(value) => handleSettingChange('paperSize', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A5">A5</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Thermal">Thermal (80mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="printQuality">Print Quality</Label>
                    <Select value={settings.printQuality} onValueChange={(value) => handleSettingChange('printQuality', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reportFormat">Report Format</Label>
                    <Select value={settings.reportFormat} onValueChange={(value) => handleSettingChange('reportFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Barcode</Label>
                      <p className="text-sm text-muted-foreground">Add barcode to receipts</p>
                    </div>
                    <Switch
                      checked={settings.includeBarcode}
                      onCheckedChange={(checked) => handleSettingChange('includeBarcode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Logo</Label>
                      <p className="text-sm text-muted-foreground">Add business logo to documents</p>
                    </div>
                    <Switch
                      checked={settings.includeLogo}
                      onCheckedChange={(checked) => handleSettingChange('includeLogo', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={settings.dataRetention}
                      onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exportFormat">Export Format</Label>
                    <Select value={settings.exportFormat} onValueChange={(value) => handleSettingChange('exportFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="syncFrequency">Sync Frequency</Label>
                    <Select value={settings.syncFrequency} onValueChange={(value) => handleSettingChange('syncFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Real-time">Real-time</SelectItem>
                        <SelectItem value="Every 5 minutes">Every 5 minutes</SelectItem>
                        <SelectItem value="Every 15 minutes">Every 15 minutes</SelectItem>
                        <SelectItem value="Hourly">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Archive Old Data</Label>
                    <p className="text-sm text-muted-foreground">Automatically archive old records</p>
                  </div>
                  <Switch
                    checked={settings.archiveOldData}
                    onCheckedChange={(checked) => handleSettingChange('archiveOldData', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>API Access</Label>
                      <p className="text-sm text-muted-foreground">Enable API access for integrations</p>
                    </div>
                    <Switch
                      checked={settings.apiAccess}
                      onCheckedChange={(checked) => handleSettingChange('apiAccess', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable debug logging</p>
                    </div>
                    <Switch
                      checked={settings.debugMode}
                      onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Beta Features</Label>
                      <p className="text-sm text-muted-foreground">Enable experimental features</p>
                    </div>
                    <Switch
                      checked={settings.betaFeatures}
                      onCheckedChange={(checked) => handleSettingChange('betaFeatures', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <Label className="text-destructive">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Reset All Settings
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset All Settings</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reset all settings to their default values. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleReset}>
                            Reset Settings
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Backup Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;