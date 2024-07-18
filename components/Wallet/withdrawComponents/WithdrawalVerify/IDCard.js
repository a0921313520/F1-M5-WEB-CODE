/*
 * @Author: Alan
 * @Date: 2021-12-01 14:58:21
 * @LastEditors: Alan
 * @LastEditTime: 2023-05-04 23:11:30
 * @Description: 验证真实姓名
 * @FilePath: \F1-M1-WEB-Code\components\Wallet\withdrawComponents\WithdrawalVerify\IDCard.js
 */
import React from "react";
import { createForm } from "rc-form";
import { Input, message, Button } from "antd";
import Item from "@/View/Formitem";
import { setMemberInfo } from "$DATA/userinfo";
import { idCard } from "$ACTIONS/reg";

class RealyName extends React.Component {
    constructor(props) {
        super(props);
        //console.log(props);
        this.state = {
            Loading: false,
            userRealyNameState: "",
            userIdState: "",
        };

        this.handleOk = this.handleOk.bind(this);
    }
    componentDidMount() {
        //this.props.onRef(this);
    }

    handleOk() {
        if (!this.submitBtnEnable()) return;
        this.props.setLoading(true);
        let userInfo = {
            key: "IdentityCard",
            value1: this.state.userIdState,
        };
        setMemberInfo(userInfo, (res) => {
            if (res.isSuccess && res.result.isSuccess) {
                message.success({ content: "提交成功", type: "loading" }, 3);
                setTimeout(() => {
                    this.props.getMemberData();
                }, 1000);
            } else {
                message.success(res.result.message);
            }
            this.props.setLoading(false);
        });
        Pushgtagdata(
            `Verification`,
            "Submit",
            `Submit_NationalID_WithdrawPage`,
        );
    }
    setidCardState = (e) => {
        this.setState({ userIdState: e.target.value });
    };

    submitBtnEnable = () => {
        let errors = Object.values(this.props.form.getFieldsError()).some(
            (v) => v !== undefined,
        );
        let idCard = this.props.form.getFieldValue("useridCardState");
        return idCard !== "" && idCard !== undefined && !errors;
    };

    render() {
        const { getFieldDecorator, getFieldError } = this.props.form;
        console.log(this.props.memberInfo);
        return (
            <div>
                <div className="IDCardVerify">
                    <h3>验证身份证号码</h3>
                    <p className="note">请输入您的有效身份证件以验证您的帐户</p>
                    <Item
                        errorMessage={getFieldError("useridCardState")}
                        label="身份证号码 (18位）"
                    >
                        {getFieldDecorator("useridCardState", {
                            rules: [
                                { required: true, message: "请输入身份证号码" },
                                {
                                    validator: (rule, value, callback) => {
                                        //console.log(value);
                                        if (value && !idCard.test(value)) {
                                            callback("身份证号码格式错误");
                                        }
                                        callback();
                                    },
                                },
                            ],
                        })(
                            <Input
                                size="large"
                                disabled={
                                    this.props.memberInfo.identityCard &&
                                    this.props.memberInfo.identityCard !== ""
                                        ? true
                                        : false
                                }
                                onChange={this.setidCardState}
                                maxLength="18"
                                placeholder="请输入身份证号码"
                            />,
                        )}
                    </Item>
                </div>

                <div className={`otp-btn-wrap`}>
                    <Button
                        className="changeVerify"
                        size="large"
                        disabled={!this.submitBtnEnable}
                        onClick={() => {
                            this.props.otpModal();
                        }}
                    >
                        下次再验证
                    </Button>
                    <Button
                        size="large"
                        type="primary"
                        onClick={() => this.handleOk()}
                        disabled={!this.submitBtnEnable()}
                        block
                    >
                        提交
                    </Button>
                </div>
            </div>
        );
    }
}

export default createForm({ fieldNameProp: "realyname" })(RealyName);
