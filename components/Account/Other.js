import React from "react";
import {
    Row,
    Col,
    Form,
    Button,
    Select,
    Input,
    message,
    Icon,
    Modal,
} from "antd";
import { formItemLayout } from "$ACTIONS/constantsData";
import { getMemberInfo, setMemberInfo } from "$DATA/userinfo";
import { GetWalletList } from "$DATA/wallet";
import { getQuestion } from "$DATA/userinfo";
import { connect } from "react-redux";
import { getMaskHandler } from "$ACTIONS/helper";
import { translate } from "$ACTIONS/Translate";
const { Option } = Select;
const { Item } = Form;

class Other extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEnable: false,
            preferWallet: "",
            fromWalletList: [],
            questionList: [],
            isSafeQCompleteModal: false, //是否顯示安全提问设置完成Modal
        };

        this.resetForm = this.resetForm.bind(this); // 重置表单
        this.isFinishFrontData = []; // 是否已获取完成当前Page所需前置数据
    }
    componentDidMount() {
        this.props.setLoading(true);
        const newLen1 = this.isFinishFrontData.push(0);
        getQuestion((res) => {
            if (res.isSuccess && res.result) {
                this.setState({ questionList: res.result });
                this.isFinishFrontData.splice(newLen1 - 1, 1, 1);
                this.isFinishFrontData.length &&
                    !~this.isFinishFrontData.indexOf(0) &&
                    this.props.memberInfoRefresh &&
                    this.props.setLoading(false);
            }
        });

        const newLen2 = this.isFinishFrontData.push(0);
        GetWalletList((res) => {
            this.setState(
                {
                    fromWalletList: res.result.fromWallet,
                },
                () => {
                    this.props.memberInfo.preferWallet &&
                        this.setState({
                            preferWallet: this.props.memberInfo.preferWallet,
                        });
                },
            );
            this.isFinishFrontData.splice(newLen2 - 1, 1, 1);
            this.isFinishFrontData.length &&
                !~this.isFinishFrontData.indexOf(0) &&
                this.props.setLoading(false);
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.memberInfo.preferWallet !==
                this.props.memberInfo.preferWallet &&
            this.props.memberInfo.preferWallet
        ) {
            this.setState({ preferWallet: this.props.memberInfo.preferWallet });
        }
    }
    componentWillUnmount() {
        this.setState = () => false;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                const memberCall = (res) => {
                    if (res.isSuccess == true) {
                        if (
                            this.props.form.isFieldTouched("preferWallet") &&
                            this.props.memberInfo.securityAnswer
                        ) {
                            message.success("更新成功!");
                        }
                        this.setState({ isEnable: false });
                        localStorage.setItem(
                            "PreferWallet",
                            values.preferWallet,
                        );
                        getMemberInfo((res) => {
                            this.props.setMemberInfo(res);
                            this.props.setSelfMemberInfo(res);
                            this.props.setLoading(false);
                        }, true);
                    } else if (res.isSuccess == false) {
                        this.props.setLoading(false);
                        if (res.message == "MEM00050") {
                            message.error("您并未修改资料。");
                        } else {
                            message.error(res.result.Message);
                        }
                    }
                };

                const newLen1 = this.isFinishFrontData.push(0);
                setMemberInfo(
                    {
                        key: "Wallet",
                        value1: values.preferWallet,
                    },
                    (res) => {
                        this.isFinishFrontData.splice(newLen1 - 1, 1, 1);
                        if (
                            this.isFinishFrontData.length &&
                            !~this.isFinishFrontData.indexOf(0)
                        ) {
                            memberCall(res);
                        }
                    },
                );

                if (!this.props.memberInfo.securityAnswer) {
                    const newLen3 = this.isFinishFrontData.push(0);
                    setMemberInfo(
                        {
                            key: "SecretQuestionAnswer",
                            value1: values.question.toString(),
                            value2: values.answer.trim(),
                        },
                        (res) => {
                            this.setState({ isSafeQCompleteModal: true });
                            this.isFinishFrontData.splice(newLen3 - 1, 1, 1);
                            if (
                                this.isFinishFrontData.length &&
                                !~this.isFinishFrontData.indexOf(0)
                            ) {
                                memberCall(res);
                            }
                        },
                    );
                }
            }
        });

        Pushgtagdata("Save_other_personal");
    };
    resetForm() {
        this.setState({ isEnable: false });
        this.props.form.resetFields();
        Pushgtagdata("Cancel_other_personal");
    }
    render() {
        const {
            getFieldDecorator,
            getFieldValue,
            getFieldsError,
            isFieldTouched,
        } = this.props.form;
        const { secretQID, securityAnswer } = this.props.memberInfo;
        const { isSafeQCompleteModal, preferWallet } = this.state;

        const isPreferWalletTouched = isFieldTouched("preferWallet");
        const isSecretQTouched = isFieldTouched("question");
        const isAnswerTouched = isFieldTouched("answer");
        const answerHasValue = getFieldValue("answer")?.trim().length;

        let isSubmittable = false;

        if (secretQID && securityAnswer) {
            if (isPreferWalletTouched) {
                isSubmittable = true;
            }
        } else {
            if (isSecretQTouched && isAnswerTouched && answerHasValue) {
                isSubmittable = true;
            }
        }

        return (
            <React.Fragment>
                <p className="home-section-title">{translate("其它设置")}</p>
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
                        <Row className="ant-form-item" gutter={100}>
                            <Col span={12}>
                                <Item
                                    label={translate("语言")}
                                    className="user-center-account-profile-input-item"
                                >
                                    <Input
                                        size="large"
                                        className="user-center-account-profile-input"
                                        autoComplete="off"
                                        disabled={true}
                                        value={translate("越南文")}
                                    />
                                </Item>
                            </Col>
                            <Col span={12}>
                                <Item
                                    label={translate("最喜欢的货币")}
                                    className="user-center-account-profile-input-item"
                                >
                                    <Input
                                        size="large"
                                        className="user-center-account-profile-input"
                                        autoComplete="off"
                                        disabled={true}
                                        value={translate("VND")}
                                    />
                                </Item>
                            </Col>
                        </Row>
                        <Row className="ant-form-item" gutter={100}>
                            <Col span={12}>
                                <Item
                                    label={translate("最喜欢的帐户")}
                                    className="user-center-account-profile-input-item"
                                >
                                    {this.state.fromWalletList &&
                                    this.state.fromWalletList.length ? (
                                        getFieldDecorator("preferWallet", {
                                            initialValue: preferWallet,
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        translate("请选择"),
                                                },
                                            ],
                                        })(
                                            <Select
                                                className="select-box account-select-box"
                                                dropdownClassName="account-dropdown usercenter-dropdown"
                                                dropdownAlign={{
                                                    offset: [1, -4],
                                                }}
                                                suffixIcon={
                                                    <Icon type="caret-down" />
                                                }
                                                size="large"
                                                placeholder={translate(
                                                    "请选择",
                                                )}
                                                dropdownStyle={{ zIndex: 1 }}
                                            >
                                                {this.state.fromWalletList.map(
                                                    (value) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    "preferWallet" +
                                                                    value.key
                                                                }
                                                                value={
                                                                    value.key
                                                                }
                                                            >
                                                                {value.name}
                                                            </Option>
                                                        );
                                                    },
                                                )}
                                            </Select>,
                                        )
                                    ) : (
                                        <Select
                                            size="large"
                                            value={translate("加载中")}
                                            disabled={true}
                                            loading={true}
                                        />
                                    )}
                                </Item>
                            </Col>
                        </Row>
                        <Row
                            className="ant-form-item clear-margin-bottom"
                            gutter={100}
                        >
                            <Col span={12}>
                                <Item
                                    label={translate("安全问题")}
                                    className="user-center-account-profile-input-item"
                                >
                                    {this.state.questionList &&
                                    this.state.questionList.length ? (
                                        getFieldDecorator("question", {
                                            initialValue: secretQID
                                                ? secretQID
                                                : undefined,
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        translate(
                                                            "请选择一个安全问题",
                                                        ),
                                                },
                                            ],
                                        })(
                                            <Select
                                                className="select-box safety-question-select-box"
                                                dropdownClassName="safety-question-dropdown usercenter-dropdown"
                                                dropdownAlign={{
                                                    offset: [1, -4],
                                                }}
                                                suffixIcon={
                                                    <Icon type="caret-down" />
                                                }
                                                size="large"
                                                placeholder={translate(
                                                    "请选择一个安全问题",
                                                )}
                                                disabled={!!secretQID}
                                            >
                                                {this.state.questionList.map(
                                                    (value) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    "questionList" +
                                                                    value.id
                                                                }
                                                                value={value.id}
                                                            >
                                                                {
                                                                    value.localizedName
                                                                }
                                                            </Option>
                                                        );
                                                    },
                                                )}
                                            </Select>,
                                        )
                                    ) : (
                                        <Select
                                            size="large"
                                            value={translate("加载中")}
                                            disabled={true}
                                            loading={true}
                                        />
                                    )}
                                </Item>
                            </Col>
                        </Row>
                        <Row className="ant-form-item" gutter={100}>
                            <Col span={12}>
                                <Item
                                    label=""
                                    className="user-center-account-profile-input-item"
                                >
                                    {getFieldDecorator("answer", {
                                        initialValue: getMaskHandler(
                                            "Security answer",
                                            securityAnswer,
                                        ),
                                        rules: [
                                            {
                                                required: true,
                                                message:
                                                    translate("输入你的答案"),
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback,
                                                ) => {
                                                    if (
                                                        value &&
                                                        value.trim() === ""
                                                    ) {
                                                        callback(
                                                            translate(
                                                                "输入你的答案",
                                                            ),
                                                        );
                                                    }
                                                    callback();
                                                },
                                            },
                                        ],
                                        getValueFromEvent: (e) => {
                                            const value = e.target.value;
                                            if (value.trim() !== "")
                                                return value;
                                        },
                                    })(
                                        <Input
                                            size="large"
                                            className="user-center-account-profile-input"
                                            autoComplete="off"
                                            placeholder={translate(
                                                "输入你的答案",
                                            )}
                                            disabled={!!secretQID}
                                        />,
                                    )}
                                </Item>
                            </Col>
                        </Row>
                    </div>
                    <div className="usercenter-button clear-border">
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
                                    Pushgtagdata("Edit_other_personal");
                                }}
                            >
                                {translate("编辑")}
                            </Button>
                        )}
                    </div>
                </Form>
                <Modal
                    className="general-modal unclosable-modal"
                    visible={isSafeQCompleteModal}
                    style={{ left: "5%" }}
                    okText="确认"
                    width={400}
                    centered
                    cancelButtonProps={{ style: { display: "none" } }}
                    okButtonProps={{ style: { width: "100%" } }}
                    onOk={() => {
                        this.setState({ isSafeQCompleteModal: false });
                    }}
                    title="安全提问设置完成"
                    closable={false}
                >
                    恭喜您，安全提问已经设置完成。日后可透过安全提问进行验证。
                </Modal>
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
)(Form.create({ name: "Other" })(Other));
