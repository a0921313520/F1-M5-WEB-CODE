import React from "react";
import Layout from "@/Layout";
import Router from "next/router";
import { Row, Col, Button, Icon, Empty, Modal, Spin, message } from "antd";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { marqueeAnimate } from "$ACTIONS/util";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import RemainderTime from "@/DoubleEleven/RemainderTime";
import RoundMain from "@/DoubleEleven/RoundMain";

export default class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDirection: false,
            showChangeRecords: false,
            activeStatus: "", // ready, start, end
            isLoadingLuckRecords: false,
            luckRecordsData: [],
            isLogin: false,
            totalAvailableDeposit: 0,
            totalSpin: 0,
            isGetPlayerLuckySpinDetailLoading: false,
            totalParticipant: 0,
            updateTime: "2021-XX-XX",
            winnerList: [],
        };

        this.marquee = React.createRef(); // 公告轮播节点
        this.prizeList = [
            {
                cnName: "塞维利亚球衣",
                id: 1,
                type: "coat",
                prizeImg: "/vn/img/doubleEleven2021/icon-coat.png",
                img: "/vn/img/doubleEleven2021/prize-3.png",
            },
            {
                cnName: "华为P50Pro手机",
                id: 2,
                type: "phone",
                prizeImg: "/vn/img/doubleEleven2021/icon-phone.png",
                img: "/vn/img/doubleEleven2021/prize-4.png",
            },
            {
                cnName: "11同乐币",
                id: 3,
                type: "currency",
                prizeImg: "/vn/img/doubleEleven2021/icon-coin.png",
                img: "/vn/img/doubleEleven2021/prize.png",
            },
            {
                cnName: "1,111元免费彩金",
                id: 4,
                type: "",
                prizeImg: "/vn/img/doubleEleven2021/icon-spin.png",
                img: "/vn/img/doubleEleven2021/prize.png",
            },
            {
                cnName: "111同乐币",
                id: 5,
                type: "currency",
                prizeImg: "/vn/img/doubleEleven2021/icon-coin.png",
                img: "/vn/img/doubleEleven2021/prize.png",
            },
            {
                cnName: "111元免费彩金",
                id: 6,
                type: "",
                prizeImg: "/vn/img/doubleEleven2021/icon-spin.png",
                img: "/vn/img/doubleEleven2021/prize-2.png",
            },
            {
                cnName: "1元免费彩金",
                id: 7,
                type: "",
                prizeImg: "/vn/img/doubleEleven2021/icon-spin.png",
                img: "/vn/img/doubleEleven2021/prize-2.png",
            },
            {
                cnName: "1,111同乐币",
                id: 8,
                type: "currency",
                prizeImg: "/vn/img/doubleEleven2021/icon-coin.png",
                img: "/vn/img/doubleEleven2021/prize.png",
            },
            {
                cnName: "11元免费彩金",
                id: 9,
                type: "",
                prizeImg: "/vn/img/doubleEleven2021/icon-spin.png",
                img: "/vn/img/doubleEleven2021/prize-2.png",
            },
        ];
    }
    componentDidMount() {
        // 获取参与人数和获奖列表
        this.GetLuckySpinWinner();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.isLogin !== this.state.isLogin) {
            if (this.state.isLogin) {
                // 获取充值总额和可以旋转次数
                this.GetPlayerLuckySpinDetail();
            }
        }
        // if (prevState.activeStatus !== this.state.activeStatus && this.state.activeStatus === "end") {
        //     Modal.info({
        //         icon: "",
        //         okText: '确认',
        //         className: "midautumn-info-dialog",
        //         title: (<div style={{ textAlign: "center" }}>温馨提醒</div>),
        //         content: (
        //             <div style={{ textAlign: "center" }}>
        //                 <p>活动已截至，我们明年再见啦~</p>
        //             </div>
        //         )
        //     });
        // }
    }
    componentWillUnmount() {
        // 清除轮播定时器
        marqueeAnimate(true);
        // 清除公告设置方法（防止异步内存泄漏）
        this.updateMidautumenNoticeList = () => {};
    }
    GetPlayerLuckySpinDetail = () => {
        if (localStorage.getItem("access_token") === null) {
            global.goUserSign("1");
            return;
        }

        this.setState({ isGetPlayerLuckySpinDetailLoading: true });
        get(ApiPort.GetPlayerLuckySpinDetail + "&eventType=DoubleEleven")
            .then((res) => {
                this.setState({
                    isGetPlayerLuckySpinDetailLoading: false,
                    totalAvailableDeposit: res.totalAvailableDeposit,
                    totalSpin: res.totalSpin,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    GetLuckySpinWinner = () => {
        get(ApiPort.GetLuckySpinWinner + "&eventType=DoubleEleven")
            .then((res) => {
                if (typeof res.updateDate === "string") {
                    const DATE_TIME = res.updateDate.split("T");
                    const YEAR_MONTH_DAY =
                        DATE_TIME[0] && DATE_TIME[0].split("-");
                    this.setState({
                        totalParticipant: res.totalParticipant,
                        updateTime: `${YEAR_MONTH_DAY[0]} 年 ${YEAR_MONTH_DAY[1]} 月 ${YEAR_MONTH_DAY[2]} 日 ${DATE_TIME[1]}`,
                    });
                }
                // 设置中奖轮询并开启动画
                this.updateMidautumenNoticeList(res.winnerList || []);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // 获取兑奖记录
    getLucyRecords = () => {
        if (localStorage.getItem("access_token") === null) {
            global.goUserSign("1");
            return;
        }

        this.setState({ isLoadingLuckRecords: true, showChangeRecords: true });
        get(ApiPort.LuckySpinHistoryDouble)
            .then((res) => {
                if (res.success) {
                    this.setState({
                        luckRecordsData: res.history || [],
                        isLoadingLuckRecords: false,
                    });
                }
            })
            .catch((error) => {});
    };
    updateMidautumenNoticeList = (list) => {
        this.setState(
            {
                winnerList: list,
            },
            function () {
                list &&
                    list.length > 1 &&
                    marqueeAnimate(this.marquee.current, "top", 10);
            }
        );
    };
    render() {
        return (
            <Layout
                status={2}
                title="FUN88"
                Keywords=""
                description=""
                wrapperClassName="midautumn-bg double"
                setLoginStatus={(v) => {
                    this.setState({ isLogin: v });
                }}
                definedHeaderNode={
                    <div
                        style={{
                            position: "relative",
                            top: 0,
                            maxWidth: 1200,
                            backgroundColor: "#bf0000",
                            backgroundImage: "none",
                            borderColor: "#b00000",
                        }}
                        className="header-warp next-header-bar-wrap common-distance-wrap"
                    >
                        <div className="common-distance">
                            <Row>
                                <Col span={21}>
                                    <div
                                        style={{ width: 160, marginBottom: 10 }}
                                        className="logo-wrap"
                                        onClick={() => {
                                            Router.push("/");
                                        }}
                                    >
                                        <img
                                            src="/vn/img/doubleEleven2021/midautumn_logo.png"
                                            alt="乐天堂"
                                        />
                                    </div>
                                </Col>
                                <Col span={3} style={{ textAlign: "right" }}>
                                    {/* 在线客服 */}
                                    <div
                                        className="menu-wrapper"
                                        style={{ marginTop: 17 }}
                                    >
                                        <div
                                            className="live-server-btn"
                                            onClick={() => {
                                                global.PopUpLiveChat();
                                                Pushgtagdata("CS_homepage");
                                            }}
                                        >
                                            <div className="tlc-sprite live-service"></div>
                                            <span>在线客服</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                }
            >
                {/* 活动已截至 */}
                {this.state.activeStatus === "end" ? (
                    <div className="active-end">活 动 已 结 束</div>
                ) : null}
                {/* 倒计时 */}
                <RemainderTime
                    setActiveStatus={(v) => {
                        this.setState({ activeStatus: v });
                    }}
                />
                <div className="midautumn-container">
                    {/* 转盘 */}
                    <div className="prize-round-main-wrapper">
                        <div className="prize-round-top">
                            <div className="left">
                                <Spin
                                    spinning={
                                        this.state
                                            .isGetPlayerLuckySpinDetailLoading
                                    }
                                >
                                    <button
                                        className="autumn-round-btn deposit"
                                        data-text="今日有效充值"
                                        onClick={this.GetPlayerLuckySpinDetail}
                                    ></button>
                                    <div className="autumn-round-box deposit">
                                        {this.state.totalAvailableDeposit}
                                    </div>
                                </Spin>
                            </div>
                            <div className="right">
                                <Spin
                                    spinning={
                                        this.state
                                            .isGetPlayerLuckySpinDetailLoading
                                    }
                                >
                                    <button
                                        className="autumn-round-btn many"
                                        data-text="剩余转盘次数"
                                        onClick={this.GetPlayerLuckySpinDetail}
                                    ></button>
                                    <div className="autumn-round-box many">
                                        {this.state.totalSpin}
                                    </div>
                                </Spin>
                            </div>
                        </div>
                        <div className="prize-round-bottom">
                            <div className="left">
                                <button
                                    className={`autumn-round-btn-2 direction ${this.state.activeStatus}`}
                                    data-text="活动说明"
                                    onClick={() => {
                                        this.state.activeStatus !== "end" &&
                                            this.setState({
                                                showDirection: true,
                                            });
                                    }}
                                ></button>
                            </div>
                            <div className="right">
                                <button
                                    className="autumn-round-btn-2 records"
                                    data-text="兑奖记录"
                                    onClick={this.getLucyRecords}
                                ></button>
                            </div>
                        </div>
                        <RoundMain
                            activeStatus={this.state.activeStatus}
                            getLucyRecords={this.getLucyRecords}
                            GetPlayerLuckySpinDetail={
                                this.GetPlayerLuckySpinDetail
                            }
                            prizeList={this.prizeList}
                        />
                    </div>
                    {/* 中奖快讯 */}
                    <div className="prize-round-main-wrapper _information">
                        <div className="prize-round-top">
                            <div className="prize-information-title">
                                <img
                                    src="/vn/img/doubleEleven2021/information-title.png"
                                    alt="中奖快讯"
                                />
                            </div>
                        </div>
                        <div className="prize-round-bottom">
                            <div className="left">
                                <div className="information-box _people">
                                    <div
                                        className="information-title"
                                        data-text="参与人数"
                                    ></div>
                                    <div className="information-content">
                                        {this.state.totalParticipant}
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <div className="information-box _notification">
                                    <div
                                        className="information-title"
                                        data-text="中奖公告"
                                    ></div>
                                    <div className="information-content">
                                        <div className="marquee-container">
                                            <div
                                                className="midautumn-notice-wrap"
                                                ref={this.marquee}
                                            >
                                                <div className="midautumn-notice">
                                                    <ul>
                                                        {this.state.winnerList
                                                            .length
                                                            ? this.state.winnerList.map(
                                                                  (
                                                                      val,
                                                                      idx
                                                                  ) => (
                                                                      <li
                                                                          data-marquee-item
                                                                          key={
                                                                              idx
                                                                          }
                                                                          title={
                                                                              val
                                                                          }
                                                                      >
                                                                          <p>
                                                                              {
                                                                                  val.split(
                                                                                      "赢了"
                                                                                  )[0]
                                                                              }
                                                                          </p>
                                                                          <p>
                                                                              赢了
                                                                              {
                                                                                  val.split(
                                                                                      "赢了"
                                                                                  )[1]
                                                                              }
                                                                          </p>
                                                                      </li>
                                                                  )
                                                              )
                                                            : null}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <p className="information-update-time">更新时间：2021 年 7 月 1 日 15:20:24</p> */}
                            <p className="information-update-time">
                                更新时间：{this.state.updateTime}
                            </p>
                        </div>
                    </div>
                    {/* 如何参加 */}
                    <div className="prize-round-main-wrapper _step">
                        <div className="prize-round-top">
                            <div className="prize-information-title">
                                <img
                                    src="/vn/img/doubleEleven2021/how-added.png"
                                    alt="如何参加"
                                />
                            </div>
                        </div>
                        <div className="prize-round-bottom">
                            <div className="midautumn-step-box">
                                <img
                                    src="/vn/img/doubleEleven2021/midautumn-fun.png"
                                    alt="步骤指示图"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* 中秋节特制Footer */}
                <div className="midautumn-footer-wrapper">
                    <div className="midautumn-footer">
                        <div
                            className="midautumn-pic"
                            data-direction="游戏平台"
                        ></div>
                        <div className="tlc-copyright">
                            © 版权归同乐城 TLCBET 2010-2022 所有 违者必究
                        </div>
                    </div>
                </div>
                {/* 活动说明 */}
                <Modal
                    title="活动说明"
                    className="midautumn-direction"
                    centered={true}
                    footer={false}
                    visible={this.state.showDirection}
                    closeIcon={<Icon type="close-circle" />}
                    width={780}
                    onCancel={() => {
                        this.setState({ showDirection: false });
                    }}
                >
                    <div className="midautumn-direction-container">
                        <h3>
                            非比寻常双11x11
                            <br />
                            时来运转赢大奖
                        </h3>
                        <p>
                            <span>活动时间：</span>
                            <span>2021/11/10-2021/11/14（北京时间）</span>
                        </p>
                        <p>
                            <span>活动对象：</span>
                            <span>所有同乐城会员</span>
                        </p>
                        <p>
                            <span>活动内容：</span>
                            <span>
                                活动期间会员当日累计充值满 500元
                                或以上即可旋转轮盘。充值越高，旋转次数越多。
                            </span>
                        </p>
                        <ul className="flex-2">
                            <li>
                                <div>累计充值要求</div>
                                <div>旋转次数</div>
                            </li>
                            <li>
                                <div>500 – 2,499</div>
                                <div>1</div>
                            </li>
                            <li>
                                <div>2,500 – 4,999</div>
                                <div>2</div>
                            </li>
                            <li>
                                <div>5,000 – 7,499</div>
                                <div>3</div>
                            </li>
                            <li>
                                <div>7,500 – 9,999</div>
                                <div>4</div>
                            </li>
                            <li>
                                <div>10,000 或以上</div>
                                <div>5</div>
                            </li>
                        </ul>
                        <ul className="flex-3">
                            <li>
                                <div style={{ flex: 1, textAlign: "center" }}>
                                    活动奖励
                                </div>
                            </li>
                            <li>
                                <div className="free-money phone">
                                    <i></i>华为P50 Pro手机
                                </div>
                                <div className="free-money coat">
                                    <i></i>塞维利亚球衣
                                </div>
                            </li>
                            <li>
                                <div className="free-money">
                                    <i></i>1,111元免费彩金
                                </div>
                                <div className="free-money">
                                    <i></i>111元免费彩金
                                </div>
                                <div className="free-money">
                                    <i></i>11元免费彩金
                                </div>
                            </li>
                            <li>
                                <div className="free-money">
                                    <i></i>1元免费彩金
                                </div>
                                <div></div>
                                <div></div>
                            </li>
                            <li>
                                <div className="free-money currency">
                                    <i></i>1,111 同乐币
                                </div>
                                <div className="free-money currency">
                                    <i></i>111 同乐币
                                </div>
                                <div className="free-money currency">
                                    <i></i>11 同乐币
                                </div>
                            </li>
                        </ul>
                        <p className="currency-direction">
                            注：数量有限, 先到先得
                        </p>
                        <h4>注意事项</h4>
                        <ul className="currency-list">
                            <li>
                                会员需点击轮盘进行抽奖，旋转结束后将会显示所抽到的奖励。
                            </li>
                            <li>充值时间以到账时间为准。</li>
                            <li>
                                旋转次数将根据实际到账的存款金额为准。使用支付宝或微信转账，建议会员充值501元或以上。
                            </li>
                            <li>
                                活动奖励（免费彩金和同乐币）将在中奖后30分钟内自动派发。
                            </li>
                            <li>
                                免费彩金提现流水为3倍；同乐币有效期为派发后的30天内。
                            </li>
                            <li>
                                小同将在活动结束后7天内联系中奖实体商品的会员，会员需提供准确有效的收件信息，确认收件信息后奖品将在30个工作日内统一寄出。
                            </li>
                            <li>
                                若在7天内联系会员后无法提供收件信息或因提交的收件信息有误导致奖品无法寄出，则视为放弃奖品。
                            </li>
                            <li>
                                所有实体商品不得转换为现金、免费彩金、免费旋转、同乐币或任何其他商品。
                            </li>
                        </ul>
                        <h4>温馨提醒</h4>
                        <ul className="currency-list">
                            <li>
                                会员申请此优惠活动需同时遵守同乐城申请
                                <a
                                    onClick={() =>
                                        Router.push(
                                            "/help?type=Sub7&key=" +
                                                CMSOBJ[HostConfig.CMS_ID][25]
                                        )
                                    }
                                >
                                    规则与条款
                                </a>
                                。
                            </li>
                            <li>
                                如有任何问题，请随时咨询小同
                                <Button
                                    className="inline"
                                    type="link"
                                    onClick={global.PopUpLiveChat}
                                >
                                    在线客服
                                </Button>
                                。
                            </li>
                            <li>
                                请关注小同抖音、微博或微信公众号，更多福利与您同乐。
                            </li>
                        </ul>
                    </div>
                </Modal>
                {/* 兑换记录 */}
                <Modal
                    title="中奖记录"
                    className="midautumn-direction"
                    centered={true}
                    footer={false}
                    visible={this.state.showChangeRecords}
                    closeIcon={<Icon type="close-circle" />}
                    width={780}
                    onCancel={() => {
                        this.setState({ showChangeRecords: false });
                    }}
                >
                    <Spin
                        spinning={this.state.isLoadingLuckRecords}
                        tip="加载中，请稍后..."
                    >
                        <div className="midautumn-direction-container">
                            {this.state.luckRecordsData.length ? (
                                <ul className="flex-3 midautumn-records">
                                    <li>
                                        <div>日期时间</div>
                                        <div>奖励</div>
                                        <div>状态</div>
                                    </li>
                                    {this.state.luckRecordsData.map((v, i) => {
                                        const tempName = this.prizeList.find(
                                            (ele) => ele.cnName === v.prizesWon
                                        );
                                        if (!tempName) return;
                                        return (
                                            <li key={"luckRecordsData" + i}>
                                                <div>
                                                    {v.applyDate
                                                        ? v.applyDate.replace(
                                                              "T",
                                                              " "
                                                          )
                                                        : ""}
                                                </div>
                                                <div
                                                    className={`free-money ${tempName.type}`}
                                                >
                                                    <i></i>
                                                    {tempName.cnName}
                                                </div>
                                                <div
                                                    className={
                                                        v.prizeStatus === 2
                                                            ? "success-color"
                                                            : v.prizeStatus ===
                                                              1
                                                            ? "green-color"
                                                            : ""
                                                    }
                                                >
                                                    {v.prizeStatusText}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <Empty
                                    image={
                                        "/vn/img/doubleEleven2021/no-record.png"
                                    }
                                    className="midautumn-big-empty-box"
                                    description="暂无数据"
                                />
                            )}
                        </div>
                    </Spin>
                </Modal>
            </Layout>
        );
    }
}
