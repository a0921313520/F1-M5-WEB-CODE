import { useRef, useEffect } from "react";
import { ReactSVG } from "react-svg";

//lib
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import useIsDesktop from "$HOOKS/useIsDesktop";

//css
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
//因有特別設定，僅供首頁swiper 使用
const HomeSwiperComponent = ({
    items,
    renderItem,
    slidesPerView = "auto",
    spaceBetween = 8,
    autoplay = false,
    autoplayDelay = 3000,
    loop = false,
    isHomePromo,
}) => {
    const swiperRef = useRef(null);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);

    const isDesktop = useIsDesktop();

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, []);

    const breakpoints = {
        768: {
            slidesPerView: slidesPerView,
        },
    };

    return (
        <div className="relative">
            <div className="-mx-4 md:-mx-2">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={spaceBetween}
                    slidesPerView="auto"
                    breakpoints={breakpoints}
                    navigation={{
                        prevEl: prevButtonRef.current,
                        nextEl: nextButtonRef.current,
                    }}
                    autoplay={
                        autoplay
                            ? {
                                  delay: autoplayDelay,
                                  disableOnInteraction: false,
                              }
                            : false
                    }
                    loop={loop}
                    className="custom-swiper !px-4 md:!px-2"
                >
                    {items.map((item, index) => (
                        <SwiperSlide
                            className={`${
                                (!isDesktop || isHomePromo) && "!w-auto"
                            }`}
                            key={index}
                        >
                            {renderItem(item, index)}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <button
                ref={prevButtonRef}
                className={`custom-swiper-button-prev absolute ${
                    isHomePromo ? "-left-5" : "-left-3" //調整首頁game list 的swiper button 位置
                } top-1/2 -translate-y-1/2 transform cursor-pointer`}
            >
                <ReactSVG src="/img/icon/icon_arrow_left.svg" />
            </button>
            <button
                ref={nextButtonRef}
                className={`custom-swiper-button-next absolute ${
                    isHomePromo ? "-right-5" : "-right-3" //調整首頁game list 的swiper button 位置
                } top-1/2 -translate-y-1/2 transform cursor-pointer`}
            >
                <ReactSVG src="/img/icon/icon_arrow_right.svg" />
            </button>
        </div>
    );
};

export default HomeSwiperComponent;
