import React from "react";
import Router from "next/router";
import { Row, Col, Form, Button, Input, message } from "antd";
import { formItemLayout } from "$ACTIONS/constantsData";
import { put } from "$ACTIONS/TlcRequest";
import { pwdReg } from "$ACTIONS/reg";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { translate } from "$ACTIONS/Translate";
const { Item } = Form;

class UpdatePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEnable: false,
        };

        this.resetForm = this.resetForm.bind(this); // 重置表单
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                put(ApiPort.PUTMemberPassword, {
                    oldPassword: values.oldPwd,
                    newPassword: values.newPwd,
                })
                    .then((res) => {
                        this.props.setLoading(false);
                        if (res.isSuccess == true) {
                            message.success(translate("修改密码成功"));
                            setTimeout(() => {
                                global.globalExit();
                            }, 3000);
                        } else if (res.isSuccess == false) {
                            message.error(translate("修改密码失败"));
                        }
                    })
                    .catch((error) => {
                        console.log("updatePassword error:", error);
                        message.error(translate("修改密码失败"));
                        return null;
                    });
            }
        });

        Pushgtagdata("SavePWmodification_personal");
    };
    resetForm() {
        this.setState({ isEnable: false });
        this.props.form.resetFields();
        Pushgtagdata("CancelPWmodification_personal");
    }
    render() {
        const {
            getFieldDecorator,
            getFieldValue,
            getFieldError,
            isFieldTouched,
        } = this.props.form;
        const isOldPwdHasError = getFieldError("oldPwd");
        const isNewPwdHasError = getFieldError("newPwd");
        const isConfirmPwdHasError = getFieldError("newPwdConfirm");

        const isOldPwdTouched = isFieldTouched("oldPwd");
        const isNewPwdTouched = isFieldTouched("newPwd");
        const isConfirmPwdTouched = isFieldTouched("newPwdConfirm");

        let isSubmittable = false;
        if (
            !isOldPwdHasError &&
            !isNewPwdHasError &&
            !isConfirmPwdHasError &&
            isOldPwdTouched &&
            isNewPwdTouched &&
            isConfirmPwdTouched
        ) {
            isSubmittable = true;
        }

        return (
            <React.Fragment>
                <p className="home-section-title">{translate("更改密码")}</p>
                <Form
                    className="user-form-wrap"
                    {...formItemLayout}
                    onSubmit={this.handleSubmit}
                >
                    <div
                        className={`edit-disabeld${
                            this.state.isEnable ? " enable" : ""
                        }`}
                    >
                        <Row gutter={100} style={{ minHeight: "143px" }}>
                            <Col span={12}>
                                <Item
                                    label={translate("当前密码")}
                                    className="user-center-account-profile-input-item"
                                >
                                    {getFieldDecorator("oldPwd", {
                                        rules: [
                                            {
                                                required: true,
                                                message: translate("当前密码不能为空"),
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback
                                                ) => {
                                                    if (
                                                        value &&
                                                        !pwdReg.test(value)
                                                    ) {
                                                        callback(
                                                            translate("当前密码不正确")
                                                        );
                                                    }
                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input.Password
                                            className="user-center-account-profile-input"
                                            size="large"
                                            placeholder={translate("输入密码")}
                                            maxLength={20}
                                            autoComplete="off"
                                        />
                                    )}
                                </Item>
                            </Col>
                            <Col span={12}>
                                <Item
                                    label={translate("新的密码")}
                                    className="user-center-account-profile-input-item"
                                >
                                    {getFieldDecorator("newPwd", {
                                        rules: [
                                            {
                                                required: true,
                                                message: translate("新密码不能为空"),
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback
                                                ) => {
                                                    if (
                                                        value &&
                                                        !pwdReg.test(value)
                                                    ) {
                                                        callback(
                                                            translate("密码必须包含 6-20 个字母数字字符“A-Z”、“a-z”、“0-9”，并且可以包含 4 个特殊字符 ^# $@")
                                                        );
                                                    }
                                                    if (
                                                        value && getFieldValue(
                                                            "oldPwd"
                                                        ) === value
                                                    ) {
                                                        callback(
                                                            translate("新密码不能与当前密码相同")
                                                        );
                                                    }
                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input.Password
                                            className="user-center-account-profile-input"
                                            size="large"
                                            placeholder={translate("输入您的新密码")}
                                            maxLength={20}
                                            autoComplete="off"
                                        />
                                    )}
                                </Item>
                                <Item
                                    label={translate("重新输入新密码")}
                                    className="user-center-account-profile-input-item"
                                >
                                    {getFieldDecorator("newPwdConfirm", {
                                        rules: [
                                            {
                                                required: true,
                                                message: translate("重新输入新密码，不能为空"),
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback
                                                ) => {
                                                    if (
                                                        value && getFieldValue(
                                                            "newPwd"
                                                        ) !== value
                                                    ) {
                                                        callback(
                                                            translate("密码不匹配")
                                                        );
                                                    }
                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input.Password
                                            className="user-center-account-profile-input"
                                            size="large"
                                            placeholder={translate("重新输入新密码(小写)")}
                                            maxLength={20}
                                            autoComplete="off"
                                        />
                                    )}
                                </Item>
                            </Col>
                        </Row>
                    </div>
                    <div className="usercenter-button">
                        {this.state.isEnable ? (
                            <React.Fragment>
                                <Button size="large" onClick={this.resetForm}>
                                    {translate("取消")}
                                </Button>
                                <Button
                                    className="btn-submit"
                                    disabled={!isSubmittable}
                                    size="large"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {translate("保存")}
                                </Button>
                            </React.Fragment>
                        ) : (
                            <Button
                                size="large"
                                type="primary"
                                ghost
                                onClick={() => {
                                    this.setState({ isEnable: true });
                                    Pushgtagdata(
                                        "Edit_PWmodification_personal"
                                    );
                                }}
                            >
                                {translate("编辑")}
                            </Button>
                        )}
                    </div>
                </Form>
            </React.Fragment>
        );
    }
}

export default Form.create({ name: "UpdatePassword" })(UpdatePassword);
