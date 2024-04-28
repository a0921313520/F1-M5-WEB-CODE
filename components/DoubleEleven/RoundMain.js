import React from "react";
import { Modal, Icon, Button, message } from "antd";
import { post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";

export default class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isResult: "",
            isCircleLoading: "",
            rotateResultTitle: "", // 恭喜赢奖、再接再厉
            showRotateResult: false,
            rotateResultContent: null,
        };

        this.speedAngle = 0;
        this.lucyCircle = React.createRef();
    }
    componentDidMount() {}
    componentWillUnmount() {}
    showDepositModal = () => {
        Modal.destroyAll();
        this.setState({ showRotateResult: false });
        global.showDialog({ key: 'wallet:{"type": "deposit"}' });
    };
    startPrize = () => {
        if (localStorage.getItem("access_token") == null) {
            global.goUserSign("1");
            return;
        }

        Pushgtagdata("Engagement Event", "Click", "Spin_Double112021​​");
        if (this.props.activeStatus === "start") {
            this.setState({ isCircleLoading: "maintain" });
            post(ApiPort.LuckySpinDouble)
                .then((res) => {
                    this.setState({ isCircleLoading: "" });

                    if (res.isAllowSpin) {
                        // const res = {"isAllowSpin":true,"message":"加油！下一个赢家就是您！","errorStatus":0,"remaining":3,"requiredDeposit":true,"pendingDeposit":false,"minDeposit":500.0000,"maxSpin":5,"wonPrizes":{"id":0},"responseStatus":3,"messageTitle":"再接再厉","isSuccess":true,"reminder":" 您今天还剩余3次旋转","buttonStatus":2};
                        const prize = [-1, 1, 0, 8, 7, 6, 5, 4, 3, 2];

                        let currentValue = this.props.prizeList.find(
                            (ele) => ele.cnName === res.wonPrizes.prizeName
                        );
                        let remainderAngle = this.speedAngle % 360;
                        let prizeAngle = currentValue
                            ? parseInt(prize[currentValue.id]) * 40 + 720
                            : 0; // 中奖度数加结果保留度数
                        let prizeCountAngle = remainderAngle + prizeAngle; // 当前奖品需要转动度数总和
                        let resultAnimation = prizeCountAngle / 230;
                        if (!!currentValue) {
                            this.speedAngle =
                                this.speedAngle - remainderAngle + prizeAngle; // 中奖角度总和
                            this.setState({ isResult: resultAnimation });
                        }

                        setTimeout(
                            () => {
                                // 重新获取游戏记录
                                // this.getLucyRecords()
                                // 获取充值总额和可以旋转次数
                                typeof this.props.GetPlayerLuckySpinDetail ===
                                    "function" &&
                                    this.props.GetPlayerLuckySpinDetail();

                                // const title = currentValue ? "恭喜中奖" : "再接再厉";

                                switch (res.responseStatus) {
                                    case 0:
                                    case 3:
                                        this.setState({
                                            rotateResultTitle: res.messageTitle,
                                            showRotateResult: true,
                                            rotateResultContent: (
                                                <div>
                                                    {currentValue ? (
                                                        <h4>
                                                            {" "}
                                                            恭喜您获得
                                                            <br />{" "}
                                                            {
                                                                currentValue.cnName
                                                            }{" "}
                                                            !
                                                        </h4>
                                                    ) : (
                                                        <h4>
                                                            加油！
                                                            <br />{" "}
                                                            下一个赢家就是您！
                                                        </h4>
                                                    )}
                                                    <div className="result-picture">
                                                        <img
                                                            src={
                                                                currentValue
                                                                    ? currentValue.img
                                                                    : "/vn/img/doubleEleven2021/prize-null.png"
                                                            }
                                                        />
                                                    </div>
                                                    <p>
                                                        {" "}
                                                        您今天还剩余{" "}
                                                        {res.remaining} 次旋转
                                                    </p>
                                                    <div className="ant-modal-confirm-btns">
                                                        <Button
                                                            type="primary"
                                                            block
                                                            onClick={() => {
                                                                this.setState({
                                                                    showRotateResult: false,
                                                                });
                                                            }}
                                                        >
                                                            继续游戏
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        });
                                        break;
                                    case 2:
                                    case 4:
                                        this.setState({
                                            rotateResultTitle: res.messageTitle,
                                            showRotateResult: true,
                                            rotateResultContent: (
                                                <div>
                                                    {currentValue ? (
                                                        <h4>
                                                            {" "}
                                                            恭喜您获得
                                                            <br />{" "}
                                                            {
                                                                currentValue.cnName
                                                            }{" "}
                                                            !
                                                        </h4>
                                                    ) : (
                                                        <h4>
                                                            {" "}
                                                            很遗憾您的旋转是空的，
                                                            <br /> 请再接再厉！
                                                        </h4>
                                                    )}
                                                    <div className="result-picture">
                                                        <img
                                                            src={
                                                                currentValue
                                                                    ? currentValue.img
                                                                    : "/vn/img/doubleEleven2021/prize-null.png"
                                                            }
                                                        />
                                                    </div>
                                                    <p> 您的旋转次数已用完咯</p>
                                                    <div className="ant-modal-confirm-btns">
                                                        <Button
                                                            type="primary"
                                                            block
                                                            onClick={() => {
                                                                this.showDepositModal();
                                                                Pushgtagdata(
                                                                    "Deposit Nav​",
                                                                    "Click",
                                                                    "Deposit_Double112021"
                                                                );
                                                            }}
                                                        >
                                                            立即充值
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        });
                                        break;
                                    case 1:
                                    case 5:
                                        this.setState({
                                            rotateResultTitle: res.messageTitle,
                                            showRotateResult: true,
                                            rotateResultContent: (
                                                <div>
                                                    {currentValue ? (
                                                        <h4>
                                                            {" "}
                                                            恭喜您获得
                                                            <br />{" "}
                                                            {
                                                                currentValue.cnName
                                                            }{" "}
                                                            !
                                                        </h4>
                                                    ) : (
                                                        <h4>
                                                            {" "}
                                                            很遗憾您的旋转是空的，
                                                            <br />{" "}
                                                            明天请再接再厉！​
                                                        </h4>
                                                    )}
                                                    <div className="result-picture">
                                                        <img
                                                            src={
                                                                currentValue
                                                                    ? currentValue.img
                                                                    : "/vn/img/doubleEleven2021/prize-null.png"
                                                            }
                                                        />
                                                    </div>
                                                    {/* <p> 您今日的旋转次数已用完，<br />请明天再来试吧</p> */}
                                                    <div className="ant-modal-confirm-btns">
                                                        <Button
                                                            type="primary"
                                                            block
                                                            onClick={() => {
                                                                this.setState({
                                                                    showRotateResult: false,
                                                                });
                                                            }}
                                                        >
                                                            确认
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        });
                                        break;
                                    default:
                                        message.error(res.message);
                                        break;
                                }
                            },
                            !!currentValue ? resultAnimation * 1000 : 0
                        );
                    } else {
                        switch (res.responseStatus) {
                            case 6:
                                Modal.info({
                                    icon: "",
                                    okText: "立即充值",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                立即充值最少{res.minDeposit}
                                                元即可旋转幸运轮盘哦~
                                            </p>
                                        </div>
                                    ),
                                    onOk: () => {
                                        Pushgtagdata(
                                            "Deposit Nav​",
                                            "Click",
                                            "Deposit_Double112021"
                                        );
                                        this.showDepositModal();
                                    },
                                });
                                break;
                            case 14:
                                Modal.info({
                                    icon: "",
                                    okText: "立即充值",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                您今天还未达到充值要求，请您立即充值
                                            </p>
                                        </div>
                                    ),
                                    onOk: () => {
                                        Pushgtagdata(
                                            "Deposit Nav​",
                                            "Click",
                                            "Deposit_Double112021"
                                        );
                                        this.showDepositModal();
                                    },
                                });
                                break;
                            case 18:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                您的充值还未通过审核，请您耐心等待
                                            </p>
                                        </div>
                                    ),
                                });
                                break;
                            case 17:
                                Modal.info({
                                    icon: "",
                                    okText: "立即充值",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                您的累积充值不足，请充值后再试吧
                                            </p>
                                        </div>
                                    ),
                                    onOk: () => {
                                        Pushgtagdata(
                                            "Deposit Nav​",
                                            "Click",
                                            "Deposit_Double112021"
                                        );
                                        this.showDepositModal();
                                    },
                                });
                                break;
                            case 7:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                您今天的旋转次数已用完，请明天再试吧
                                            </p>
                                        </div>
                                    ),
                                });
                                break;
                            case 9:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                很遗憾您的旋转是空的，明天请再接再厉吧！
                                            </p>
                                        </div>
                                    ),
                                });
                                break;
                            case 10:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                抱歉
                                                ，您的账号无法参加此次优惠，详情请联系客服
                                            </p>
                                        </div>
                                    ),
                                });
                                break;
                            case 11:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>活动还未开始，敬请期待</p>
                                        </div>
                                    ),
                                });
                                break;
                            case 19:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>活动已截至，我们明年再见啦~</p>
                                        </div>
                                    ),
                                });
                                break;
                            default:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>{res.message}</p>
                                        </div>
                                    ),
                                });
                                break;
                        }
                    }
                })
                .catch((error) => console.log(error));
        } else {
            message.error("活动暂不开放！");
        }

        // this.loadingRotate()
        // setTimeout(() => {
        //     let prize = Math.floor(Math.random() * 7) // 7 以内的随机整数，模拟奖品！
        //     clearInterval(this.lodingTimer)
        //     let remainderAngle = this.speedAngle % 360 // 剩余角度
        //     let prizeAngle = prize * 51.428 + 360 // 中奖度数加结果保留度数
        //     let prizeCountAngle = remainderAngle + prizeAngle // 当前奖品需要转动度数总和
        //     let resultAnimation = prizeCountAngle <= 360 ? "prize1200" : prizeCountAngle < 720 ? "prize2900" : "prize3500"
        //     this.speedAngle = this.speedAngle - remainderAngle + prizeAngle // 中奖角度总和
        //     this.setState({isResult: resultAnimation}, () => {
        //         setTimeout(() => {
        //             this.setState({isResult: ""})
        //         }, parseInt(resultAnimation.substr(/[0-9]/.exec(resultAnimation).index)))
        //     })
        // }, 1000)
    };
    // loadingRotate () {
    //     this.lucyCircle.current.setAttribute("style", "transform:rotate(" + (this.speedAngle += 500) + "deg);")
    //     this.lodingTimer = setInterval(() => {
    //         this.lucyCircle.current.setAttribute("style", "transform:rotate(" + (this.speedAngle += 500) + "deg);")
    //     }, 1000);
    // }
    render() {
        return (
            <React.Fragment>
                <div
                    className={`prize-round-pic-wrapper ${this.state.isCircleLoading}`}
                >
                    <div
                        ref={this.lucyCircle}
                        style={{
                            transform: "rotate(" + this.speedAngle + "deg)",
                            transitionDuration: this.state.isResult + "s",
                        }}
                        className="prize-round-list"
                    ></div>
                    {this.props.activeStatus === "start" ? (
                        <button
                            onClick={this.startPrize}
                            className={`prize-round-list-btn active start`}
                            data-status="开始"
                        ></button>
                    ) : (
                        <button
                            className={`prize-round-list-btn disabled ${this.props.activeStatus}`}
                            data-status="活动即将开始/已结束"
                        ></button>
                    )}

                    <div className="prize-round-star"></div>
                </div>
                {/* 抽奖结果提示 */}
                <Modal
                    title={this.state.rotateResultTitle}
                    className="midautumn-direction rotate-result defined-btn"
                    centered={true}
                    footer={false}
                    visible={this.state.showRotateResult}
                    closeIcon={<Icon type="close-circle" />}
                    width={660}
                    onCancel={() => {
                        this.setState({ showRotateResult: "" });
                    }}
                >
                    <div style={{ paddingTop: 32 }}>
                        {this.state.rotateResultContent}
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}
