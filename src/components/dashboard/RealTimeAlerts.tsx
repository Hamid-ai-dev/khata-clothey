import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

export function RealTimeAlerts() {
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["dashboard-alerts"],
    queryFn: async () => {
      const alertsList = [];

      // Check for overdue customers (balance > 0 and last transaction > 30 days ago)
      const { data: customers } = await supabase
        .from("customers")
        .select("id, name");

      if (customers) {
        let overdueCount = 0;
        let overdueAmount = 0;

        for (const customer of customers) {
          const { data: balance } = await supabase.rpc('get_customer_balance', {
            customer_uuid: customer.id
          });

          if (balance && balance > 0) {
            const { data: lastTransaction } = await supabase
              .from("transactions")
              .select("created_at")
              .eq("customer_id", customer.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            const daysSinceLastTransaction = lastTransaction 
              ? (new Date().getTime() - new Date(lastTransaction.created_at).getTime()) / (1000 * 60 * 60 * 24)
              : Infinity;

            if (daysSinceLastTransaction > 30) {
              overdueCount++;
              overdueAmount += balance;
            }
          }
        }

        if (overdueCount > 0) {
          alertsList.push(`${overdueCount} customers have overdue payments (Rs. ${overdueAmount.toLocaleString()} total)`);
        }
      }

      // Check for low stock products
      const { data: lowStockProducts } = await supabase
        .from("products")
        .select("name, stock_quantity")
        .lt("stock_quantity", 10);

      if (lowStockProducts && lowStockProducts.length > 0) {
        alertsList.push(`${lowStockProducts.length} products are running low on stock`);
      }

      // Check if monthly report is ready
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const isEndOfMonth = new Date().getDate() > 25; // Show alert after 25th of the month

      if (isEndOfMonth) {
        const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', { month: 'long' });
        alertsList.push(`Monthly report for ${monthName} is ready to generate`);
      }

      return alertsList;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-card border border-warning/20 rounded-lg p-6 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="font-semibold text-primary">Attention Required</h3>
        </div>
        <div className="h-16 bg-secondary/20 rounded animate-pulse" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-gradient-card border border-success/20 rounded-lg p-6 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-success" />
          <h3 className="font-semibold text-primary">All Clear</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          No urgent issues requiring attention at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card border border-warning/20 rounded-lg p-6 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <h3 className="font-semibold text-primary">Attention Required</h3>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        {alerts.map((alert, index) => (
          <p key={index}>• {alert}</p>
        ))}
      </div>
    </div>
  );
}