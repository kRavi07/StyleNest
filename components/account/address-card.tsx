import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Edit3, X } from 'lucide-react'
import { Address, AddressResponse } from '@/types'

const AddressCard = ({ address }: {
    address: AddressResponse

}) => {
    return (
        <div className="p-6 rounded-xl bg-slate-700/20 border border-slate-600/30">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{address.type}</h3>
                        {address.isPrimary && (
                            <Badge className="bg-blue-500/20 text-blue-400">Default</Badge>
                        )}
                    </div>
                    <p className="opacity-70">{address.address1}</p>
                    {address.address2 && <p className="opacity-70">{address.address2}</p>}
                    <p className="opacity-70">{address.city}, {address.state} {address.postalCode}</p>
                    <p className="opacity-70">{address.country}</p>
                    <p className="opacity-70 mt-2">Phone: {address.phone}</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                        <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddressCard