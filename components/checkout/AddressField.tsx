import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    control: any;
    prefix: string;
    errors: any;
};

export function AddressFields({ control, prefix, errors }: Props) {
    // Helper function to get nested error
    const getNestedError = (fieldName: string) => {
        const path = `${prefix}.${fieldName}`;
        return path.split('.').reduce((obj, key) => obj?.[key], errors);
    };

    return (
        <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor={`${prefix}-firstName`}>First Name</Label>
                    <Controller
                        name={`${prefix}.firstName`}
                        control={control}
                        rules={{ required: "First name is required" }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={`${prefix}-firstName`}
                                placeholder="Enter your first name"
                                className={getNestedError('firstName') ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {getNestedError('firstName') && (
                        <p className="text-sm text-red-500 mt-1">
                            {getNestedError('firstName')?.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor={`${prefix}-lastName`}>Last Name</Label>
                    <Controller
                        name={`${prefix}.lastName`}
                        control={control}
                        rules={{ required: "Last name is required" }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={`${prefix}-lastName`}
                                placeholder="Enter your last name"
                                className={getNestedError('lastName') ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {getNestedError('lastName') && (
                        <p className="text-sm text-red-500 mt-1">
                            {getNestedError('lastName')?.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <Label htmlFor={`${prefix}-phone`}>Phone Number</Label>
                <Controller
                    name={`${prefix}.phone`}
                    control={control}
                    rules={{
                        required: "Phone number is required",
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Phone number must be 10 digits"
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id={`${prefix}-phone`}
                            placeholder="10-digit phone number"
                            maxLength={10}
                            className={getNestedError('phone') ? 'border-red-500' : ''}
                        />
                    )}
                />
                {getNestedError('phone') && (
                    <p className="text-sm text-red-500 mt-1">
                        {getNestedError('phone')?.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor={`${prefix}-address1`}>Address Line 1</Label>
                <Controller
                    name={`${prefix}.address1`}
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id={`${prefix}-addressLine1`}
                            placeholder="House/Flat number, Street name"
                            className={getNestedError('addressLine1') ? 'border-red-500' : ''}
                        />
                    )}
                />
                {getNestedError('address1') && (
                    <p className="text-sm text-red-500 mt-1">
                        {getNestedError('addressLine1')?.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor={`${prefix}-address2`}>Address Line 2 (Optional)</Label>
                <Controller
                    name={`${prefix}.address2`}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id={`${prefix}-address2`}
                            placeholder="Landmark, Area"
                        />
                    )}
                />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor={`${prefix}-city`}>City</Label>
                    <Controller
                        name={`${prefix}.city`}
                        control={control}
                        rules={{ required: "City is required" }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={`${prefix}-city`}
                                placeholder="City"
                                className={getNestedError('city') ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {getNestedError('city') && (
                        <p className="text-sm text-red-500 mt-1">
                            {getNestedError('city')?.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor={`${prefix}-state`}>State</Label>
                    <Controller
                        name={`${prefix}.state`}
                        control={control}
                        rules={{ required: "State is required" }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={`${prefix}-state`}
                                placeholder="State"
                                className={getNestedError('state') ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {getNestedError('state') && (
                        <p className="text-sm text-red-500 mt-1">
                            {getNestedError('state')?.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor={`${prefix}-postalCode`}>Postal Code</Label>
                    <Controller
                        name={`${prefix}.postalCode`}
                        control={control}
                        rules={{
                            required: "Postal code is required",
                            pattern: {
                                value: /^[0-9]{6}$/,
                                message: "Postal code must be 6 digits"
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={`${prefix}-postalCode`}
                                placeholder="6-digit PIN"
                                maxLength={6}
                                className={getNestedError('postalCode') ? 'border-red-500' : ''}
                            />
                        )}
                    />

                    {getNestedError('postalCode') && (
                        <p className="text-sm text-red-500 mt-1">
                            {getNestedError('postalCode')?.message}
                        </p>
                    )}
                </div>

                {/*<div>
                    <Label htmlFor={`${prefix}-country`}>Country</Label>
                    <Controller
                        name={`${prefix}.country`}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={`${prefix}-country`}
                                value="India"
                                readOnly
                                className=" cursor-not-allowed"
                            />
                        )}
                    />

                </div>*/}
            </div>
        </div>
    );
}