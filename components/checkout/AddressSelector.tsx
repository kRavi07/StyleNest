"use client"

import { useEffect, useState } from "react"
import { Check, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { ShippingAddress } from "@/types/checkout"



interface AddressSelectorProps {
    addresses: ShippingAddress[]
    onSelectAddress: (address: ShippingAddress) => void
    defaultSelectedId?: string
}

export function AddressSelector({ addresses, onSelectAddress, defaultSelectedId }: AddressSelectorProps) {
    const [selectedId, setSelectedId] = useState<string>(defaultSelectedId || addresses[0]?._id || "")

    useEffect(() => {
        onSelectAddress(addresses.find((address) => address._id === defaultSelectedId) || addresses[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSelect = (address: ShippingAddress) => {
        setSelectedId(address._id || "")
        onSelectAddress(address)
    }


    return (
        <div className="w-full space-y-4">
            {/* Desktop View - Full Details */}
            <div className="hidden md:grid gap-3">
                {addresses.map((address) => (
                    <button
                        key={address._id}
                        onClick={() => handleSelect(address)}
                        className={cn(
                            "relative w-44 p-4 text-left border rounded-lg transition-all duration-200",
                            "hover:border-accent hover:bg-accent/5",
                            selectedId === address._id ? "border-accent bg-accent/10 ring-1 ring-accent/50" : "border-border bg-card",
                        )}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-foreground">{address.firstName} {address.lastName}</p>
                                    {address.isPrimary && (
                                        <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded">Default</span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{address.address1}</p>
                                {address.address2 && <p className="text-sm text-muted-foreground">{address.address2}</p>}
                                <p className="text-sm text-muted-foreground">
                                    {address.city}, {address.state} {address.postalCode}
                                </p>
                                {address.phone && <p className="text-xs text-muted-foreground mt-2">{address.phone}</p>}
                            </div>

                            {/* Selection indicator */}
                            <div
                                className={cn(
                                    "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedId === address._id ? "border-accent bg-accent" : "border-border",
                                )}
                            >
                                {selectedId === address._id && <Check className="w-3 h-3 text-accent-foreground" />}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Mobile View - Compact */}
            <div className="md:hidden space-y-2">
                {addresses.map((address) => (
                    <button
                        key={address._id}
                        onClick={() => handleSelect(address)}
                        className={cn(
                            "w-full p-3 text-left border rounded-lg transition-all duration-200",
                            "hover:border-accent hover:bg-accent/5",
                            selectedId === address._id ? "border-accent bg-accent/10 ring-1 ring-accent/50" : "border-border bg-card",
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                                    <p className="font-medium text-sm text-foreground truncate">{address.firstName} {address.lastName}</p>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{address.address1}</p>
                                <p className="text-xs text-muted-foreground">
                                    {address.city}, {address.state}
                                </p>
                            </div>

                            {/* Selection indicator */}
                            <div
                                className={cn(
                                    "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5",
                                    selectedId === address._id ? "border-accent bg-accent" : "border-border",
                                )}
                            >
                                {selectedId === address._id && <Check className="w-3 h-3 text-accent-foreground" />}
                            </div>
                        </div>
                    </button>
                ))}
            </div>


        </div>
    )
}
