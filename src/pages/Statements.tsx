import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, FileText, Printer, Mail } from "lucide-react";
import { format, subDays } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type Transaction = {
  id: string;
  customer_id: string;
  type: "credit" | "debit";
  amount: number;
  description?: string;
  created_at: string;
  customers?: {
    name: string;
    phone?: string;
    address?: string;
  };
};

export default function Statements() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ["customers-statements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, name, phone, address")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch customer transactions
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["customer-transactions", selectedCustomerId, dateRange],
    queryFn: async () => {
      if (!selectedCustomerId) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          customers(name, phone, address)
        `)
        .eq("customer_id", selectedCustomerId)
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!selectedCustomerId,
  });

  // Get customer balance using the database function
  const { data: customerBalance } = useQuery({
    queryKey: ["customer-balance", selectedCustomerId],
    queryFn: async () => {
      if (!selectedCustomerId) return 0;
      
      const { data, error } = await supabase.rpc('get_customer_balance', {
        customer_uuid: selectedCustomerId
      });
      
      if (error) throw error;
      return data as number;
    },
    enabled: !!selectedCustomerId,
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Calculate running balance for statement
  let runningBalance = 0;
  const transactionsWithBalance = transactions.map(transaction => {
    if (transaction.type === "credit") {
      runningBalance += transaction.amount;
    } else {
      runningBalance -= transaction.amount;
    }
    return {
      ...transaction,
      runningBalance
    };
  });

  const totalCredits = transactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const handlePrintStatement = () => {
    window.print();
  };

  const handleExportStatement = () => {
    const statementData = {
      customer: selectedCustomer,
      dateRange,
      transactions: transactionsWithBalance,
      summary: {
        totalCredits,
        totalDebits,
        currentBalance: customerBalance,
      },
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(statementData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${selectedCustomer?.name?.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailStatement = () => {
    const subject = `Account Statement - ${selectedCustomer?.name}`;
    const body = `Dear ${selectedCustomer?.name},

Please find your account statement for the period ${format(dateRange.from, 'MMM dd, yyyy')} to ${format(dateRange.to, 'MMM dd, yyyy')}.

Statement Summary:
- Total Sales: Rs. ${totalCredits.toLocaleString()}
- Total Payments: Rs. ${totalDebits.toLocaleString()}
- Current Balance: Rs. ${Math.abs(customerBalance || 0).toLocaleString()} ${(customerBalance || 0) >= 0 ? 'due' : 'credit'}

Thank you for your business.

Best regards,
Your Business Team`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Statements</h1>
            <p className="text-muted-foreground">
              Generate detailed account statements for your customers
            </p>
          </div>
          {selectedCustomerId && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEmailStatement} className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" onClick={handlePrintStatement} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button onClick={handleExportStatement} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          )}
        </div>

        {/* Statement Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Statement Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Customer</label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.from, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.to, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedCustomerId && selectedCustomer && (
          <>
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedCustomer.name}</p>
                  </div>
                  {selectedCustomer.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                  )}
                  {selectedCustomer.address && (
                    <div className="col-span-full">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedCustomer.address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Opening Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rs. 0.00</div>
                  <p className="text-xs text-muted-foreground">Start of period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">Rs. {totalCredits.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Credits in period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">Rs. {totalDebits.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Payments received</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${(customerBalance || 0) >= 0 ? 'text-warning' : 'text-success'}`}>
                    Rs. {Math.abs(customerBalance || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(customerBalance || 0) >= 0 ? 'Outstanding' : 'Credit'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Statement */}
            <Card>
              <CardHeader>
                <CardTitle>Account Statement</CardTitle>
                <CardDescription>
                  Period: {format(dateRange.from, "MMM dd, yyyy")} to {format(dateRange.to, "MMM dd, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found for the selected period
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Description</th>
                          <th className="text-right p-3">Debit</th>
                          <th className="text-right p-3">Credit</th>
                          <th className="text-right p-3">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionsWithBalance.map((transaction) => (
                          <tr key={transaction.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              {format(new Date(transaction.created_at), "MMM dd, yyyy")}
                            </td>
                            <td className="p-3">
                              {transaction.description || `${transaction.type === 'credit' ? 'Sale' : 'Payment'}`}
                            </td>
                            <td className="p-3 text-right">
                              {transaction.type === 'debit' ? (
                                <span className="text-success font-medium">
                                  Rs. {transaction.amount.toLocaleString()}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {transaction.type === 'credit' ? (
                                <span className="text-warning font-medium">
                                  Rs. {transaction.amount.toLocaleString()}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="p-3 text-right font-medium">
                              <span className={transaction.runningBalance >= 0 ? 'text-warning' : 'text-success'}>
                                Rs. {Math.abs(transaction.runningBalance).toLocaleString()}
                                {transaction.runningBalance >= 0 ? ' Dr' : ' Cr'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 font-medium">
                          <td className="p-3" colSpan={2}>Total</td>
                          <td className="p-3 text-right text-success">
                            Rs. {totalDebits.toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-warning">
                            Rs. {totalCredits.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <span className={`${(customerBalance || 0) >= 0 ? 'text-warning' : 'text-success'}`}>
                              Rs. {Math.abs(customerBalance || 0).toLocaleString()}
                              {(customerBalance || 0) >= 0 ? ' Dr' : ' Cr'}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}