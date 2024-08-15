import * as React from "react";
// import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    //共用樣式
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold rounded-lg w-[60px] md:w-[100px] h-7 px md:h-9 text-sm md:text-lg",
    {
        variants: {
            type: {
                primary: "text-white bg-primary hover:bg-primaryHover",
                outline:
                    "text-primary hover:text-primaryHover bg-transparent border border-primary hover:border-primaryHover",
                text: "text-primary bg-white",
                green: "text-white bg-positive hover:bg-positiveHover",
                white: "text-black bg-white hover:bg-whiteHover",
                red: "text-white bg-negative hover:bg-negativeHover",
                disabled: "text-grayBlue bg-bgDarkGray cursor-default",
                dashBorder:
                    "text-primary border-2 border-primary border-dashed",
            },
        },
        defaultVariants: {
            type: "primary",
        },
    }
);

const Button = React.forwardRef(
    (
        {
            className,
            type,
            iconSizeClass,
            asChild = false,
            leftIcon,
            rightIcon,
            ...props
        },
        ref
    ) => {
        // const Comp = asChild ? Slot : "button";

        return (
            <button
                className={cn(buttonVariants({ type, className }))}
                ref={ref}
                {...props}
            >
                {leftIcon && (
                    <img src={leftIcon} className={cn(iconSizeClass)} />
                )}
                {props.children}
                {rightIcon && (
                    <img src={rightIcon} className={cn(iconSizeClass)} />
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
