import React from "react";
import { Row, Col, Popover, Select, Modal } from "antd";
import Router from "next/router";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import ImageWithFallback from "@/ImageWithFallback/imgLocal";
import { translate } from "$ACTIONS/Translate";

const { Option } = Select;
export default class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Menudata: "",
            HlepMenudata: "",
            showWechatQrcode: false,
            language: translate("越南文"),
            languageArray: [
                // {name:"Vietnam",language: translate("越南文"),path:"/vn"},
                { name: "Thailand", language: translate("泰文"), path: "/th" },
                { name: "China", language: "中文", path: "/cn" },
            ],
        };
    }
    handleChange = (e) => {
        if (typeof window !== "undefined") {
            const language = e === "/th" ? "Thailand" : "China";
            this.setState({ language });
            window.location.href = e;
        }
    };
    showTelegramQRCood = () => {
        const QRCood = Modal.info({
            title: "",
            centered: true,
            okText: translate("关闭"),
            closable: true,
            icon: null,
            content: (
                <div>
                    <img
                        src={`${process.env.BASE_PATH}/img/footer/social/Contact_TG-VN.jpg`}
                    />
                </div>
            ),
            onOk: () => {
                QRCood.destroy();
            },
        });
    };
    render() {
        const footerIcon = [
            "AG",
            "BTI",
            "MICROGAMING",
            "SABASPORTS",
            "playtech",
            "INPLAYMATRIX",
            "CMD",
            "GAMEPLAY",
            "KINGMAKER",
            "EVOLUTION",
            "WIN",
            "TCGAMING",
            "TFGAMING",
            "WMCASINO",
            "other1",
            "JILI",
            "KINGSPOKER",
            "PG",
            "PLAYNGO",
            "VIR2ALSPORTS",
            "SPRIBE",
            "PP",
            "WECASINO",
            "EVOPLAY",
            "BABANERO",
            "BNG",
            "NAGA",
            "BTG",
            "REDTIGER",
        ];
        const { language, languageArray } = this.state;
        const isLogin =
            typeof window !== "undefined" &&
            !!localStorage.getItem("access_token") &&
            localStorage.getItem("access_token");
        return (
            <React.Fragment>
                <div className="common-distance-wrap footer-platform-wrap">
                    <div className="common-distance">
                        <Row className="footer-platform">
                            <Col span={7}>
                                <h4>{translate("支付方式")}</h4>
                                <ul className="icon-list">
                                    <li className="icon-item1 _1">
                                        <Popover
                                            content="Zalo Pay"
                                            title=""
                                            trigger="hover"
                                            overlayClassName="footer-popover"
                                        >
                                            <div className="_set_"></div>
                                        </Popover>
                                    </li>
                                    <li className="icon-item1 _2">
                                        <Popover
                                            content="Mã QR"
                                            title=""
                                            trigger="hover"
                                            overlayClassName="footer-popover"
                                        >
                                            <div className="_set_"></div>
                                        </Popover>
                                    </li>
                                    <li className="icon-item1 _3">
                                        <Popover
                                            content="Thẻ Cào"
                                            title=""
                                            trigger="hover"
                                            overlayClassName="footer-popover"
                                        >
                                            <div className="_set_"></div>
                                        </Popover>
                                    </li>
                                    <li className="icon-item1 _4">
                                        <Popover
                                            content="Ngân Hàng Địa Phương"
                                            title=""
                                            trigger="hover"
                                            overlayClassName="footer-popover"
                                        >
                                            <div className="_set_"></div>
                                        </Popover>
                                    </li>

                                    <li className="icon-item1 _5">
                                        <Popover
                                            content="Fast Pay"
                                            title=""
                                            trigger="hover"
                                            overlayClassName="footer-popover"
                                        >
                                            <div className="_set_"></div>
                                        </Popover>
                                    </li>

                                    <li className="icon-item1 _6">
                                        <Popover
                                            content="Momo Pay"
                                            title=""
                                            trigger="hover"
                                            overlayClassName="footer-popover"
                                        >
                                            <div className="_set_"></div>
                                        </Popover>
                                    </li>
                                </ul>
                            </Col>
                            <Col span={6}>
                                <h4>{translate("关注我们")}</h4>
                                <ul className="icon-list">
                                    <Popover
                                        content="Theo dõi Fun88 tại Facebook"
                                        title=""
                                        trigger="hover"
                                        overlayClassName="footer-popover aboutUS"
                                    >
                                        <li
                                            className="icon-item2 _7"
                                            onClick={() => {
                                                window.open(
                                                    "hhttps://www.facebook.com/FunSportVietNam",
                                                    "_blank",
                                                );
                                                Pushgtagdata(
                                                    "Sina_socialmedia_footer_homepage",
                                                );
                                            }}
                                        ></li>
                                    </Popover>
                                    <Popover
                                        content="Theo dõi Fun88 tại Youtube"
                                        title=""
                                        trigger="hover"
                                        overlayClassName="footer-popover aboutUS"
                                    >
                                        &nbsp;
                                        <li
                                            className="icon-item2 _8"
                                            onClick={() => {
                                                window.open(
                                                    "https://www.youtube.com/@funsportgame8887",
                                                    "_blank",
                                                );
                                                Pushgtagdata(
                                                    "Tencent_socialmedia_footer_homepage",
                                                );
                                            }}
                                        ></li>
                                    </Popover>
                                    <Popover
                                        content="Theo dõi Fun88 tại Instagram"
                                        title=""
                                        trigger="hover"
                                        overlayClassName="footer-popover aboutUS"
                                    >
                                        &nbsp;
                                        <li
                                            className="icon-item2 _9"
                                            onClick={() => {
                                                window.open(
                                                    "https://www.instagram.com/funsportvn/",
                                                    "_blank",
                                                );
                                                Pushgtagdata(
                                                    "Tencent_socialmedia_footer_homepage",
                                                );
                                            }}
                                        ></li>
                                    </Popover>
                                    <Popover
                                        content="Theo dõi Fun88 tại Tiktok"
                                        title=""
                                        trigger="hover"
                                        overlayClassName="footer-popover aboutUS"
                                    >
                                        &nbsp;
                                        <li
                                            className="icon-item2 _10"
                                            onClick={() => {
                                                window.open(
                                                    "https://www.tiktok.com/@fun.sport",
                                                    "_blank",
                                                );
                                                Pushgtagdata(
                                                    "Tencent_socialmedia_footer_homepage",
                                                );
                                            }}
                                        ></li>
                                    </Popover>
                                    <Popover
                                        content="Kết bạn với Fun88 tại Telegram"
                                        title=""
                                        trigger="hover"
                                        overlayClassName="footer-popover aboutUS"
                                    >
                                        &nbsp;
                                        <li
                                            className="icon-item2 _11"
                                            onClick={() => {
                                                this.showTelegramQRCood();
                                                Pushgtagdata(
                                                    "Tencent_socialmedia_footer_homepage",
                                                );
                                            }}
                                        ></li>
                                    </Popover>
                                </ul>
                            </Col>
                            <Col span={4}>
                                <h4>{translate("博彩责任")}</h4>
                                <ul className="icon-list">
                                    <Popover
                                        content="GAMCARE"
                                        title=""
                                        trigger="hover"
                                        overlayClassName="footer-popover"
                                    >
                                        &nbsp;
                                        <li
                                            className="icon-item3 _12"
                                            onClick={() => {
                                                window.open(
                                                    "http://www.gamcare.org.uk/",
                                                    "_blank",
                                                );
                                            }}
                                        ></li>
                                    </Popover>

                                    <li className="icon-item3 _13">
                                        <Popover
                                            content="21 +"
                                            title=""
                                            trigger="hover"
                                            overlayClassName="footer-popover"
                                        >
                                            <div className="_set_">
                                                <a
                                                    target="_blank"
                                                    // onClick={() => {
                                                    //     Router.push(
                                                    //         "/help?type=Sub3&key=" +
                                                    //             CMSOBJ[
                                                    //                 HostConfig
                                                    //                     .CMS_ID
                                                    //             ][25]
                                                    //     );
                                                    // }}
                                                >
                                                    &nbsp;
                                                </a>
                                            </div>
                                        </Popover>
                                    </li>
                                </ul>
                            </Col>
                            <Col span={4}>
                                <h4>{translate("信息安全")}</h4>
                                <ul className="icon-list">
                                    <li className="icon-item3 _14">
                                        <Popover
                                            content="IOVATION"
                                            title=""
                                            trigger="hover"
                                            overlayClassName="footer-popover"
                                        >
                                            <div className="_set_"></div>
                                        </Popover>
                                    </li>
                                </ul>
                            </Col>
                            {!isLogin && (
                                <Col span={3}>
                                    <Select
                                        size="large"
                                        dropdownClassName="footer-small-drop"
                                        className={`select-language-box ${language}`}
                                        defaultValue={language}
                                        onChange={this.handleChange}
                                        suffixIcon={
                                            <img
                                                src={`${process.env.BASE_PATH}/img/icon/icon-extand.svg`}
                                                alt="extand"
                                            />
                                        }
                                    >
                                        {languageArray.map((item) => (
                                            <Option key={item.path}>
                                                <img
                                                    src={`${process.env.BASE_PATH}/img/footer/language/${item.name}.svg`}
                                                />
                                                <span>{item.language}</span>
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                            )}
                        </Row>
                        <div>
                            <h4>{translate("游戏平台")}</h4>
                            <Row gutter={16}>
                                {footerIcon.map((item, index) => {
                                    return (
                                        <Col
                                            span={3}
                                            style={{
                                                width: "140px",
                                                height: "36px",
                                                marginTop: "10px",
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                            key={index}
                                            onMouseEnter={() => {
                                                this.setState({
                                                    ["showHoverFooterIcon" +
                                                    index]: false,
                                                });
                                            }}
                                            onMouseLeave={() => {
                                                this.setState({
                                                    ["showHoverFooterIcon" +
                                                    index]: true,
                                                });
                                            }}
                                        >
                                            <ImageWithFallback
                                                src={
                                                    this.state[
                                                        "showHoverFooterIcon" +
                                                            index
                                                    ] == false || undefined
                                                        ? `/vn/img/footer/product/hoverIcon/hover-${item}.png`
                                                        : `/vn/img/footer/product/${item}.png`
                                                }
                                                width={130}
                                                height={36}
                                                alt={item}
                                                fallbackSrc="/vn/img/logo/logo.svg"
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="common-distance-wrap footer-copyright-wrap">
                    <div className="common-distance clear-padding">
                        <Row>
                            <Col span={3} className="copyright-picture">
                                <ImageWithFallback
                                    src={`/vn/img/home/part/img.png`}
                                    width={122}
                                    height={118}
                                    alt={"card"}
                                    fallbackSrc="/vn/img/logo/logo.svg"
                                />
                            </Col>
                            <Col span={21} className="copyright-article">
                                <p>
                                    www.fun88.com is operated by E Gambling
                                    Montenegro d.o.o. (81000 Podgorica,
                                    Moskovska br. 65., reg. no.5-0615951) in
                                    cooperation with OG GLOBAL ACCESS LIMITED
                                    (P.O. Box 3340, Road Town, Tortola, British
                                    Virgin Islands.
                                </p>
                                <p>
                                    E Gambling Montenegro d.o.o. (81000
                                    Podgorica, Moskovska br. 65., reg.
                                    no.5-0615951) hereby certifies that under
                                    the concession (serial no. AA 001588,
                                    numeric no. 133-01/15 4A and 1ER) and
                                    approval (no. 02/01-118/4), organize and
                                    operate games of chance in Montenegro on
                                    website www.fun88.com , in accordance with
                                    the Agreement, concluded between E Gambling
                                    Montenegro d.o.o. and OG GLOBAL ACCESS
                                    LIMITED (P.O. Box 3340, Road Town, Tortola,
                                    British Virgin Islands, reg. no. 1923130) on
                                    07 October 2021
                                </p>
                            </Col>
                        </Row>
                        <div className="copyright-content">
                            <p>
                                {translate(
                                    "Fun88乐天堂属于OG GLOBAL ACCESS LIMITED 运营",
                                )}
                            </p>
                            <p>
                                {translate(
                                    "FUN88乐天堂于2019年3月1日起获得菲律宾政府PAGCOR授权并监管",
                                )}
                            </p>
                            <p>
                                {translate("FUN88乐天堂 © 版权所有 违者必究")}
                            </p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
