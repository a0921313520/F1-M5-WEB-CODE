import Marquee from "react-fast-marquee";

const TextMarquee = ({ text, ...props }) => {
    return (
        <div className="flex items-center rounded-lg bg-[#fff5bf] py-1.5 pl-2 text-sm text-[#a28c10]">
            <img
                className="mr-1 size-4"
                src="/img/icon/icon_inform.svg"
                alt="inform icon"
            />
            <Marquee pauseOnHover={true} speed={140} {...props}>
                {text}
            </Marquee>
        </div>
    );
};

export default TextMarquee;
