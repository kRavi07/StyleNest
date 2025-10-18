import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface DataTableErrorProps {
    error: Error;
    retry: () => void;
}

export function DataTableError({ error, retry }: DataTableErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                {error.message || "An error occurred while loading the data."}
            </p>
            <Button onClick={retry} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
            </Button>
        </div>
    );
}
