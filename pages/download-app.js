import React from "react";
import Layout from "@/Layout";
import QRCode from "qrcode-react";
import { get } from "$ACTIONS/TlcRequest";
import { CMSAPIUrl } from "$ACTIONS/TLCAPI";
import {
    getAffiliateReferralCode,
    Cookie as Cookiehelper,
} from "$ACTIONS/helper";
import { isWebPSupported } from "$ACTIONS/helper";
import { translate } from "$ACTIONS/Translate";
import { getStaticPropsFromStrapiSEOSetting } from "$DATA/seo";
export async function getStaticProps() {
    return await getStaticPropsFromStrapiSEOSetting("/download-app"); //參數帶本頁的路徑
}
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: "1",
            downloadLinks: "",
        };
    }
    componentDidMount() {
        this.Downloadidopen();
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
        // get(
        //  ApiPort.GetDownloadLink +
        //    '?affiliateCode=' +
        //    getAffiliateReferralCode() +
        //    '&domain=' +
        //    ApiPort.LOCAL_HOST + "/zh" +
        //    APISETS
        // ).then((data) => {
        //  if (data) {
        //    let url = data.downloadLinks.filter((d) => d.downloadId == 'DownloadGameUrl_Android')[0].downloadUrl;
        //    this.setState({
        //      downloadLinks: url
        //    });
        //  }
        // });
    }
    render() {
        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                status={1}
                seoData={this.props.seoData}
            >
                <div className="common-distance-wrap down-wrap">
                    <div className="dow-distance">
                        <div className="content">
                            <img
                                className="hero-banner"
                                src={`${process.env.BASE_PATH}/img/download/Image174.${
                                    isWebPSupported() ? "webp" : "png"
                                }`}
                            />
                            <div className="app-lists-box">
                                <div className="app-list-box">
                                    <div className="app-item">
                                        <img
                                            className="img-app-demo"
                                            src={`${process.env.BASE_PATH}/img/download/Untitled-1.${
                                                isWebPSupported()
                                                    ? "webp"
                                                    : "png"
                                            }`}
                                            alt="app"
                                        />
                                        <div className="text-box">
                                            <h1>
                                                {translate(
                                                    "新FUN88原创应用程序",
                                                )}
                                            </h1>
                                            <p>
                                                {translate("操作简易尽享指尖")}
                                            </p>
                                            <div className="qr-box">
                                                <QRCode
                                                    size={100}
                                                    value={
                                                        this.state.downloadLinks
                                                    }
                                                />
                                            </div>
                                            <p className="app-description">
                                                {translate(
                                                    "扫描二维码下载最新版本的FUN88 App并进入下载页面，查看下载说明并按照步骤下载安装",
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="app-list-box">
                                    <div className="app-item">
                                        <div className="text-box">
                                            <h1>{translate("下载乐聊APP")}</h1>
                                            <p>
                                                {translate("24/7随时为您服务")}
                                            </p>
                                            <div className="qr-box">
                                                <QRCode
                                                    size={100}
                                                    value={
                                                        this.state.downloadLinks
                                                    }
                                                />
                                            </div>
                                            <p className="app-description">
                                                {translate(
                                                    "扫描二维码下载乐聊APP乐天使客服贴心为您提供24小时服务。",
                                                )}
                                            </p>
                                        </div>

                                        <img
                                            className="img-app-demo"
                                            src={`${process.env.BASE_PATH}/img/download/AppDownload.${
                                                isWebPSupported()
                                                    ? "webp"
                                                    : "png"
                                            }`}
                                            alt="AppDownload"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}
