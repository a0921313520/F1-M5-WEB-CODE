import React from "react";
import Layout from "@/Layout";
import Router from "next/router";
import { get, post } from "$ACTIONS/TlcRequest";
import { LEARN_TIME } from "$ACTIONS/constantsData";
import { Cookie } from "$ACTIONS/util";
import { ApiPort, APISETS, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { Modal, Row, Col, Tabs, Icon, message, Spin } from "antd";
import {
    getQueryVariable,
    getAffiliateReferralCode,
    Cookie as Cookiehelper,
} from "$ACTIONS/helper";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Banner from "@/Banner";
import QRCode from "qrcode-react";
import LazyLoad from "react-lazyload";
import Announcement from "@/Announcement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bannerimg from "@/Banner/img";
import { isWebPSupported } from "$ACTIONS/helper";
import ImageWithFallback from "@/ImageWithFallback/imgLocal";
import WelcomeBanne from "@/Home/WelcomeBanne";
import {translate} from "$ACTIONS/Translate";
import { HomePageSeo } from "$DATA/seo/seo.static";
import RegisterBonus from "@/Home/RegisterBonus";
import BankBusinessTime from "@/Home/BankBusinessTime";
import { getStaticPropsFromStrapiSEOSetting } from '$DATA/seo';

const { TabPane } = Tabs;
export async function getStaticProps() {
    return await getStaticPropsFromStrapiSEOSetting('/'); //參數帶本頁的路徑
}
export default class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bannerList: [],
            isLogin: false,
            isLearn: false,
            downloadLinks: "",
            hostname: "",
            promotionbannerList: "",
            sponsorbannerList: "",
            promotionCurrKey: "0",
        };

        this.homePageSetLockHeader = function () {}; // 锁定Header状态
        this.defaultBannerList = this.defaultBannerList.bind(this); // 默认获取登录前的Banner列表
        this.mainPromotionSplitPage = this.mainPromotionSplitPage.bind(this);
    }
    isJSON(str) {
        if (typeof str == "string") {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == "object" && obj) {
                    return obj;
                } else {
                    return false;
                }
            } catch (e) {
                console.log("error：" + str + "!!!" + e);
                return false;
            }
        }
        console.log("It is not a string!");
    }

    componentDidMount() {
        const isSupportWebp = isWebPSupported() ? "&displaying_webp" : "";
        let loginStatus =
                sessionStorage.getItem("isLogin") &&
                localStorage.getItem("access_token"), //已登录状态
            isRegisterEvent =
                sessionStorage.getItem("isRegisterEvent") &&
                localStorage.getItem("access_token"); //注册登录成功
        !isRegisterEvent &&
            get(
                `${CMSAPIUrl}/vi-vn/api/v1/web/webbanners/position/home_main?login=${
                    loginStatus
                        ? `after${isSupportWebp}`
                        : `before${isSupportWebp}`
                }`
            ).then(this.defaultBannerList);
        this.Downloadidopen();
        setTimeout(() => {
            this.Downloadidopen();
        }, 5000);
        this.setState({
            hostname: window.location.origin,
        });

        const LocalFeature = localStorage.getItem("LocalFeature");
        const LocalSponsor = localStorage.getItem("LocalSponsor");
        const LocalFeatureParse = this.isJSON(LocalFeature),
            LocalSponsorParse = this.isJSON(LocalSponsor);
        LocalFeatureParse &&
            this.setState({ promotionbannerList: LocalFeatureParse });
        LocalSponsorParse &&
            this.setState({ sponsorbannerList: LocalSponsorParse });
        const baseUrl =
            CMSAPIUrl + "/vi-vn/api/v1/web/webbanners/position/home_feature";
        const loginParam = loginStatus
            ? `after${isSupportWebp}`
            : `before${isSupportWebp}`;
        const _url = `${baseUrl}?login=${loginParam}`;
        /* 优惠列表 */
        !isRegisterEvent &&
            get(_url).then((res) => {
                let result = this.formatPromotionListData(res);
                const localStr = JSON.stringify(result);
                localStorage.setItem("LocalFeature", localStr);
                localStr !== LocalFeature &&
                    result &&
                    this.setState({ promotionbannerList: result });
            });

        /* 赞助列表 */
        !isRegisterEvent &&
            get(
                CMSAPIUrl +
                    "/vi-vn/api/v1/web/webbanners/position/home_sponsor?login=" +
                    (loginStatus
                        ? `after${isSupportWebp}`
                        : `before${isSupportWebp}`)
            ).then((res) => {
                const localStr = JSON.stringify(res);
                localStorage.setItem("LocalSponsor", localStr);
                localStr !== LocalSponsor &&
                    res &&
                    this.setState({ sponsorbannerList: res });
            });

        // 按照字符串下标说明依次为（未登录首页，已登录首页，已登录个人中心入口，我的优惠，交易记录，提现，转账）
        let learnStepString = Cookie("learnStep");
        // 初始导引步骤状态
        !learnStepString &&
            Cookie("learnStep", "00000000", { expires: LEARN_TIME });
        // this.setLearnStepStatus();

        // 更改为seesionStorage，强制清除客户端localStorage，隔版本后删除此代码。
        localStorage.removeItem("LocalShopURL");
        global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("home");
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isLogin !== this.state.isLogin) {
            const isSupportWebp = isWebPSupported() ? "&displaying_webp" : "";
            this.defaultBannerList = function () {};
            let loginStatus =
                    sessionStorage.getItem("isLogin") &&
                    localStorage.getItem("access_token"), //已登录状态
                isRegisterEvent =
                    sessionStorage.getItem("isRegisterEvent") &&
                    localStorage.getItem("access_token"); //注册登录成功
            !isRegisterEvent &&
                get(
                    CMSAPIUrl +
                        "/vi-vn/api/v1/web/webbanners/position/home_main?login=" +
                        (loginStatus
                            ? `after${isSupportWebp}`
                            : `before${isSupportWebp}`)
                ).then((res) => {
                    res && this.setState({ bannerList: res });
                });

            const baseUrl =
                CMSAPIUrl +
                "/vi-vn/api/v1/web/webbanners/position/home_feature";
            const loginParam = loginStatus ? "after" : "before";

            const getimgurl = `${baseUrl}?login=${loginParam}${isSupportWebp}`;
            /* 优惠列表 */
            !isRegisterEvent &&
                get(getimgurl).then((res) => {
                    let result = this.formatPromotionListData(res);
                    const localStr = JSON.stringify(result);
                    localStorage.setItem("LocalFeature", localStr);
                    this.setState({ promotionbannerList: result });
                });

            /* 赞助列表 */
            !isRegisterEvent &&
                get(
                    CMSAPIUrl +
                        "/vi-vn/api/v1/web/webbanners/position/home_sponsor?login=" +
                        (loginStatus
                            ? `after${isSupportWebp}`
                            : `before${isSupportWebp}`)
                ).then((res) => {
                    const localStr = JSON.stringify(res);
                    localStorage.setItem("LocalSponsor", localStr);
                    this.setState({ sponsorbannerList: res });
                });
        }
    }
    componentWillUnmount(){
        this.setState =()=> false
    }
    /**
     * 根据单页长度，按照几个长度进行分页，格式化响应的精彩活动
     * @param {Array} res 需要处理分页的数据
     * @param {Int} singlePageSize 单页需要展示的长度
     * @param {Int} splitPageSize 实际分页的参考长度
     * @returns 转换后的结果
     */
    formatPromotionListData(res, singlePageSize = 3, splitPageSize = 2) {
        let result = [];
        let len = res && Math.ceil(res.length / splitPageSize);

        for (let i = 0; i < len; i++) {
            let tempIndex = i * splitPageSize; // 当前页起始下标
            let tempPageData = []; // 当前下标数据暂存值
            for (let j = 0; j < singlePageSize; j++) {
                const tempData = res[tempIndex + j]; // 当前页单个数据暂存值
                !!tempData && tempPageData.push(tempData);
            }
            result.push(tempPageData);
        }

        return result;
    }

    defaultBannerList(res) {
        res && this.setState({ bannerList: res });
    }

    Downloadidopen() {
        const affcode = getAffiliateReferralCode(),
            disabled =
                Cookiehelper.GetCookieKeyValue("CO_affiliate") != "undefined" &&
                Cookiehelper.GetCookieKeyValue("CO_affiliate") != "";
        const url = `${window.location.origin}/vn/Appinstall.html${
            disabled ? "?affCode=" + affcode : ""
        }`;
        global.downloadLinks = url;
        this.setState({ downloadLinks: url });
    }

    // 前往指定的充值方式
    goDepositModal() {
        if (!localStorage.getItem("access_token")) {
            global.goUserSign("1");
            return;
        }

        global.showDialog({
            key: 'wallet:{"type": "deposit", "currentPayValue": "CTC"}',
        });
    }
    // 首页精彩活动翻页
    mainPromotionSplitPage(direction) {
        const { promotionCurrKey, promotionbannerList } = this.state;
        const currKey = parseInt(promotionCurrKey);
        direction === "up" &&
            currKey > 0 &&
            this.setState({ promotionCurrKey: (currKey - 1).toString() });
        direction === "down" &&
            currKey < promotionbannerList.length - 1 &&
            this.setState({ promotionCurrKey: (currKey + 1).toString() });
    }
    render() {
        const { 
            promotionbannerList, 
            sponsorbannerList
        } =
            this.state;
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
                {/* Banner 图片 */}
                <Banner
                    // bannerClick={this.bannerClick}
                    bannerList={this.state.bannerList}
                />
                {/* 主体内容区域 */}
                <div className="common-distance-wrap">
                    {/* ------------ 註冊成功彈窗 ------------*/}
                    <ToastContainer />

                    <div className="common-distance">
                        {Array.isArray(sponsorbannerList) &&
                            sponsorbannerList.length != 0 && (
                                <React.Fragment>
                                    {" "}
                                    <h2 className="home-section-title">
                                        {translate("推荐优惠")}
                                    </h2>
                                    {sponsorbannerList != "" &&
                                    Array.isArray(sponsorbannerList) ? (
                                        <Tabs
                                            type="card"
                                            className="home-promotion-wrap _2 promotionBanner"
                                        >
                                            {sponsorbannerList.map(
                                                (item, index) => {
                                                    return (
                                                        <TabPane
                                                            tab={
                                                                <div
                                                                    className="home-sponsor offset-y"
                                                                    onClick={() => {
                                                                        Pushgtagdata(
                                                                            "Home",
                                                                            "Click Feature Banner",
                                                                            "Home_C_FeatureBanner",
                                                                            "",
                                                                            [
                                                                                {customVariableKey: "Home_C_FeatureBanner_ActivityName",
                                                                                customVariableValue: item.title}
                                                                            ]
                                                                        );
                                                                    }}
                                                                >
                                                                    <LazyLoad
                                                                        height={
                                                                            120
                                                                        }
                                                                    >
                                                                        <Bannerimg
                                                                            item={
                                                                                item
                                                                            }
                                                                            width={
                                                                                540
                                                                            }
                                                                            height={
                                                                                119
                                                                            }
                                                                        />
                                                                    </LazyLoad>
                                                                </div>
                                                            }
                                                            key={index}
                                                        />
                                                    );
                                                }
                                            )}
                                        </Tabs>
                                    ) : (
                                        <div className="ant-skeleton ant-skeleton-active">
                                            <div className="ant-skeleton-content">
                                                <ul className="ant-skeleton-paragraph">
                                                    <li
                                                        style={{ height: 133 }}
                                                    />
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}

                        {Array.isArray(promotionbannerList) &&
                            promotionbannerList.length != 0 && (
                                <React.Fragment>
                                    {" "}
                                    <h2 className="home-section-title">
                                        <span>{translate("精彩活动")}</span>
                                        <div
                                            className="home-split-page-btn-wrap"
                                            style={{
                                                display:
                                                    promotionbannerList != "" &&
                                                    Array.isArray(
                                                        promotionbannerList
                                                    ) &&
                                                    promotionbannerList.length >
                                                        1
                                                        ? "block"
                                                        : "none",
                                            }}
                                        >
                                            {this.state.promotionCurrKey !=
                                            0 ? (
                                                <span
                                                    onClick={() => {
                                                        this.mainPromotionSplitPage(
                                                            "up"
                                                        );
                                                    }}
                                                    unselectable="unselectable"
                                                    className="ant-tabs-tab-prev ant-tabs-tab-arrow-show"
                                                >   
                                                    <Icon type="left-circle" />
                                                </span>
                                            ) : null}
                                            {promotionbannerList &&
                                            promotionbannerList.length &&
                                            promotionbannerList.length - 1 !=
                                                this.state.promotionCurrKey ? (
                                                <span
                                                    onClick={() => {
                                                        this.mainPromotionSplitPage(
                                                            "down"
                                                        );
                                                    }}
                                                    unselectable="unselectable"
                                                    className="ant-tabs-tab-next ant-tabs-tab-arrow-show"
                                                >
                                                    <Icon type="right-circle" />
                                                </span>
                                            ) : null}
                                        </div>
                                    </h2>
                                    {promotionbannerList != "" &&
                                    Array.isArray(promotionbannerList) ? (
                                        <div>
                                            <Tabs
                                                className="home-split-page-promotion-wrap"
                                                activeKey={
                                                    this.state.promotionCurrKey
                                                }
                                            >
                                                {promotionbannerList.map(
                                                    (item, index) => {
                                                        return (
                                                            <TabPane
                                                                tab={null}
                                                                key={index}
                                                            >
                                                                {item.map(
                                                                    (
                                                                        panelItem,
                                                                        panelIndex
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    "panel" +
                                                                                    panelIndex
                                                                                }
                                                                                className="home-promotion offset-y"
                                                                                onClick={() => {
                                                                                    if (
                                                                                        panelItem.title ===
                                                                                        "WEC Feature Banner"
                                                                                    ) {
                                                                                        Pushgtagdata(
                                                                                            `FeatureBanner`,
                                                                                            "Click",
                                                                                            `${panelItem.action.cgmsVendorCode}_FeatureBanner_Home`
                                                                                        );
                                                                                        return;
                                                                                    }
                                                                                    Pushgtagdata(
                                                                                        "Banner",
                                                                                        "Click",
                                                                                        panelItem.title +
                                                                                            "_Feature_Home"
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <LazyLoad
                                                                                    height={
                                                                                        100
                                                                                    }
                                                                                    offset={
                                                                                        100
                                                                                    }
                                                                                    once
                                                                                >
                                                                                    <Bannerimg
                                                                                        item={
                                                                                            panelItem
                                                                                        }
                                                                                        width={
                                                                                            480
                                                                                        }
                                                                                        height={
                                                                                            100
                                                                                        }
                                                                                    />
                                                                                </LazyLoad>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </TabPane>
                                                        );
                                                    }
                                                )}
                                            </Tabs>
                                        </div>
                                    ) : (
                                        <div className="ant-skeleton ant-skeleton-active">
                                            <div className="ant-skeleton-content">
                                                <ul className="ant-skeleton-paragraph">
                                                    <li
                                                        style={{ height: 116 }}
                                                    />
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                    </div>
                </div>
                <div className="common-distance-wrap app-qrcode-wrap">
                    <div className="common-distance">
                        <Row gutter={20}>
                            <Col span={9}>
                                <LazyLoad height={401} offset={100} once>
                                    <div className="app-picture">
                                        <div className="AppDownloadSection">
                                            <ImageWithFallback
                                                src={`/vn/img/home/part/AppDownloadSection.${
                                                    isWebPSupported()
                                                        ? "webp"
                                                        : "png"
                                                }`}
                                                width={401}
                                                height={382}
                                                alt="app-picture"
                                                fallbackSrc="/vn/img/logo/logo.svg"
                                            />
                                        </div>
                                    </div>
                                </LazyLoad>
                            </Col>
                            <Col span={14}>
                                <Row className="qrcode">
                                    <Col span={14}>
                                        <h1 className="title">{translate("下载FUN88 APP")}</h1>
                                        <div className="qrcode-article-wrap">
                                            <p className="qrcode-article">
                                               {translate("提供最大的访问安全性和效率拥有更快、更安全的全新转账功能只需按下即可！ 兴奋并实时获胜，您将不会错过它。 一举一动都与亚洲最好的在线网站有关。 支持Android和iOS操作系统，大奖。")}
                                            </p>
                                            <i className="tlc-sprite app-down-icons" />
                                            <h4>{translate("手机浏览器输入网址")}</h4>
                                            <CopyToClipboard
                                                text={this.state.downloadLinks}
                                                onCopy={() => {
                                                    message.success(
                                                        translate("复制成功")
                                                    );
                                                    Pushgtagdata(
                                                        "TLCmobileweb_homepage"
                                                    );
                                                }}
                                            >
                                                <div className="homeinstallurl">
                                                    {this.state.downloadLinks}
                                                    <img
                                                        src={`${process.env.BASE_PATH}/img/icons/copy.svg`}
                                                        className="copy-icon"
                                                        alt="copy"
                                                    />
                                                </div>
                                            </CopyToClipboard>
                                        </div>
                                    </Col>
                                    <Col span={5} offset={1}>
                                        <div className="App-Qrcode-List">
                                            <LazyLoad
                                                height={175}
                                                offset={100}
                                                once
                                            >
                                                <div className="qrcode-picture">
                                                    {this.state.downloadLinks ? (
                                                        <QRCode
                                                            //logo={'/vn/img/download/qrlogo.jpg'}
                                                            size={148}
                                                            value={
                                                                this.state.downloadLinks
                                                            }
                                                            // logoWidth={50}
                                                            // logoHeight={50}
                                                        />
                                                    ) : null}
                                                    <h5 className="App-Name">
                                                        IOS APP
                                                    </h5>
                                                </div>
                                            </LazyLoad>
                                            <LazyLoad
                                                height={175}
                                                offset={100}
                                                once
                                            >
                                                <div className="qrcode-picture">
                                                    {this.state.downloadLinks ? (
                                                        <QRCode
                                                            //logo={'/vn/img/download/qrlogo.jpg'}
                                                            size={148}
                                                            value={
                                                                this.state.downloadLinks
                                                            }
                                                            // logoWidth={50}
                                                            // logoHeight={50}
                                                        />
                                                    ) : null}
                                                    <h5 className="App-Name">
                                                        Android APP
                                                    </h5>
                                                </div>
                                            </LazyLoad>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
                <LazyLoad height={454} offset={100}>
                    <div className="common-distance-wrap cooperate-wrap">
                        <div className="common-distance clear-padding">
                            <Row>
                                <Col span={11}>
                                    <h2>{translate("赞助")}</h2>
                                    <Row>
                                        <Col span={12}>
                                            <div className="cooperate-content _1">
                                                <p>
                                                    <span className="cooperate-name">
                                                        {translate("官方球衣赞助商")}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        {translate("纽卡斯尔联足球俱乐部")}
                                                    </span>
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="cooperate-content _2">
                                                <p>
                                                    <span className="cooperate-name">
                                                        {translate("亚洲官方投注伙伴")}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        {translate("托特纳姆热刺足球俱乐部")}
                                                    </span>
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={1}></Col>
                                <Col span={12}>
                                    <LazyLoad height={808} offset={100} once>
                                        <ImageWithFallback
                                            src={`/vn/img/home/part/brand-ambassador.${
                                                isWebPSupported()
                                                    ? "webp"
                                                    : "png"
                                            }`}
                                            width={808}
                                            height={410}
                                            alt="app-picture"
                                            fallbackSrc="/vn/img/logo/logo.svg"
                                        />
                                    </LazyLoad>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </LazyLoad>

                {/* 紧急公告弹窗 */}
                <Announcement/>

                {/* 乐天堂全新升级通知 */}
                <WelcomeBanne />

                {/* 新用户注册优惠 */}
                <RegisterBonus/>

                {/* 银行营业时间 */}
                <BankBusinessTime />
            </Layout>
        );
    }
}
