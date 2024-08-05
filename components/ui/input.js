import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-lg border border-white bg-white px-3 py-2 text-md ring-offset-white",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-grayBluePlaceholder focus-visible:outline-none",
                "focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
