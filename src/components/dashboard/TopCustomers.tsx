import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string;
  name: string;
  balance: number;
  lastTransaction: string;
  status: "active" | "pending" | "overdue";
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Ahmed Ali",
    balance: 25000,
    lastTransaction: "2024-01-18",
    status: "pending"
  },
  {
    id: "2", 
    name: "Fatima Khan",
    balance: -5000,
    lastTransaction: "2024-01-19",
    status: "active"
  },
  {
    id: "3",
    name: "Hassan Sheikh",
    balance: 15000,
    lastTransaction: "2024-01-15",
    status: "overdue"
  },
  {
    id: "4",
    name: "Sara Ahmad",
    balance: 8000,
    lastTransaction: "2024-01-17",
    status: "pending"
  },
  {
    id: "5",
    name: "Ali Raza",
    balance: -2000,
    lastTransaction: "2024-01-20",
    status: "active"
  }
];

export function TopCustomers() {
  const getStatusVariant = (status: Customer["status"]) => {
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

  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return "text-success";
      case "pending":
        return "text-warning";
      case "overdue":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-primary">Top Customers by Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCustomers.map((customer, index) => (
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
                    Last: {customer.lastTransaction}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}