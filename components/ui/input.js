import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(
    ({ className, type, error, icon, prefix, ...props }, ref) => {
        return (
            <div className="space-y-1">
                <div className="relative">
                    {(icon || prefix) && (
                        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                            {icon && (
                                <img
                                    className="size-5"
                                    src={icon}
                                    alt="input icon"
                                />
                            )}
                            {prefix && (
                                <>
                                    <img
                                        className="ml-1 size-5"
                                        src="/img/icon/icon_india.svg"
                                    />
                                    <div className="ml-1 text-md text-black">
                                        {prefix}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex h-10 w-full rounded-lg border border-white bg-white px-3 py-2 text-md ring-offset-white",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-grayBluePlaceholder focus-visible:outline-none",
                            "focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
                            icon && prefix
                                ? "pl-[96px]"
                                : icon || prefix
                                ? "pl-11"
                                : "",
                            error
                                ? "border-negative focus-visible:border-negative"
                                : "",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <div className="text-sm text-negative">{error}</div>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
