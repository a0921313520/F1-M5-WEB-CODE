// pages/hi.js

import Layout from "@/Layout";
import useBearStore from "../zustand/zustandStore";
import { HomePageSeo } from "$DATA/seo/seo.static";
import { useI18n } from "../utils/lang/LangContext"; // Updated path to context
import Link from "../components/Link";

const Homepage = () => {
    const { t, toggleLanguage, language } = useI18n();
    const { value, increment, decrement } = useBearStore();

    return (
        <Layout
            title={HomePageSeo.title}
            Keywords={HomePageSeo.Keywords}
            description={HomePageSeo.description}
            seoContainer={HomePageSeo.container}
            setLoginStatus={(v) => {}}
            setLockHeader={(setLockHeader) => {}}
        >
            <main className="pt-[44px] md:pt-[56px]">
                <h1>{t("title")}</h1>

                <button onClick={toggleLanguage}>
                    切换到 {language === "hi" ? "English" : "हिन्दी"}
                </button>

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
    );
};

export default Homepage;
