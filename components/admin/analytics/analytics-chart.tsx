"use client"

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

const data = [
  {
    name: "Jan",
    revenue: 4000,
    orders: 240,
    visitors: 12400,
    conversions: 2.4,
  },
  {
    name: "Feb",
    revenue: 3000,
    orders: 198,
    visitors: 10800,
    conversions: 2.2,
  },
  {
    name: "Mar",
    revenue: 5000,
    orders: 300,
    visitors: 14200,
    conversions: 2.8,
  },
  {
    name: "Apr",
    revenue: 8000,
    orders: 400,
    visitors: 18000,
    conversions: 3.1,
  },
  {
    name: "May",
    revenue: 7000,
    orders: 380,
    visitors: 16900,
    conversions: 3.0,
  },
  {
    name: "Jun",
    revenue: 9000,
    orders: 480,
    visitors: 21000,
    conversions: 3.2,
  },
  {
    name: "Jul",
    revenue: 8500,
    orders: 460,
    visitors: 20500,
    conversions: 3.1,
  },
  {
    name: "Aug",
    revenue: 11000,
    orders: 520,
    visitors: 23000,
    conversions: 3.3,
  },
  {
    name: "Sep",
    revenue: 9800,
    orders: 495,
    visitors: 22000,
    conversions: 3.2,
  },
  {
    name: "Oct",
    revenue: 12000,
    orders: 580,
    visitors: 25000,
    conversions: 3.4,
  },
  {
    name: "Nov",
    revenue: 14500,
    orders: 620,
    visitors: 27000,
    conversions: 3.5,
  },
  {
    name: "Dec",
    revenue: 18000,
    orders: 720,
    visitors: 32000,
    conversions: 3.6,
  },
]

export function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          className="text-xs fill-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          className="text-xs fill-muted-foreground"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Month
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0].payload.name}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Revenue
                      </span>
                      <span className="font-bold">
                        ${payload[0].value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          activeDot={{ r: 6 }}
          className="stroke-primary"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}