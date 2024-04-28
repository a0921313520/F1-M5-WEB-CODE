import React, { Component } from "react";
import Router from "next/router";
import Layout from "@/Layout";
import { Tabs, Row, Col, Radio, Spin, Modal } from "antd";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import moment from "moment";
import Countdown from "react-countdown";
import DetailModal from "@/Dailydeals";
import Qs from "qs";
import DateRange from "@/DateRange";
import ImageWithFallback from "@/ImageWithFallback/";
import { PromotionList } from "$ACTIONS/cmsApi";
import {isWebPSupported} from "$ACTIONS/helper"
import { translate } from "$ACTIONS/Translate";
import { getStaticPropsFromStrapiSEOSetting } from '$DATA/seo';
export async function getStaticProps() {
    return await getStaticPropsFromStrapiSEOSetting('/daily-gift'); //參數帶本頁的路徑
}
export default class Dailydeals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Loading: true,
            DailyList: [],
            historyList: [],
            dateRadio: "1", // 时间单选框值
            definedDate: {
                startDate: moment()
                    .startOf("day")
                    .format("YYYY-MM-DDTHH:mm:ss"),
                endDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
            }, // 自定义时间值
            ShowDetail: false,
            DailyListLoading: true,
            showDateRangeModal: false,
            activeKey: "1",
        };
    }

    componentDidMount() {
        if (Router.router.query.id) {
            Router.push("/daily-gift/");
        }

        this.getDailydealsList(true);
        // this.getDailydealsHistory(true);
    }
    componentWillUnmount() {
        this.setState = ()=>false;
    }
    //获取每日优惠
    getDailydealsList = (isLoad) => {
        this.setState({
            DailyListLoading: true,
        });
        let params = {
            type: "daily",
        };
        PromotionList(params).then((res) => {
            if (res) {
                this.setState({
                    DailyList: res,
                    Loading: false,
                });
                if (isLoad) {
                    this.setState({
                        DailyListLoading: false,
                    });
                }
            }
        });
    };

    getDailydealsHistory = (isLoad) => {
        this.setState({
            Loading: true,
        });

        get(
            ApiPort.DailyDealsHistories +
                "&" +
                Qs.stringify(this.state.definedDate)
        )
            .then((res) => {
                if (res.isSuccess && res.result) {
                    this.setState({
                        historyList: res.result,
                        Loading: false,
                    });
                }
                if (isLoad) {
                    this.setState({
                        Loading: false,
                    });
                }
            })
            .catch((error) => {
                console.log("GetDailydealsHistory error: ", error);
                this.setState({
                    Loading: false,
                });
            });
    };

    changeRadio = (e) => {
        if (e.target.value == 1) {
            this.setState(
                {
                    dateRadio: e.target.value,
                    definedDate: {
                        startDate: moment()
                            .startOf("day")
                            .format("YYYY-MM-DDTHH:mm:ss"),
                        endDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
                    },
                },
                () => {
                    this.getDailydealsHistory();
                }
            );
        } else if (e.target.value == 0) {
            this.setState({
                showDateRangeModal: true,
            });
        } else {
            this.setState(
                {
                    dateRadio: e.target.value,
                    definedDate: {
                        startDate: moment()
                            .day(
                                moment().day() - (parseInt(e.target.value) - 1)
                            )
                            .utcOffset(8)
                            .format("YYYY-MM-DDTHH:mm:ss"),
                        endDate: moment()
                            .utcOffset(8)
                            .format("YYYY-MM-DDTHH:mm:ss"),
                    },
                },
                () => {
                    this.getDailydealsHistory();
                }
            );
        }
    };

    closeModal = (state) => {
        this.setState({
            ShowDetail: false,
        });
    };

    render() {
        const { TabPane } = Tabs;
        const {
            DailyList,
            historyList,
            ShowDetail,
            BonusData,
            Loading,
            DailyListLoading,
            activeKey,
        } = this.state;
        const renderer = ({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
                return <span>0 {translate("时")} 0 {translate("分")}</span>;
            } else {
                return (
                    <span>
                        {days} {translate("天")} {hours} {translate("时")} {minutes} {translate("分")}
                    </span>
                );
            }
        };

        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                status={1}
                setUserCenterMemberInfo={(v, setMemberInfo, getBalance) => {
                    this.setState({
                        defaultDisabledUserName: true,
                        username: v.UserName,
                    });
                }}
                seoData={this.props.seoData}
            >
                <div className="dailydeals-wrap">
                    <Spin
                        className={`user-center-loading ${
                            this.state.Loading ? "show" : "hide"
                        }`}
                        size="large"
                        tip={translate("加载中")}
                        style={{ zIndex: "9999999999" }}
                    />
                    <div className="daily-content">
                        <div className="daily-gift-banner-container">
                            <img
                                src={`${process.env.BASE_PATH}/img/dailygift/featureBanner.${isWebPSupported() ? "webp" : "jpg"}`}
                                alt={"featureBannerAlt"}
                            />
                        </div>
                        <div style={{ textAlign: "left" }}>
                            <Tabs
                                tabBarStyle={{
                                    borderBottom: "2px solid #E0E0E0",
                                    marginBottom: "40px",
                                }}
                                onChange={(e) => {
                                    if (!localStorage.getItem("access_token")) {
                                        this.setState({
                                            activeKey: "1",
                                        });
                                        global.goUserSign("1");

                                        return;
                                    }
                                    if (e == 2) {
                                        this.setState({
                                            activeKey: "2",
                                        });
                                        this.getDailydealsHistory();
                                    } else {
                                        this.setState({
                                            activeKey: "1",
                                        });
                                    }
                                }}
                                activeKey={activeKey}
                            >
                                <TabPane tab={translate("每日优惠")} key="1">
                                    <Row gutter={16}>
                                        {DailyList &&
                                            DailyList.map((item, i) => {
                                                return (
                                                    <Col span={8} key={i}>
                                                        <div
                                                            className="daily-deals-list"
                                                            style={{
                                                                marginBottom:
                                                                    "35px",
                                                            }}
                                                        >
                                                            <div
                                                                className="daily-deals-list-img"
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            ShowDetail: true,
                                                                            BonusData:
                                                                                item,
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                <ImageWithFallback
                                                                    src={
                                                                        item.promoImage
                                                                    }
                                                                    width={354}
                                                                    height={166}
                                                                    alt={
                                                                        item.promoTitle
                                                                    }
                                                                    fallbackSrc="/vn/img/logo/logo.svg"
                                                                />
                                                                <div className="daily-deals-item">
                                                                    <div className="daily-deals-item-left">
                                                                        <div className="daily-deals-item-left-title">
                                                                            <h5>
                                                                                {
                                                                                    item.promoTitle
                                                                                }
                                                                            </h5>
                                                                        </div>

                                                                        <div className="daily-deals-item-left-info">
                                                                            <div className="daily-deals-item-left-icon">
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="1.5"
                                                                                    stroke="currentColor"
                                                                                    className="w-6 h-6"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                    />
                                                                                </svg>
                                                                            </div>

                                                                            <div className="daily-deals-item-left-text">
                                                                                <Countdown
                                                                                    daysInHours={
                                                                                        true
                                                                                    }
                                                                                    date={
                                                                                        new Date(
                                                                                            item.endDate
                                                                                        )
                                                                                    }
                                                                                    renderer={
                                                                                        renderer
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {item.bonusData ? (
                                                                        <div className="daily-deals-item-btn">
                                                                            {item.bonusData.maxApplications == item.bonusData.currentApplications ? (
                                                                                <button>
                                                                                    {translate("缺货")}
                                                                                </button>
                                                                            ) : (
                                                                                <button>
                                                                                    {translate("剩余")}
                                                                                    {item.bonusData.maxApplications - item.bonusData.currentApplications}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="daily-deals-item-btn">
                                                                            <button>
                                                                                {translate("没有数据")}
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                );
                                            })}
                                        {DailyListLoading && (
                                            <SkeletonTheme
                                                baseColor="#dbdbdb"
                                                highlightColor="#ffffff"
                                            >
                                                <Skeleton
                                                    count={1}
                                                    height="140px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="50px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="140px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="50px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="140px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="50px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="140px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="50px"
                                                />
                                            </SkeletonTheme>
                                        )}
                                    </Row>
                                </TabPane>
                                <TabPane tab={translate("奖励历史记录")} key="2">
                                    <div className="message-button dailyGiftHistoryBtn">
                                        <Radio.Group
                                            buttonStyle="solid"
                                            className="black-radio"
                                            value={this.state.dateRadio}
                                            onChange={this.changeRadio}
                                        >
                                            <Radio.Button value="1">
                                                {translate("今天")}
                                            </Radio.Button>
                                            <Radio.Button value="7">
                                                {translate("7天内")}
                                            </Radio.Button>
                                            <Radio.Button value="30">
                                                {translate("30天内")}
                                            </Radio.Button>
                                            <Radio.Button
                                                value="0"
                                                onClick={() => {
                                                    if (
                                                        this.state.dateRadio ===
                                                        "0"
                                                    )
                                                        this.setState({
                                                            showDateRangeModal: true,
                                                        });
                                                }}
                                            >
                                                {translate("自定义")}
                                            </Radio.Button>
                                        </Radio.Group>
                                    </div>
                                    <div className="history-list-wrap has-detail">
                                        <Row style={{ fontSize: "16px" }}>
                                            <Col span={4}>{translate("交易日期")}</Col>
                                            <Col span={4}>{translate("产品")}</Col>
                                            <Col span={4}>{translate("参考编号(大写)")}</Col>
                                            <Col span={4}>{translate("状态")}</Col>
                                            <Col span={4}>{translate("优惠")}</Col>
                                            <Col span={4}>{translate("备注")}</Col>
                                        </Row>

                                        {historyList &&
                                            historyList.map((item, i) => {
                                                return (
                                                    <Row
                                                        style={{
                                                            fontSize: "14px",
                                                        }}
                                                        key={i}
                                                    >
                                                        <React.Fragment>
                                                            <Col span={4}>
                                                                {moment(
                                                                    new Date(
                                                                        item.createdDate
                                                                    )
                                                                ).format(
                                                                    "DD-MM-YYYY"
                                                                )}
                                                            </Col>
                                                            <Col span={4}>
                                                                {item.bonusName}
                                                            </Col>
                                                            <Col span={4}>
                                                                {
                                                                    item.referenceOutId
                                                                }
                                                            </Col>
                                                            <Col span={4}>
                                                                {
                                                                    item.bonusStatus
                                                                }
                                                            </Col>
                                                            <Col span={4}>
                                                                {
                                                                    item.bonusGivenType
                                                                }
                                                            </Col>
                                                            {item[
                                                                "bonusDailyDealsDetail.remarks"
                                                            ] ? (
                                                                <Col
                                                                    span={4}
                                                                    style={{
                                                                        color: "#00A6FF",
                                                                    }}
                                                                >
                                                                    {translate("查看更多")}
                                                                </Col>
                                                            ) : (
                                                                "--"
                                                            )}
                                                        </React.Fragment>
                                                    </Row>
                                                );
                                            })}

                                        {Loading && (
                                            <SkeletonTheme
                                                baseColor="#dbdbdb"
                                                highlightColor="#ffffff"
                                            >
                                                <Skeleton
                                                    count={1}
                                                    height="140px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="140px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="140px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="140px"
                                                />
                                                <Skeleton
                                                    count={1}
                                                    height="140px"
                                                />
                                            </SkeletonTheme>
                                        )}

                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
                {/*-------------------- 打开优惠详情 --------------------*/}
                {ShowDetail && (
                    <div className="PromoDetail">
                        <DetailModal
                            BonusData={BonusData}
                            ShowDetail={ShowDetail}
                            CloseDetail={() => {
                                this.setState({
                                    ShowDetail: false,
                                });
                            }}
                        />
                    </div>
                )}
                <DateRange
                    classNameDatePicker="rebate-time-picker-container"
                    classNameModal="rebate-time-picker-modal promotion-modal"
                    visible={this.state.showDateRangeModal}
                    forDailyGiftHistory={true}
                    dateRangeLimit={30}
                    closeRange={() => {
                        this.setState({ showDateRangeModal: false });
                    }}
                    setDate={(v) => {
                        console.log("setDate v: ", v);
                        this.setState(
                            {
                                definedDate: {
                                    startDate: v.startTime,
                                    endDate: v.endTime,
                                },
                                showDateRangeModal: false,
                                dateRadio: "0",
                            },
                            () => {
                                this.getDailydealsHistory();
                            }
                        );
                    }}
                />
            </Layout>
        );
    }
}
