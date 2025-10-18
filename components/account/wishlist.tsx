import { Badge, ShoppingBag, X } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';
import Image from 'next/image';

const Wishlist = ({ savedItems }: any) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedItems.map((item: any, index: any) => (
                <div key={index} className="group relative overflow-hidden rounded-xl bg-slate-700/20 hover:bg-slate-700/30 transition-all">
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <Image width={100} height={100} src={"https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{item.name}</h3>
                                <p className="text-xl font-bold text-green-400 mt-2">{item.price}</p>
                                <Badge className={`mt-2 ${item.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button size="sm" className="flex-1" disabled={!item.inStock}>
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Add to Cart
                            </Button>
                            <Button size="sm" variant="ghost">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Wishlist