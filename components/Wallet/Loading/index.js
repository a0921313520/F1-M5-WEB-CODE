import React from "react";
import { Modal, message } from "antd";
import { Cookie } from "$ACTIONS/util";

class payConfirmLoading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingText: "正在为您匹配合适的账户…",
        };
        this.timeTimer = null;
        this.startCountDown = this.startCountDown.bind(this); // 倒计时
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.visible !== this.props.visible &&
            this.props.visible &&
            Cookie("loadingTime")
        ) {
            this.startCountDown();
        }
        if (
            prevState.visible !== this.props.visible &&
            !this.props.visible &&
            Cookie("loadingTime")
        ) {
            Cookie("loadingTime", null);
            clearInterval(this.timeTimer);
        }
    }
    componentWillUnmount() {
        Cookie("loadingTime", null);
        clearInterval(this.timeTimer);
    }
    startCountDown() {
        clearInterval(this.timeTimer);
        const countTime = 100;
        const depositDateTime = Cookie("loadingTime")
            .replace("-", "/")
            .replace("-", "/");
        let lastSeconds =
            countTime -
            (new Date().getTime() - new Date(depositDateTime).getTime()) / 1000;
        this.timeTimer = setInterval(() => {
            if (lastSeconds <= 0) {
                Cookie("loadingTime", null);
                clearInterval(this.timeTimer);
                this.props.setVisible(false);
            }
            lastSeconds--;
            // console.log("lastSeconds--;",lastSeconds--)
            let loadingText = "";
            if (lastSeconds > 74) {
                loadingText = "正在为您匹配合适的账户…";
            } else if (lastSeconds > 49) {
                loadingText = "账户匹配中，请耐心等待…";
            } else {
                loadingText =
                    "交易繁忙中，乐天使请您耐心等待10秒 或使用其他存款方式...";
            }
            this.setState({ loadingText });
        }, 1000);
    }
    render() {
        const { visible } = this.props;
        return (
            <React.Fragment>
                <Modal
                    title={``}
                    visible={visible}
                    footer={null}
                    className="showInfoModal  depositLoading"
                    centered={true}
                >
                    <div className="loadimg">
                        <img
                            src="/cn/img/icons/loading.gif"
                            style={{ width: "40px", height: "40px" }}
                            alt="gif"
                        />
                        <p
                            style={{
                                marginTop: 10,
                                marginBottom: 0,
                                padding: 0,
                            }}
                        >
                            {this.state.loadingText}
                        </p>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}
export default payConfirmLoading;
