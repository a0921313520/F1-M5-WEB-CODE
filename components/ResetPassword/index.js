import React from "react";
import { Modal, Icon, Spin, Input, Button, message } from "antd";
import { pwdReg } from "$ACTIONS/reg";
import { post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            loadingReset: false,
        };

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
    }
    componentDidMount() {}
    handleEvent() {
        this.setState({ visible: false });
    }
    onChange(event, type) {
        this[type] = event.target.value;
    }
    handleSubmit() {
        const { newPwd, confirmPwd } = this;

        if (pwdReg.test(newPwd) === false) {
            message.error("请输入正确新密码。");
            return;
        }

        if (pwdReg.test(confirmPwd) === false) {
            message.error("请输入正确确认密码。");
            return;
        }

        if (newPwd !== confirmPwd) {
            message.error("密码输入不一致。");
            return;
        }

        this.setState({ loadingReset: true });
        const postData = {
            newPassword: newPwd,
            confirmPassword: confirmPwd,
            encryptedLinkValue: this.props.enc,
        };
        post(ApiPort.POSTForgetPassword + "&notificationType=EMAIL", postData)
            .then((res) => {
                this.setState({ loadingReset: false });
                if (res.isSuccess) {
                    Modal.info({
                        title: "成功",
                        okText: "关闭",
                        content:
                            "恭喜你已成功重置您的密码，请您使用新密码登入。",
                    });
                    this.setState({ visible: false });
                } else {
                    Modal.info({
                        title: "失败",
                        okText: "关闭",
                        content: "重置密码失败！",
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <Modal
                title="重置密码"
                closeIcon={<Icon type="close" style={{ fontSize: "18px" }} />}
                className="modal-pubilc"
                visible={this.state.visible}
                onOk={this.handleEvent}
                onCancel={this.handleEvent}
                width={400}
                footer={null}
            >
                <Spin spinning={this.state.loadingReset} tip="请稍后...">
                    <div className="user-modal">
                        <div className="IputBox">
                            <Input
                                type="password"
                                size="large"
                                placeholder="新密码"
                                onChange={(e) => this.onChange(e, "newPwd")}
                                onPressEnter={() => this.HandleEnterKey()}
                                maxLength={16}
                            />
                        </div>
                        <div className="IputBox">
                            <Input
                                type="password"
                                size="large"
                                placeholder="确认密码"
                                onChange={(e) => this.onChange(e, "confirmPwd")}
                                onPressEnter={() => this.HandleEnterKey()}
                                maxLength={16}
                            />
                        </div>
                        <Button
                            size="large"
                            type="primary"
                            block
                            onClick={this.handleSubmit}
                        >
                            提交
                        </Button>
                    </div>
                </Spin>
            </Modal>
        );
    }
}
