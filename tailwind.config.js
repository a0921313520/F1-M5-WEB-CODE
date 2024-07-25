/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
    theme: {
        fontSize: {
            "4xl": ["2rem", { lineHeight: "2.75rem" }], // 32px 44px
            "3xl": ["1.5rem", { lineHeight: "2.25rem" }], // 24px 36px
            "2xl": ["1.25rem", { lineHeight: "1.75rem" }], // 20px 28px
            xl: ["1.125rem", { lineHeight: "1.5rem" }], // 18px 24px
            lg: ["1rem", { lineHeight: "1.375rem" }], // 16px 22px
            md: ["0.875rem", { lineHeight: "1.25rem" }], // 14px 20px
            sm: ["0.75rem", { lineHeight: "1rem" }], // 12px 16px
            xxs: ["0.625rem", { lineHeight: "0.875rem" }], // 10px 14px
        },

        extend: {
            scrollbar: ["thin"],
            colors: {
                //Brand Color
                primary: "#00A6FF",
                //text
                black: "#262B33",
                grayBlue: "#989DAB",
                grayBluePlaceholder: "#989DAB80",
                whiteOpacityhalf: "#ffffff80",
                gray1: "#5A5D62",
                gray2: "#909296",
                //Info Status
                positive: "#33C85D",
                negative: "#FF262E",
                remind: "#FBBA26",
                //Background
                bgGray: "#EAEBED",
                bgDarkGray: "#E0E0E0",
                bgLightGray: "#EFF0F2",
                bgPrimaryLight: "#00A6FF0F",
                bgLightYellow: "#FFF5BF",
                //hover
                primaryHover: "#009EF2",
                positiveHover: "#30BE58",
                negativeHover: "#F2242C",
                whiteHover: "#F2F2F2",

                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            fontFamily: {
                sans: ["Roboto", "sans-serif"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
