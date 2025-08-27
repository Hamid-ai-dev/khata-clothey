import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

export function RealTimeAnalytics() {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ["analytics-chart"],
    queryFn: async () => {
      // Get last 6 days of data
      const days = [];
      for (let i = 5; i >= 0; i--) {
        const date = subDays(new Date(), i);
        days.push(startOfDay(date));
      }

      const analytics = await Promise.all(
        days.map(async (day) => {
          const nextDay = new Date(day);
          nextDay.setDate(nextDay.getDate() + 1);

          // Get sales (credits) for this day
          const { data: salesData } = await supabase
            .from("transactions")
            .select("amount")
            .eq("type", "credit")
            .gte("created_at", day.toISOString())
            .lt("created_at", nextDay.toISOString());

          // Get payments (debits) for this day
          const { data: paymentsData } = await supabase
            .from("transactions")
            .select("amount")
            .eq("type", "debit")
            .gte("created_at", day.toISOString())
            .lt("created_at", nextDay.toISOString());

          const sales = salesData?.reduce((sum, t) => sum + t.amount, 0) || 0;
          const payments = paymentsData?.reduce((sum, t) => sum + t.amount, 0) || 0;

          return {
            day: format(day, "MMM dd"),
            sales,
            payments
          };
        })
      );

      return analytics;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-primary">Sales vs Payments (Last 6 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-secondary/20 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-primary">Sales vs Payments (Last 6 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                className="text-xs text-muted-foreground" 
              />
              <YAxis 
                className="text-xs text-muted-foreground"
                tickFormatter={(value) => `Rs. ${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--primary))' }}
                formatter={(value: number, name: string) => [
                  `Rs. ${value.toLocaleString()}`, 
                  name === 'sales' ? 'Sales' : 'Payments'
                ]}
              />
              <Bar 
                dataKey="sales" 
                fill="hsl(var(--warning))" 
                radius={[4, 4, 0, 0]}
                name="sales"
              />
              <Bar 
                dataKey="payments" 
                fill="hsl(var(--success))" 
                radius={[4, 4, 0, 0]}
                name="payments"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}