import React from "react";
import Layout from "@/Layout";
import Router from "next/router";
import { Button, Icon, Input, Modal, Collapse, Spin, message } from "antd";
import {
    RightOutlined,
    DownOutlined,
    DoubleRightOutlined,
} from "@ant-design/icons";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { get, post } from "$ACTIONS/TlcRequest";
import { nameReg, trimReg } from "$ACTIONS/reg";
import DepositLesson from "@/DepositLesson/CTC";
import WithdrawLesson from "@/WithdrawLesson";
import { isWebPSupported } from "$ACTIONS/helper";
import USDTDifferentLesson from "@/USDTDifferentLesson";
import HeadTitleUSDT from "@/USDTintroduce/HeadTitleUSDT";
// import { Cookie, dateFormat } from '$ACTIONS/util';

const { Panel } = Collapse;
const { TextArea } = Input;

const sections = [
    { name: "首頁圖片", href: "#header-usdt" },
    { name: "您必须了解的加密货币", href: "#usdt-introduce" },
    { name: "USDT泰达币的优势", href: "#usdt-advantage" },
    { name: "FUN88 USDT 存款支付方式", href: "#usdt-deposit" },
    { name: "常见问题", href: "#usdt-question" },
    { name: "问题反馈", href: "#usdt-question-feedback" },
    { name: "頁尾", href: "#footer-usdt" },
];

