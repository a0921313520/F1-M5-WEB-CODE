import React from "react";
import {
    Row,
    Col,
    Modal,
    Radio,
    Select,
    Pagination,
    Button,
    Icon,
    Popover,
    Empty,
    message,
} from "antd";
// import { formatAmount } from "$ACTIONS/util";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import TITLEX from "$DATA/platform.chinese.code.static";
import DateRange from "@/DateRange";
import moment from "moment";
import { Decimal } from "decimal.js";
import { translate } from "$ACTIONS/Translate";
const { Option } = Select;

class BetRecords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetail: false,
            accountValue: "",
            fromWalletList: [],
            recordsData: [], // 最外层需要显示的统计分类
            recordsDetailData: [], // 投注记录对应分类的详细信息
            visibleDateRange: false, // 自定义时间范围
            definedDate: {
                startTime: moment().format("YYYY-MM-DD"),
                endTime: moment().format("YYYY-MM-DD"),
            }, // 自定义时间值
            dateRadio: "1", // 时间单选框值
            bonusTypeString: "", // 投注详情标题
            // totalTurnover: 0, // 总投注金额
            // totalRowCount: 0, // 数据总页数
            isShowPopover: false, // 是否显示投注记录提示弹窗
            isShowPopoverMask: false,
        };

        this.showDetail = this.showDetail.bind(this); // 呼出当前分类投注详情
        this.changePage = this.changePage.bind(this); // 改变当前投注详情的分页
        this.changeRadio = this.changeRadio.bind(this); // 改变单选框
        this.handleChange = this.handleChange.bind(this); // 改变目标账户获取记录
        this.getRecordslist = this.getRecordslist.bind(this); // 获取投注记录

        this.onePageSize = 6; // 单页数据长度
        this.localCurrentBetDetail = []; // 当前显示的投注详情的总数居
        this.isFinishFrontData = []; // 是否已获取完成当前Page所需前置数据
    }
    componentDidMount() {
        this.props.setLoading(true);

        const newLen = this.isFinishFrontData.push(0);
        get(ApiPort.GetProductCategories)
            .then((res) => {
                this.setState({
                    fromWalletList: res.result,
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

        this.getRecordslist(true);

        !localStorage.getItem("isShowBetRecordsPopover") &&
            this.setState({ isShowPopover: true, isShowPopoverMask: true });
        global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("bet_record");
    }
    handleChange(val) {
        this.setState({ accountValue: val }, () => {
            this.getRecordslist();
        });

        switch (val) {
            case "Sportsbook":
                Pushgtagdata("Sport_sorting_betrecord");
                break;
            case "Esports":
                Pushgtagdata("Esport_sorting_betrecord");
                break;
            case "LiveDealer":
                Pushgtagdata("Live_sorting_betrecord");
                break;
            case "P2P":
                Pushgtagdata("P2P_sorting_betrecord");
                break;
            case "Slot":
                Pushgtagdata("Slot_sorting_betrecord");
                break;
            case "Keno":
                Pushgtagdata("Keno_sorting_betrecord");
                break;
            default:
                break;
        }
    }
    /**
     * @param {boolean} isLoad 是否是第一次加载
     * @param {function} call 获取成功回调函数
     */
    getRecordslist(isLoad, call) {
        this.props.setLoading(true);
        let newLen = null;
        isLoad && (newLen = this.isFinishFrontData.push(0));

        get(
            ApiPort.GETUserBetHistory +
                "&productType=" +
                this.state.accountValue +
                "&dateFrom=" +
                this.state.definedDate.startTime +
                "&dateTo=" +
                this.state.definedDate.endTime,
        )
            .then((res) => {
                if (res.isSuccess && res.result) {
                    this.setState({
                        recordsData: {
                            dailyTurnoverDetails:
                                res.result.dailyTurnoverDetails,
                            totalValidTurnover: res.result.totalValidTurnover,
                            totalBetAmount: res.result.totalBetAmount,
                            totalWinLoss: res.result.totalWinLoss,
                        },
                    });
                    typeof call === "function" && call();
                } else {
                    message.error(res.message);
                }
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
                console.log("GETUserBetHistory", error);
            });
    }
    changeRadio(e) {
        let value = e.target.value;

        switch (value) {
            case "1":
                Pushgtagdata("Today_betrecord_profilepage");
                break;
            case "7":
                Pushgtagdata("7daysrecord_betrecord_profilepage");
                break;
            case "30":
                Pushgtagdata("30daysrecord_betrecord_profilepage");
                break;
            case "0":
                Pushgtagdata("Customization_betrecord_profilepage");
                break;
            default:
                break;
        }

        if (value === "0") {
            return this.setState({
                visibleDateRange: true,
            });
        }
        this.setState(
            {
                dateRadio: value,
                definedDate: {
                    startTime: moment()
                        .day(moment().day() - (parseInt(value) - 1))
                        .format("YYYY-MM-DD"),
                    endTime: moment().format("YYYY-MM-DD"),
                },
            },
            () => {
                this.getRecordslist();
            },
        );
    }
    showDetail(type, name) {
        console.log("type =========> ", type);
        let List = this.state.recordsData.dailyTurnoverDetails.filter(
            (item) => item.providerCode == type,
        );
        let sequenceList = List.sort(function (a, b) {
            return b.dateLabel < a.dateLabel ? -1 : 1;
        });
        let startIndex = 0;
        this.setState({
            recordsDetailData: sequenceList,
            localCurrentBetDetail: sequenceList.slice(
                startIndex,
                startIndex + this.onePageSize,
            ),
            bonusTypeString: name || TITLEX[type] || type,
            showDetail: true,
        });
    }
    changePage(index) {
        const currPage = typeof index === "number" ? index - 1 : 0;
        let startIndex = currPage * this.onePageSize; // 当前起始下标
        this.setState({
            localCurrentBetDetail: this.state.recordsDetailData.slice(
                startIndex,
                startIndex + this.onePageSize,
            ),
        });
    }
    numberWithCommas = (x, precision = 2, removeZore = false) => {
        if (!x) {
            const zero = 0;
            if (removeZore) {
                return zero.toFixed(0);
            } else {
                return 0;
            }
        }

        var parts = new Decimal(x).toFixed(precision).toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const formattedNum = parts.join(".");
        if (!removeZore) {
            return formattedNum;
            //不能用這個 ios會報錯
            //return x ? new Decimal(x).toFixed(precision).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : 0;
        } else {
            return formattedNum.replace(/\.(?=0{1,2})0*$|0{1}$/g, "");
        }
    };

    render() {
        const { definedDate } = this.state;
        let hash = {};
        console.log(
            " --------------------------> 投注紀錄",
            this.state.recordsData.dailyTurnoverDetails,
        );
        return (
            <React.Fragment>
                {this.state.isShowPopoverMask ? (
                    <div
                        className="usercenter-mask transparent"
                        onClick={() => {
                            localStorage.setItem(
                                "isShowBetRecordsPopover",
                                "true",
                            );
                            this.setState({
                                isShowPopover: false,
                                isShowPopoverMask: false,
                            });
                        }}
                    />
                ) : null}
                <div className="account-wrap betrecord">
                    <h2>
                        <span>{translate("投注记录")}</span>
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
                                    className="betRecords-icon-popover"
                                    style={{ maxWidth: 400 }}
                                    onMouseEnter={() => {
                                        clearTimeout(this.timer);
                                        this.setState({ isShowPopover: true });
                                    }}
                                    onMouseLeave={() => {
                                        this.setState({ isShowPopover: false });
                                    }}
                                >
                                    {translate(
                                        "[投注总额]是指您在Fun88所有产品的投注总额。",
                                    )}
                                    <br />
                                    {translate(
                                        "[总赢/输]是您在 Fun88 上所有提供商中所产生的赢或输的总金额。",
                                    )}
                                    <br />
                                    {translate(
                                        "[总收入]为Fun88各产品类型指定的有效总收入。",
                                    )}
                                    <br />
                                    {translate(
                                        "体育、电子竞技、赌场、3D赌场和彩票产品的收入计算公式是根据投注票的实际输赢金额计算的。 此外，合格流水总额不能超过总投注额的两倍。",
                                    )}
                                    <br />
                                    {translate(
                                        "注：对于游戏和射鱼产品，总收益是根据总投注金额计算的。 取消的赛事以及任何违反投注规则或通过促销活动牟取暴利的投注将不被视为有效投注。",
                                    )}
                                    <br />
                                </div>
                            }
                            placement="bottomLeft"
                            title=""
                            overlayClassName="betRecords-popover-dark"
                            trigger="hover"
                        >
                            <span className="question-popover-tip">
                                <Icon type="info" />
                            </span>
                        </Popover>
                    </h2>
                    <div className="overview">
                        <p className="clear-margin-bottom">
                            {translate("总投注金额")}：{" "}
                            <strong>
                                {this.state.recordsData.totalBetAmount
                                    ? this.numberWithCommas(
                                          this.state.recordsData.totalBetAmount,
                                          2,
                                          true,
                                      )
                                    : "0"}
                                {" đ"}
                            </strong>
                        </p>
                        <p className="clear-margin-bottom">
                            {translate("总输/赢")}：
                            <strong
                                className={
                                    this.state.recordsData.totalWinLoss < 0
                                        ? "red-color"
                                        : this.state.recordsData
                                                .totalWinLoss === 0
                                          ? ""
                                          : "success-color"
                                }
                            >
                                {" "}
                                {this.state.recordsData.totalWinLoss
                                    ? this.state.recordsData.totalWinLoss < 0
                                        ? this.numberWithCommas(
                                              Math.abs(
                                                  this.state.recordsData
                                                      .totalWinLoss,
                                              ),
                                              2,
                                              true,
                                          )
                                        : this.numberWithCommas(
                                              this.state.recordsData
                                                  .totalWinLoss,
                                              2,
                                              true,
                                          )
                                    : " 0"}
                                {" đ"}
                            </strong>
                        </p>
                        <p>
                            {translate("总有效流水")}：{" "}
                            <strong>
                                {this.state.recordsData.totalValidTurnover
                                    ? this.numberWithCommas(
                                          this.state.recordsData
                                              .totalValidTurnover,
                                          2,
                                          true,
                                      )
                                    : "0"}
                                {" đ"}
                            </strong>
                        </p>
                    </div>
                    <div className="betRecord-message-button">
                        {this.state.fromWalletList.length ? (
                            <Select
                                dropdownClassName="small-option"
                                className="betRecords-select"
                                defaultValue={translate("全部")}
                                dropdownStyle={{ width: 110, zIndex: 1 }}
                                suffixIcon={<Icon type="caret-down" />}
                                onFocus={() => {
                                    Pushgtagdata(
                                        "Sorting_betrecord_profilepage",
                                    );
                                }}
                                onChange={this.handleChange}
                            >
                                {this.state.fromWalletList.map((value) => {
                                    return (
                                        <Option
                                            key={
                                                "preferWallet" +
                                                value.productType
                                            }
                                            value={value.productType}
                                            className="betRecords-select-option"
                                        >
                                            {value.localizedName}
                                        </Option>
                                    );
                                })}
                            </Select>
                        ) : null}
                        <Radio.Group
                            buttonStyle="solid"
                            className="betRecord-radio-group"
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
                            <Radio.Button value="0">
                                {translate("自定义")}
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                    {this.state.dateRadio === "0" ? (
                        <p className="defined-time-wrap">
                            {translate("从")}
                            {`${moment(definedDate.startTime).format("DD/MM/YYYY")}`}
                            {translate("至")}
                            {`${moment(definedDate.endTime).format("DD/MM/YYYY")}`}
                            <span
                                className="change"
                                onClick={() => {
                                    this.setState({
                                        visibleDateRange: true,
                                    });
                                }}
                            >
                                {translate("更改")}
                            </span>
                        </p>
                    ) : null}
                    {this.state.recordsData.dailyTurnoverDetails ? (
                        this.state.recordsData.dailyTurnoverDetails.length ? (
                            <Row gutter={20} className="my-bonus-list-wrap">
                                {this.state.recordsData.dailyTurnoverDetails
                                    .reduce((preVal, curVal) => {
                                        hash[
                                            curVal.providerCode +
                                                curVal.productType
                                        ]
                                            ? ""
                                            : (hash[
                                                  curVal.providerCode +
                                                      curVal.productType
                                              ] = true && preVal.push(curVal));
                                        return preVal;
                                    }, [])
                                    .map((betItem, index) => {
                                        const {
                                            providerCode,
                                            betAmount,
                                            winLoss,
                                            productType,
                                            productGroup,
                                            providerCodeLocalizedName,
                                        } = betItem;
                                        const filterData =
                                            this.state.recordsData.dailyTurnoverDetails.filter(
                                                (item) =>
                                                    item.providerCode +
                                                        item.productType ==
                                                    betItem.providerCode +
                                                        betItem.productType,
                                            );
                                        //总投注金额
                                        let TotalbetAmount = filterData.reduce(
                                            (c, R) => c + R.betAmount,
                                            0,
                                        );
                                        //总输赢金额
                                        let TotalwinLoss = filterData.reduce(
                                            (c, R) => c + R.winLoss,
                                            0,
                                        );

                                        return (
                                            <Col span={12} key={index}>
                                                <div
                                                    className="my-bonus-item"
                                                    onClick={() => {
                                                        this.showDetail(
                                                            providerCode,
                                                            providerCodeLocalizedName.replace(
                                                                "（",
                                                                "(",
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    <div className="bonus-brief">
                                                        <div className="brief-img inline-block">
                                                            <img
                                                                src={`${process.env.BASE_PATH}/img/user/${
                                                                    productType ||
                                                                    productGroup
                                                                }.png`}
                                                            />
                                                        </div>
                                                        <div className="brief-info inline-block">
                                                            <h3
                                                                style={{
                                                                    fontSize:
                                                                        "14px",
                                                                    fontFamily:
                                                                        "PingFangSC-Semibold",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {providerCodeLocalizedName.replace(
                                                                    "（",
                                                                    "(",
                                                                ) ||
                                                                    TITLEX[
                                                                        providerCode
                                                                    ] ||
                                                                    providerCode}
                                                            </h3>
                                                            <p>
                                                                {
                                                                    definedDate.startTime
                                                                }{" "}
                                                                ~{" "}
                                                                {
                                                                    definedDate.endTime
                                                                }
                                                            </p>
                                                        </div>
                                                        <Icon type="right" />
                                                    </div>
                                                    <div className="brief-detail-wrap">
                                                        <div className="brief-detail inline-block">
                                                            <p>
                                                                {translate(
                                                                    "总投注金额",
                                                                )}
                                                            </p>
                                                            <strong>
                                                                {Number(
                                                                    TotalbetAmount,
                                                                ) < 0
                                                                    ? "-"
                                                                    : ""}
                                                                &nbsp;&nbsp;
                                                                {Math.abs(
                                                                    TotalbetAmount,
                                                                )
                                                                    ? this.numberWithCommas(
                                                                          Math.abs(
                                                                              TotalbetAmount,
                                                                          ),
                                                                          2,
                                                                          true,
                                                                      )
                                                                    : "0"}
                                                                {" đ"}
                                                            </strong>
                                                        </div>
                                                        <div className="brief-detail inline-block">
                                                            <p>
                                                                {translate(
                                                                    "总输/赢",
                                                                )}
                                                            </p>
                                                            <strong
                                                                className={
                                                                    winLoss < 0
                                                                        ? "error-color"
                                                                        : "success-color"
                                                                }
                                                            >
                                                                {Number(
                                                                    TotalwinLoss,
                                                                ) < 0
                                                                    ? "-"
                                                                    : "+"}
                                                                &nbsp;&nbsp;
                                                                {Math.abs(
                                                                    TotalwinLoss,
                                                                )
                                                                    ? this.numberWithCommas(
                                                                          Math.abs(
                                                                              TotalwinLoss,
                                                                          ),
                                                                          2,
                                                                          true,
                                                                      )
                                                                    : "0"}
                                                                {" đ"}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        );
                                    })}
                            </Row>
                        ) : (
                            <Row>
                                <div className="line-distance" />
                                <Col span={24} className="center">
                                    <Empty
                                        image={"/vn/img/icon/img-no-record.svg"}
                                        className="big-empty-box"
                                        description={translate("没有数据")}
                                    />
                                </Col>
                            </Row>
                        )
                    ) : null}
                    <Modal
                        className="tlc-padding-top"
                        title={this.state.bonusTypeString}
                        visible={this.state.showDetail}
                        onCancel={() => {
                            this.setState({ showDetail: false });
                        }}
                        width={800}
                        footer={null}
                    >
                        <div className="records-list-wrap _modal">
                            <Row>
                                <Col span={6}>{translate("日期")}</Col>
                                <Col span={6}>{translate("投注金额")}</Col>
                                <Col span={6}>{translate("流水")}</Col>
                                <Col span={6}>{translate("总输/赢")}</Col>
                            </Row>
                            {this.state.localCurrentBetDetail?.length ? (
                                this.state.localCurrentBetDetail.map((item) => {
                                    return (
                                        <Row key={item.ID}>
                                            <Col span={6}>
                                                {moment(
                                                    new Date(item.dateLabel),
                                                ).format("DD/MM/YYYY")}
                                            </Col>
                                            <Col span={6}>
                                                {this.numberWithCommas(
                                                    item.betAmount,
                                                    2,
                                                    true,
                                                )}
                                                {" đ"}
                                            </Col>
                                            <Col span={6}>
                                                {this.numberWithCommas(
                                                    item.validTurnoverAmount,
                                                    2,
                                                    true,
                                                )}
                                                {" đ"}
                                            </Col>
                                            <Col
                                                span={6}
                                                className={
                                                    item.winLoss < 0
                                                        ? "error-color"
                                                        : "success-color"
                                                }
                                            >
                                                {Number(item.winLoss) < 0
                                                    ? "-"
                                                    : "+"}
                                                &nbsp;&nbsp;
                                                {Math.abs(item.winLoss)
                                                    ? this.numberWithCommas(
                                                          Math.abs(
                                                              item.winLoss,
                                                          ),
                                                          2,
                                                          true,
                                                      )
                                                    : "0"}
                                                {" đ"}
                                            </Col>
                                        </Row>
                                    );
                                })
                            ) : (
                                <Row>
                                    <Col span={24} className="center">
                                        {translate("没有数据")}
                                    </Col>
                                </Row>
                            )}
                        </div>
                        <Pagination
                            className="betrecord-pagination"
                            defaultCurrent={1}
                            defaultPageSize={this.onePageSize}
                            total={this.state.recordsDetailData.length}
                            onChange={this.changePage}
                        />
                    </Modal>
                    <DateRange
                        classNameDatePicker="recordDateRange"
                        classNameModal="rebate-time-picker-modal promotion-modal"
                        title={translate("选择时间")}
                        dateRangeLimit={6}
                        visible={this.state.visibleDateRange}
                        closeRange={() => {
                            this.setState({ visibleDateRange: false });
                        }}
                        setDate={(v) => {
                            this.setState(
                                { definedDate: v, dateRadio: "0" },
                                () => {
                                    this.getRecordslist();
                                },
                            );
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default BetRecords;
