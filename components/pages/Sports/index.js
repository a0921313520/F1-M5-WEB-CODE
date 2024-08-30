import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

//components
import Layout from "@/Layout";
//libs
import useCurrentPath from "$HOOKS/useCurrentPath";
import useLanguageNavigation from "$HOOKS/useLanguageNavigation";
import SportsLayout from "@/sports/SportsLayout";

//data
import {
    SPORTSCATEGORY,
    EXCHANGECATEGORY,
    VIRTUALCATEGORY,
} from "$DATA/sportsPage";

const index = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { slug } = router.query;
    switch (true) {
        case slug === undefined || // slug === undefined 為/sports頁面
            slug.includes("saba") || //sports/saba
            slug.includes("b2b"): //sports/b2b
            return (
                <Layout>
                    <SportsLayout
                        categoryItems={SPORTSCATEGORY}
                        vendor={"sports"}
                    />
                </Layout>
            );
        case slug.includes("exchange") || //sports/exchange
            slug.includes("9wickets") || //sports/exchange/9wickets
            slug.includes("lotus"): //sports/exchange/lotus
            return (
                <Layout>
                    <SportsLayout
                        categoryItems={EXCHANGECATEGORY}
                        vendor={"exchange"}
                    />
                </Layout>
            );
        case slug.includes("virtual") || //sports/virtual
            slug.includes("ice-hockey") || //sports/virtual/ice-hockey
            slug.includes("cockfighting"): //sports/virtual/cockfighting
            return (
                <Layout>
                    <SportsLayout
                        categoryItems={VIRTUALCATEGORY}
                        vendor={"virtual"}
                    />
                </Layout>
            );
        default:
            return null;
    }
};

export default index;