export default class USDTintroduce extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            depositLessonModal: false,
            withdrawLessonModal: false,
            usdtDifferentLessonModal: false,
            questionLessonModal: false,
            usdtUseFunctionLessonModal: false,
            depositIndex: 1,
            // usdtUseFunctionIndex: 1,
            promotionId: 0,
            loading: false,
            username: "",
            feedback: "",
            nameFocus: false,
            feedbackFocus: false,
            defaultDisabledUserName: false,
            cmsImageUrl: "",
            // where2buyData: null,
            // usdtFaq: null, //存放api取得的FAQ資料，目前採hardcode
            isGotUsdtFaq: false,
            faqValue: null,
            faqSelectedList: [], //所點選的FAQ ID Array
            faqModalSelectedList: [], //常見問題之查看更多跳窗所選的FAQ ID Array
            currentSection: 0,
        };

        this.goUSDTdeposit = this.goUSDTdeposit.bind(this);
        this.goPromotionId = this.goPromotionId.bind(this);
    }
    componentDidMount() {
        const isSupportWebp = isWebPSupported() ? "&displaying_webp" : "";
        const updateCurrentDotHandler = (e) => {
            const winScroll =
                document.body.scrollTop || document.documentElement.scrollTop;
            const height =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;

            //運用scrolled (滑動百分比)來製造效果
            const scrolled = (winScroll / height) * 100;
            const sectionInterval = 100 / sections.length - 1;
            const sectionIndex = scrolled / sectionInterval;
            if (sectionIndex < 0) return;

            //set currentSection by each section's porpotion to optimize scrolling expirence
            if (sectionIndex <= 1.31) {
                this.setState({ currentSection: 0 });
            } else if (sectionIndex > 1.31 && sectionIndex <= 2.7) {
                this.setState({ currentSection: 1 });
            } else if (sectionIndex > 2.7 && sectionIndex <= 3.71) {
                this.setState({ currentSection: 2 });
            } else if (sectionIndex > 3.71 && sectionIndex <= 4.91) {
                this.setState({ currentSection: 3 });
            } else if (sectionIndex > 4.91 && sectionIndex <= 5.81) {
                this.setState({ currentSection: 4 });
            } else if (sectionIndex > 5.81 && sectionIndex <= 6.5) {
                this.setState({ currentSection: 5 });
            } else if (sectionIndex > 6.5 && sectionIndex <= 7) {
                this.setState({ currentSection: 6 });
            }
        };
        window.addEventListener("scroll", updateCurrentDotHandler);
        get(
            CMSAPIUrl +
                "/vi-vn/api/v1/web/webbanners/position/USDT_intro?login=after" +
                isSupportWebp
        ).then((res) => {
            if (Array.isArray(res)) {
                this.setState({
                    promotionId: res[0] && res[0].action && res[0].action.ID,
                    // cmsImageUrl: res[0].cmsImageUrl,
                });
            }
        });

        // get(
        //   CMSAPIUrl + "/vi-vn/api/v1/uiblock/usdt/where2buy" + isSupportWebp1
        // ).then((res) => {
        //   if (res && res.success) {
        //     let data = res.data;
        //     data.listItem = [];
        //     data.icons.forEach((v, i) => {
        //       if (i % 5 === 0) {
        //         data.listItem.push([v]);
        //       } else {
        //         data.listItem[data.listItem.length - 1].push(v);
        //       }
        //     });
        //     this.setState({ where2buyData: data });
        //   } else {
        //     res && res.msg && message.error(res.msg);
        //   }
        // });

        // API取得常見問題FAQ資料，目前採Hardcode，請先不要刪除
        // get(CMSAPIUrl + "/vi-vn/api/v1/web/usdt/faq" + isSupportWebp1).then(
        //   (res) => {
        //     res && this.setState({ usdtFaq: res });
        //   }
        // );

        global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("USDT_info");
    }

    sectionScrollHandler(i, e) {
        e.preventDefault();
        const targetSectionEl = document.querySelector(sections[i].href);
        targetSectionEl.scrollIntoView({ behavior: "smooth" });
    }

    goPromotionId() {
        if (localStorage.getItem("access_token") === null) {
            global.goUserSign("1");
        } else {
            Router.push(`/promotions?id=${this.state.promotionId}`);
        }
    }
    goUSDTdeposit() {
        if (localStorage.getItem("access_token") === null) {
            global.goUserSign("1");
        } else {
            global.showDialog({
                key: 'wallet:{"type": "deposit", "currentPayValue": "CTC"}',
            });
        }
    }
    postFeedback = () => {
        this.setState({ nameFocus: true, feedbackFocus: true });
        if (!this.state.username || !nameReg.test(this.state.username)) {
            return;
        }
        if (
            !this.state.feedback ||
            trimReg.test(this.state.feedback) ||
            this.state.feedback.trim().length > 200
        ) {
            return;
        }
        this.setState({ loading: true });
        post(ApiPort.Feedbackform, {
            username: this.state.username,
            feedback: this.state.feedback.trim(),
        })
            .then((res) => {
                this.setState({
                    loading: false,
                    feedbackFocus: false,
                    feedback: "",
                });
                // const STATIC_CHECK_INFO = "您的反馈已收到";
                console.log("Feedback res", res);
                if (res && res.isSuccess) {
                    this.prompt("提交成功", true);
                } else {
                    this.prompt("提交失敗", false);
                    // 後端會自動跳prompt
                }
                this.setState({
                    loading: false,
                    feedbackFocus: false,
                    feedback: "",
                });
            })
            .catch((error) => {
                console.log("Feedbackform" + error);
            });
    };
    prompt = (value, status) => {
        typeof status === "undefined" && (status = true);
        Modal.info({
            title: ``,
            className: "showInfoModal opacity feedback-status-modal",
            centered: true,
            mask: false,
            content: (
                <div
                    className="dialog-content"
                    style={{
                        backgroundColor: status
                            ? "#DAFFE3"
                            : "rgb(255 218 218)",
                    }}
                >
                    {status ? (
                        <Icon
                            type="check-circle"
                            theme="filled"
                            style={{ color: "#0CCC3C" }}
                        />
                    ) : (
                        <Icon
                            type="close-circle"
                            theme="filled"
                            style={{ color: "red" }}
                        />
                    )}
                    <p style={{ color: status ? "#0CCC3C" : "red" }}>{value}</p>
                </div>
            ),
        });
        setTimeout(() => {
            Modal.destroyAll();
        }, 2500);
    };
    readMore = (title, body) => {
        Modal.info({
            icon: "",
            okText: "确认",
            title: title,
            content: (
                <div
                    style={{ textAlign: "left" }}
                    dangerouslySetInnerHTML={{ __html: body }}
                ></div>
            ),
        });
    };

    faqClick = (i) => {
        this.setState((prev) => {
            return { ...prev, faqValue: prev.faqValue === i ? null : i };
        });
    };

    render() {
        const { faqSelectedList, faqModalSelectedList } = this.state;
        const usdtFaqHardCode = [
            {
                id: "8479",
                title: "什么是加密货币？",
                body: "<p>加密货币，是一种使用密码学原理创造出来的交易方式，可应用于转帐/支付。</p>",
            },
            {
                id: "8480",
                title: "什么是泰达币？",
                body: "<p>一种将加密货币与法定货币美元挂钩的虚拟货币，以开放的区块链为底层技术，具有安全性和透明度，由 Tether 公司推出，Tether 将现金转换为数字货币，锚定于美元、欧元和日元等国家法币的价格，因此定价相对稳定。</p>",
            },
            {
                id: "8575",
                title: "为什么使用加密货币？",
                body: "<p>点对点支付，无需经过银行等任何中间机构，钱直接给对方，大大降低了交易费率。<br>加密货币安全性高，能够保障客户资金隐私。<br>大额单笔转账，额度无上限，到账迅速。<br>24小时随时交易，可以随意和外汇资金兑换</p>",
            },
            {
                id: "8576",
                title: "如何获取加密货币？",
                body: "<p>如欲了解更多交易平台的咨询，请联系在线客服或参考资金页面(加密货币)</p>",
            },
            {
                id: "8577",
                title: "加密货币的汇率是固定的吗？",
                body: "<p>加密货币兑换汇率是按照实时汇率随时变动，存款页面我们将提供参考汇率</p>",
            },
            {
                id: "8578",
                title: "转账后订单迟迟未显示成功怎么办?",
                body: "<p>加密货币转账需要区块全部确认，才会判定转账成功。您可以先查看钱包的转账详情页面是否已显示转账完成，<br>若未完成，请耐心等待；<br>若已完成，系统在检测到打币后会及时响应并更改订单状态。<br>若已完成，网站还未到账金额，请联系在线客服提供相应转账凭证寻求协助。</p>",
            },
            {
                id: "8579",
                title: "支付成功了，订单显示失败怎么处理?",
                body: "<p>产生这种情况的原因是：1、支付金额不对 2、订单超时 3、币价突然波动过大，系统停止处理。请联系平台或在线客服进行处理。</p>",
            },
            {
                id: "8580",
                title: "加密货币交易是否会产生手续费用呢？",
                body: "<p>部分平台会产生交易费用，供应商页面将显示交易金额+手续费，您在转账时请输入总金额即可。</p>",
            },
        ];

        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                wrapperClassName="usdt-introduce-layout"
                status={1}
                setUserCenterMemberInfo={(v, setMemberInfo, getBalance) => {
                    console.log("setUserCenterMemberInfo", v);
                    this.setState({
                        defaultDisabledUserName: true,
                        username: v.userName,
                    });
                }}
            >
                <div className="header-usdt" id="header-usdt"></div>

                <div className="page-navi-dot-box">
                    {sections.map((section, i) => {
                        return (
                            <a
                                key={i}
                                onClick={this.sectionScrollHandler.bind(
                                    this,
                                    i
                                )}
                                className={`navi-dot ${
                                    sections[this.state.currentSection].href ===
                                        section.href && "current-section-dot"
                                }`}
                                href={section.href}
                            ></a>
                        );
                    })}
                </div>

                <div className="footer-usdt" id="footer-usdt"></div>

                <div className="common-distance-wrap usdt-introduce-wrap">
                    <img
                        src="/vn/img/user/otpVerify/icon-success.png"
                        style={{
                            visibility: "hidden",
                            position: "absolute",
                            left: -9999,
                            top: -9999,
                        }}
                    />
                    <img
                        id="usdt-hero"
                        className="hero-image-ustd"
                        src="/vn/img/usdt/USDTbanner.jpg"
                    />
                    <div className="usdt-content">
                        <div
                            className="usdt-banner-wrap"
                            style={{
                                backgroundImage:
                                    "url(" + this.state.cmsImageUrl + ")",
                            }}
                        >
                            {this.state.promotionId ? (
                                <button onClick={this.goPromotionId}>
                                    立即申请
                                </button>
                            ) : null}
                        </div>
                        <div className="usdt-introduce" id="usdt-introduce">
                            <HeadTitleUSDT title="您必须了解的加密货币" />
                            <p className="usdt-description">
                                加密货币是现代社会中最有价值的发明之一，其颠覆传统的去中心化交易模式及安全、稳定、隐秘之特性，广受企业机构的青睐，成为现今市场交易的主流。
                            </p>
                            <ul className="usdt-list">
                                <li className="usdt-item">
                                    <div className="usdt-item-img">
                                        <img src="/vn/img/usdt/1_1.png" />
                                    </div>
                                    <div className="usdt-item-text">
                                        <h3>安全有保障</h3>
                                        <p>
                                            与银行卡等传统支付方式相比，玩家不需要给出自己的姓名或卡号即可完成加密货币交易，避免了敏感信息泄漏。
                                        </p>
                                    </div>
                                </li>
                                <li className="usdt-item">
                                    <div className="usdt-item-img">
                                        <img src="/vn/img/usdt/1_2.png" />
                                    </div>
                                    <div className="usdt-item-text">
                                        <h3>交易速度快</h3>
                                        <p>
                                            加密货币所采用的区块链技术具有去中心化特点，不需要清算中心机构来处理数据，交易时间将被缩短。
                                        </p>
                                    </div>
                                </li>
                                <li className="usdt-item">
                                    <div className="usdt-item-img">
                                        <img src="/vn/img/usdt/1_3.png" />
                                    </div>
                                    <div className="usdt-item-text">
                                        <h3>高度匿名性</h3>
                                        <p>
                                            不由央行或当局发行，不受银行监管，玩家可以随心所欲地使用存放在自己加密钱包里的资金。
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="usdt-advantage" id="usdt-advantage">
                            <HeadTitleUSDT title="USDT泰达币的优势" />
                            <p className="usdt-description">
                                泰达币（Tether）也被称为USDT，其价值与美元对等
                                1USDT=1美元。作为最稳定且保值的币种，在加密货币中独占鳌头。
                            </p>
                            <ul className="usdt-list">
                                <li className="usdt-item">
                                    <div className="usdt-item-img">
                                        <img src="/vn/img/usdt/2_1.png" />
                                    </div>
                                    <div className="usdt-item-text">
                                        <p>匿名买卖</p>
                                    </div>
                                </li>
                                <li className="usdt-item">
                                    <div className="usdt-item-img">
                                        <img src="/vn/img/usdt/2_2.png" />
                                    </div>
                                    <div className="usdt-item-text">
                                        <p>24小时</p>
                                    </div>
                                </li>
                                <li className="usdt-item">
                                    <div className="usdt-item-img">
                                        <img src="/vn/img/usdt/2_3.png" />
                                    </div>
                                    <div className="usdt-item-text">
                                        <p>价格稳定</p>
                                    </div>
                                </li>
                                <li className="usdt-item">
                                    <div className="usdt-item-img">
                                        <img src="/vn/img/usdt/2_4.png" />
                                    </div>
                                    <div className="usdt-item-text">
                                        <p>快速到账</p>
                                    </div>
                                </li>
                                <li className="usdt-item">
                                    <div className="usdt-item-img">
                                        <img src="/vn/img/usdt/2_5.png" />
                                    </div>
                                    <div className="usdt-item-text">
                                        <p>不受银行监管</p>
                                    </div>
                                </li>
                                <li className="usdt-item">
                                    <div className="usdt-item-img">
                                        <img src="/vn/img/usdt/2_6.png" />
                                    </div>
                                    <div className="usdt-item-text">
                                        <p>额度无上限</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="usdt-btn-wrapper">
                                <Button
                                    size="large"
                                    ghost
                                    className="usdt-btn"
                                    onClick={() => {
                                        this.setState({
                                            usdtDifferentLessonModal: true,
                                        });
                                    }}
                                >
                                    钱包协议的区别　
                                    <Icon type="right" />
                                </Button>
                            </div>
                        </div>
                        {/*this.state.where2buyData && (
              <div className="usdt-deposit-type">
                <h2 className="usdt-weight-title">
                  {this.state.where2buyData.title}
                </h2>
                <p className="usdt-description">
                  {this.state.where2buyData.subTitle}
                </p>
                {this.state.where2buyData.listItem &&
                  this.state.where2buyData.listItem.map((v, i) => {
                    return (
                      <ul className="usdt-list" key={i}>
                        {v.map((inV, inI) => (
                          <li key={inI} className="usdt-item">
                            <a target="_blank" href={inV.href}>
                              <div className="usdt-item-img">
                                <img src={inV.src} />
                              </div>
                              <div className="usdt-item-text">
                                <h3>{inV.title}</h3>
                                <Icon type="right" />
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    );
                  })}
              </div>
                )*/}
                        <div className="usdt-deposit" id="usdt-deposit">
                            <HeadTitleUSDT
                                title="FUN88 USDT 存款支付方式"
                                style={{ marginBottom: "65px" }}
                            />
                            <div className="usdt-deposit-table">
                                <li className="usdt-deposit-table-tr">
                                    <div className="usdt-deposit-table-td">
                                        极速虚拟币
                                    </div>
                                    <div className="usdt-deposit-table-td">
                                        虚拟币支付
                                    </div>
                                </li>
                                <li className="usdt-deposit-table-tr">
                                    <div className="usdt-deposit-table-td">
                                        以实时兑换率来进行交易
                                    </div>
                                    <div className="usdt-deposit-table-td">
                                        以锁定的交易时间内的兑换率来进行交易
                                    </div>
                                </li>
                                <li className="usdt-deposit-table-tr">
                                    <div className="usdt-deposit-table-td">
                                        您的专属存款二维码和钱包地址，可储存于第三方平台重复使用
                                    </div>
                                    <div className="usdt-deposit-table-td">
                                        每次您提交存款交易请求时，所产生的二维码和收款地址仅限一次使用
                                    </div>
                                </li>
                                <li className="usdt-deposit-table-tr">
                                    <div className="usdt-deposit-table-td">
                                        您无需浏览乐天堂的泰达币存款页面，亦能直接从第三方平台直接进行存款
                                    </div>
                                    <div className="usdt-deposit-table-td">
                                        您需要浏览乐天堂的泰达币存款页面才能进行存款
                                    </div>
                                </li>
                                <li className="usdt-deposit-table-tr">
                                    <div className="usdt-deposit-table-td">
                                        您的交易单号会在您的泰达币入账后才产生
                                    </div>
                                    <div className="usdt-deposit-table-td">
                                        一旦完成提交存款后，您即可获得交易单号
                                    </div>
                                </li>
                                <li className="usdt-deposit-table-tr">
                                    <div className="usdt-deposit-table-td">
                                        您可以随时随地进行存款
                                    </div>
                                    <div className="usdt-deposit-table-td">
                                        您必须在交易限定的时间内完成存款
                                    </div>
                                </li>
                            </div>
                            <div className="usdt-btn-wrapper">
                                <Button
                                    size="large"
                                    ghost
                                    className="usdt-btn"
                                    onClick={() => {
                                        this.setState({
                                            depositLessonModal: true,
                                        });
                                    }}
                                >
                                    存款教程
                                    <Icon type="right" />
                                </Button>
                                <div
                                    style={{
                                        display: "inline-block",
                                        width: 20,
                                        height: 10,
                                    }}
                                ></div>
                                <Button
                                    size="large"
                                    ghost
                                    className="usdt-btn"
                                    onClick={() => {
                                        this.setState({
                                            withdrawLessonModal: true,
                                        });
                                    }}
                                >
                                    提款教程　
                                    <Icon type="right" />
                                </Button>
                            </div>
                        </div>
                        <div className="usdt-question" id="usdt-question">
                            <HeadTitleUSDT
                                title="常见问题"
                                style={{ marginBottom: "60px" }}
                            />
                            <ul className="usdt-list">
                                {usdtFaqHardCode.map((v, i) => {
                                    if (i >= 5) {
                                        return null;
                                    }
                                    return (
                                        <li
                                            key={i.toString()}
                                            onClick={() => {
                                                if (
                                                    faqSelectedList.includes(
                                                        v.id
                                                    )
                                                ) {
                                                    this.setState({
                                                        faqSelectedList:
                                                            faqSelectedList.filter(
                                                                (id) =>
                                                                    id !== v.id
                                                            ),
                                                    });
                                                } else {
                                                    this.setState({
                                                        faqSelectedList: [
                                                            ...faqSelectedList,
                                                            v.id,
                                                        ],
                                                    });
                                                }
                                                this.faqClick(v.id);
                                            }}
                                            className={`usdt-item ${
                                                faqSelectedList.includes(v.id)
                                                    ? "usdt-faq-selected"
                                                    : ""
                                            }`}
                                        >
                                            <div className={`usdt-item-text`}>
                                                <h3>
                                                    {v.title}
                                                    {faqSelectedList.includes(
                                                        v.id
                                                    ) ? (
                                                        <DownOutlined />
                                                    ) : (
                                                        <RightOutlined />
                                                    )}
                                                </h3>
                                                {faqSelectedList.includes(
                                                    v.id
                                                ) && (
                                                    <div
                                                        className="faqInfo"
                                                        dangerouslySetInnerHTML={{
                                                            __html: v.body,
                                                        }}
                                                    ></div>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="usdt-btn-wrapper">
                                <Button
                                    size="large"
                                    ghost
                                    className="usdt-btn"
                                    onClick={() => {
                                        this.setState({
                                            questionLessonModal: true,
                                        });
                                    }}
                                >
                                    查看更多　
                                    <DoubleRightOutlined />
                                </Button>
                            </div>
                        </div>
                        <div
                            className="usdt-question-feedback"
                            id="usdt-question-feedback"
                        >
                            <HeadTitleUSDT
                                title="问题反馈"
                                style={{ gap: "180px", marginBottom: "60px" }}
                            />
                            <Spin spinning={this.state.loading}>
                                <div className="usdt-question-feedback-form">
                                    <Input
                                        maxLength={16}
                                        disabled={
                                            this.state.defaultDisabledUserName
                                        }
                                        onChange={(e) => {
                                            this.setState({
                                                nameFocus: true,
                                                username: e.target.value,
                                            });
                                        }}
                                        value={this.state.username}
                                        size="large"
                                        placeholder="请输入您的用户名"
                                        className=""
                                        autoComplete="off"
                                    />
                                    {this.state.nameFocus ? (
                                        !this.state.username ? (
                                            <p className="errorTip">
                                                用户名不得为空。
                                            </p>
                                        ) : !nameReg.test(
                                              this.state.username
                                          ) ? (
                                            <p className="errorTip">
                                                5 -
                                                16个字母或数字组合，中间不得有任何特殊符号。
                                            </p>
                                        ) : null
                                    ) : null}
                                    <TextArea
                                        placeholder="请输入您的问题或意见"
                                        autoSize={{ minRows: 3, maxRows: 5 }}
                                        onChange={(e) => {
                                            this.setState({
                                                feedbackFocus: true,
                                                feedback: e.target.value,
                                            });
                                        }}
                                        value={this.state.feedback}
                                    />
                                    {this.state.feedbackFocus ? (
                                        !this.state.feedback ||
                                        trimReg.test(this.state.feedback) ? (
                                            <p className="errorTip">
                                                问题反馈内容不得为空。
                                            </p>
                                        ) : this.state.feedback.trim().length >
                                          200 ? (
                                            <p className="errorTip">
                                                问题反馈仅限200字符以内。
                                            </p>
                                        ) : null
                                    ) : null}
                                    <p className="usdt-question-feedback-hint">
                                        我们期待倾听您使用加密货币过程中遇到的问题与宝贵意见。
                                    </p>
                                    <div className="usdt-btn-wrapper">
                                        <Button
                                            size="large"
                                            type="primary"
                                            disabled={
                                                !nameReg.test(
                                                    this.state.username
                                                ) ||
                                                !this.state.feedback ||
                                                trimReg.test(
                                                    this.state.feedback
                                                ) ||
                                                this.state.feedback.trim()
                                                    .length > 200
                                            }
                                            onClick={this.postFeedback}
                                        >
                                            提交
                                        </Button>
                                    </div>
                                </div>
                            </Spin>
                        </div>
                    </div>
                </div>
                <Modal
                    title="泰达币存款教程"
                    footer={null}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ depositLessonModal: false });
                    }}
                    visible={this.state.depositLessonModal}
                    width={960}
                    className="UsdtTeachModalStyle"
                >
                    <DepositLesson
                        tabNum={this.state.depositIndex}
                        handleChangeDepositLessonTab={(i) => {
                            this.setState({ depositIndex: i });
                        }}
                        onhandleCancel={() => {
                            this.setState({ depositLessonModal: false });
                        }}
                    />
                </Modal>
                <Modal
                    title="提款教学"
                    footer={null}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ withdrawLessonModal: false });
                    }}
                    visible={this.state.withdrawLessonModal}
                    width={960}
                    className="UsdtTeachModalStyle udt-withdrawl-modal"
                >
                    <WithdrawLesson
                        onhandleCancel={() => {
                            this.setState({ withdrawLessonModal: false });
                        }}
                    />
                </Modal>
                <Modal
                    title="钱包协议的区别"
                    footer={null}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ usdtDifferentLessonModal: false });
                    }}
                    visible={this.state.usdtDifferentLessonModal}
                    width={960}
                    height={738}
                    className="UsdtTeachModalStyle"
                >
                    <USDTDifferentLesson
                        onhandleCancel={() => {
                            this.setState({ usdtDifferentLessonModal: false });
                        }}
                    />
                </Modal>
                <Modal
                    className="UsdtTeachModalStyle"
                    footer={null}
                    maskClosable={true}
                    title="常见问题"
                    onCancel={() => {
                        this.setState({
                            questionLessonModal: false,
                            faqModalSelectedList: [],
                        });
                    }}
                    centered
                    visible={this.state.questionLessonModal}
                    width={770}
                >
                    <div className="FAQ-wrapper">
                        <Collapse
                            activeKey={faqModalSelectedList}
                            bordered={false}
                            expandIconPosition={"right"}
                            expandIcon={({ isActive }) => (
                                <Icon
                                    type="down"
                                    rotate={isActive ? -180 : 0}
                                />
                            )}
                            defaultActiveKey={null}
                            onChange={(e) => {
                                this.setState({ faqModalSelectedList: e });
                            }}
                        >
                            {usdtFaqHardCode.map((v, i) => {
                                return (
                                    <Panel header={v.title} key={i.toString()}>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: v.body,
                                            }}
                                        ></p>
                                    </Panel>
                                );
                            })}
                        </Collapse>
                    </div>
                </Modal>
            </Layout>
        );
    }
}
