import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { month: "Jan", sales: 45000, payments: 35000 },
  { month: "Feb", sales: 52000, payments: 48000 },
  { month: "Mar", sales: 48000, payments: 40000 },
  { month: "Apr", sales: 61000, payments: 55000 },
  { month: "May", sales: 58000, payments: 62000 },
  { month: "Jun", sales: 67000, payments: 58000 },
];

export function AnalyticsChart() {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-primary">Sales vs Payments (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
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