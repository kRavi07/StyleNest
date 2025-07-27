import { useCart } from '@/hooks/context/cart/cart-context';
import { useCartItemsCount } from '@/hooks/context/cart/cart-item-context';
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button';
import { useCartStore } from '@/hooks/store/cart/use-cart';

const CartCount = () => {

    const cartItemsCount = useCartStore((state) => state.count);


    if (!cartItemsCount) {
        return null;
    }


    return (
        <Button variant="ghost" size="icon" className="relative" asChild>

            <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {cartItemsCount}
                    </span>
                )}
            </Link>
        </Button>
    )
}

export default React.memo(CartCount);