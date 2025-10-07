import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RealTimeMetrics } from "@/components/dashboard/RealTimeMetrics";
import { RealTimeAnalytics } from "@/components/dashboard/RealTimeAnalytics";
import { RealTimeTransactions } from "@/components/dashboard/RealTimeTransactions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RealTimeCustomers } from "@/components/dashboard/RealTimeCustomers";
import { RealTimeAlerts } from "@/components/dashboard/RealTimeAlerts";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Welcome to Khata Management System
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your clothing business accounts and transactions efficiently
          </p>
        </div>

        {/* Real-time Metrics */}
        <RealTimeMetrics />

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <RealTimeAnalytics />
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <RealTimeTransactions />
          <RealTimeCustomers />
        </div>

        {/* Real-time Alerts */}
        <RealTimeAlerts />
      </div>
    </DashboardLayout>
  );
};

export default Index;
