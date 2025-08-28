import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  BellRing, 
  Check, 
  Search, 
  Filter,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Package,
  Calendar,
  Clock,
  Settings,
  MoreVertical
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: 'system' | 'transaction' | 'customer' | 'product' | 'report';
  priority: 'low' | 'medium' | 'high';
}

const Notifications = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications - In real app, fetch from Supabase
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Product "Premium Shirt" is running low on stock (2 items remaining)',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      category: 'product',
      priority: 'high'
    },
    {
      id: '2',
      type: 'success',
      title: 'Payment Received',
      message: 'Customer "Ahmad Ali" paid PKR 5,000 for recent order',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false,
      category: 'transaction',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'info',
      title: 'New Customer Registration',
      message: 'Customer "Sara Khan" has been added to the system',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      category: 'customer',
      priority: 'low'
    },
    {
      id: '4',
      type: 'error',
      title: 'Transaction Failed',
      message: 'Payment processing failed for order #12345',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: false,
      category: 'transaction',
      priority: 'high'
    },
    {
      id: '5',
      type: 'info',
      title: 'Monthly Report Ready',
      message: 'Your monthly business report is ready for download',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      read: true,
      category: 'report',
      priority: 'medium'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction': return <DollarSign className="h-4 w-4" />;
      case 'customer': return <Users className="h-4 w-4" />;
      case 'product': return <Package className="h-4 w-4" />;
      case 'report': return <TrendingUp className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast({
      title: "Notification marked as read"
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read"
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification deleted"
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesRead = !showUnreadOnly || !notification.read;
    
    return matchesSearch && matchesCategory && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your business activities and important alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={unreadCount > 0 ? "destructive" : "secondary"}>
              {unreadCount} unread
            </Badge>
            <Button 
              onClick={markAllAsRead}
              variant="outline"
              disabled={unreadCount === 0}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Categories</option>
                  <option value="system">System</option>
                  <option value="transaction">Transactions</option>
                  <option value="customer">Customers</option>
                  <option value="product">Products</option>
                  <option value="report">Reports</option>
                </select>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unread-only"
                    checked={showUnreadOnly}
                    onCheckedChange={setShowUnreadOnly}
                  />
                  <Label htmlFor="unread-only" className="text-sm">
                    Unread only
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'all' || showUnreadOnly 
                    ? "Try adjusting your filters" 
                    : "You're all caught up!"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          )}
                          <Badge 
                            variant={notification.priority === 'high' ? 'destructive' : 
                                   notification.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(notification.category)}
                            <span className="capitalize">{notification.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{notification.timestamp.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!notification.read && (
                          <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Mark as read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => deleteNotification(notification.id)}
                          className="text-destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{notifications.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <BellRing className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{unreadCount}</div>
              <div className="text-sm text-muted-foreground">Unread</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.priority === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {notifications.filter(n => 
                  n.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Today</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;