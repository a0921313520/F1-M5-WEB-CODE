import React from "react";
import {
    Modal,
    Pagination,
    Row,
    Col,
    Radio,
    Select,
    Popover,
    Button,
    Icon,
    Empty,
    message,
} from "antd";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { formatAmount } from "$ACTIONS/util";
import DateRange from "@/DateRange";
import moment from "moment";
import TITLEX from "$DATA/platform.chinese.code.static";

const { Option } = Select;

class MyBonus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetail: false,
            accountValue: "All",
            fromWalletList: [],
            bonusData: {},
            bonusDetailData: {}, // 我的返水详情
            bonusTypeString: "", // 类型名称
            visibleDateRange: false, // 自定义时间范围
            definedDate: {
                startTime: moment()
                    .day(moment().day() - 6)
                    .format("YYYY-MM-DD"),
                endTime: moment().format("YYYY-MM-DD"),
            }, // 自定义时间值
            dateRadio: "7", // 时间单选框值
            currentPage: 1, // 当前页数
            isShowPopover: false,
            isShowPopoverMask: false,
        };

        this.showDetail = this.showDetail.bind(this); // 呼出详情
        this.handleChange = this.handleChange.bind(this); // 改变账户
        this.changeRadio = this.changeRadio.bind(this); // 改变单选框
        this.getBonuslist = this.getBonuslist.bind(this); // 获取返水列表
        this.changePage = this.changePage.bind(this); // 改变详情分页

        this.localBnousDetailData = []; // 当前查询到的返水详情数据
        this.isFinishFrontData = []; // 是否已获取完成当前Page所需前置数据
        this.onePageSize = 10; // 返水详情单页条数
    }
    componentDidMount() {
        this.props.setLoading(true);

        const newLen = this.isFinishFrontData.push(0);
        get(ApiPort.GetProductCategories)
            .then((res) => {
                this.setState({
                    fromWalletList: res,
                });
                this.isFinishFrontData.splice(newLen - 1, 1, 1);
                this.isFinishFrontData.length &&
                    !~this.isFinishFrontData.indexOf(0) &&
                    this.props.setLoading(false);
            })
            .catch((error) => {
                this.props.setLoading(false);
                console.log("GetProductCategories", error);
            });

        this.getBonuslist(true);

        !localStorage.getItem("isShowBonusPopover") &&
            this.setState({ isShowPopover: true, isShowPopoverMask: true });
    }
    /**
     * @param {boolean} isLoad 是否是第一次加载
     */
    getBonuslist(isLoad) {
        this.props.setLoading(true);
        let newLen = null;
        isLoad && (newLen = this.isFinishFrontData.push(0));

        // 我的返水会返回的类型：SB SP P2P KYG LD SLOT KENO AG
        get(
            ApiPort.GetRebateHistory +
                "?startDate=" +
                this.state.definedDate.startTime +
                "&endDate=" +
                this.state.definedDate.endTime,
        )
            .then((res) => {
                res && this.setState({ bonusData: res.result });
                console.log(res.result);
                if (isLoad) {
                    this.isFinishFrontData.splice(newLen - 1, 1, 1);
                    this.isFinishFrontData.length &&
                        !~this.isFinishFrontData.indexOf(0) &&
                        this.props.setLoading(false);
                } else {
                    this.props.setLoading(false);
                }
            })
            .catch((error) => {
                this.props.setLoading(false);
                console.log("RebateBonusHistory" + error);
            });
    }
    showDetail(value) {
        this.props.setLoading(true);
        // + "&Platform=" + this.state.accountValue
        get(
            ApiPort.GetRebateHistory +
                "?startDate=" +
                this.state.definedDate.startTime +
                "&endDate=" +
                this.state.definedDate.endTime,
        )
            .then((res) => {
                if (res) {
                    this.localBnousDetailData = res.result || [];
                    this.setState({
                        showDetail: true,
                        bonusTypeString: this.state.fromWalletList,
                        bonusDetailData: {
                            rebates: this.localBnousDetailData,
                        },
                    });
                } else {
                    message.error(
                        res.result.message ||
                            translate("系统错误，请稍后重试！"),
                    );
                }
                this.props.setLoading(false);
            })
            .catch((error) => {
                this.props.setLoading(false);
                console.log("RebateBonusDetail" + error);
            });
    }
    handleChange(val) {
        this.setState({ accountValue: val }, () => {
            this.getBonuslist();
        });

        switch (val) {
            case "Sportsbook":
                Pushgtagdata("Sport_sorting_myrebate");
                break;
            case "Esports":
                Pushgtagdata("Esport_sorting_myrebate");
                break;
            case "LiveDealer":
                Pushgtagdata("Live_sorting_myrebate");
                break;
            case "P2P":
                Pushgtagdata("P2P_sorting_myrebate");
                break;
            case "Slot":
                Pushgtagdata("Slot_sorting_myrebate");
                break;
            case "Keno":
                Pushgtagdata("Keno_sorting_myrebate");
                break;
            default:
                break;
        }
    }
    changeRadio(e) {
        switch (e.target.value) {
            case "1":
                Pushgtagdata("Today_myrebate_profilepage");
                break;
            case "7":
                Pushgtagdata("7daysrecord_myrebate_profilepage");
                break;
            case "30":
                Pushgtagdata("30daysrecord_myrebate_profilepage");
                break;
            case "0":
                Pushgtagdata("Customization_myrebate_profilepage");
                break;
            default:
                break;
        }

        if (e.target.value === "0") {
            return this.setState({
                visibleDateRange: true,
            });
        }
        this.setState(
            {
                dateRadio: e.target.value,
                definedDate: {
                    startTime: moment()
                        .day(moment().day() - (parseInt(e.target.value) - 1))
                        .format("YYYY-MM-DD"),
                    endTime: moment().format("YYYY-MM-DD"),
                },
            },
            () => {
                this.getBonuslist();
            },
        );
    }
    changePage(index) {
        const currPage = typeof index === "number" ? index - 1 : 0;
        let startIndex = currPage * this.onePageSize; // 当前起始下标
        this.setState({
            currentPage: index,
            bonusDetailData: {
                rebates: this.localBnousDetailData.slice(
                    startIndex,
                    startIndex + this.onePageSize,
                ), // 当前展示数据
            },
        });
    }
    render() {
        return (
            <React.Fragment>
                {this.state.isShowPopoverMask ? (
                    <div
                        className="usercenter-mask transparent"
                        onClick={() => {
                            localStorage.setItem("isShowBonusPopover", "true");
                            this.setState({
                                isShowPopover: false,
                                isShowPopoverMask: false,
                            });
                        }}
                    ></div>
                ) : null}
                <div className="account-wrap">
                    <h2>
                        <span>我的返水</span>
                        <Popover
                            visible={this.state.isShowPopover}
                            onMouseEnter={() => {
                                this.setState({ isShowPopover: true });
                            }}
                            onMouseLeave={() => {
                                this.timer = setTimeout(() => {
                                    this.setState({ isShowPopover: false });
                                }, 100);
                            }}
                            content={
                                <div
                                    style={{ maxWidth: 400 }}
                                    onMouseEnter={() => {
                                        clearTimeout(this.timer);
                                        this.setState({ isShowPopover: true });
                                    }}
                                    onMouseLeave={() => {
                                        this.setState({ isShowPopover: false });
                                    }}
                                >
                                    每日满足日返水最低有效流水要求，次日系统将自动依据返水比例派发相应返水。
                                    <br />
                                    [体育/电竞/真人/棋牌]
                                    游戏的有效流水均以游戏中的输赢金额来计算。
                                    <br />
                                    [电子/彩票/捕鱼]
                                    游戏以投注金额来计算有效流水
                                    (不包含未完成游戏等其他不符合的投注额)。
                                </div>
                            }
                            placement="bottomLeft"
                            title=""
                            overlayClassName="popover-dark"
                            trigger="hover"
                        >
                            <span className="question-popover-tip">
                                <Icon type="question-circle" />
                            </span>
                        </Popover>
                    </h2>
                    <div className="message-button">
                        <div className="usercenter-title-brief">
                            总得返水：
                            <strong>
                                ￥
                                {this.state.bonusData.totalRebateAmount
                                    ? this.state.bonusData.totalRebateAmount
                                    : "00.00"}
                            </strong>
                        </div>
                        {/* {this.state.fromWalletList.length ?
              <Select dropdownClassName="small-option" defaultValue="All" dropdownStyle={{ width: 110, zIndex: 1 }} onChange={this.handleChange} onFocus={() => { Pushgtagdata("Sorting_myrebate_profilepage"); }}>
                {this.state.fromWalletList.map((value) => {
                  return <Option key={"preferWallet" + value.key} value={value.key}>{value.name}</Option>;
                })}
              </Select> : null} */}
                        <Radio.Group
                            buttonStyle="solid"
                            className="gray-radio"
                            value={this.state.dateRadio}
                            onChange={this.changeRadio}
                        >
                            <Radio.Button value="1">今天</Radio.Button>
                            <Radio.Button value="7">近7天</Radio.Button>
                            <Radio.Button value="30">近30天</Radio.Button>
                            <Radio.Button value="0">自定义</Radio.Button>
                        </Radio.Group>
                    </div>
                    {this.state.dateRadio === "0" ? (
                        <p className="defined-time-wrap">
                            {this.state.definedDate.startTime} ~{" "}
                            {this.state.definedDate.endTime}&nbsp;
                            <Button
                                type="link"
                                className="inline"
                                onClick={() => {
                                    this.setState({ visibleDateRange: true });
                                }}
                            >
                                修改
                            </Button>
                        </p>
                    ) : null}
                    <Row gutter={20} className="my-bonus-list-wrap">
                        {this.state.bonusData ? (
                            this.state.bonusData.length ? (
                                this.state.bonusData.map((bonuItem, index) => {
                                    // const currentTypeInfo = this.state.fromWalletList.find(v => ~v.wallets.indexOf(bonuItem.productName));
                                    return (
                                        <Col span={12} key={index}>
                                            <div
                                                className="my-bonus-item"
                                                onClick={() => {
                                                    this.showDetail(bonuItem);
                                                }}
                                            >
                                                <div className="bonus-brief">
                                                    <div className="brief-img inline-block">
                                                        {/* <img src={`/vn/img/user/${currentTypeInfo && currentTypeInfo.key}.png`} /> */}
                                                    </div>
                                                    <div className="brief-info inline-block">
                                                        <h3>
                                                            {TITLEX[
                                                                bonuItem
                                                                    .rebateName
                                                            ] ||
                                                                bonuItem.rebateName}
                                                        </h3>
                                                        <p>
                                                            会员等级：
                                                            {
                                                                bonuItem.rebateGroupName
                                                            }
                                                        </p>
                                                    </div>
                                                    <Icon type="right" />
                                                </div>
                                                <div className="brief-detail-wrap">
                                                    <div className="brief-detail inline-block">
                                                        <p>有效流水</p>
                                                        <strong>
                                                            {formatAmount(
                                                                bonuItem.totalBetAmount,
                                                            )}
                                                        </strong>
                                                    </div>
                                                    <div className="brief-detail inline-block">
                                                        <p>所得返水</p>
                                                        <strong className="theme-color">
                                                            ￥
                                                            {formatAmount(
                                                                bonuItem.totalGivenAmount,
                                                            )}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })
                            ) : (
                                <React.Fragment>
                                    <div className="line-distance"></div>
                                    <Col span={24} className="center">
                                        <Empty
                                            image={
                                                "/vn/img/icon/img-no-record.svg"
                                            }
                                            className="big-empty-box"
                                            description="暂无返水记录"
                                        />
                                    </Col>
                                </React.Fragment>
                            )
                        ) : null}
                    </Row>
                    <Modal
                        className="tlc-padding-top"
                        title={this.state.bonusTypeString || "乐天堂"}
                        visible={this.state.showDetail}
                        onCancel={() => {
                            this.setState({ showDetail: false });
                        }}
                        width={800}
                        footer={null}
                    >
                        <div className="records-list-wrap _modal">
                            <Row>
                                <Col span={4}>有效流水</Col>
                                <Col span={5}>所得返水</Col>
                                <Col span={5}>返水比例</Col>
                                <Col span={5}>编号</Col>
                                <Col span={5}>日期</Col>
                            </Row>
                            {this.state.bonusDetailData.rebates ? (
                                this.state.bonusDetailData.rebates.length ? (
                                    this.state.bonusDetailData.rebates.map(
                                        (val, index) => {
                                            return (
                                                <Row key={index}>
                                                    <Col span={4}>
                                                        {formatAmount(
                                                            val.totalBetAmount,
                                                        )}
                                                    </Col>
                                                    <Col span={5}>
                                                        ￥
                                                        {formatAmount(
                                                            val.totalGivenAmount,
                                                        )}
                                                    </Col>
                                                    <Col span={5}>
                                                        {val.rate}
                                                    </Col>
                                                    <Col span={5}>
                                                        {val.rebateId}
                                                    </Col>
                                                    <Col span={5}>
                                                        {val.applyDate.substring(
                                                            0,
                                                            val.applyDate.indexOf(
                                                                "T",
                                                            ),
                                                        )}
                                                    </Col>
                                                </Row>
                                            );
                                        },
                                    )
                                ) : (
                                    <Row>
                                        <Col span={24}>暂无记录</Col>
                                    </Row>
                                )
                            ) : null}
                        </div>
                        <Pagination
                            current={this.state.currentPage}
                            total={
                                this.state.bonusDetailData.rebates
                                    ? this.state.bonusDetailData.rebates.length
                                    : 0
                            }
                            onChange={this.changePage}
                        />
                    </Modal>
                    <DateRange
                        visible={this.state.visibleDateRange}
                        closeRange={() => {
                            this.setState({ visibleDateRange: false });
                        }}
                        setDate={(v) => {
                            this.setState(
                                { definedDate: v, dateRadio: "0" },
                                () => {
                                    this.getBonuslist();
                                },
                            );
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default MyBonus;
