import { ApiPort } from "$ACTIONS/TLCAPI";
import { patch, put } from "$ACTIONS/TlcRequest";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import {
    Input,
    Form,
    Row,
    Col,
    message,
    Button,
    DatePicker,
    Spin,
    Modal,
} from "antd";
import { getQueryVariable } from "$ACTIONS/helper";
import { pwdReg, emailReg } from "$ACTIONS/reg";
import Head from "next/head";
import React from "react";
import { translate } from "$ACTIONS/Translate";
import PublicHead from "@/Layout/PublicHead";
let defaultDisabled = true;

class RedirectResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PTName: "",
            disabledName: false,
            loadingStatus: false,
            showPwdTip: false, // 密码输入框16位提示信息
            showConfirmPwdTip: false, // 确认密码输入框16位提示信息
            logoHref: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);

        global.globalExit = () => {
            window.location.href = "/vn/";
        };
    }

    componentDidMount() {
        this.memberName =
            getQueryVariable("username") || getQueryVariable("membercode");
        this.encryptedText = getQueryVariable("enc");

        // 验证当前加密代码是否符合规则
        patch(
            ApiPort.VerifyResetPasswordLink +
            "&encryptedValue=" +
            encodeURIComponent(this.encryptedText)
        )
            .then((res) => {
                if (res && !res.isSuccess) {
                    Modal.info({
                        className: "confirm-modal-of-public",
                        icon: <div />,
                        title: "重置密码失败",
                        centered: true,
                        okText: "关闭",
                        zIndex: 2000,
                        content: (
                            <div
                                style={{ textAlign: "center" }}
                                dangerouslySetInnerHTML={{
                                    __html: "重置密码链接已失效",
                                }}
                            />
                        ),
                        onCancel: () => {
                            window.location.href = "/vn/";
                        },
                        onOk: () => {
                            window.location.href = "/vn/";
                        },
                    });
                } else {
                    this.setState({
                        emailInfo: res.result,
                    });
                }
            })
            .catch((error) => {
                console.log("------->", error);
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.showPwdTip !== this.state.showPwdTip &&
            this.state.showPwdTip
        ) {
            this.showPwdTipTimer = setTimeout(() => {
                this.setState({ showPwdTip: false });
            }, 5000);
        }
        if (
            prevState.showConfirmPwdTip !== this.state.showConfirmPwdTip &&
            this.state.showConfirmPwdTip
        ) {
            this.showConfirmPwdTipTimer = setTimeout(() => {
                this.setState({ showConfirmPwdTip: false });
            }, 5000);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.showPwdTipTimer);
        clearTimeout(this.showConfirmPwdTip);
    }

    handleSubmit(e) {
        e.preventDefault();
        const { emailInfo } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loadingStatus: true });
                // const emailInfo = {
                //     memberCode : 'oppovn1',
                //     email: 'oppovn1@oppo.comn',
                //     emailCode:'oppoe'
                // }
                put(ApiPort.SubmitResetPasswordLink, {
                    memberCode: emailInfo.memberCode,
                    email: emailInfo.email,
                    newPassword: values.password,
                    emailCode: emailInfo.emailCode,
                })
                    .then((res) => {
                        this.setState({ loadingStatus: false });
                        if (res.isSuccess) {
                            Modal.info({
                                className: "confirm-modal-of-forgetuser",
                                icon: <div />,
                                title: translate("重设密码"),
                                centered: true,
                                okText: translate("关闭"),
                                content:
                                    <div
                                        style={{ textAlign: "center" }}
                                        dangerouslySetInnerHTML={{
                                            __html: translate("您已成功重置密码，请使用新密码登录！"),
                                        }}

                                    />,
                                onOk: () => {
                                    window.location.href = "/vn/";
                                },
                            });
                        } else {
                            Modal.info({
                                className: "confirm-modal-of-forgetuser",
                                icon: <div />,
                                title: translate("重设密码"),
                                centered: true,
                                okText: translate("关闭"),
                                content: (
                                    <div
                                        style={{ textAlign: "center" }}
                                        dangerouslySetInnerHTML={{
                                            __html: res.errors[0].description || translate('系统错误，请联系在线支持！'),
                                        }}
                                    />
                                ),
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);

                        this.setState({ loadingStatus: false });
                    });
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldValue } =
            this.props.form;
        const { visibleError } = this.state;
        return (
            <React.Fragment>
                <Head>
                    <title>{"FUN88"}</title>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
                    <link
                        rel="shortcut icon"
                        type="image/x-icon"
                        href="/vn/img/logo/favicon.ico"
                    />
                    <meta name="description" content={""} />
                    <meta name="Keywords" content={""} />
                    <script src="/vn/js/polyfill.min.js" />
                </Head>
                <div id="maintain" className="common-distance-wrap link-resetpassword-page">
                    <div className="maintain-header-wrap">
                        <PublicHead />
                    </div>
                    <div className="common-distance">
                        <div className="reset-content">
                            <div className="reset-wrap">
                                <h3>{translate("更改密码")}</h3>
                                <div style={{ padding: "20px" }}>
                                    <Row>
                                        <Col span={24}>
                                            <Form
                                                className="user-form-wrap"
                                                {...formItemLayout}
                                                onSubmit={this.handleSubmit}
                                            >
                                                <Form.Item
                                                    label={translate("新的密码")}
                                                    className={
                                                        this.state.showPwdTip
                                                            ? "defined-error"
                                                            : null
                                                    }
                                                // extra={
                                                //     this.state.showPwdTip
                                                //         ? "您已达到 20 个字符的输入上限"
                                                //         : null
                                                // }
                                                >
                                                    {getFieldDecorator(
                                                        "password",
                                                        {
                                                            rules: [
                                                                {
                                                                    required: false,
                                                                    message: ""
                                                                },
                                                                {
                                                                    validator: (
                                                                        rule,
                                                                        value,
                                                                        callback
                                                                    ) => {
                                                                        if (
                                                                            pwdReg.test(
                                                                                value
                                                                            ) ===
                                                                            false
                                                                        ) {
                                                                            callback(
                                                                                translate("密码必须包含 6-20 个字母数字字符“A-Z”、“a-z”、“0-9”，并且可以包含 4 个特殊字符 ^# $@")
                                                                            );
                                                                            return;
                                                                        }
                                                                        if (
                                                                            value &&
                                                                            value.length ===
                                                                            20
                                                                        ) {
                                                                            this.setState(
                                                                                {
                                                                                    showPwdTip: true,
                                                                                }
                                                                            );
                                                                        }
                                                                        callback();
                                                                    },
                                                                },
                                                            ],
                                                        }
                                                    )(
                                                        <Input.Password
                                                            size="large"
                                                            type="password"
                                                            maxLength={20}
                                                            autoComplete="off"
                                                            placeholder={translate("新的密码(小写)")}
                                                        />
                                                    )}
                                                </Form.Item>
                                                <Form.Item
                                                    label={translate("重新输入新密码")}
                                                    className={
                                                        this.state
                                                            .showConfirmPwdTip
                                                            ? "defined-error"
                                                            : null
                                                    }
                                                // extra={
                                                //     this.state
                                                //         .showConfirmPwdTip
                                                //         ? "您已达到 20 个字符的输入上限"
                                                //         : null
                                                // }
                                                >
                                                    {getFieldDecorator(
                                                        "passwordconfirm",
                                                        {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: translate("确认密码和新密码不一致"),
                                                                },
                                                                {
                                                                    validator: (
                                                                        rule,
                                                                        value,
                                                                        callback
                                                                    ) => {
                                                                        if (
                                                                            value
                                                                        ) {
                                                                            getFieldValue(
                                                                                "password"
                                                                            ) !==
                                                                                value &&
                                                                                callback(
                                                                                    translate("确认密码和新密码不一致")
                                                                                );
                                                                        }
                                                                        if (
                                                                            value &&
                                                                            value.length ===
                                                                            20
                                                                        ) {
                                                                            this.setState(
                                                                                {
                                                                                    showConfirmPwdTip: true,
                                                                                }
                                                                            );
                                                                        }
                                                                        callback();
                                                                    },
                                                                },
                                                            ],
                                                        }
                                                    )(
                                                        <Input.Password
                                                            size="large"
                                                            type="password"
                                                            maxLength={20}
                                                            autoComplete="off"
                                                            placeholder={translate("重新输入新密码(小写)")}
                                                        />
                                                    )}
                                                </Form.Item>
                                                <div className="line-distance" />
                                                <Form.Item
                                                    {...tailFormItemLayout}
                                                >
                                                    <div className="btn-wrap">
                                                        <Button
                                                            size="large"
                                                            type="danger"
                                                            htmlType="submit"
                                                            disabled={
                                                                Object.values(
                                                                    getFieldsError()
                                                                ).some(
                                                                    (v) =>
                                                                        v !==
                                                                        undefined
                                                                ) ||
                                                                !getFieldValue(
                                                                    "password"
                                                                ) ||
                                                                !getFieldValue(
                                                                    "passwordconfirm"
                                                                )
                                                            }
                                                            loading={
                                                                this.state
                                                                    .loadingStatus
                                                            }
                                                            block
                                                        >
                                                            {translate("提交")}
                                                        </Button>
                                                    </div>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Form.create({
    name: "redirectresetpassword",
    onValuesChange: (props, changeVal, allVal) => {
        allVal.password && allVal.passwordconfirm && (defaultDisabled = false);
    },
})(RedirectResetPassword);
