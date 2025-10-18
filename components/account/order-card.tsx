import { Order } from '@/types'
import Image from 'next/image'
import React from 'react'
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';



const OrderCard = ({ order }: { order: Order }) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };
    return (
        <div key={order._id} className="flex items-center gap-4 p-6 rounded-xl bg-white border shadow-md dark:bg-slate-700/20 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
            <Image src={"https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=" loading="lazy" style={{ objectFit: 'cover' }
            } width={100} height={100} alt="Product" className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold truncate overflow-ellipsis text-ellipsis">{order?.items[0]?.name}</p>
                    <Badge className={getStatusColor(order.status)}>
                        {order?.status && order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                </div>
                <div className="flex items-center justify-between text-sm opacity-70">
                    <span>{formatDate(order.createdAt, "dd/MM/yyyy ")} • {order.items.length} items</span>
                    <span className="font-semibold text-green-400">{formatCurrency(order.total)}</span>
                </div>
            </div>
            <Button variant="ghost" size="sm">
                <Link href={`/account/orders/${order._id}`}>
                    <Eye className="w-4 h-4" />
                </Link>
            </Button>
        </div>
    )
}

export default OrderCard