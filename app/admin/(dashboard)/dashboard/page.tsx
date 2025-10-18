"use client"
import { SaleGraphOverview } from "@/components/admin/dashboard/overview";
import { RecentSales } from "@/components/admin/dashboard/recent-sales";
import { DashboardSkeleton } from "@/components/admin/dashboard/skeleton";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import { Icons } from "@/components/admin/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetDashboardAnalytics } from "@/lib/react-query/admin/query/analytics";
import { formatCurrency } from "@/lib/utils";
import { IndianRupee, User } from "lucide-react";
import { useMemo, useState } from "react";

export default function DashboardPage() {

  const [timeRange, setTimeRange] = useState<string>("7");

  const { data, isLoading } = useGetDashboardAnalytics(parseInt(timeRange));



  //convert timeRange to date range from today 
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    const startDate = new Date();
    const endDate = new Date();
    if (timeRange === "1") {
      startDate.setDate(today.getDate() - 1);
      endDate.setDate(today.getDate() - 1);
    } else if (timeRange === "7") {
      startDate.setDate(today.getDate() - 7);
      endDate.setDate(today.getDate() - 1);
    } else if (timeRange === "30") {
      startDate.setDate(today.getDate() - 30);
      endDate.setDate(today.getDate() - 1);
    }
    return { startDate, endDate }
  }, [timeRange]);


  if (isLoading) {
    return <DashboardSkeleton />
  }


  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="today" className="w-[300px]" onValueChange={
            setTimeRange
          } value={timeRange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="1">Today</TabsTrigger>
              <TabsTrigger value="7">Week</TabsTrigger>
              <TabsTrigger value="30">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(data?.totalRevenue) || 0}
          icon={<IndianRupee className="h-4 w-4" />}
          percentage="+20.1%"
          percentageType="increase"
        />
        <StatsCard
          title="Active Users"
          value={data?.activeUsers || 0}
          icon={<User className="h-4 w-4" />}
          percentage="-5.2%"
          percentageType="decrease"
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +7.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <Icons.product className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Compare sales performance over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SaleGraphOverview startDate={startDate.toISOString()} endDate={endDate.toISOString()} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              Latest transactions and order details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}