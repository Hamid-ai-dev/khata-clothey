import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CustomerWithBalance {
  id: string;
  name: string;
  created_at: string;
  balance: number;
  lastTransaction?: string;
  status: "active" | "pending" | "overdue";
}

export function RealTimeCustomers() {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["top-customers"],
    queryFn: async () => {
      // Get all customers with their balances
      const { data: customersData, error: customersError } = await supabase
        .from("customers")
        .select("id, name, created_at")
        .order("created_at", { ascending: false });

      if (customersError) throw customersError;

      // Get balances for each customer
      const customersWithBalances = await Promise.all(
        customersData.map(async (customer) => {
          const { data: balance } = await supabase.rpc('get_customer_balance', {
            customer_uuid: customer.id
          });

          // Get last transaction date
          const { data: lastTransaction } = await supabase
            .from("transactions")
            .select("created_at")
            .eq("customer_id", customer.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Determine status
          let status: "active" | "pending" | "overdue" = "active";
          if (balance > 0) {
            const daysSinceLastTransaction = lastTransaction 
              ? (new Date().getTime() - new Date(lastTransaction.created_at).getTime()) / (1000 * 60 * 60 * 24)
              : 0;
            
            if (daysSinceLastTransaction > 30) {
              status = "overdue";
            } else if (balance > 0) {
              status = "pending";
            }
          }

          return {
            ...customer,
            balance: balance || 0,
            lastTransaction: lastTransaction?.created_at,
            status
          } as CustomerWithBalance;
        })
      );

      // Sort by balance (highest first) and take top 5
      return customersWithBalances
        .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
        .slice(0, 5);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const getStatusVariant = (status: CustomerWithBalance["status"]) => {
    switch (status) {
      case "active":
        return "secondary";
      case "pending": 
        return "outline";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-primary">Top Customers by Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary/20 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-primary">Top Customers by Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No customers yet</p>
          ) : (
            customers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium text-primary">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last: {customer.lastTransaction 
                        ? format(new Date(customer.lastTransaction), "MMM dd") 
                        : "No transactions"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${customer.balance >= 0 ? 'text-warning' : 'text-success'}`}>
                    Rs. {Math.abs(customer.balance).toLocaleString()}
                    {customer.balance >= 0 ? ' due' : ' credit'}
                  </p>
                  <Badge variant={getStatusVariant(customer.status)} className="mt-1">
                    {customer.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}