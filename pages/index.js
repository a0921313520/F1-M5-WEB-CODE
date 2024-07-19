import React from "react";
import Layout from "@/Layout";
import { Tabs } from "antd";
import Banner from "@/Banner";
import "react-toastify/dist/ReactToastify.css";
import { HomePageSeo } from "$DATA/seo/seo.static";
import { getStaticPropsFromStrapiSEOSetting } from "$DATA/seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";

const { TabPane } = Tabs;

export async function getStaticProps({ locale }) {
    const seoData = await getStaticPropsFromStrapiSEOSetting("/");
    return {
        props: {
            seoData,
            ...(await serverSideTranslations(
                locale,
                ["common", "footer"],
                null,
                ["en", "hi"],
            )),
        },
    };
}

class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { promotionbannerList, sponsorbannerList } = this.state;
        const { t } = this.props;
        return (
            <Layout
                title={HomePageSeo.title}
                Keywords={HomePageSeo.Keywords}
                description={HomePageSeo.description}
                seoContainer={HomePageSeo.container}
                headerHeightLock={this.state.isLearn}
                setLoginStatus={(v) => {
                    this.setState({ isLogin: v });
                }}
                setLockHeader={(setLockHeader) => {
                    this.homePageSetLockHeader = setLockHeader;
                }}
                seoData={this.props.seoData}
            >
                <Banner
                    // bannerClick={this.bannerClick}
                    bannerList={this.state.bannerList}
                />
                <br />
                <div className="text-center text-2xl font-bold">
                    {t("hello_world")} {/* 使用翻譯文本 */}
                </div>
            </Layout>
        );
    }
}

export default withTranslation("common")(Main);
