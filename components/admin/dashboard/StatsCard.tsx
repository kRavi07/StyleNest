import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    percentage?: string; // "+20.1%"
    percentageType?: "increase" | "decrease"; // controls color
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    percentage,
    percentageType = "increase",
    className = "",
}) => {
    const percentageColor =
        percentageType === "increase" ? "text-green-500" : "text-red-500";

    return (
        <Card className={`rounded-2xl ${className}`}>
            <CardHeader className="flex flex-row justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {percentage && (
                    <p className={`text-xs mt-1 ${percentageColor}`}>{percentage}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsCard;
