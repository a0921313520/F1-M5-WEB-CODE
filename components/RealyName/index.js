import React from "react";
import { Modal, Input, Button } from "antd";
import { getMemberInfo, setUserRealyName } from "$DATA/userinfo";

class RealyName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userRealyNameState: "", // 充值完善姓名state值
            fillRealyNameLoading: false, // 充值完善姓名按钮是否加载中状态
        };

        this.handleOk = this.handleOk.bind(this); // 提交完善姓名表单
        this.setRealyNameState = this.setRealyNameState.bind(this); // 设置真实姓名State值
    }
    componentDidMount() {}
    setRealyNameState({ target: { value } }) {
        this.setState({ userRealyNameState: value });
    }
    handleOk() {
        this.setState({ fillRealyNameLoading: true });
        const { userRealyNameState } = this.state;
        setUserRealyName(userRealyNameState, (res) => {
            if (res.isSuccess) {
                this.props.onCancel();
                this.props.onChangeName(userRealyNameState);
                this.props.setLoading && this.props.setLoading(true);
                this.props.type === "promotion" && this.props.nextStep();
                getMemberInfo(() => {
                    this.props.setLoading && this.props.setLoading(false);
                }, true);
            }

            this.setState({ fillRealyNameLoading: false });
        });
    }
    render() {
        const isPromotion = this.props.type === "promotion";
        return (
            <Modal
                width={400}
                centered={true}
                title={isPromotion ? "请填写真实姓名" : "请输入真实姓名"}
                className="tlc-modal-confirm"
                visible={this.props.realyNameVisible}
                onCancel={this.props.onCancel}
                footer={null}
            >
                <p>
                    {isPromotion
                        ? "请在申请优惠前填写您的真实姓名，必须与银行账户姓名一致。"
                        : "请务必输入您的真实姓名，才能进行充值。"}
                </p>
                <Input
                    size="large"
                    placeholder="请输入真实姓名"
                    onChange={this.setRealyNameState}
                />
                <div className={isPromotion ? "btns-wrap" : "only-wrap"}>
                    {isPromotion ? (
                        <Button
                            type="primary"
                            size="large"
                            ghost
                            onClick={this.props.onCancel}
                        >
                            取消
                        </Button>
                    ) : null}
                    <Button
                        key="submit"
                        type="primary"
                        size="large"
                        block
                        loading={this.state.fillRealyNameLoading}
                        onClick={this.handleOk}
                    >
                        提交
                    </Button>
                </div>
            </Modal>
        );
    }
}

export default RealyName;
