import Sports from "@/pages/Sports";
import { makeStaticProps } from "$UTILS/lang/makeStatic";

export default () => <Sports />;

export const getStaticPaths = async () => {
    const sportsPaths = [
        ["saba"],
        ["b2b"],
        ["exchange"],
        ["exchange", "9wickets"],
        ["exchange", "lotus"],
        ["virtual"],
        ["virtual", "ice-hockey"],
        ["virtual", "cockfighting"],
    ];

    const paths = sportsPaths.map((slug) => ({
        params: { slug },
    }));

    return { paths, fallback: false };
};

const getStaticProps = makeStaticProps(["login", "footer"]);
export { getStaticProps };
