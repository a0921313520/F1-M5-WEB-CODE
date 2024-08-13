import Layout from "@/Layout";
import useBearStore from "../zustand/zustandStore";
import { HomePageSeo } from "$DATA/seo/seo.static";
import { useTranslations } from "next-intl";
import Link from "../components/Link";

const Homepage = () => {
    const t = useTranslations("Index");
    const { value, increment, decrement } = useBearStore();

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
                <main>
                    <p>{t("title")}</p>
                    <div>
                        <div className="p-4 bg-gray-100">
                            <h1 className="text-2xl font-bold mb-4">
                                Zustand Counter
                            </h1>
                            <p className="text-lg mb-4">Value: {value}</p>
                            <div className="space-x-2">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={increment}
                                >
                                    Increment
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={decrement}
                                >
                                    Decrement
                                </button>
                            </div>
                        </div>

                        <Link href="/second-page">
                            <button type="button">{t("description")}</button>
                        </Link>
                    </div>
                </main>
            </Layout>
        </>
    );
};

export default Homepage;

export async function getStaticProps({ locale }) {
    return {
        props: {
            messages: (await import(`../messages/${locale}.json`)).default,
        },
    };
}
