import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "./MetricCard";
import { DollarSign, TrendingUp, TrendingDown, Users } from "lucide-react";

export function RealTimeMetrics() {
  // Fetch real-time metrics
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      // Get total sales (credits)
      const { data: salesData } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "credit");
      
      const totalSales = salesData?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Get total payments (debits)
      const { data: paymentsData } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "debit");
      
      const totalPayments = paymentsData?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Get customer count
      const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      // Get this month's sales for comparison
      const currentMonth = new Date();
      const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      
      const { data: thisMonthSales } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "credit")
        .gte("created_at", new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString());

      const { data: lastMonthSales } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "credit")
        .gte("created_at", lastMonth.toISOString())
        .lt("created_at", new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString());

      const thisMonthTotal = thisMonthSales?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const lastMonthTotal = lastMonthSales?.reduce((sum, t) => sum + t.amount, 0) || 0;
      
      const salesGrowth = lastMonthTotal > 0 
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
        : "0";

      return {
        totalSales,
        totalPayments,
        pendingAmount: totalSales - totalPayments,
        customerCount: customerCount || 0,
        salesGrowth: parseFloat(salesGrowth)
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gradient-card rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Sales"
        value={`Rs. ${metrics?.totalSales?.toLocaleString() || '0'}`}
        change={`${metrics?.salesGrowth && metrics.salesGrowth > 0 ? '+' : ''}${metrics?.salesGrowth || 0}% from last month`}
        changeType={metrics?.salesGrowth && metrics.salesGrowth > 0 ? "positive" : metrics?.salesGrowth && metrics.salesGrowth < 0 ? "negative" : "neutral"}
        icon={DollarSign}
      />
      <MetricCard
        title="Pending Payments"
        value={`Rs. ${metrics?.pendingAmount?.toLocaleString() || '0'}`}
        change="Outstanding amount"
        changeType={metrics?.pendingAmount && metrics.pendingAmount > 0 ? "negative" : "positive"}
        icon={TrendingUp}
      />
      <MetricCard
        title="Received Payments"
        value={`Rs. ${metrics?.totalPayments?.toLocaleString() || '0'}`}
        change="Total collected"
        changeType="positive"
        icon={TrendingDown}
      />
      <MetricCard
        title="Active Customers"
        value={metrics?.customerCount?.toString() || '0'}
        change="Total customers"
        changeType="neutral"
        icon={Users}
      />
    </div>
  );
}