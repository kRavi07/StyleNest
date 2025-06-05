"use client"

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

const data = [
  {
    name: "New",
    count: 40,
  },
  {
    name: "Returning",
    count: 30,
  },
  {
    name: "Regular",
    count: 20,
  },
  {
    name: "VIP",
    count: 10,
  },
]

const deviceData = [
  {
    name: "Desktop",
    percentage: 45,
  },
  {
    name: "Mobile",
    percentage: 40,
  },
  {
    name: "Tablet",
    percentage: 15,
  },
]

export function CustomerInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Customer Types</h4>
        <ResponsiveContainer width="100%" height={200}>
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
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Type
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.name}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Count
                          </span>
                          <span className="font-bold">
                            {payload[0].value}%
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
              dataKey="count"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              className="cursor-pointer hover:opacity-80"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Device Breakdown</h4>
        <div className="space-y-2">
          {deviceData.map((item) => (
            <div key={item.name} className="flex items-center">
              <div className="w-16 text-sm">{item.name}</div>
              <div className="w-full">
                <div className="h-2 bg-muted overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
              <div className="w-10 text-right text-sm">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}