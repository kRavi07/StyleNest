import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetOrders } from "@/lib/react-query/admin/query/orders"
import { formatCurrency } from "@/lib/utils"
import { OrderSummary } from "@/types/admin"
import Link from "next/link"



const OrderRow = ({ order }: any) => {
  return (
    <div className="flex items-center">
      <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
        <AvatarImage src={`https://ui-avatars.com/api/?name=${order.customer.name}`} alt="Avatar" />
        <AvatarFallback>JL</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{order.customer.name}</p>
        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
      </div>
      <div className="ml-auto font-medium text-green-500 ">{formatCurrency(order.total)}</div>
    </div>
  )
}
export const OrderRowSkeleton = () => {
  return (
    <div className="flex items-center animate-pulse">
      {/* Avatar skeleton */}
      <Skeleton className="h-9 w-9 rounded-full" />

      {/* Name + Email skeleton */}
      <div className="ml-4 space-y-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>

      {/* Total skeleton */}
      <div className="ml-auto">
        <Skeleton className="h-4 w-12 rounded-md" />
      </div>
    </div>
  )
}

export function RecentSales() {

  const { data, isLoading } = useGetOrders({
    limit: 7,
    page: 1,
    status: "pending",
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        {
          [...Array(5)].map((_, index) => (
            <OrderRowSkeleton key={index} />
          ))
        }
      </div>
    )
  }

  if (!data.data) return null

  return (
    <div className="space-y-8">
      {
        data.data && data.data?.map((order: OrderSummary) => (
          <OrderRow key={order._id} order={order} />
        ))
      }
      <div className="text-xs justify-center flex w-full">
        <Link href="/admin/orders" className="text-slate-600 dark:text-slate-50  hover:underline">View All</Link>
      </div>
    </div>
  )
}