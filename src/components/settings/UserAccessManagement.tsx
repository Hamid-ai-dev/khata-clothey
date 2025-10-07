import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Shield, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AllowedEmail {
  id: string;
  email: string;
  created_at: string;
}

export const UserAccessManagement = () => {
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if current user is admin
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });
      
      setCurrentUserIsAdmin(data || false);
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (currentUserIsAdmin) {
      fetchAllowedEmails();
    }
  }, [currentUserIsAdmin]);

  const fetchAllowedEmails = async () => {
    try {
      const { data, error } = await supabase
        .from("allowed_emails")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllowedEmails(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch allowed emails",
        variant: "destructive",
      });
    }
  };

  const addEmail = async () => {
    if (!newEmail.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("allowed_emails")
        .insert({
          email: newEmail.toLowerCase(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Email ${newEmail} has been added to the allowed list`,
      });

      setNewEmail("");
      setIsAdmin(false);
      setIsDialogOpen(false);
      fetchAllowedEmails();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeEmail = async (id: string, email: string) => {
    if (email === user?.email) {
      toast({
        title: "Error",
        description: "You cannot remove your own email",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("allowed_emails")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Email ${email} has been removed from the allowed list`,
      });

      fetchAllowedEmails();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove email",
        variant: "destructive",
      });
    }
  };

  if (!currentUserIsAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Access Management
          </CardTitle>
          <CardDescription>
            Manage who can access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You need administrator privileges to manage user access.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Access Management
            </CardTitle>
            <CardDescription>
              Manage who can access the system and their permissions
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User Email</DialogTitle>
                <DialogDescription>
                  Add an email address to allow access to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="admin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="admin">Grant administrator privileges</Label>
                </div>
                <Button 
                  onClick={addEmail} 
                  disabled={isLoading || !newEmail.trim()}
                  className="w-full"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Email
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allowedEmails.map((allowedEmail) => (
                  <TableRow key={allowedEmail.id}>
                    <TableCell className="font-medium">
                      {allowedEmail.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        User
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(allowedEmail.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {allowedEmail.email !== user?.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmail(allowedEmail.id, allowedEmail.email)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {allowedEmails.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No allowed emails found. Add some to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};