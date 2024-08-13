import Link from "../components/Link";
import Layout from "@/Layout";
import { useTranslations } from "next-intl";

const SecondPage = () => {
    const t = useTranslations("PageLayout");

    return (
        <>
            <Layout status={1}>
                <Link href="/">
                    <button type="button">{t("pageTitle")}</button>
                </Link>
            </Layout>
        </>
    );
};

export default SecondPage;

export async function getStaticProps({ locale }) {
    return {
        props: {
            messages: (await import(`../messages/${locale}.json`)).default,
        },
    };
}
