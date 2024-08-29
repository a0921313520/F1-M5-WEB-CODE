import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    closeButton: false,
    pauseOnFocusLoss: true,
    className:
        "!relative !flex !p-1 !min-h-10 !rounded-full !justify-between !overflow-hidden !bg-black !text-white !text-md !shadow-lg !w-max !max-w-[280px] md:!max-w-[420px]",
};

const Toast = {
    success(message, options = {}) {
        return toast.success(message, {
            ...defaultOptions,
            ...options,
            icon: (
                <img
                    className="size-6"
                    src="/img/icon/icon_correct.svg"
                    alt="success icon"
                />
            ),
        });
    },
    error(message, options = {}) {
        return toast.error(message, {
            ...defaultOptions,
            ...options,
            icon: (
                <img
                    className="size-6"
                    src="/img/icon/icon_limit.svg"
                    alt="error icon"
                />
            ),
        });
    },
};

export default Toast;
