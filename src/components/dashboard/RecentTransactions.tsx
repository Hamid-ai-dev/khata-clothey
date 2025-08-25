import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Transaction {
  id: string;
  customerName: string;
  type: "credit" | "debit";
  amount: number;
  date: string;
  description: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    customerName: "Ahmed Ali",
    type: "credit",
    amount: 15000,
    date: "2024-01-20",
    description: "Wedding suit purchase"
  },
  {
    id: "2", 
    customerName: "Fatima Khan",
    type: "debit",
    amount: 8000,
    date: "2024-01-19",
    description: "Payment received"
  },
  {
    id: "3",
    customerName: "Hassan Sheikh",
    type: "credit", 
    amount: 12000,
    date: "2024-01-18",
    description: "Formal shirts x3"
  },
  {
    id: "4",
    customerName: "Sara Ahmad",
    type: "debit",
    amount: 5000,
    date: "2024-01-17",
    description: "Partial payment"
  }
];

export function RecentTransactions() {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-primary">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {transaction.customerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-primary">{transaction.customerName}</p>
                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={transaction.type === "credit" ? "destructive" : "secondary"}
                    className={transaction.type === "credit" ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground"}
                  >
                    {transaction.type === "credit" ? "Credit" : "Payment"}
                  </Badge>
                </div>
                <p className={`font-semibold ${transaction.type === "credit" ? "text-warning" : "text-success"}`}>
                  {transaction.type === "credit" ? "+" : "-"}Rs. {transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}