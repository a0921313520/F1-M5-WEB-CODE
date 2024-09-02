import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
//libs
import useCurrentPath from "$HOOKS/useCurrentPath";
import useLanguageNavigation from "$HOOKS/useLanguageNavigation";

const SportsLayout = ({ categoryItems, vendor }) => {
    const { t } = useTranslation();
    const { navigateTo } = useLanguageNavigation();
    const path = useCurrentPath(); //取得網址
    const router = useRouter();

    return (
        <div>
            {/* mobile佔位元素 */}
            <div className="h-11 md:hidden" />
            <div className="flex flex-col md:flex-row">
                {/* mobile sports category */}
                <div className="fixed left-0 top-11 flex h-11 w-full items-center bg-white px-4 text-sm md:hidden">
                    <img
                        className="mr-4 size-5"
                        src="/img/icon/icon_arrow_left.svg"
                        alt="icon left arrow"
                        onClick={() => router.back()}
                    />
                    <div className="flex flex-1 items-center justify-around text-lg">
                        {categoryItems.map((item) => (
                            <div
                                key={item.link}
                                className={`relative flex cursor-pointer flex-col items-center ${
                                    path === item.link
                                        ? "font-semibold text-primary"
                                        : "text-gray2"
                                }`}
                                onClick={() => navigateTo(item.link)}
                            >
                                <div className="relative">
                                    {item.name}
                                    {item.isNew && (
                                        <span className="absolute -right-8 -top-2 flex h-[17px] items-center justify-center rounded bg-gradient-to-r from-[#f43972] to-[#eb0d5d] px-1 text-[10px] text-xxs text-white">
                                            NEW
                                        </span>
                                    )}
                                    {item.isHot && (
                                        <span className="absolute -right-8 -top-2 flex h-[17px] items-center justify-center rounded bg-gradient-to-r from-[#ffa51e] to-[#ff6c1a] px-1 text-[10px] text-xxs text-white">
                                            HOT
                                        </span>
                                    )}
                                </div>
                                {path === item.link && ( //active時增加下底線
                                    <div className="absolute -bottom-3 h-0.5 w-full bg-primary" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* desktop sports category */}
                <div className="hidden h-[824px] min-w-[320px] rounded-br-lg bg-white md:block">
                    <div className="flex flex-col gap-3 p-5">
                        {categoryItems.map((item) => {
                            const isActive = item.link === path;
                            return (
                                <div
                                    className={`flex h-[60px] w-[280px] cursor-pointer items-center rounded-lg px-4 text-md ${
                                        isActive ? "bg-primary text-white" : ""
                                    }`}
                                    key={item.link}
                                    onClick={() => navigateTo(item.link)}
                                >
                                    <img
                                        className={`${
                                            vendor === "virtual"
                                                ? "size-10"
                                                : "h-[40px] w-[76px]"
                                        }`}
                                        src={
                                            isActive ? item.activeImg : item.img
                                        }
                                        alt={item.name + " image"}
                                    />
                                    <div className="ml-4 text-md">
                                        {item.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="h-[932px] min-h-[823px] w-full overflow-y-scroll border border-red-500 md:mx-6 md:mt-6"></div>
            </div>
        </div>
    );
};

export default SportsLayout;
