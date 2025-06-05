"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 12400,
  },
  {
    name: "Feb",
    total: 18100,
  },
  {
    name: "Mar",
    total: 16200,
  },
  {
    name: "Apr",
    total: 23800,
  },
  {
    name: "May",
    total: 28900,
  },
  {
    name: "Jun",
    total: 39400,
  },
  {
    name: "Jul",
    total: 34200,
  },
  {
    name: "Aug",
    total: 29300,
  },
  {
    name: "Sep",
    total: 36200,
  },
  {
    name: "Oct",
    total: 28000,
  },
  {
    name: "Nov",
    total: 42100,
  },
  {
    name: "Dec",
    total: 45231,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
                        Sales
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
        <Bar
          dataKey="total"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
          className="cursor-pointer hover:fill-primary/80"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}