import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className="flex items-center justify-center h-screen text-2xl font-bold text-gray-700 dark:text-gray-300">
            <h1>Admin Dashboard - Category Management</h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
                This page is under construction. Please check back later.
            </p>
            <Button asChild className="mt-6">
                <Link href="/admin/category/new">New Category</Link>
            </Button>
        </div>
    )
}

export default page