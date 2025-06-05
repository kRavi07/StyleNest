import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, User } from "@/hooks/store/auth";

const UserProfile = ({ user }: { user: User }) => {



    return (
        <div >
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                            <p>{user.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                            <p>Not provided</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                            <p>Not provided</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline">Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Password</h3>
                        <p>••••••••</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Two-Factor Authentication</h3>
                        <p className="text-amber-600">Not enabled</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline">Change Password</Button>
                        <Button>Enable 2FA</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserProfile