import React from 'react'
import OrderDetailPage from './order'

type Params = Promise<{ orderNumber: string }>;

const OrderPage = async ({ params }: { params: Params }) => {
    const param = await params
    return (
        <OrderDetailPage params={param} />
    )
}

export default OrderPage