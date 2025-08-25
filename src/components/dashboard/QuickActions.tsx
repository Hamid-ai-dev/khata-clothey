import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Receipt, FileText } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Add Transaction",
      description: "Record new credit or payment",
      icon: Plus,
      variant: "default" as const,
      onClick: () => console.log("Add transaction")
    },
    {
      title: "New Customer", 
      description: "Add customer profile",
      icon: UserPlus,
      variant: "secondary" as const,
      onClick: () => console.log("Add customer")
    },
    {
      title: "Quick Receipt",
      description: "Generate payment receipt",
      icon: Receipt,
      variant: "outline" as const,
      onClick: () => console.log("Generate receipt")
    },
    {
      title: "Monthly Report",
      description: "View detailed reports",
      icon: FileText,
      variant: "ghost" as const,
      onClick: () => console.log("View reports")
    }
  ];

  return (
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
  );
}