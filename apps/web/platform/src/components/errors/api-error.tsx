"use client";

import { Button } from "@shopify-clone/ui";

interface ApiErrorProps {
    message: string;
    onClick?: () => void
}
export function ApiError({ message, onClick }: ApiErrorProps) {
    return (
        <div className="w-full">
            <p className="text-red-500">{message}</p>
            {onClick && <Button onClick={onClick} variant="destructive">Try again</Button>}
        </div>
    );
}