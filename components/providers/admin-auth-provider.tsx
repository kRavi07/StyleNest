import { useAuth } from '@/hooks/store/auth';
import { redirect } from 'next/navigation';
import React from 'react'

const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {

    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated || user?.role !== 'admin') {
        redirect('/auth/login');
    }

    return (
        <>{children}</>
    )
}

export default AdminAuthProvider