import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TopCustomers } from "@/components/dashboard/TopCustomers";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users,
  CreditCard,
  AlertTriangle
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome to Khata Management System
          </h1>
          <p className="text-muted-foreground">
            Manage your clothing business accounts and transactions efficiently
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sales"
            value="Rs. 2,45,000"
            change="+12.5% from last month"
            changeType="positive"
            icon={DollarSign}
          />
          <MetricCard
            title="Pending Payments"
            value="Rs. 85,000"
            change="+5.2% from last month"
            changeType="negative"
            icon={TrendingUp}
          />
          <MetricCard
            title="Received Payments"
            value="Rs. 1,60,000"
            change="+8.1% from last month"
            changeType="positive"
            icon={TrendingDown}
          />
          <MetricCard
            title="Active Customers"
            value="142"
            change="+3 new this month"
            changeType="positive"
            icon={Users}
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart />
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions />
          <TopCustomers />
        </div>

        {/* Alerts Section */}
        <div className="bg-gradient-card border border-warning/20 rounded-lg p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h3 className="font-semibold text-primary">Attention Required</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• 5 customers have overdue payments (Rs. 45,000 total)</p>
            <p>• 3 products are running low on stock</p>
            <p>• Monthly report for January is ready to generate</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
