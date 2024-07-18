import React from "react";
import {
    Select,
    Button,
    Empty,
    Modal,
    Dropdown,
    Menu,
    Popover,
    Icon,
    message,
    Tabs,
} from "antd";
import Router from "next/router";
import moment from "moment";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import { formatAmount, Cookie, sub } from "$ACTIONS/util";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import { LEARN_TIME } from "$ACTIONS/constantsData";

const { Option } = Select;
const { TabPane } = Tabs;

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
        };

        this.BonusClaim = this.BonusClaim.bind(this); // 领取红利
        this.cancelBonusPromotion = this.cancelBonusPromotion.bind(this); // 取消优惠
        this.getDepositlist = this.getDepositlist.bind(this); // 获取我的优惠
        this.changeFilterTime = this.changeFilterTime.bind(this); // 改变筛选时间
        this.handleChange = this.handleChange.bind(this); // 筛选状态
        this.closeLearn = this.closeLearn.bind(this);
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
        this.props.setLoading(true);
        get(ApiPort.GETBonusOptions)
            .then((res) => {
                console.log(res.result.length);
                if (res && res.bonusStatus) {
                    let opationTransfer = [];
                    for (let key in res.bonusStatus) {
                        opationTransfer.push({
                            key: key,
                            name: res.bonusStatus[key],
                        });
                    }
                    this.setState({
                        // Optionswallets: res.wallets,
                        OptionStatus: opationTransfer,
                    });

                    this.isFinishFrontData.splice(newLen - 1, 1, 1);
                    this.isFinishFrontData.length &&
                        !~this.isFinishFrontData.indexOf(0) &&
                        this.props.setLoading(false);
                }
            })
            .catch((error) => {
                this.props.setLoading(false);
                console.log("GETBonusOptions" + error);
            });

        this.getDepositlist(true);

        !localStorage.getItem("isShowPromotionPopover") &&
            this.setState({ isShowPopover: true, isShowPopoverMask: true });

        let learnStepString = Cookie("learnStep");
        typeof learnStepString === "string" &&
            learnStepString.substr(3, 1) === "0" &&
            this.setState({ isShowLearnMask: true });
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
        this.props.setLoading(true);
        let newLen = null;
        isLoad && (newLen = this.isFinishFrontData.push(0));

        const filterTime = this[this.currentSelectTime].split("年");
        get(ApiPort.GETBonusApplications)
            .then((res) => {
                console.log("GETBonusApplications res : ", res.result);
                this.props.setLoading(false);
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
                    this.isFinishFrontData.length &&
                        !~this.isFinishFrontData.indexOf(0) &&
                        this.props.setLoading(false);
                } else {
                    this.props.setLoading(false);
                }
            })
            .catch((error) => {
                this.props.setLoading(false);
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
    cancelBonusPromotion({ bonusID, playerBonusId }) {
        Pushgtagdata("Cancelapply_myreward_profilepage");
        Modal.confirm({
            icon: null,
            centered: true,
            title: "确认撤销",
            content: "确认要将此优惠撤销吗？",
            okText: "确认撤销",
            cancelText: "取消",
            onCancel: () => {
                Pushgtagdata("Cancel_cancelapply_myreward");
            },
            onOk: () => {
                this.props.setLoading(true);
                post(
                    ApiPort.CancelBonusPromotion +
                        `&remark=Cancel&bonusID=${bonusID}&playerBonusId=${playerBonusId}`,
                )
                    .then((res) => {
                        if (res.isSuccess) {
                            message.success("取消优惠成功！");
                            this.getDepositlist();
                        } else {
                            this.props.setLoading(false);
                            message.error(res.message || "撤销申请失败！");
                        }
                    })
                    .catch((error) => {
                        console.log("POSTBonusClaim" + error);
                    });
                Pushgtagdata("Submit_cancelapply_myreward");
            },
        });
    }
    BonusClaim(id) {
        this.props.setLoading(true);
        post(ApiPort.POSTBonusClaim, parseInt(id))
            .then((res) => {
                this.props.setLoading(false);
                if (res.isClaimSuccess) {
                    message.success(res.message);
                    this.getDepositlist();
                } else {
                    message.error(res.message);
                }
            })
            .catch((error) => {
                console.log("POSTBonusClaim" + error);
            });

        Pushgtagdata("Collectreward_myreward_profilepage");
    }
    render() {
        return (
            <React.Fragment>
                {this.state.isShowPopoverMask ? (
                    <div
                        className="usercenter-mask transparent"
                        onClick={() => {
                            localStorage.setItem(
                                "isShowPromotionPopover",
                                "true",
                            );
                            this.setState({
                                isShowPopover: false,
                                isShowPopoverMask: false,
                            });
                        }}
                    ></div>
                ) : null}
                {/* {this.state.isShowLearnMask ? (
                    <div className="usercenter-mask my-promotion">
                        <button
                            className="learn-knew"
                            onClick={this.closeLearn}
                        ></button>
                    </div>
                ) : null} */}
                <div className="account-wrap">
                    <h2>
                        我的优惠
                        <a
                            className="usercenter-title-link"
                            onClick={() => {
                                Router.push(
                                    "/help?type=Sub2&key=" +
                                        CMSOBJ[HostConfig.CMS_ID][27],
                                );
                                Pushgtagdata("Tutorial_myreward_profilepage");
                            }}
                        >
                            查看操作教学
                        </a>
                    </h2>
                    <div className="message-button">
                        <div className="usercenter-title-brief">
                            {/* {this.state.OptionStatus.length
                ? this.state.OptionStatus.find((v) => v.key === this.status)
                    .name
                : ""} */}
                            优惠：<strong>{this.state.processCount} 个</strong>
                        </div>
                        {/* <Select
              dropdownClassName="small-option"
              defaultValue={"3"}
              dropdownStyle={{ width: 110, zIndex: 1 }}
              onFocus={() => {
                Pushgtagdata("Sorting_myreward_profilepage");
              }}
              onChange={this.handleChange}
            >
              {this.state.OptionStatus.length
                ? this.state.OptionStatus.map((val) => {
                    return (
                      <Option key={val.key} value={val.key}>
                        {val.name}
                      </Option>
                    );
                  })
                : null}
            </Select> */}

                        {/* <Radio.Group buttonStyle="solid" className="gray-radio" defaultValue="currMonth" onChange={this.changeFilterTime}>
              <Radio.Button value="currMonth">{this.currMonth}</Radio.Button>
              <Radio.Button value="lastMonth">{this.lastMonth}</Radio.Button>
              <Radio.Button value="lastLastMonth">{this.lastLastMonth}</Radio.Button>
            </Radio.Group> */}
                    </div>
                    <div style={{ color: "#666", fontSize: 14 }}>
                        <span>有效流水的计算会依据不同游戏而变动</span>
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
                                    [体育/电竞/真人/棋牌]
                                    游戏的有效流水均以游戏中的输赢金额来计算。
                                    <br />
                                    [电子/彩票/捕鱼]
                                    游戏以投注金额来计算有效流水
                                    (不包含未完成游戏等其他不符合的投注额)。
                                </div>
                            }
                            placement="bottom"
                            title=""
                            overlayClassName="popover-dark"
                            trigger="hover"
                        >
                            <span className="question-popover-tip my-promotion-tip">
                                <Icon type="question-circle" />
                            </span>
                        </Popover>
                    </div>
                    <ul className="my-promo-list-wrap">
                        {this.state.PromotionList.length ? (
                            this.state.PromotionList.map((val, index) => {
                                // const processSplit = val.bonusReleaseTypeValue.split("/"); //10:45 annotation
                                const processSplit = val.releaseValue;
                                return (
                                    <li key={index} className="my-promo-item">
                                        <div className="promo-brief">
                                            {/* <div className="brief-img inline-block">
                    <img src="" />
                  </div> */}
                                            <div className="brief-info inline-block">
                                                <h3>{val.title}</h3>
                                                <p>结束时间：{val.expiryDay}</p>
                                            </div>
                                            {/* 待处理 1 或者 进行中 3 为可撤销状态 */}
                                            {/* 改为只有待处理 1 为可撤销状态  2020/07/01 */}
                                            {val.bonusStatusId === 1 ? (
                                                <Dropdown
                                                    placement="bottomRight"
                                                    overlayClassName="remove-promo-wrap"
                                                    overlay={
                                                        <Menu>
                                                            <Menu.Item
                                                                onClick={() => {
                                                                    this.cancelBonusPromotion(
                                                                        {
                                                                            bonusID:
                                                                                val.bonusId,
                                                                            playerBonusId:
                                                                                val.playerBonusId,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                撤销申请
                                                            </Menu.Item>
                                                        </Menu>
                                                    }
                                                >
                                                    <Icon type="more" />
                                                </Dropdown>
                                            ) : null}
                                        </div>
                                        <div className="brief-detail-wrap">
                                            <div
                                                className={`brief-detail inline-block ${
                                                    val.bonusStatusId === 2
                                                        ? "dark"
                                                        : "light"
                                                }`}
                                            >
                                                {/* bonusTitle -> titile      bonusGiven -> givingRate   10:49 annotation*/}
                                                <h3>
                                                    可得
                                                    {~val.title.indexOf(
                                                        "同乐币",
                                                    )
                                                        ? ""
                                                        : "红利"}
                                                    {val.givingRate}
                                                </h3>
                                                <div className="line-process-wrap">
                                                    <div
                                                        className="line-process"
                                                        style={{
                                                            width:
                                                                val.percentage +
                                                                "%",
                                                        }}
                                                    ></div>
                                                </div>
                                                {/* bonusReleaseTypeValue -> bonusReleaseTypeID */}
                                                {val.bonusReleaseTypeID ? (
                                                    <div className="item-wrap">
                                                        <span>
                                                            {/* processSplit[1].replace(/,/g, "")   ->   processSplit */}
                                                            共需{" "}
                                                            {formatAmount(
                                                                parseFloat(
                                                                    processSplit,
                                                                ),
                                                            )}{" "}
                                                            流水
                                                        </span>
                                                        <span>
                                                            还需{" "}
                                                            {/*  parseFloat(processSplit[1].replace(/,/g, "")), parseFloat(processSplit[0].replace(/,/g, ""))  ->  */}
                                                            {formatAmount(
                                                                sub(
                                                                    parseFloat(
                                                                        processSplit,
                                                                    ),
                                                                    parseFloat(
                                                                        processSplit,
                                                                    ),
                                                                ),
                                                            )}{" "}
                                                            流水
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="brief-button">
                                                {val.isClaimable ? (
                                                    <Button
                                                        size="large"
                                                        type="primary"
                                                        className="tlc-btn-2"
                                                        onClick={() => {
                                                            this.BonusClaim(
                                                                val.playerBonusId,
                                                            );
                                                        }}
                                                    >
                                                        领取红利
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="large"
                                                        type="primary"
                                                        className="tlc-button-disabled"
                                                        disabled={true}
                                                    >
                                                        {/* 沒有 bonusStatus 以 代替 (沒有顯示字)*/}
                                                        {val.active}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="center">
                                <Empty
                                    image={"/vn/img/icon/img-no-record.svg"}
                                    className="big-empty-box"
                                    description="没有查询到相关优惠"
                                />
                            </li>
                        )}
                    </ul>
                    {/* <div className="center">
            <Button size="large" className="tlc-large-btn">展开过期的优惠</Button>
          </div> */}
                </div>
            </React.Fragment>
        );
    }
}

export default MyPromotion;
