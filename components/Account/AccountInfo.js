import React from "react";
import {
    Row,
    Col,
    Form,
    Button,
    Checkbox,
    Input,
    message,
    Popover,
    Icon,
} from "antd";
import { formItemLayout } from "$ACTIONS/constantsData";
import { emailReg, telegramReg } from "$ACTIONS/reg";
import EmailVerify from "@/Verification/EmailVerify";
import PhoneVerify from "@/Verification/PhoneVerify";
import { getMemberInfo, setMemberInfo, setMemberInfoPut } from "$DATA/userinfo";
import { BsInfoCircleFill } from "react-icons/bs";
import { connect } from "react-redux";
import { getMaskHandler } from "../../actions/helper";
import { translate } from "$ACTIONS/Translate";

const { Item } = Form;

class AccountInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEnable: false,
            emailVisible: false,
            phoneVisible: false,
            offerContacts: [], // 联系方式
            attemptRemaining: "5",
            emailattemptRemaining: "5",
            isPopoverVisible: false,
            checkboxValue: this.tranferContacts(
                this.props.memberInfo.offerContacts,
            ).filter((contact) =>
                ["isCall", "isEmail", "isSMS"].some(
                    (method) => method === contact,
                ),
            ),
        };

        this.VerifyCategory = this.VerifyCategory.bind(this);
        this.resetForm = this.resetForm.bind(this); // 重置表单
        this.tranferContacts = this.tranferContacts.bind(this); // 对象转换数组
        this.correctMemberInfo = this.correctMemberInfo.bind(this); // 更正会员信息
        this.openEmailVerification = this.openEmailVerification.bind(this); // 打开邮箱验证
        this.openPhoneVerification = this.openPhoneVerification.bind(this); // 打开手机号验证
        this.getVerifiedStatusBox = this.getVerifiedStatusBox.bind(this);
        this.getCheckboxStatusUI = this.getCheckboxStatusUI.bind(this);
    }

    componentDidMount() {}
    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.memberInfo !== this.props.memberInfo &&
            this.props.memberInfo?.offerContacts
        ) {
            this.setState({
                checkboxValue: this.tranferContacts(
                    this.props.memberInfo.offerContacts,
                ).filter((contact) =>
                    ["isCall", "isEmail", "isSMS"].some(
                        (method) => method === contact,
                    ),
                ),
            });
        }
    }
    VerifyCategory(param, otpVisible, status) {
        if (param == "Email") return this.setState({ emailVisible: status });
        if (param == "Phone") return this.setState({ phoneVisible: status });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                const { contacts } = this.props.memberInfo;
                let contactsMap = {};
                let promiseArr = [];
                Array.isArray(contacts) &&
                    contacts.forEach((val) => {
                        contactsMap[val.contactType] = val.contact;
                    });
                console.log(
                    "🚀 ~ file: AccountInfo.js:72 ~ AccountInfo ~ this.props.form.validateFields ~ contactsMap:",
                    contactsMap,
                );

                promiseArr.push(
                    new Promise((resolve, reject) => {
                        setMemberInfo(
                            {
                                key: "offerContacts",
                                value1:
                                    '{"isCall": ' +
                                    !!~values.contactMethods.indexOf("isCall") +
                                    ',"isEmail": ' +
                                    !!~values.contactMethods.indexOf(
                                        "isEmail",
                                    ) +
                                    ',"isSMS": ' +
                                    !!~values.contactMethods.indexOf("isSMS") +
                                    "}",
                            },
                            (res) => {
                                if (res && res.isSuccess) {
                                    resolve(res);
                                } else {
                                    reject(res);
                                }
                            },
                        );
                    }),
                );

                if (!contactsMap.Email) {
                    promiseArr.push(
                        new Promise((resolve, reject) => {
                            setMemberInfo(
                                {
                                    key: "Email",
                                    value1: values.email,
                                },
                                (res) => {
                                    if (res && res.isSuccess) {
                                        resolve(res);
                                    } else {
                                        reject(res);
                                    }
                                },
                            );
                        }),
                    );
                }

                // if (!contactsMap.Phone) {
                //     promiseArr.push(new Promise((resolve, reject) => {
                //         setMemberInfo({
                //             key: 'Phone',
                //             value1: values.phone
                //         }, (res) => {
                //             if (res && res.isSuccess) {
                //                 resolve(res);
                //             } else {
                //                 reject(res);
                //             }
                //         });
                //     }));
                // }

                if (
                    !contactsMap.Telegram ||
                    (contactsMap.Telegram !== values.telegram &&
                        values.telegram)
                ) {
                    promiseArr.push(
                        new Promise((resolve, reject) => {
                            setMemberInfoPut(
                                {
                                    messengerDetails: [
                                        {
                                            Contact: values.telegram,
                                            ContactTypeId: "15",
                                        },
                                    ],
                                },
                                (res) => {
                                    if (res && res.isSuccess) {
                                        resolve(res);
                                    } else {
                                        reject(res);
                                    }
                                },
                            );
                        }),
                    );
                }

                Promise.all(promiseArr)
                    .then(() => {
                        message.success(translate("成功"));
                        this.setState({ isEnable: false });
                        getMemberInfo((res) => {
                            this.props.setMemberInfo(res);
                            this.props.setSelfMemberInfo(res);
                            this.props.form.resetFields();
                            this.props.setLoading(false);
                        }, true);
                    })
                    .catch((err) => {
                        getMemberInfo((res) => {
                            this.props.setMemberInfo(res);
                            this.props.setSelfMemberInfo(res);
                            this.props.form.resetFields();
                            this.props.setLoading(false);
                        }, true);
                        Array.isArray(err) &&
                            err.forEach((v) => {
                                if (v.message == "MEM00050") {
                                    message.error(
                                        v.message ||
                                            v.result.Message ||
                                            translate("失败"),
                                    );
                                } else {
                                    message.error(
                                        v.message || v.result.Message,
                                    );
                                }
                            });
                    });
            }
        });

        Pushgtagdata("Save_contact_personal");
    };
    resetForm() {
        this.setState({ isEnable: false });
        this.props.form.resetFields();
        this.setState({
            checkboxValue: this.tranferContacts(
                this.props.memberInfo.offerContacts,
            ).filter((contact) =>
                ["isCall", "isEmail", "isSMS"].some(
                    (method) => method === contact,
                ),
            ),
        });
        Pushgtagdata("Cancel_contact_personal");
    }
    correctMemberInfo(call) {
        this.props.setLoading(true);
        getMemberInfo((res) => {
            this.props.setMemberInfo(res);
            this.props.setSelfMemberInfo(res);
            this.props.setLoading(false);
            typeof call === "function" && call();
        }, true);
    }
    openEmailVerification() {
        const promiseVerification = this.props.form.validateFields(["email"]);
        promiseVerification.then(() => {
            this.setState({ emailVisible: true });
        });
        Pushgtagdata("Emailverification_contact_personal");
    }
    openPhoneVerification() {
        this.setState({ phoneVisible: true });
        Pushgtagdata("Phoneverification_contact_personal");
    }
    tranferContacts(offerContacts) {
        if (!offerContacts) {
            return [];
        } else {
            let array = [];
            for (let value in offerContacts) {
                offerContacts[value] && array.push(value);
            }
            return array;
        }
    }

    getVerifiedStatusBox(isItemVerified, verifyHandler) {
        return (
            <div
                className={`verifiled-status-box ${
                    isItemVerified && isItemVerified[1] && "verified"
                }`}
            >
                {isItemVerified && isItemVerified[1] && (
                    <img
                        src={`${process.env.BASE_PATH}/img/icons/icon-checked.png`}
                    />
                )}
                <p
                    onClick={() => {
                        if (!isItemVerified[1]) {
                            verifyHandler();
                        }
                    }}
                >
                    {isItemVerified && isItemVerified[1]
                        ? translate("已验证")
                        : translate("立即验证")}
                </p>
            </div>
        );
    }

    getCheckboxStatusUI(filedName) {
        return (
            <img
                style={{
                    transition: "all 0.3s",
                    width: "16px",
                    height: "16px",
                    position: "absolute",
                    top: "14px",
                    left: "0",
                }}
                src={`${process.env.BASE_PATH}/img/icons/${
                    this.state.checkboxValue.includes(filedName)
                        ? "icon-checked.png"
                        : "greyCheck.svg"
                }`}
            />
        );
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {
            userName,
            memberCode,
            contacts,
            offerContacts,
            isVerifiedEmail,
            isVerifiedPhone,
        } = this.props.memberInfo;
        const { isPopoverVisible, checkboxValue, isEnable } = this.state;

        let contactsMap = {};
        Array.isArray(contacts) &&
            contacts.forEach((val) => {
                contactsMap[val.contactType] = val.contact;
            });
        let isSubmittable = false;
        const isContactMethodInvalid =
            this.props.form.getFieldError("contactMethods");
        const isTelegramInvalid = this.props.form.getFieldError("telegram");
        const isTelegramTouched = this.props.form.isFieldTouched("telegram");
        const isTelegramHasValue = !!this.props.form.getFieldValue("telegram");
        const isContactMethodTouched =
            this.props.form.isFieldTouched("contactMethods");

        if (
            checkboxValue.length >= 2 &&
            !isTelegramInvalid &&
            isTelegramHasValue &&
            (isTelegramTouched || isContactMethodTouched)
        ) {
            isSubmittable = true;
        }

        return (
            <React.Fragment>
                <p className="home-section-title">{translate("安全信息")}</p>
                <Form
                    className="user-form-wrap"
                    {...formItemLayout}
                    onSubmit={this.handleSubmit}
                >
                    <Row className="ant-form-item" gutter={100}>
                        <Col span={12}>
                            <Item
                                label={translate("用户名(大写)")}
                                className="user-center-account-profile-input-item"
                            >
                                <Input
                                    size="large"
                                    className="tlc-input-disabled user-center-account-profile-input"
                                    disabled={true}
                                    autoComplete="off"
                                    value={userName}
                                />
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item
                                label={translate("会员代码")}
                                className="user-center-account-profile-input-item"
                            >
                                <Input
                                    size="large"
                                    className="tlc-input-disabled user-center-account-profile-input"
                                    disabled={true}
                                    autoComplete="off"
                                    value={memberCode}
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row className="ant-form-item" gutter={100}>
                        <Col span={12}>
                            <Item
                                label={translate("邮箱")}
                                className="user-center-account-profile-input-item"
                            >
                                {getFieldDecorator("email", {
                                    initialValue: getMaskHandler(
                                        "Email",
                                        contactsMap.Email,
                                    ),
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                translate("请输入电子邮箱"),
                                        },
                                    ],
                                })(
                                    <Input
                                        disabled={true}
                                        placeholder={translate(
                                            "请输入电子邮箱",
                                        )}
                                        size="large"
                                        autoComplete="off"
                                        className="user-center-account-profile-input"
                                        maxLength={50}
                                    />,
                                )}
                                {this.getVerifiedStatusBox(
                                    isVerifiedEmail,
                                    this.openEmailVerification,
                                )}
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item
                                label={translate("电话号码")}
                                className="user-center-account-profile-input-item"
                            >
                                {getFieldDecorator("phone", {
                                    initialValue: getMaskHandler(
                                        "Phone",
                                        contactsMap.Phone,
                                    ),
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                translate("请输入联系电话"),
                                        },
                                    ],
                                })(
                                    <Input
                                        disabled={true}
                                        size="large"
                                        autoComplete="off"
                                        className="user-center-account-profile-input"
                                        maxLength={9}
                                        placeholder={translate(
                                            "请输入联系电话",
                                        )}
                                    />,
                                )}
                                {this.getVerifiedStatusBox(
                                    isVerifiedPhone,
                                    this.openPhoneVerification,
                                )}
                            </Item>
                        </Col>
                    </Row>
                    <Row className="ant-form-item" gutter={100}>
                        <Col span={12}>
                            <Item
                                label={
                                    <>
                                        {translate("联系方式")}
                                        <Popover
                                            trigger="click"
                                            placement="topLeft"
                                            align={{ offset: [-8, 0] }}
                                            overlayClassName="info-popover"
                                            visible={isPopoverVisible}
                                            onVisibleChange={(status) => {
                                                this.setState({
                                                    isPopoverVisible: status,
                                                });
                                            }}
                                            content={
                                                <>
                                                    <p className="p-text">
                                                        {translate(
                                                            "您至少可以选择2种方式，以便我们及时联系您发送礼物、发布新活动！",
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                this.setState({
                                                                    isPopoverVisible: false,
                                                                });
                                                            }}
                                                        >
                                                            <Icon type="close" />
                                                        </button>
                                                    </p>
                                                </>
                                            }
                                        >
                                            <span
                                                style={{ paddingLeft: "6px" }}
                                            >
                                                <BsInfoCircleFill
                                                    cursor="pointer"
                                                    size={10}
                                                    color="#00A6FF"
                                                />
                                            </span>
                                        </Popover>
                                    </>
                                }
                                className="checkbox-correct"
                            >
                                {getFieldDecorator("contactMethods", {
                                    initialValue: this.state.checkboxValue,
                                    rules: [
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback,
                                            ) => {
                                                if (Array.isArray(value)) {
                                                    if (
                                                        !offerContacts.isNonMandatory
                                                    ) {
                                                        if (value.length < 2) {
                                                            callback(
                                                                translate(
                                                                    "请至少选择两个联系方式。",
                                                                ),
                                                            );
                                                        }
                                                    }
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                })(
                                    <Checkbox.Group
                                        onChange={(e) => {
                                            this.setState({ checkboxValue: e });
                                        }}
                                        className="general-check-box"
                                        disabled={!isEnable}
                                        style={{ width: "100%" }}
                                    >
                                        <Row>
                                            <Col offset={1} span={7}>
                                                <Checkbox value="isCall">
                                                    {translate("打电话")}
                                                </Checkbox>
                                                {this.getCheckboxStatusUI(
                                                    "isCall",
                                                )}
                                            </Col>
                                            <Col span={7}>
                                                <Checkbox value="isSMS">
                                                    {translate("短信")}
                                                </Checkbox>
                                                {this.getCheckboxStatusUI(
                                                    "isSMS",
                                                )}
                                            </Col>
                                            <Col span={7}>
                                                <Checkbox value="isEmail">
                                                    {translate("电子邮件")}
                                                </Checkbox>
                                                {this.getCheckboxStatusUI(
                                                    "isEmail",
                                                )}
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>,
                                )}
                            </Item>
                        </Col>
                        <Col span={12}>
                            <div
                                className={`edit-disabeld${
                                    this.state.isEnable ? " enable" : ""
                                }`}
                            >
                                <Item label={translate("Telegram 账户")}>
                                    {getFieldDecorator("telegram", {
                                        initialValue: contactsMap.Telegram,
                                        rules: [
                                            {
                                                required: true,
                                                message:
                                                    translate(
                                                        "Telegram 账号不能为空",
                                                    ),
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback,
                                                ) => {
                                                    if (
                                                        value &&
                                                        !telegramReg.test(value)
                                                    ) {
                                                        callback(
                                                            translate(
                                                                "格式错误。 只接受字母、数字和字符“_”",
                                                            ),
                                                        );
                                                    }
                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input
                                            placeholder={translate(
                                                "输入您的电报帐户",
                                            )}
                                            size="large"
                                            className="tlc-input-disabled user-center-account-profile-input"
                                            maxLength={50}
                                            autoComplete="off"
                                            disabled={!isEnable}
                                        />,
                                    )}
                                </Item>
                            </div>
                        </Col>
                    </Row>
                    <div className="usercenter-button">
                        {isEnable ? (
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
                                    Pushgtagdata("Edit_contact_personal");
                                }}
                            >
                                {translate("编辑")}
                            </Button>
                        )}
                    </div>
                </Form>
                <EmailVerify
                    GetThroughoutVerification={() => {
                        global.GetThroughoutVerification();
                    }}
                    memberInfo={this.props.memberInfo}
                    visible={this.state.emailVisible}
                    changeVerify={this.VerifyCategory}
                    closeModal={() => {
                        this.setState({ emailVisible: false });
                    }}
                    correctMemberInfo={this.correctMemberInfo}
                    otpParam={`memberProfile-otp`}
                    emailattemptRemaining={this.state.emailattemptRemaining}
                    setEmailAttemptRemaining={(v) =>
                        this.setState({ emailattemptRemaining: v })
                    }
                />
                <PhoneVerify
                    GetThroughoutVerification={() => {
                        global.GetThroughoutVerification();
                    }}
                    isEditPhone={false}
                    memberInfo={this.props.memberInfo}
                    visible={this.state.phoneVisible}
                    closeModal={() => this.setState({ phoneVisible: false })}
                    correctMemberInfo={this.correctMemberInfo}
                    otpParam={`memberProfile-otp`}
                    attemptRemaining={this.state.attemptRemaining}
                    setAttemptRemaining={(v) =>
                        this.setState({ attemptRemaining: v })
                    }
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        memberInfo: state.userCenter.memberInfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Form.create({ name: "AccountInfo" })(AccountInfo));
