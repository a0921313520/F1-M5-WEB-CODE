import { useTranslation } from "next-i18next";
import { HomePageSeo } from "$DATA/seo/seo.static";

//components
import Layout from "@/Layout";
import BetSlips from "@/Home/BetSlips";
import TextMarquee from "@/common/TextMarquee";
import HomeSwiperComponent from "@/common/HomeSwiperComponent";
import ImageWithSkeleton from "@/common/ImageWithSkeleton";

//lib
import useBearStore from "../../zustand/zustandStore";
import useIsDesktop from "$HOOKS/useIsDesktop";

//css
import "react-loading-skeleton/dist/skeleton.css";

const Homepage = () => {
    const { t } = useTranslation(["common", "footer", "header"]);
    const { value, increment, decrement } = useBearStore();
    const isDesktop = useIsDesktop();

    return (
        <>
            <Layout
                title={HomePageSeo.title}
                Keywords={HomePageSeo.Keywords}
                description={HomePageSeo.description}
                seoContainer={HomePageSeo.container}
                setLoginStatus={(v) => {}}
                setLockHeader={(setLockHeader) => {}}
                // seoData={this.props.seoData}
            >
                <div className="flex">
                    {/* 佔位元素 */}
                    <div className="hidden md:block md:w-[20%]" />

                    <main className="md:mx-auto md:max-w-[60%]">
                        {/* 首頁上方promo card */}
                        <div className="space-y-2 bg-white px-4 py-2 md:rounded-b-[14px] md:px-2">
                            <TextMarquee
                                text={
                                    "Dear customer for faster payment process kindly deposit between 6:00 a.m. to 6:00 p.m. After successful deposit, please don't forget to input them into your account."
                                }
                            />
                            <HomeSwiperComponent
                                items={Array(6).fill("/img/promoCard.png")}
                                renderItem={(item, index) => (
                                    <ImageWithSkeleton
                                        src={item}
                                        alt={`promoCard ${index + 1}`}
                                        className="h-[131px] w-[278px] md:h-[258px] md:w-[450px]"
                                    />
                                )}
                                autoplay={false}
                                autoplayDelay={3000}
                                isHomePromo={true}
                            />
                        </div>
                        <div className="mt-6 space-y-2 md:space-y-4">
                            {/* 首頁遊戲可滑動列表1 */}
                            <div className="w-full px-2">
                                <HomeSwiperComponent
                                    items={Array(6).fill("/img/gameCard.png")}
                                    slidesPerView={3}
                                    renderItem={(item, index) => (
                                        <div
                                            className={`${
                                                !isDesktop &&
                                                "h-[84px] w-[308px]"
                                            }`}
                                        >
                                            <img
                                                className="h-full w-full rounded-lg object-cover"
                                                src={item}
                                                alt={`promoCard ${index + 1}`}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {/* 首頁遊戲可滑動列表2 */}
                            <div className="w-full px-2">
                                <HomeSwiperComponent
                                    items={Array(9).fill("/img/squareCard.png")}
                                    slidesPerView={6}
                                    renderItem={(item, index) => (
                                        <div
                                            className={`${
                                                !isDesktop && "size-[154px]"
                                            }`}
                                        >
                                            <img
                                                className="h-full w-full rounded-lg object-cover"
                                                src={item}
                                                alt={`promoCard ${index + 1}`}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {/* 首頁遊戲可滑動列表3 */}
                            <div className="w-full px-2">
                                <HomeSwiperComponent
                                    items={Array(3).fill("/img/gameCard.png")}
                                    slidesPerView={3}
                                    renderItem={(item, index) => (
                                        <div
                                            className={`${
                                                !isDesktop &&
                                                "h-[84px] w-[308px]"
                                            }`}
                                        >
                                            <img
                                                className="h-full w-full rounded-lg object-cover"
                                                src={item}
                                                alt={`promoCard ${index + 1}`}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </main>

                    {/* bet slips */}
                    <BetSlips />
                </div>
            </Layout>
        </>
    );
};

export default Homepage;
