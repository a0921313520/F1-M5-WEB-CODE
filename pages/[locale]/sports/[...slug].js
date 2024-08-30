import Sports from "@/pages/Sports";
import { makeStaticProps } from "$UTILS/lang/makeStatic";
import i18nextConfig from "../../../next-i18next.config";

export default () => <Sports />;

export async function getStaticPaths() {
    const locales = i18nextConfig.i18n.locales;
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

    const paths = locales.flatMap((locale) =>
        sportsPaths.map((slug) => ({
            params: { locale, slug },
        }))
    );

    return {
        fallback: false,
        paths,
    };
}

export const getStaticProps = async (context) => {
    const makeStaticPropsFunction = makeStaticProps(["login", "footer"]);
    const staticProps = await makeStaticPropsFunction(context);

    return {
        ...staticProps,
        props: {
            ...staticProps.props,
            slug: context.params.slug || [],
        },
    };
};
