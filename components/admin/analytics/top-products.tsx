"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const topProducts = [
  {
    name: "Premium Wireless Headphones",
    sales: 245,
    revenue: 61245.55,
    growth: 12.5,
  },
  {
    name: "Modern Ergonomic Chair",
    sales: 189,
    revenue: 56689.11,
    growth: 8.2,
  },
  {
    name: "Professional DSLR Camera",
    sales: 126,
    revenue: 45360.00,
    growth: -2.4,
  },
  {
    name: "Stainless Steel Water Bottle",
    sales: 521,
    revenue: 18749.79,
    growth: 22.1,
  },
  {
    name: "Smart Home Hub",
    sales: 91,
    revenue: 11829.09,
    growth: 5.3,
  },
]

export function TopProducts() {
  const maxRevenue = Math.max(...topProducts.map(p => p.revenue))
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topProducts.map((product) => (
          <TableRow key={product.name}>
            <TableCell>
              <div className="font-medium">{product.name}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="mr-2">{product.sales} units</span>
                <span className={`text-xs ${product.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.growth >= 0 ? '+' : ''}{product.growth}%
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="font-medium">${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <Progress 
                value={(product.revenue / maxRevenue) * 100} 
                className="h-1 w-24 ml-auto mt-1" 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}