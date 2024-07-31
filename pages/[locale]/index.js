import { useTranslation } from "next-i18next";
import { getStaticPaths, makeStaticProps } from "../../utils/lang/getStatic";
import Layout from "@/Layout";
import useBearStore from "../../zustand/zustandStore";
import { HomePageSeo } from "$DATA/seo/seo.static";

import Link from "../../components/Link";

const Homepage = () => {
    const { t } = useTranslation(["common", "footer"]);
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
                <main className="pt-[44px] md:pt-[56px]">
                    {t("title")}
                    <div>
                        <div className="bg-gray-100 p-4">
                            <h1 className="mb-4 text-2xl font-bold">
                                Zustand Counter
                            </h1>
                            <p className="mb-4 text-lg">Value: {value}</p>
                            <div className="space-x-2">
                                <button
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                    onClick={increment}
                                >
                                    Increment
                                </button>
                                <button
                                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                    onClick={decrement}
                                >
                                    Decrement
                                </button>
                            </div>
                        </div>

                        <Link href="/second-page">
                            <button type="button">{t("to-second-page")}</button>
                        </Link>
                    </div>
                </main>
            </Layout>
        </>
    );
};

export default Homepage;

const getStaticProps = makeStaticProps(["common", "footer"]);
export { getStaticPaths, getStaticProps };
