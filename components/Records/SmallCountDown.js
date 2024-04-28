import React from "react";
import { Modal } from "antd";
import { Cookie, dateFormat } from "$ACTIONS/util";

class SmallCountDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remainingTime: 5, //小额确认倒计时
        };
        this.timeTimer = null;
        this.startCountDown = this.startCountDown.bind(this); // 倒计时
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.visible !== this.props.visible && this.props.visible) {
            this.setState({ remainingTime: 5 }, () => {
                Cookie("smallTime", dateFormat(), { expires: 0.05 });
                this.startCountDown();
            });
        }
        if (prevProps.visible !== this.props.visible && !this.props.visible) {
            Cookie("smallTime", null);
            clearInterval(this.timeTimer);
        }
    }
    componentWillUnmount() {
        Cookie("smallTime", null);
        clearInterval(this.timeTimer);
    }
    startCountDown() {
        clearInterval(this.timeTimer);
        const phoneTime = Cookie("smallTime")
            .replace("-", "/")
            .replace("-", "/");
        if (phoneTime !== null && phoneTime !== "") {
            this.timeTimer = setInterval(() => {
                if (this.state.remainingTime == 0) {
                    Cookie("smallTime", null);
                    clearInterval(this.timeTimer);
                } else {
                    this.setState({
                        remainingTime: --this.state.remainingTime,
                    });
                }
            }, 1000);
        } else {
            Cookie("smallTime", null);
        }
    }
    confirmReceipt = () => {
        this.props.confirmReceipt();
    };
    onCancel = () => {
        this.props.setVisible(false);
    };
    render() {
        const { visible } = this.props;
        console.log("this.state.remainingTime:", this.state.remainingTime);
        return (
            <React.Fragment>
                <Modal
                    // title={`温馨提示`}
                    className="smallCountDownModal confirmModalRecord"
                    visible={visible}
                    footer={null}
                    centered={true}
                    maskClosable={false}
                    onCancel={this.onCancel}
                    width="360px"
                    closable={true}
                >
                    <div
                        className="deposit-help-wrap smallRiver-help-wrap"
                        style={{ textAlign: "left" }}
                    >
                        <div className="smallRiver-warnstop">
                            <img
                                src="/vn/img/icons/icon-warnstop.png"
                                alt="icon-warnstop"
                            ></img>
                            <p>
                                {" "}
                                重要提示
                            </p>
                        </div>
                        <div style={{textAlign: 'center', fontWeight: '500', color: '#222222', marginBottom: '10px'}}>
                            在您继续下一步之前，请务必先了解详细内容后才点击“确认到账”。
                        </div>
                        <ul>
                            <li>
                                {" "}
                                请注意，乐天堂不会在金额还没到账前通知会员点击“确认到账”。
                                <span
                                    style={{
                                        color: "#E30000",
                                        fontWeight: "bold",
                                    }}
                                >
                                    请留意您的资金安全。
                                </span>
                            </li>
                            <li>
                                {" "}
                                若您在尚未检查的情况下点击 “确认到账”， 
                            </li>
                            <li>
                                所产生的损失乐天堂
                                <span
                                    style={{
                                        color: "#f00",
                                        fontWeight: "bold",
                                    }}
                                >
                                    概不负责赔偿。
                                </span>
                                <br/>
                                请确认您的金额是否已到账。
                            </li>
                        </ul>
                        <div className="footerbtn">
                            <p onClick={this.onCancel}>还没到账</p>
                            <div
                                className={`${
                                    this.state.remainingTime
                                        ? "inactiv"
                                        : "active"
                                }`}
                                onClick={this.confirmReceipt}
                            >
                                {this.state.remainingTime ? (
                                    <img
                                        className="loading-animation"
                                        src="/vn/img/icons/timedown.png"
                                    />
                                ) : null}
                                {this.state.remainingTime ? (
                                    <span>{this.state.remainingTime}</span>
                                ) : null}
                                确认到账
                            </div>
                        </div>
                    </div>
                    ,
                </Modal>
            </React.Fragment>
        );
    }
}
export default SmallCountDown;
