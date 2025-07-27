"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { CartItem } from "@/hooks/context/cart/cart-context";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
    item: CartItem;
    onQuantityChange: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
}

const CartItemCard = ({ item, onQuantityChange, onRemove }: Props) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-6 border-b last:border-b-0"
        >
            <div className="flex flex-col sm:flex-row gap-4">
                <div
                    className="w-24 h-24 rounded bg-muted/20 flex-shrink-0"
                    style={{
                        backgroundImage: `url(${item.product.images[0]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>
                            <Link href={`/products/${item.product._id}`} className="font-medium hover:underline">
                                {item.product.name}
                            </Link>
                            <div className="text-sm text-muted-foreground mt-1">
                                {item.size && <span>Size: {item.size}</span>}
                                {item.size && item.color && <span> | </span>}
                                {item.color && <span>Color: {item.color}</span>}
                            </div>
                            <div className="text-sm font-medium mt-2">
                                {formatCurrency(item.product.price)}
                            </div>
                        </div>
                        <button
                            onClick={() => onRemove(item.product._id)}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onQuantityChange(item.product._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onQuantityChange(item.product._id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.inventory}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="font-medium">
                            {
                                formatCurrency(item.product.price * item.quantity)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(CartItemCard);
