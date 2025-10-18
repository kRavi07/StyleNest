/* eslint-disable no-unused-vars */
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableField } from "../common/EditableField";
import { ProfileResponse } from "@/types";

interface UserProfileFormValues {
    name: string;
    email: string;
    mobileno?: string;
}

interface UserProfileProps {
    user: ProfileResponse;
    onFieldUpdate?: (field: string, value: any) => void;
}

const UserProfile = ({ user, onFieldUpdate }: UserProfileProps) => {
    const methods = useForm<UserProfileFormValues>({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            mobileno: user?.mobileno || "",
        },
    });

    if (!user) null


    return (
        <FormProvider {...methods}>
            <div className="space-y-8">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditableField
                                label="Name"
                                name="name"
                                onSave={onFieldUpdate}
                                control={methods.control}
                            />
                            <EditableField
                                label="Email"
                                name="email"
                                type="email"
                                onSave={onFieldUpdate}
                                control={methods.control}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditableField
                                label="Mobile Number"
                                name="mobileno"
                                onSave={onFieldUpdate}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Security */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Password</h3>
                            <p>••••••••</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-amber-600">{"Enabled"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FormProvider>
    );
};

export default UserProfile;
