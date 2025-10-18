"use client"

import { useState } from "react"
import { Copy, CheckCircle } from "lucide-react"

interface CopyableFieldProps {
    text: string
    field: string
    children: React.ReactNode
    className?: string
}

export function CopyableField({ text, field, children, className = "" }: CopyableFieldProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedField(field)
            setTimeout(() => setCopiedField(null), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <div className={`group flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded p-1 -m-1 transition-colors ${className}`}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
                {children}
            </div>
            <button
                onClick={() => copyToClipboard(text, field)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all duration-200 flex-shrink-0"
                title="Copy to clipboard"
            >
                {copiedField === field ? (
                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                ) : (
                    <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                )}
            </button>
        </div>
    )
}