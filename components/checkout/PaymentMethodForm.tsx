import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Truck } from 'lucide-react';

interface PaymentMethodFormProps {
    initialPaymentMethod: 'razorpay' | 'cod';
    // eslint-disable-next-line no-unused-vars
    onSubmit: (paymentMethod: 'razorpay' | 'cod') => void;
    onBack: () => void;
}

export function PaymentMethodForm({ initialPaymentMethod, onSubmit, onBack }: PaymentMethodFormProps) {
    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            paymentMethod: initialPaymentMethod
        }
    });

    const paymentMethod = watch('paymentMethod');

    const handleFormSubmit = (data: { paymentMethod: 'razorpay' | 'cod' }) => {
        onSubmit(data.paymentMethod);
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                </CardTitle>
                <CardDescription>
                    Choose your preferred payment method
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange}>
                                <div className="space-y-3">
                                    {/*<div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value="razorpay" id="razorpay" />
                                        <div className="flex-1">
                                            <Label htmlFor="razorpay" className="font-medium cursor-pointer flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-green-600" />
                                                Pay Online (Razorpay)
                                            </Label>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Credit/Debit Cards, UPI, Net Banking, Wallets
                                            </p>
                                        </div>
                                        <Badge variant="secondary">Recommended</Badge>
                                    </div>*/}

                                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                                        <RadioGroupItem value="cod" id="cod" />
                                        <div className="flex-1">
                                            <Label htmlFor="cod" className="font-medium cursor-pointer flex items-center gap-2">
                                                <Truck className="h-4 w-4 text-orange-600" />
                                                Cash on Delivery
                                            </Label>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Cash on Delivery
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </RadioGroup>
                        )}
                    />

                    <div className="flex gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                            Back
                        </Button>
                        <Button type="submit" disabled={!paymentMethod} className="flex-1 bg-accent hover:bg-accent/90">
                            Review Order
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
