import React from "react";
import { Tabs, Select, Input, Table } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import Layout from "@/Layout";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import Collapse, { Panel } from "rc-collapse";
import { translate } from "$ACTIONS/Translate";
import { isWebPSupported } from "$ACTIONS/helper";
import { getStaticPropsFromStrapiSEOSetting } from "$DATA/seo";
export async function getStaticProps() {
    return await getStaticPropsFromStrapiSEOSetting("/diamond-club"); //參數帶本頁的路徑
}
const { TabPane } = Tabs;

function expandIcon({ isActive }) {
    return (
        <i style={{ float: "right" }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                style={{
                    verticalAlign: "-.125em",
                    transition: "transform .2s",
                    transform: `rotate(${isActive ? -180 : 0}deg)`,
                    float: "right",
                }}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
            </svg>
        </i>
    );
}

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            VipFaqList: [],
            ContentData: {},
            title: "",
            vipLevel: null,
            vipRight: {},
            ViPDetails: {},
            vip_normalBanner: [],
            vip_highRollerBanner: [],
        };
        this.GetVipFaqList = this.GetVipFaqList.bind(this); // 等級 權益 等
        this.DiamondClubDetail = this.DiamondClubDetail.bind(this); // 鑽石俱樂部QA
        //---------------------------------------------------
    }

    componentDidMount() {
        if (typeof window !== "undefined") {
            let id = window.location.search
                ? window.location.search.split("?key=")[1]
                : "";
            this.setState({
                TypeID: id,
            });

            // id && this.GetVipFaqList(id);
        }

        // this.GetVipFaqList();
        // this.DiamondClubDetail();
        // this.GetCmsBanner();
    }
    componentDidUpdate() {}
    componentWillUnmount() {}

    CmsBanner(Position, call) {
        get(ApiPort.CmsBanner + Position, "GET")
            .then((res) => {
                console.log("res", res);
                call(res);
            })
            .catch((error) => {
                console.log("CmsBanner error:", error);
                return null;
            });
    }

    GetCmsBanner = () => {
        let BannerArray = ["vip_normal", "vip_highRoller", "vip_detail"];
        BannerArray.map((type) => {
            console.log(type);
            this.CmsBanner(type, (res) => {
                if (res.message === "data not found") {
                    return;
                }
                if (res) {
                    this.setState({
                        [type + "Banner"]: res,
                    });
                }
            });
        });
    };

    GetVipFaqList = () => {
        get(ApiPort.GetVipFaqList).then((res) => {
            if (res !== {}) {
                if (res?.message === "data not found") {
                    return;
                }
                console.log("faqlist", res);
                this.setState({
                    VipFaqList: res,
                });
            }
        });
    };

    DiamondClubDetail = () => {
        get(ApiPort.DiamondClubDetail).then((res) => {
            if (res?.message === "data not found") {
                return;
            }

            if (res && res.length) {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].id == "5658") {
                        // vip
                        let body = res[i].body;
                        this.setState({
                            ContentData: res[i].body,
                            title: res[i].title,
                            vipRight: { VIP_special: res[i].body.VIP_special },
                            vipLevel: res[i].body["<p>	VIP 会员等级</p>"],
                        });
                    }
                    if (res[i].id == "5659") {
                        let ViPDetails = {};
                        let body = res[i].body;
                        for (let key in body) {
                            if (key === "customer_care") {
                                const newInnerHtml = body[key].replaceAll(
                                    ". ",
                                    ".</td><td>",
                                );
                                ViPDetails[key] = newInnerHtml;
                            } else ViPDetails[key] = body[key];
                        }
                        this.setState({
                            ViPDetails,
                        });
                    }
                }
            }
        });
    };

    /**
     * @description: 切换TAB
     * @param {*} key
     * @return {*}
     */
    onClickTabs = (key) => {
        if (key == 1) {
            this.setState(
                {
                    TypeID: 5658,
                },
                () => {
                    this.DiamondClubDetail();
                },
            );
        } else {
            this.setState(
                {
                    TypeID: 5659,
                },
                () => {
                    this.DiamondClubDetail();
                    this.GetVipFaqList();
                },
            );
        }
    };

    splitSectionContent = (html) => {
        const startIndex = html.indexOf("<caption>");
        const endIndex = html.indexOf("</caption>") + "</caption>".length;
        const header = html
            .slice(startIndex, endIndex)
            .replaceAll("caption", "h3");

        const rule = html.slice(0, startIndex) + html.slice(endIndex);
        return { header, rule };
    };
    render() {
        const {
            ContentData,
            vipRight,
            vip_highRollerBanner,
            vip_normalBanner,
            vipLevel,
            VipFaqList,
            ViPDetails,
            vip_detailBanner,
        } = this.state;

        const vipLevelDetail = {
            normalMemberLevel: [
                {
                    name: "silver",
                    imageURL: `/vn/img/diamondClub/silver.${isWebPSupported() ? "webp" : "png"}`,
                },
                {
                    name: "gold",
                    imageURL: `/vn/img/diamondClub/gold.${isWebPSupported() ? "webp" : "png"}`,
                },
                {
                    name: "platinum",
                    imageURL: `/vn/img/diamondClub/platinum.${isWebPSupported() ? "webp" : "png"}`,
                },
            ],
            vipMemberLevel: [
                {
                    name: "silver",
                    imageURL: `/vn/img/diamondClub/silver_diamond.${isWebPSupported() ? "webp" : "png"}`,
                },
                {
                    name: "gold",
                    imageURL: `/vn/img/diamondClub/gold_diamond.${isWebPSupported() ? "webp" : "png"}`,
                },
                {
                    name: "platinum",
                    imageURL: `/vn/img/diamondClub/star_diamond.${isWebPSupported() ? "webp" : "png"}`,
                },
            ],
        };
        const vipRightColumn = [
            {
                title: "",
                dataIndex: "rowHeader",
                key: "rowHeader",
            },
            {
                title: translate("银钻会员"),
                dataIndex: "silverMember",
                key: "silverMember",
            },
            {
                title: translate("黄钻会员"),
                dataIndex: "goldMember",
                key: "goldMember",
            },
            {
                title: translate("星钻会员"),
                dataIndex: "starMember",
                key: "starMember",
            },
        ];

        const vipRightData = [
            {
                key: "1",
                rowHeader: <p>{translate("贵宾客户服务")}</p>,
                silverMember: (
                    <img
                        src={`${process.env.BASE_PATH}/img/diamondClub/icon-check-sign.svg`}
                    />
                ),
                goldMember: (
                    <img
                        src={`${process.env.BASE_PATH}/img/diamondClub/icon-check-sign.svg`}
                    />
                ),
                starMember: (
                    <img
                        src={`${process.env.BASE_PATH}/img/diamondClub/icon-check-sign.svg`}
                    />
                ),
            },
            {
                key: "2",
                rowHeader: <p>{translate("独家客户服务")}</p>,
                silverMember: (
                    <img
                        src={`${process.env.BASE_PATH}/img/diamondClub/icon-check-sign.svg`}
                    />
                ),
                goldMember: (
                    <img
                        src={`${process.env.BASE_PATH}/img/diamondClub/icon-check-sign.svg`}
                    />
                ),
                starMember: (
                    <img
                        src={`${process.env.BASE_PATH}/img/diamondClub/icon-check-sign.svg`}
                    />
                ),
            },
            {
                key: "3",
                rowHeader: <p>{translate("欢迎礼金")}</p>,
                silverMember: <p>2,888,000 VND</p>,
                goldMember: <p>8,888,000 VND</p>,
                starMember: <p>15,888,000 VND</p>,
            },
            {
                key: "4",
                rowHeader: <p>{translate("节日礼物")}</p>,
                silverMember: (
                    <img
                        src={`${process.env.BASE_PATH}/img/diamondClub/icon-check-sign.svg`}
                    />
                ),
                goldMember: (
                    <img
                        src={`${process.env.BASE_PATH}/img/diamondClub/icon-check-sign.svg`}
                    />
                ),
                starMember: (
                    <img
                        src={`${process.env.BASE_PATH}/img/diamondClub/icon-check-sign.svg`}
                    />
                ),
            },
            {
                key: "5",
                rowHeader: <p>{translate("生日礼物")}</p>,
                silverMember: <p>1,888,000 VND</p>,
                goldMember: <p>5,888,000 VND</p>,
                starMember: <p>12,888,000 VND</p>,
            },
        ];

        const scoreColumn = [
            {
                title: "",
                dataIndex: "rowHeader",
                key: "rowHeader",
                render: (text) => <p>{text}</p>,
            },
            {
                title: translate("金额"),
                dataIndex: "amount",
                key: "amount",
            },
            {
                title: translate("乐币积分​"),
                dataIndex: "score",
                key: "score",
            },
        ];

        const scoreDateLeft = [
            {
                key: "1",
                rowHeader: <p>{translate("白银")}</p>,
                amount: <p>600,000</p>,
                score: <p>1</p>,
            },
            {
                key: "2",
                rowHeader: <p>{translate("黄金")}</p>,
                amount: <p>600,000</p>,
                score: <p>1.2</p>,
            },
            {
                key: "3",
                rowHeader: <p>{translate("铂金")}</p>,
                amount: <p>600,000</p>,
                score: <p>1.5</p>,
            },
            {
                key: "4",
                rowHeader: (
                    <p>
                        {translate("贵宾VIP")}
                        <br />
                        <span>{translate("(银钻/金钻/星钻)")}</span>
                    </p>
                ),
                amount: <p>600,000</p>,
                score: <p>2</p>,
            },
        ];

        const scoreDateRight = [
            {
                key: "1",
                rowHeader: <p>{translate("白银")}</p>,
                amount: <p>1,500,000</p>,
                score: <p>1</p>,
            },
            {
                key: "2",
                rowHeader: <p>{translate("黄金")}</p>,
                amount: <p>1,500,000</p>,
                score: <p>1.2</p>,
            },
            {
                key: "3",
                rowHeader: <p>{translate("铂金")}</p>,
                amount: <p>1,500,000</p>,
                score: <p>1.5</p>,
            },
            {
                key: "4",
                rowHeader: (
                    <p>
                        {translate("贵宾VIP")}
                        <br />
                        <span>{translate("(银钻/金钻/星钻)")}</span>
                    </p>
                ),
                amount: <p>1,500,000</p>,
                score: <p>2</p>,
            },
        ];

        const scoreDateSlot = [
            {
                key: "1",
                rowHeader: <p>{translate("白银")}</p>,
                amount: <p>750,000</p>,
                score: <p>1</p>,
            },
            {
                key: "2",
                rowHeader: <p>{translate("黄金")}</p>,
                amount: <p>750,000</p>,
                score: <p>1.2</p>,
            },
            {
                key: "3",
                rowHeader: <p>{translate("铂金")}</p>,
                amount: <p>750,000</p>,
                score: <p>1.5</p>,
            },
            {
                key: "4",
                rowHeader: (
                    <p>
                        {translate("贵宾VIP")}
                        <br />
                        <span>{translate("(银钻/金钻/星钻)")}</span>
                    </p>
                ),
                amount: <p>750,000</p>,
                score: <p>2</p>,
            },
        ];

        const faqListHardcode = [
            {
                id: "f1",
                title: translate("我如何获得FUN88的奖励积分？"),
                body: `<p>${translate("您在 FUN88 进行的每一次有效投注都将为您赚取积分。 您下注越多，您的分数就越大。 符合条件的投注根据 FUN88 一般条款和条件进行结算")}</p>`,
            },
            {
                id: "f2",
                title: translate("如果我无法维持每个级别所需的积分会怎样？"),
                body: `<p>${translate("如果您在每个级别规定的时间后没有保持所需的积分，您的级别将被降一级。 除非你保持每个等级所需的积分，否则你的等级将会恢复到正常等级。")}</p>`,
            },
            {
                id: "f3",
                title: translate("我可以获得什么奖励积分？"),
                body: `<p>${translate("您可以使用奖励积分在 Fun88 兑换礼物。")}</p>`,
            },
            {
                id: "f4",
                title: translate("我需要保持更高级别的目的地吗？"),
                body: `<p>${translate("除起始级别外，每个级别都有自己的分数要求，您需要保持指定的时间才能保持该级别。")}</p>`,
            },
            {
                id: "f5",
                title: translate("如何成为钻石/黄钻/星钻会员？"),
                body: `<p>${translate("钻石/黄钻/星钻级别仅适用于受邀请的合格会员。")}</p>`,
            },
            {
                id: "f6",
                title: translate("我仍然没有收到我要求的奖励，我该怎么办？"),
                body: `<p>${translate("您可以发送电子邮件至 cs.viet@fun88.com 查看您的奖品状态，您将收到奖品通知。")}</p>`,
            },
            {
                id: "f7",
                title: translate("如何获得更好的奖励？"),
                body: `<p>${translate("我们的奖励系统分为6个级别：银级、金级、白金级、钻石级、黄钻级和星钻级，其中银级是起始级别，星钻级是最高级别。 你的等级越高，你的奖励就越好。")}</p>`,
            },
        ];

        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                status={6}
                seoData={this.props.seoData}
            >
                <div
                    id="DiamondClub"
                    className="common-distance-wrap promotions-content"
                >
                    <div className="common-distance diamond-club-tob-tab">
                        <Tabs
                            defaultActiveKey={1}
                            className="border-tabs"
                            onChange={(v) => {}}
                        >
                            <TabPane
                                tab={<div>{translate("会员等级")}</div>}
                                key="1"
                            >
                                {/* 一般會員等級介紹 */}
                                <div
                                    id={`tlc-vip`}
                                    className="tlc-about ViPLevel"
                                >
                                    <div className="normal-member-box">
                                        <h3>{translate("普通会员级别")}</h3>
                                        <CarouselItem
                                            data={
                                                vipLevelDetail.normalMemberLevel
                                            }
                                        />
                                        <ol className="general-ordered-list">
                                            <li>
                                                {translate(
                                                    "从2018年1月11日起生效。",
                                                )}
                                            </li>
                                            <li>
                                                {translate(
                                                    "仅以流水额作为兑换积分的有效标准（促销奖金和开卡奖金不计算在内）。",
                                                )}
                                            </li>
                                        </ol>
                                    </div>
                                    <div className="vip-member-box">
                                        <h3>{translate("VIP特别优惠")}</h3>
                                        <CarouselItem
                                            data={vipLevelDetail.vipMemberLevel}
                                        />
                                    </div>

                                    <h3>{translate("VIP特别优惠")}</h3>
                                    <Table
                                        className="general-table vip-right-table"
                                        style={{ width: "60%" }}
                                        columns={vipRightColumn}
                                        dataSource={vipRightData}
                                        pagination={{
                                            style: { display: "none" },
                                        }}
                                    />
                                    <ol className="general-ordered-list vip-right-condition">
                                        <li>
                                            {translate(
                                                "VIP会员享受卓越的客户服务。",
                                            )}
                                        </li>
                                        <li>
                                            {translate(
                                                "VIP会员优先参与Fun88专属活动。",
                                            )}
                                        </li>
                                        <li>
                                            {translate(
                                                "除了普通会员福利外，VIP会员还可以获得更高的奖金和专属奖金选项。",
                                            )}
                                        </li>
                                        <li>
                                            {translate(
                                                "Fun88保留对本活动的修改、补充和解释权，以及更改本活动的权利，恕不另行通知。",
                                            )}
                                        </li>
                                    </ol>

                                    {/* 從API拿取資料所用格式(現改為Hardcode)、暫時先保留以免改回/}
                                        {/* <div className="normal-member-box">
                                            {ContentData.member_benefit && (
                                            <>
                                                <div
                                                className="HeaderCarousel Bannertitle"
                                                dangerouslySetInnerHTML={{
                                                    __html: this.splitSectionContent(
                                                    ContentData.member_benefit
                                                    ).header,
                                                }}
                                                />

                                                <CarouselItem data={vip_normalBanner} />
                                                <div
                                                className="rule"
                                                dangerouslySetInnerHTML={{
                                                    __html: this.splitSectionContent(
                                                    ContentData.member_benefit
                                                    ).rule,
                                                }}
                                                />
                                            </>
                                            )}
                                        </div> */}
                                    {/* <div className="vip-member-box">
                                            {vipLevel && (
                                            <>
                                                <div
                                                className="HeaderCarousel Bannertitle"
                                                dangerouslySetInnerHTML={{
                                                    __html: this.splitSectionContent(vipLevel).header,
                                                }}
                                                />
                                                <CarouselItem data={vip_highRollerBanner} />
                                            </>
                                            )}
                                        </div> */}
                                    {/* <div className="content AboutItem">
                                            <AboutItem ContentData={vipRight} />
                                        </div> */}
                                </div>
                            </TabPane>
                            <TabPane
                                tab={<div>{translate("详情")}</div>}
                                key="2"
                            >
                                <React.Fragment>
                                    <div className="TopBanner">
                                        <img
                                            src={`${process.env.BASE_PATH}/img/diamondClub/bannerDetail.${isWebPSupported() ? "webp" : "png"}`}
                                            // src={vip_detailBanner && vip_detailBanner[0].cmsImageUrl}
                                        />
                                    </div>
                                    <div
                                        id="vip-detail-container"
                                        className="vip-detail-container"
                                    >
                                        <div className="score-box">
                                            <div>
                                                <h3>
                                                    {translate(
                                                        "乐币积分表(体育/IM体育/彩票)",
                                                    )}
                                                </h3>
                                                <Table
                                                    className="general-table vip-score-table"
                                                    columns={scoreColumn}
                                                    dataSource={scoreDateLeft}
                                                    pagination={{
                                                        style: {
                                                            display: "none",
                                                        },
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h3>
                                                    {translate(
                                                        "乐币积分表:(真人娱乐、捕鱼游戏)",
                                                    )}
                                                </h3>
                                                <Table
                                                    className="general-table vip-score-table"
                                                    columns={scoreColumn}
                                                    dataSource={scoreDateRight}
                                                    pagination={{
                                                        style: {
                                                            display: "none",
                                                        },
                                                    }}
                                                />
                                            </div>
                                            {/* <div
                                                    className="score-table"
                                                    dangerouslySetInnerHTML={{
                                                    __html: ViPDetails.contact_us,
                                                    }}
                                                />
                                                <div
                                                    className="score-table"
                                                    dangerouslySetInnerHTML={{
                                                    __html: ViPDetails.e_mail,
                                                    }}
                                                /> */}
                                        </div>
                                        <div className="score-box slotAtCenter">
                                            <div>
                                                <h3>
                                                    {translate(
                                                        "乐币积分表(电玩)",
                                                    )}
                                                </h3>
                                                <Table
                                                    className="general-table vip-score-table"
                                                    columns={scoreColumn}
                                                    dataSource={scoreDateSlot}
                                                    pagination={{
                                                        style: {
                                                            display: "none",
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="faq-box">
                                            <h3 className="FaqTitle">
                                                常见问题
                                            </h3>
                                            <Collapse
                                                accordion={false}
                                                destroyInactivePanel
                                                expandIcon={expandIcon}
                                            >
                                                {faqListHardcode.map(
                                                    (item, index) => {
                                                        return (
                                                            <Panel
                                                                header={
                                                                    item.title
                                                                }
                                                                key={
                                                                    index +
                                                                    "list"
                                                                }
                                                                showArrow={true}
                                                            >
                                                                <div
                                                                    className="FaqContent"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: item.body,
                                                                    }}
                                                                />
                                                            </Panel>
                                                        );
                                                    },
                                                )}
                                            </Collapse>
                                        </div>
                                        {/* <div
                                                className="rule-box"
                                                dangerouslySetInnerHTML={{
                                                    __html: ViPDetails.customer_care,
                                                }}
                                                /> */}
                                        <div className="rule-box">
                                            <h3>{translate("规则与条款")}</h3>
                                            <ol className="general-ordered-list rule-list">
                                                <li>
                                                    {translate(
                                                        "要参与Fun88奖励计划，您需要了解以下条款和条件",
                                                    )}
                                                </li>
                                                <li>
                                                    {translate(
                                                        "Fun88保留随时终止和修改Fun88奖励计划会员资格和其他计划福利的权利，恕不另行通知。",
                                                    )}
                                                </li>
                                                <li>
                                                    {translate(
                                                        "参与Fun88奖励计划的会员必须承诺遵守该计划的条款、条件和规定。 Fun88 保留随时更改、添加或删除程序任何部分的权利，恕不另行通知。 但Fun88会在适当的情况下尽力告知具体原因。 所有会员和参与者应定期参阅条款和条件以了解变更。 玩家有责任及时了解有关条款和条件变更的最新信息。",
                                                    )}
                                                </li>
                                                <li>
                                                    {translate(
                                                        "Fun88保留出于自身目的检查交易记录和记录的权利。 经审核，如发现玩家有欺诈行为，Fun88将取消其奖励计划会员资格。",
                                                    )}
                                                </li>
                                                <li>
                                                    {translate(
                                                        "当所请求的奖励缺货或不再生产时，Fun88 保留以同等货币价值的其他奖励替换任何所请求的奖励的权利。",
                                                    )}
                                                </li>
                                                <li>
                                                    {translate(
                                                        "奖励页面中，只有实名账户（账户名与银行账户名一致）才视为有效。 只有实名账户才能在该账户下进行游戏/投注。",
                                                    )}
                                                </li>
                                                <li>
                                                    {translate(
                                                        "Fun88努力在其能力范围内提供最佳奖励，但受第三方提供商的能力和限制的约束。",
                                                    )}
                                                </li>
                                                <li>
                                                    {translate(
                                                        "对于信息缺失或无地址信息的客人，将拒绝兑换礼品并退回积分。 Fun88将通过Fun88主页通知栏告知取消兑换的原因。",
                                                    )}
                                                    <br />
                                                    {translate(
                                                        "只有受邀会员才有资格成为钻石会员。 所有钻石级别的请求、招揽和入场均无效。",
                                                    )}
                                                </li>
                                                <li>
                                                    {translate(
                                                        "Fun88保留对奖励计划规则的最终解释权。",
                                                    )}
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </React.Fragment>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </Layout>
        );
    }
}

//列表
class AboutItem extends React.Component {
    state = { count: 0 };
    render() {
        return (
            <React.Fragment>
                {Object.keys(this.props.ContentData).map((item2, i2) => {
                    return (
                        <div
                            key={i2}
                            className={`tlc${item2}`}
                            id={`tlc${item2}`}
                            dangerouslySetInnerHTML={{
                                __html: this.props.ContentData[item2],
                            }}
                        />
                    );
                })}
            </React.Fragment>
        );
    }
}

//幻灯片
class CarouselItem extends React.Component {
    render() {
        return (
            <Swiper
                spaceBetween={28}
                slidesPerView="3"
                className="diamond-slider"
                watchSlidesProgress={true}
            >
                {this.props.data &&
                    this.props.data.length != 0 &&
                    this.props.data.map((item, index) => {
                        return (
                            <SwiperSlide key={index + "list"}>
                                <img
                                    src={item.imageURL}
                                    alt="Fun88"
                                    style={{
                                        width: "315px",
                                        height: "180px",
                                        verticalAlign: "top",
                                    }}
                                />
                            </SwiperSlide>
                        );
                    })}
            </Swiper>
        );
    }
}
