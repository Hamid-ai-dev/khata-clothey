import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Receipt, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function QuickActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Forms state
  const [transactionForm, setTransactionForm] = useState({
    customer_id: '',
    type: '',
    amount: '',
    description: '',
    product_id: ''
  });

  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    cnic: '',
    address: ''
  });

  // Fetch customers and products for dropdowns
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await supabase.from('customers').select('*');
      return data || [];
    }
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*');
      return data || [];
    }
  });

  const handleAddTransaction = async () => {
    try {
      const { error } = await supabase.from('transactions').insert({
        customer_id: transactionForm.customer_id,
        type: transactionForm.type as 'credit' | 'debit',
        amount: parseFloat(transactionForm.amount),
        description: transactionForm.description,
        product_id: transactionForm.product_id || null
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully"
      });

      setTransactionForm({
        customer_id: '',
        type: '',
        amount: '',
        description: '',
        product_id: ''
      });
      setIsTransactionOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive"
      });
    }
  };

  const handleAddCustomer = async () => {
    try {
      const { error } = await supabase.from('customers').insert({
        name: customerForm.name,
        phone: customerForm.phone,
        cnic: customerForm.cnic,
        address: customerForm.address
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer added successfully"
      });

      setCustomerForm({
        name: '',
        phone: '',
        cnic: '',
        address: ''
      });
      setIsCustomerOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive"
      });
    }
  };

  const actions = [
    {
      title: "Add Transaction",
      description: "Record new credit or payment",
      icon: Plus,
      variant: "default" as const,
      onClick: () => setIsTransactionOpen(true)
    },
    {
      title: "New Customer", 
      description: "Add customer profile",
      icon: UserPlus,
      variant: "secondary" as const,
      onClick: () => setIsCustomerOpen(true)
    },
    {
      title: "Quick Receipt",
      description: "Generate payment receipt",
      icon: Receipt,
      variant: "outline" as const,
      onClick: () => setIsReceiptOpen(true)
    },
    {
      title: "Monthly Report",
      description: "View detailed reports",
      icon: FileText,
      variant: "ghost" as const,
      onClick: () => navigate('/reports')
    }
  ];

  return (
    <>
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              onClick={action.onClick}
              className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-card transition-all"
            >
              <div className="flex items-center gap-2 w-full">
                <action.icon className="h-5 w-5" />
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                {action.description}
              </span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Select value={transactionForm.customer_id} onValueChange={(value) => 
                setTransactionForm(prev => ({ ...prev, customer_id: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={transactionForm.type} onValueChange={(value) => 
                setTransactionForm(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={transactionForm.amount}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="product">Product (Optional)</Label>
              <Select value={transactionForm.product_id} onValueChange={(value) => 
                setTransactionForm(prev => ({ ...prev, product_id: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={transactionForm.description}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>
            <Button onClick={handleAddTransaction} className="w-full">
              Add Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={isCustomerOpen} onOpenChange={setIsCustomerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={customerForm.name}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="cnic">CNIC</Label>
              <Input
                id="cnic"
                value={customerForm.cnic}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, cnic: e.target.value }))}
                placeholder="Enter CNIC"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={customerForm.address}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
              />
            </div>
            <Button onClick={handleAddCustomer} className="w-full">
              Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Receipt</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <Receipt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Receipt generation will be available in the next update.</p>
            <Button onClick={() => setIsReceiptOpen(false)} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}