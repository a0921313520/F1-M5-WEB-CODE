import React from "react";
import { Row, Col, Modal, Form, Input, message } from "antd";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { phoneReg } from "$ACTIONS/reg";
import { getMemberInfo, setMemberInfo } from "$DATA/userinfo";

/**
 * 允许单次修改手机号
 * @method PhoneEdit
 * @param {string} disableEdit  是否禁用更新手机号码按钮
 * @param {string} memberCode   获取是否允许修改手机号码所需参数
 * @param {string} phoneNumber   默认手机号码
 * @param {string} isDeposited   是否以存款，如以存款则禁止修改手机号码
 * @param {boolean} dialogVisible  父级窗体关闭重新开启后edit状态需要重置
 * @param {object|undefined} setLoading   用来设置父级loading状态
 * @param {function(string|number)} setRemainingTime  重置父组件发送验证码状态
 * @param {function(boolean)} setSendBtnDisable   用来设置父级发送验证码按钮禁用状态
 * @param {function(phoneNumber)} updatePhoneNumber  本地同步更新手机号参数值
 * @param {function(memberInfo)|undefined} updateProfile  如果传递此参数，则代表需要更正父级的个人信息状态
 */
const { Item } = Form;
class PhoneEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditPhone: false,
            inputPhoneDisabled: true,
            phonestatus: 0, // 0 初始狀態 1 編輯 2 編輯且符合格式
            updatePhoneStatus: 0, // 0 图标  1 更新禁用  2 更新启用
            phoneMaxLength: 11,
        };

        this.getEditPhoneStatus = this.getEditPhoneStatus.bind(this);
        // this.updatePhoneStatus = this.updatePhoneStatus.bind(this);
        this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
        this.resetEditStatus = this.resetEditStatus.bind(this);

        this.phonePrefix = [];
        this.maxLength = 0;
        this.minLength = 0;
    }
    componentDidMount() {
        // 获取手机号是否可更新状态
        this.getEditPhoneStatus();
        // 获取手机号验证格式
        get(ApiPort.PhonePrefix)
            .then((res) => {
                this.phonePrefix = res.result.prefixes;
                res.result.maxLength &&
                    this.setState({ phoneMaxLength: res.result.maxLength });
                this.maxLength = res.result.maxLength;
                this.minLength = res.result.minLength;
            })
            .catch((error) => {
                console.log("PhonePrefix error:", error);
            });
        this.props.isEditPhoneHandler(this);
    }
    componentDidUpdate(prevProps, prevState) {
        // 当会员前置信息获取成功后获取是否允许更改手机号
        // if (
        //     prevProps.memberCode !== this.props.memberCode &&
        //     this.props.memberCode
        // ) {
        //     this.getEditPhoneStatus();
        // }
        // if (prevState.updatePhoneStatus !== this.state.updatePhoneStatus) {
        //     this.props.setSendBtnDisable(!!this.state.updatePhoneStatus);
        // }
        // 更新父組件發送按鈕狀態
        if (prevState.phonestatus !== this.state.phonestatus) {
            if (this.state.phonestatus === 1) {
                this.props.setSendBtnDisable(true);
            } else if (this.state.phonestatus === 2) {
                this.props.setSendBtnDisable(false);
            }
        }
        if (
            prevProps.dialogVisible !== this.props.dialogVisible &&
            this.props.dialogVisible
        ) {
            this.resetEditStatus();
            this.getEditPhoneStatus();
        }
        // if (
        //     prevProps.phoneStatus !== this.props.phoneStatus &&
        //     this.props.phoneStatus
        // ) {
        //     this.getEditPhoneStatus();
        // }
    }
    getEditPhoneStatus() {
        this.setState({ isEditPhone: false });
        // 获取手机号是否可更新状态
        // get(ApiPort.IsPhoneAllowedEdit + "&Membercode=" + this.props.memberCode)
        //     .then((res) => {
        //         this.setState({ isEditPhone: res.result });
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
        // 获取手机号是否可更新状态
        get(ApiPort.MemberFlagsStatus + "&flagKey=IsPhoneEditable")
            .then((data) => {
                if (data.isSuccess) {
                    this.setState({
                        isEditPhone: data.result.isPhoneEditable,
                    });
                    this.props.setPhoneEditable(data.result.isPhoneEditable);
                }
            })
            .catch((err) => {
                //console.log(err);
            });
    }
    resetEditStatus() {
        this.props.form.setFieldsValue({ phoneNumber: this.props.phoneNumber });
        this.setState({
            // inputPhoneDisabled: true,
            // updatePhoneStatus: 0,
            isEditPhone: false,
            phonestatus: 0,
        });
    }
    // updatePhoneStatus() {
    //     if (!this.props.disableEdit) {
    //         this.props.form.setFieldsValue({ phoneNumber: "" });
    //         this.setState({
    //             inputPhoneDisabled: false,
    //             updatePhoneStatus: 1,
    //         });
    //     }
    // }
    updatePhoneNumber() {
        if (this.state.phonestatus === 2) {
            this.props.form.validateFields(["phoneNumber"], (err, values) => {
                if (!err) {
                    this.props.setLoading(true);
                    setMemberInfo(
                        {
                            key: "Contact",
                            value1: "86-" + values.phoneNumber,
                        },
                        (res) => {
                            if (res && res.isSuccess) {
                                // 更新UI按钮状态及禁用手机号输入框
                                this.setState({
                                    // inputPhoneDisabled: true, // 禁用手机号码输入框
                                    // updatePhoneStatus: 0, // 重置手机号更新按钮状态为图标
                                    isEditPhone: false, // 禁用用户修改手机号码权限
                                    phonestatus: 0, // 初始狀態
                                });

                                // 半黑透明提示更新手机号成功
                                // const updateSuccessDialog = Modal.info({
                                //     title: ``,
                                //     centered: true,
                                //     mask: false,
                                //     zIndex: 1501,
                                //     content: (
                                //         <div>
                                //             <img src="/vn/img/user/otpVerify/icon-success.png" />
                                //             <p
                                //                 style={{
                                //                     marginTop: 10,
                                //                     marginBottom: 0,
                                //                 }}
                                //             >
                                //                 更新成功
                                //             </p>
                                //         </div>
                                //     ),
                                //     className: "showInfoModal opacity",
                                // });
                                // this.clearDialogTimer = setTimeout(() => {
                                //     updateSuccessDialog.destroy();
                                // }, 2000);
                                // this.props.setRemainingTime("");
                                // 更新仅允许单次修改手机号
                                // setMemberInfo(
                                //     {
                                //         key: "IsAllowEdit",
                                //         value1: false,
                                //     },
                                //     (res) => {
                                //         if (!res.isSuccess) {
                                //             console.error(
                                //                 "用户仅允许单次修改手机号状态更新失败"
                                //             );
                                //         }
                                //     }
                                // );
                                // 更新用户信息
                                getMemberInfo((res) => {
                                    let resPhoneNum = "";
                                    if (
                                        typeof this.props.updateProfile ===
                                        "function"
                                    ) {
                                        resPhoneNum =
                                            this.props.updateProfile(res);
                                    } else {
                                        res.contacts.some((v) => {
                                            if (v.contactType === "Phone") {
                                                resPhoneNum = v.contact;
                                                return true;
                                            }
                                        });
                                    }

                                    resPhoneNum = resPhoneNum.replace(
                                        "86-",
                                        "",
                                    );
                                    // 更新父组件所需最新手机号参数
                                    typeof this.props.updatePhoneNumber ===
                                        "function" &&
                                        this.props.updatePhoneNumber(
                                            resPhoneNum,
                                        );
                                    // 更新本地值
                                    this.props.form.setFieldsValue({
                                        phoneNumber: resPhoneNum.replace(
                                            /\d(?=\d{4})/g,
                                            "*",
                                        ),
                                    });
                                    typeof global.setGlobalMemberInfo ===
                                        "function" &&
                                        global.setGlobalMemberInfo(res);
                                    this.props.setLoading &&
                                        this.props.setLoading(false);
                                }, true);

                                if (res.result.queleaReferreeStatus) {
                                    this.props.GetThroughoutVerification();
                                }
                            } else {
                                this.props.setLoading(false);
                                if (res && res.message == "MEM00050") {
                                    message.error("您并未修改资料。");
                                } else {
                                    message.error(
                                        res.message || res.result.Message,
                                    );
                                }
                            }
                        },
                    );
                }
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            isEditPhone,
            updatePhoneStatus,
            inputPhoneDisabled,
            phonestatus,
        } = this.state;
        const isWalletDeposit =
            this.props.className === "wallet-deposit_phoneEdit";
        return (
            <Item label="手机号" className={this.props.className}>
                <Row gutter={14}>
                    <Col span={7}>
                        <Input
                            size="large"
                            className="tlc-input-disabled hard-clear-error"
                            disabled={true}
                            value={isWalletDeposit ? "+86" : "中国 +86"}
                        />
                    </Col>
                    <Col span={17}>
                        {isEditPhone && !this.props.phoneStatus ? (
                            phonestatus === 0 ? (
                                <div
                                    onClick={() => {
                                        this.setState({ phonestatus: 1 });
                                    }}
                                    className="ant-input ant-input-lg"
                                >
                                    {this.props.phoneNumber.replace(
                                        /\d(?=\d{4})/g,
                                        "*",
                                    )}
                                </div>
                            ) : (
                                getFieldDecorator("phoneNumber", {
                                    initialValue: "",
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入手机号",
                                        },
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback,
                                            ) => {
                                                // 默认禁用更新按钮
                                                // this.setState({ updatePhoneStatus: 1 });
                                                // 編輯
                                                this.setState({
                                                    phonestatus: 1,
                                                });
                                                if (
                                                    value &&
                                                    !phoneReg.test(value)
                                                    // && (this.phonePrefix ===
                                                    //     undefined ||
                                                    //     (this.phonePrefix &&
                                                    //         !this.phonePrefix
                                                    //             .length))
                                                ) {
                                                    callback(
                                                        "请输入正确的手机号码",
                                                    );
                                                    return;
                                                }
                                                const phoneLength =
                                                    value.toString().length;
                                                if (
                                                    value &&
                                                    (!this.phonePrefix.includes(
                                                        value.substr(0, 3),
                                                    ) ||
                                                        phoneLength >
                                                            this.maxLength ||
                                                        phoneLength <
                                                            this.minLength ||
                                                        /\D/.test(
                                                            value.toString(),
                                                        ))
                                                ) {
                                                    callback(
                                                        "请输入正确的手机号码",
                                                    );
                                                    return;
                                                }
                                                if (!value) {
                                                    this.setState({
                                                        phonestatus: 1,
                                                    });
                                                    callback();
                                                    return;
                                                }
                                                // 手机号格式通过后更正更新按钮状态
                                                // this.setState({ updatePhoneStatus: 2 });
                                                // 編輯且符合格式
                                                this.setState({
                                                    phonestatus: 2,
                                                });
                                                callback();
                                            },
                                        },
                                    ],
                                })(
                                    <Input
                                        size="large"
                                        maxLength={11}
                                        className="addon-icon tlc-input-disabled"
                                        autoComplete="off"
                                        disabled={
                                            !isEditPhone && phonestatus === 0
                                        }
                                    />,
                                )
                            )
                        ) : (
                            getFieldDecorator("phoneNumber", {
                                initialValue: isWalletDeposit
                                    ? this.props.phoneNumber.replace(
                                          /\d(?=\d{4})/g,
                                          "*",
                                      )
                                    : this.props.phoneNumber,
                            })(
                                <Input
                                    size="large"
                                    maxLength={11}
                                    className="addon-icon tlc-input-disabled"
                                    autoComplete="off"
                                    disabled={true}
                                />,
                            )
                        )}
                        {/* {isEditPhone ? (
                            !updatePhoneStatus ? (
                                <div
                                    className="inner-addon-icon"
                                    onClick={this.updatePhoneStatus}
                                >
                                    <svg
                                        style={{ verticalAlign: "middle" }}
                                        fill={
                                            this.props.disableEdit
                                                ? "#cecece"
                                                : "#1c8eff"
                                        }
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                    >
                                        <g transform="translate(109 -15.89)">
                                            <rect
                                                width="24"
                                                height="24"
                                                transform="translate(-109 15.89)"
                                                fill="none"
                                            />
                                            <g
                                                transform="translate(-105 18.89)"
                                                clipPath="url(#clip-path)"
                                            >
                                                <path
                                                    d="M133.257,42.378a.817.817,0,0,0,1.176,0l9.189-9.178a.836.836,0,0,0,0-1.192.817.817,0,0,0-1.178,0l-9.187,9.176a.836.836,0,0,0,0,1.193Zm0,0"
                                                    transform="translate(-128.284 -31.521)"
                                                />
                                                <path
                                                    d="M-88.856,27.209a.843.843,0,0,0-.844.842v6.721h-12.613v-12.6h6.729a.854.854,0,0,0,.844-.842.839.839,0,0,0-.827-.843h-7.591a.843.843,0,0,0-.843.843V35.614a.835.835,0,0,0,.245.6.837.837,0,0,0,.6.245h14.3a.837.837,0,0,0,.6-.245.835.835,0,0,0,.245-.6V28.052a.843.843,0,0,0-.843-.843Zm0,0"
                                                    transform="translate(104.001 -20.475)"
                                                />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            ) : (
                                <div
                                    className="inner-addon-icon"
                                    onClick={this.updatePhoneNumber}
                                >
                                    <div
                                        style={
                                            updatePhoneStatus === 1
                                                ? {
                                                      color: "#CCC",
                                                      cursor: "not-allowed",
                                                  }
                                                : {
                                                      color: "#1C8EFF",
                                                      cursor: "pointer",
                                                  }
                                        }
                                    >
                                        更新
                                    </div>
                                </div>
                            )
                        ) : null} */}
                    </Col>
                </Row>
            </Item>
        );
    }
}

export default Form.create({ name: "PhoneEdit" })(PhoneEdit);
