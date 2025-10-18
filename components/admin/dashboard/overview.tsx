"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { useGetSalesAnalyticsReport } from "@/lib/react-query/admin/query/analytics"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// --- Types ---
type RawItem = {
  _id: { year: number; month: number }
  totalSales: number
  orderCount: number
}

type ChartData = {
  date: string
  totalSales: number
  orderCount: number
}

// --- Transform ---
export function transformData(rawData: RawItem[]): ChartData[] {
  if (!rawData || rawData.length === 0) return []

  return rawData.map((item) => {
    const { year, month } = item._id
    return {
      date: `${year}-${String(month).padStart(2, "0")}-01`,
      totalSales: item.totalSales,
      orderCount: item.orderCount,
    }
  })
}

// --- Skeleton loader for chart ---
export const BarChartSkeleton = ({ bars = 6 }: { bars?: number }) => {
  return (
    <div className="flex h-48 w-full items-end gap-3">
      {Array.from({ length: bars }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-6 rounded-md shimmer"
          style={{
            height: `${Math.floor(Math.random() * 80) + 20}%`,
          }}
        />
      ))}
    </div>
  )
}

// --- Main Component ---
export function SaleGraphOverview({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}) {
  const { isLoading, data } = useGetSalesAnalyticsReport(
    startDate,
    endDate,
    "sales-by-month"
  )

  const chartData = useMemo(() => {
    if (!data || data.data.length === 0) return []
    return transformData(data.data)
  }, [data])

  // --- Skeleton on loading ---
  if (isLoading) return <BarChartSkeleton />

  const chartConfig = {
    totalSales: {
      label: "Total Sales",
      color: "var(--chart-2)",
    },
    orderCount: {
      label: "Orders",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  // --- Empty data ---
  if (chartData.length === 0) {
    return (
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No data available
        </div>
      </ChartContainer>
    )
  }

  // --- Chart ---
  return (
    <ChartContainer config={chartConfig} className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          barCategoryGap="20%"
          barGap={2}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              })
            }}
          />

          <YAxis />

          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="date"
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                }
              />
            }
          />

          <Bar
            dataKey="totalSales"
            name={chartConfig.totalSales.label}
            fill={chartConfig.totalSales.color}
            barSize={20}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
