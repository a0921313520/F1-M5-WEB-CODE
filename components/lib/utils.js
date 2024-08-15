import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatNumberWithCommas(number) {
    // 將數字轉換為字符串
    const parts = number.toString().split(".");

    // 處理整數部分
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 如果有小數部分,將其加回
    return parts.join(".");
}
