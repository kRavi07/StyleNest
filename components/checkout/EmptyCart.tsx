import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EmptyCart() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-4">Add some items to your cart to proceed with checkout</p>
                    <Button onClick={() => router.push('/')}>Continue Shopping</Button>
                </CardContent>
            </Card>
        </div>
    );
}
