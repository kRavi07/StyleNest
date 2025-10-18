import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Plus,
    MapPin,
    Home,
    Building,
    User,
    Phone,
    Mail,
    Loader2,
    CheckCircle2,
    Star
} from 'lucide-react';
import { useAddAddress } from '@/lib/react-query/user/query';
import { toast } from 'sonner';

// Zod Schema for Address Validation
const addressSchema = z.object({
    type: z.enum(['home', 'work', 'other'], {
        required_error: "Please select an address type"
    }),
    firstName: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters"),
    lastName: z.string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters"),
    email: z.string()
        .email("Please enter a valid email address")
        .optional()
        .or(z.literal("")),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[\+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
    address1: z.string()
        .min(5, "Address line 1 must be at least 5 characters")
        .max(100, "Address line 1 must be less than 100 characters"),
    addres2: z.string()
        .max(100, "Address line 2 must be less than 100 characters")
        .optional(),
    city: z.string()
        .min(2, "City must be at least 2 characters")
        .max(50, "City must be less than 50 characters"),
    state: z.string()
        .min(2, "State must be at least 2 characters")
        .max(50, "State must be less than 50 characters"),
    postalCode: z.string().length(6, "Postal code must be exactly 6 characters"),
    country: z.string()
        .min(2, "Country must be at least 2 characters")
        .default("United States"),
    isDefault: z.boolean().default(false)
});

type AddressFormData = z.infer<typeof addressSchema>;

// Address Type Selector Component
const AddressTypeSelector = ({ value, onChange, error }: {
    value: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    error?: any
}) => {
    const addressTypes = [
        {
            value: 'home',
            label: 'Home',
            icon: Home,
            description: 'Personal residence',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            value: 'work',
            label: 'Work',
            icon: Building,
            description: 'Office or workplace',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            value: 'other',
            label: 'Other',
            icon: MapPin,
            description: 'Alternative address',
            gradient: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium">Address Type</Label>
            <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 gap-3">
                {addressTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = value === type.value;

                    return (
                        <div key={type.value} className="relative">
                            <RadioGroupItem
                                value={type.value}
                                id={type.value}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={type.value}
                                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  hover:border-primary/50 hover:shadow-md
                  ${isSelected
                                        ? 'border-primary bg-primary/5 shadow-md'
                                        : 'border-border hover:bg-muted/50'
                                    }
                `}
                            >
                                <div className={`
                  p-2 rounded-lg bg-gradient-to-br ${type.gradient} shadow-sm
                  ${isSelected ? 'shadow-lg scale-110' : ''}
                  transition-all duration-200
                `}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-center">
                                    <div className="font-medium text-sm">{type.label}</div>
                                    <div className="text-xs text-muted-foreground">{type.description}</div>
                                </div>
                                {isSelected && (
                                    <CheckCircle2 className="absolute -top-2 -right-2 w-5 h-5 text-primary bg-background rounded-full" />
                                )}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
            {error && <p className="text-sm text-destructive mt-2">{error.message}</p>}
        </div>
    );
};

// Main Address Form Component
const AddressForm = ({ onSubmit, onCancel, isSubmitting }: {
    // eslint-disable-next-line no-unused-vars
    onSubmit: (data: AddressFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean
}) => {
    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            type: 'home',
            country: 'India',
            isDefault: false,
            email: '',
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Address Type Selection */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <AddressTypeSelector
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.type}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Separator className="my-6" />

                {/* Personal Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-base">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} className="transition-all focus:ring-2" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} className="transition-all focus:ring-2" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Email
                                        <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                                    </FormLabel>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <FormControl>
                                            <Input
                                                placeholder="john@example.com"
                                                {...field}
                                                className="pl-10 transition-all focus:ring-2"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <FormControl>
                                            <Input
                                                placeholder="+1 (555) 123-4567"
                                                {...field}
                                                className="pl-10 transition-all focus:ring-2"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />

                {/* Address Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-md bg-gradient-to-r from-violet-500 to-purple-500">
                            <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-base">Address Details</h3>
                    </div>

                    <FormField
                        control={form.control}
                        name="address1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="123 Main Street"
                                        {...field}
                                        className="transition-all focus:ring-2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="addres2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Apartment, suite, etc.
                                    <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Apt 4B, Suite 100"
                                        {...field}
                                        className="transition-all focus:ring-2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="New York"
                                            {...field}
                                            className="transition-all focus:ring-2"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="NY"
                                            {...field}
                                            className="transition-all focus:ring-2"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ZIP Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="10001"
                                            {...field}
                                            className="transition-all focus:ring-2"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="United States"
                                            {...field}
                                            className="transition-all focus:ring-2"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />

                {/* Default Address Toggle */}
                <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                        <FormItem>
                            <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-5 h-5 text-amber-500" />
                                        <div>
                                            <FormLabel className="text-base font-medium">Set as Default Address</FormLabel>
                                            <FormDescription className="text-sm text-muted-foreground">
                                                This address will be selected automatically for future orders
                                            </FormDescription>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </div>
                            </Card>
                        </FormItem>
                    )}
                />

                {/* Form Actions */}
                <DialogFooter className="gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving Address...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Save Address
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

// Main Add Address Component with Dialog
const AddAddressComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mutateAsync: addAddress } = useAddAddress()

    const handleSubmit = async (data: AddressFormData) => {
        setIsSubmitting(true);

        toast.promise(
            addAddress(data), {
            loading: 'Saving address...',
            success: 'Address saved successfully!',
            error: 'Failed to save address. Please try again.',
        })

        alert('Address saved successfully!');
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-accent/90 hover:bg-accent shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Add New Address</DialogTitle>
                            <DialogDescription>
                                Add a new delivery address to your account for faster checkout.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <AddressForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddAddressComponent;