import Link from "../../components/Link";
import Layout from "@/Layout";

import { useTranslation } from "next-i18next";
import { getStaticPaths, makeStaticProps } from "../../lib/getStatic";

const SecondPage = () => {
    const { t } = useTranslation(["second-page", "common", "footer"]);

    return (
        <>
            <Layout status={1}>
                <Link href="/">
                    <button type="button">{t("common:back-to-home")}</button>
                </Link>
            </Layout>
        </>
    );
};

export default SecondPage;

const getStaticProps = makeStaticProps(["second-page", "common", "footer"]);
export { getStaticPaths, getStaticProps };
