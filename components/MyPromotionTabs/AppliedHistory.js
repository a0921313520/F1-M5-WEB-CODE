import React from "react";
import {
    Button,
    Empty,
    message,
    Row,
    Col,
    Input,
    Modal,
    Pagination,
    Spin,
} from "antd";
import Router from "next/router";
import moment from "moment";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import { formatAmount, Cookie, sub } from "$ACTIONS/util";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import { LEARN_TIME } from "$ACTIONS/constantsData";
import { AppliedDataModal } from "./Modal";
import AppliedHistoryCard from "./AppliedHistoryCard";
import { connect } from "react-redux";
import { promotionActions } from "../../store/promotionSlice";
import { getAppliedHistoryAction } from "../../store/thunk/promotionThunk";
import { translate } from "$ACTIONS/Translate";

class MyPromotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PromotionList: [], // 我的优惠列表
            OptionStatus: [], // 筛选状态类别
            processCount: 0, // 进行中的优惠
            isShowLearnMask: false, // 是否显示教程
            isShowPopover: false,
            isShowPopoverMask: false,
            selectedValidPopoverIndex: null, // 選擇Popover之valid Promotion index
            selectedInvalidPopoverIndex: null, // 選擇Popover之ivvalid Promotion index
            appliedHistoryList: JSON.parse(
                localStorage.getItem("appliedHistoryList"),
            ),

            // news

            BonusAppliedList: [], //全部已申請Promotions

            startDate: moment(new Date())
                .subtract(90, "d")
                .startOf("day")
                .utcOffset(8)
                .format("YYYY-MM-DD HH:mm:ss"),
            endDate: moment(new Date())
                .utcOffset(8)
                .format("YYYY-MM-DDTHH:mm:ss"),
            HideInvalid: true,
            /* 展开取消申请优惠弹窗 */
            ShowCancellPopup: false,
            remark: null,
            remarkKey: null,
            showApplyDataItem: null, // 愈顯示的申請資料
            isShowApplyDataModal: false, //是否顯示申請資料
            cancelPromotionItem: null, //欲取消優惠資料
            pageValidIndex: 1, //valid資料分頁index
            pageInvalidIndex: 1, //invalid資料分頁index
            isRefreshingHistory: false, //是否正在更新history data
        };

        this.BonusClaim = this.BonusClaim.bind(this); // 领取红利
        this.cancelBonusPromotion = this.cancelBonusPromotion.bind(this); // 取消优惠
        this.getDepositlist = this.getDepositlist.bind(this); // 获取我的优惠
        this.changeFilterTime = this.changeFilterTime.bind(this); // 改变筛选时间
        this.handleChange = this.handleChange.bind(this); // 筛选状态
        this.closeLearn = this.closeLearn.bind(this);
        this.judgeText = this.judgeText.bind(this); //判斷btn狀態
        this.judgeBtnStatus = this.judgeBtnStatus.bind(this); //判斷btn狀態
        this.currentSelectTime = "currMonth"; // 默认查询当月
        this.currMonth = moment().format("YYYY年MM月");
        this.lastMonth = moment()
            .month(moment().month() - 1)
            .format("YYYY年MM月");
        this.lastLastMonth = moment()
            .month(moment().month() - 2)
            .format("YYYY年MM月");
        this.status = "3"; // 当前的查询状态State值

        this.isFinishFrontData = []; // 是否已获取完成当前Page所需前置数据
    }
    componentDidMount() {
        const newLen = this.isFinishFrontData.push(0);
        this.props.setAppliedPromotions(() => {
            this.setState({ isRefreshingHistory: false });
        });
        this.getDepositlist(true);

        !localStorage.getItem("isShowPromotionPopover") &&
            this.setState({ isShowPopover: true, isShowPopoverMask: true });

        let learnStepString = Cookie("learnStep");
        typeof learnStepString === "string" &&
            learnStepString.substr(3, 1) === "0" &&
            this.setState({ isShowLearnMask: true });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.topTabIndex !== this.props.topTabIndex) {
            this.setState({
                selectedValidPopoverIndex: null,
                selectedInvalidPopoverIndex: null,
            });
        }
    }

    closeLearn() {
        this.setState({ isShowLearnMask: false });
        // 设置开启的记录
        let LearnArr = Cookie("learnStep").split("");
        LearnArr.splice(3, 1, "1");
        Cookie("learnStep", LearnArr.join(""), { expires: LEARN_TIME });
        Pushgtagdata("Myreward_userguide");
    }
    /**
     * @param {boolean} isLoad 是否是第一次加载
     */
    getDepositlist(isLoad) {
        console.log("getDepositlist running");
        // this.props.setLoading(true);
        let newLen = null;
        isLoad && (newLen = this.isFinishFrontData.push(0));

        const filterTime = this[this.currentSelectTime].split("年");
        get(ApiPort.GETBonusApplications)
            .then((res) => {
                console.log(res.result);
                // this.props.setLoading(false);
                if (res) {
                    // let promoCount = 0;
                    // res.forEach((val) => {
                    //   val.bonusStatusId === parseInt(this.status) && promoCount++
                    // });
                    this.setState({
                        processCount: res.result.length,
                        PromotionList: res.result,
                    });
                }

                if (isLoad) {
                    this.isFinishFrontData.splice(newLen - 1, 1, 1);
                    //   this.isFinishFrontData.length &&
                    //     !~this.isFinishFrontData.indexOf(0) &&
                    //     this.props.setLoading(false);
                } else {
                    //   this.props.setLoading(false);
                }
            })
            .catch((error) => {
                // this.props.setLoading(false);
                console.log("GETBonusApplications" + error);
            });
    }
    changeFilterTime(e) {
        this.currentSelectTime = e.target.value;
        this.getDepositlist();
    }
    handleChange(v) {
        this.status = v;
        this.getDepositlist();
        console.log(typeof v, v);
        switch (v) {
            case "1":
                Pushgtagdata("Pending_sorting_myreward");
                break;
            case "3":
                Pushgtagdata("Processing_sorting_myreward");
                break;
            case "4":
                Pushgtagdata("Verifying_sorting_myreward");
                break;
            case "6":
                Pushgtagdata("Completed_sorting_myreward");
                break;
            case "2":
                Pushgtagdata("Cancelled_sorting_myreward");
                break;
            case "7":
                Pushgtagdata("Received_sorting_myreward");
                break;
            default:
                break;
        }
    }
    cancelBonusPromotion(cancelItem) {
        console.log("cancelItem", cancelItem);
        Pushgtagdata("Cancelapply_myreward_profilepage");
        const data = {
            playerBonusId: cancelItem.playerBonusId,
            bonusId: cancelItem.bonusRuleId,
            remark: this.state.remark,
        };

        // Modal.confirm({
        //     icon: null,
        //     centered: true,
        //     title: "确认撤销",
        //     content: "确认要将此优惠撤销吗？",
        //     okText: "确认撤销",
        //     cancelText: "取消",
        //     onCancel: () => {
        //         Pushgtagdata("Cancel_cancelapply_myreward");
        //     },
        //     onOk: () => {
        // this.props.setLoading(true);
        this.setState({ isRefreshingHistory: true });
        post(ApiPort.CancelBonusPromotion, data)
            .then((res) => {
                if (res.isSuccess) {
                    if (res.result.isSuccess) {
                        message.success("取消优惠成功！");
                        this.setState({
                            ShowCancellPopup: false,
                            remark: null,
                            remarkKey: null,
                        });
                        this.getDepositlist();
                        this.props.setAppliedPromotions(() => {
                            this.setState({
                                isRefreshingHistory: false,
                            });
                        });
                    } else {
                        this.setState({
                            ShowCancellPopup: false,
                            isRefreshingHistory: false,
                        });
                        message.error(res.result.message);
                    }
                } else {
                    this.setState({ isRefreshingHistory: false });
                    message.error(res.result.message || "撤销申请失败！");
                }
            })
            .catch((error) => {
                this.setState({ isRefreshingHistory: false });
                console.log("POSTBonusClaim" + error);
            });
        Pushgtagdata("Submit_cancelapply_myreward");
        //     },
        // });
    }
    BonusClaim(id) {
        let postData = {
            playerBonusId: id,
        };
        post(ApiPort.POSTBonusClaim, postData)
            .then((res) => {
                if (res && res.isSuccess) {
                    if (res.result.isClaimSuccess) {
                        message.success(res.result.message);
                        this.props.setAppliedPromotions(() => {
                            this.setState({ isRefreshingHistory: false });
                        });
                    } else {
                        message.error(res.result.message);
                    }
                }
            })
            .catch((error) => {
                console.log("POSTBonusClaim" + error);
            });

        Pushgtagdata("Collectreward_myreward_profilepage");
    }

    judgeText(type, status, turnoverNeeded, bonusAmount, percentage) {
        if (type === "Bonus") {
            if (status === "Serving") {
                //領取紅利
                return (
                    <>
                        <div className="line-process-wrap">
                            <div
                                className="line-process"
                                style={{ width: percentage + "%" }}
                            ></div>
                        </div>
                        <span>
                            还需 {turnoverNeeded}
                            流水
                        </span>
                        <h3>
                            {bonusAmount}
                            元紅利
                        </h3>
                    </>
                );
            } else {
                //沒有btn
                return (
                    <>
                        <h3>
                            {bonusAmount}
                            元紅利
                        </h3>
                    </>
                );
            }
        } else {
            //查看提交資料
            return;
        }
    }

    judgeBtnStatus(type, status, playerBonusId) {
        if (type === "Bonus") {
            if (status === "Release") {
                //領取紅利
                return (
                    <>
                        <Button
                            size="large"
                            type="primary"
                            className="tlc-btn-2"
                            onClick={() => {
                                this.BonusClaim(playerBonusId);
                            }}
                        >
                            领取红利
                        </Button>
                    </>
                );
            } else if (status === "Serving") {
                //沒有btn
                return;
            } else if (status === "Served" || status === "Force to served") {
                //已領取

                return (
                    <>
                        <Button size="large" type="primary" disabled>
                            已領取
                        </Button>
                    </>
                );
            } else {
                //待配發
                return (
                    <>
                        <Button size="large" type="primary" disabled>
                            待配發
                        </Button>
                    </>
                );
            }
        } else {
            //查看提交資料
            return (
                <Button
                    size="large"
                    type="primary"
                    className="tlc-btn-2"
                    onClick={() => {
                        // this.BonusClaim(val.playerBonusId);
                        console.log("查看提交資料");
                    }}
                >
                    查看提交資料
                </Button>
            );
        }
    }

    render() {
        {
            console.log("ValidAppliedList", this.props.ValidAppliedList);
        }
        const {
            ShowCancellPopup,
            remarkKey,
            isShowApplyDataModal,
            showApplyDataItem,
            selectedValidPopoverIndex,
            selectedInvalidPopoverIndex,
            pageValidIndex,
            pageInvalidIndex,
            isRefreshingHistory,
        } = this.state;
        const { HideInvalid } = this.state;

        return (
            <div style={{ minHeight: "250px" }}>
                <Spin
                    style={{ minHeight: "250px" }}
                    spinning={
                        isRefreshingHistory || !this.props.appliedPromotions
                    }
                    tip={translate("加载中")}
                >
                    {this.props.appliedPromotions &&
                        (this.props.appliedPromotions.length ? (
                            <div className="account-wrap">
                                {/* 這裡要放要渲染的資料 圖卡式 */}
                                <div className="valid-list-box">
                                    {this.props.ValidAppliedList?.length ? (
                                        <div
                                            className="applied-list-box"
                                            gutter={24}
                                        >
                                            {this.props.ValidAppliedList.slice(
                                                (pageValidIndex - 1) * 9,
                                                pageValidIndex * 9,
                                            ).map((item, index) => {
                                                return (
                                                    <AppliedHistoryCard
                                                        key={index}
                                                        item={item}
                                                        isValid={true}
                                                        index={index}
                                                        selectedPopoverIndex={
                                                            selectedValidPopoverIndex
                                                        }
                                                        onBonusClaim={
                                                            this.BonusClaim
                                                        }
                                                        onCancelPromotion={() => {
                                                            this.setState({
                                                                ShowCancellPopup: true,
                                                                selectedValidPopoverIndex:
                                                                    null,
                                                                selectedInvalidPopoverIndex:
                                                                    null,
                                                                cancelPromotionItem:
                                                                    item,
                                                            });
                                                        }}
                                                        onCancelPopover={() => {
                                                            this.setState({
                                                                selectedValidPopoverIndex:
                                                                    null,
                                                                selectedInvalidPopoverIndex:
                                                                    null,
                                                            });
                                                        }}
                                                        onOpenPopover={() => {
                                                            this.setState({
                                                                selectedValidPopoverIndex:
                                                                    index,
                                                                selectedInvalidPopoverIndex:
                                                                    null,
                                                            });
                                                        }}
                                                        onOpenAppliedDataModal={() => {
                                                            //这个是申请优惠时候填写资料的详情
                                                            this.setState({
                                                                isShowApplyDataModal: true,
                                                                showApplyDataItem:
                                                                    item,
                                                                selectedValidPopoverIndex:
                                                                    null,
                                                                selectedInvalidPopoverIndex:
                                                                    null,
                                                            });
                                                        }}
                                                        openPromotionDetail={() => {
                                                            //这个是打开优惠详情的modal
                                                            this.props.openPromotionDetail(
                                                                item,
                                                            );
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <li className="center">
                                            <Empty
                                                image={
                                                    "/vn/img/icon/img-no-record.svg"
                                                }
                                                className="big-empty-box"
                                                description={translate(
                                                    "您暂无任何优惠纪录，先去优惠页面申请吧!",
                                                )}
                                            />
                                        </li>
                                    )}
                                    {this.props.ValidAppliedList?.length >
                                        9 && (
                                        <Pagination
                                            className="general-pagination"
                                            style={{ textAlign: "left" }}
                                            defaultCurrent={1}
                                            pageSize={9}
                                            onChange={(e) => {
                                                this.setState({
                                                    pageValidIndex: e,
                                                });
                                            }}
                                            total={
                                                this.props.ValidAppliedList
                                                    .length
                                            }
                                        />
                                    )}
                                </div>
                                {this.props.inValidAppliedList.length ? (
                                    <div className="invalid-list-box">
                                        {HideInvalid && (
                                            <p>
                                                {translate(
                                                    "要显示已收到、已过期和无效的促销活动，",
                                                )}
                                                <span
                                                    onClick={() => {
                                                        this.setState({
                                                            HideInvalid:
                                                                !HideInvalid,
                                                        });
                                                    }}
                                                >
                                                    {translate("点击这里。")}
                                                </span>
                                            </p>
                                        )}
                                        {!HideInvalid && (
                                            <p>
                                                {translate(
                                                    "要隐藏已收到、已过期和无效的促销活动，",
                                                )}
                                                <span
                                                    style={{
                                                        margin: " 0 10px 0 0",
                                                    }}
                                                    onClick={() => {
                                                        this.setState({
                                                            HideInvalid:
                                                                !HideInvalid,
                                                        });
                                                    }}
                                                >
                                                    {translate("点击这里。")}
                                                </span>
                                            </p>
                                        )}
                                        <div className="line-distance"></div>
                                        <div
                                            className="invalid-list"
                                            style={{
                                                display: HideInvalid
                                                    ? "none"
                                                    : "grid",
                                            }}
                                        >
                                            {this.props.inValidAppliedList
                                                .slice(
                                                    (pageInvalidIndex - 1) * 9,
                                                    pageInvalidIndex * 9,
                                                )
                                                .map((item, index) => {
                                                    return (
                                                        <AppliedHistoryCard
                                                            key={index}
                                                            item={item}
                                                            isValid={false}
                                                            index={index}
                                                            selectedPopoverIndex={
                                                                selectedInvalidPopoverIndex
                                                            }
                                                            onCancelPromotion={() => {
                                                                this.setState({
                                                                    ShowCancellPopup: true,
                                                                    selectedInvalidPopoverIndex:
                                                                        null,
                                                                    selectedValidPopoverIndex:
                                                                        null,
                                                                    cancelPromotionItem:
                                                                        item,
                                                                });
                                                            }}
                                                            onCancelPopover={() => {
                                                                this.setState({
                                                                    selectedInvalidPopoverIndex:
                                                                        null,
                                                                    selectedValidPopoverIndex:
                                                                        null,
                                                                });
                                                            }}
                                                            onOpenPopover={() => {
                                                                this.setState({
                                                                    selectedInvalidPopoverIndex:
                                                                        index,
                                                                    selectedValidPopoverIndex:
                                                                        null,
                                                                });
                                                            }}
                                                            onOpenAppliedDataModal={() => {
                                                                //这个是申请优惠时候填写资料的详情
                                                                console.log(
                                                                    "Open Detail Modal",
                                                                );
                                                                this.setState({
                                                                    isShowApplyDataModal: true,
                                                                    showApplyDataItem:
                                                                        item,
                                                                    selectedInvalidPopoverIndex:
                                                                        null,
                                                                    selectedValidPopoverIndex:
                                                                        null,
                                                                });
                                                            }}
                                                            openPromotionDetail={() => {
                                                                //这个是打开优惠详情的modal
                                                                this.props.openPromotionDetail(
                                                                    item,
                                                                );
                                                            }}
                                                        />
                                                    );
                                                })}
                                        </div>
                                        {HideInvalid === false &&
                                            this.props.inValidAppliedList
                                                .length > 9 && (
                                                <Pagination
                                                    className="general-pagination"
                                                    style={{
                                                        textAlign: "left",
                                                    }}
                                                    defaultCurrent={1}
                                                    pageSize={9}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            pageInvalidIndex: e,
                                                        });
                                                    }}
                                                    total={
                                                        this.props
                                                            .inValidAppliedList
                                                            .length
                                                    }
                                                />
                                            )}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        ) : (
                            <Empty
                                image={"/vn/img/icon/img-no-record.svg"}
                                className="big-empty-box"
                                description={translate(
                                    "您暂无任何优惠纪录，先去优惠页面申请吧!",
                                )}
                            />
                        ))}

                    <AppliedDataModal
                        isVisible={isShowApplyDataModal}
                        onCancel={() =>
                            this.setState({ isShowApplyDataModal: false })
                        }
                        appliedItem={showApplyDataItem}
                    />
                    {/*-------------------------------取消优惠弹窗 选择取消的原因 -----------------------------------*/}
                    <Modal
                        closable={true}
                        className="Proms"
                        centered
                        title={translate("取消免费投注奖金")}
                        visible={ShowCancellPopup}
                        footer={null}
                        onCancel={() => {
                            this.setState({
                                ShowCancellPopup: false,
                            });
                        }}
                    >
                        {console.log(
                            "cancelPromotionItem",
                            this.state.cancelPromotionItem,
                        )}
                        {/* <label>取消原因</label> */}
                        <Row>
                            <ul className="cap-list cancell-list">
                                {[
                                    translate("选错优惠"),
                                    translate("存款资料错误"),
                                    translate("流水太多"),
                                    translate("存款未到账"),
                                ].map((val, index) => {
                                    return (
                                        <Col span={12} key={index}>
                                            <li
                                                className="cap-item"
                                                onClick={() => {
                                                    this.setState({
                                                        remarkKey: index,
                                                        remark: val,
                                                    });
                                                }}
                                            >
                                                <div
                                                    className={`cap-item-circle${
                                                        remarkKey === index
                                                            ? " curr"
                                                            : ""
                                                    }`}
                                                />
                                                <div className="padding-left-xs">
                                                    {val}
                                                </div>
                                            </li>
                                        </Col>
                                    );
                                })}
                            </ul>
                            <label
                                style={{
                                    frenderontSize: "12px",
                                    fontFamily: "MicrosoftYaHei",
                                    color: "#222222",
                                }}
                            >
                                {translate("其它")}
                            </label>
                            <Input
                                size="large"
                                placeholder={translate("输入原因")}
                                onChange={(e) => {
                                    this.setState({
                                        remark: e.target.value,
                                    });
                                }}
                            />
                        </Row>

                        <Row gutter={16} justify="center">
                            <Col
                                span={12}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        this.setState({
                                            ShowCancellPopup: false,
                                            remarkKey: null,
                                            remark: null,
                                        });
                                    }}
                                >
                                    {translate("取消")}
                                </button>
                            </Col>

                            <Col
                                span={12}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <button
                                    className="keep-btn"
                                    disabled={
                                        this.state.remarkKey === null &&
                                        this.state.remark === null
                                            ? true
                                            : false
                                    }
                                    onClick={() => {
                                        this.cancelBonusPromotion(
                                            this.state.cancelPromotionItem,
                                        );
                                    }}
                                >
                                    {translate("提交")}
                                </button>
                            </Col>
                        </Row>
                    </Modal>
                </Spin>
            </div>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        topTabIndex: state.promotion.topTabIndex,
        appliedPromotions: state.promotion.appliedPromotions,
        ValidAppliedList: state.promotion.ValidAppliedList,
        inValidAppliedList: state.promotion.inValidAppliedList,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        changeTab: (i) => {
            dispatch(promotionActions.changeTab(i));
        },
        setAppliedPromotions: (stopLoading) => {
            dispatch(getAppliedHistoryAction(stopLoading));
        },
        openPromotionDetail: (item) => {
            dispatch(promotionActions.openPromotionDetail(item));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPromotion);
