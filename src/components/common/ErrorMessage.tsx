"use client";

import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

interface ErrorMessageProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export function ErrorMessage({
  title = "Error",
  message,
  action,
}: ErrorMessageProps) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1 space-y-2">
            <h3 className="font-medium text-destructive">{title}</h3>
            <p className="text-sm text-destructive/80">{message}</p>
            {action && <div>{action}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
