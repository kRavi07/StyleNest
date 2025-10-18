import OrdersTable from "./order-list"



type Params = Promise<{ id: string }>;


const OrderPage = async ({ params }: { params: Params }) => {
    const { id } = await params
    return (
        <OrdersTable id={id} />
    )
}

export default OrderPage