import Link from "../../components/Link";
import Layout from "@/Layout";

import { useTranslation } from "next-i18next";

const SecondPage = () => {
    const { t } = useTranslation();

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
