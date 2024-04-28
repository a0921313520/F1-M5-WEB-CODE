import React from "react";
import {
    Row,
    Col,
    Form,
    Button,
    Select,
    Input,
    message,
    Modal,
    Spin,
    Icon
} from "antd";
import { formItemLayout } from "$ACTIONS/constantsData";
import { getMemberInfo, setMemberInfo } from "$DATA/userinfo";
import { memberId,realyNameReg } from "$ACTIONS/reg";
import moment from "moment";
import dynamic from "next/dynamic";
import { connect } from "react-redux";
import { getMaskHandler } from "$ACTIONS/helper";
import { replaceMultipleSpacesWithSingle } from "$ACTIONS/util";
import { translate } from "$ACTIONS/Translate";
import 'moment/locale/vi';
moment.updateLocale('vi',{
    weekdays: ['Chủ nhật', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
    weekdaysShort: ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
    weekdaysMin:  ["CN", "Hai", "Ba", "Tu", "Năm", "Sáu", "Bảy"],
    week: {
        dow: 1,
    }
});
moment.locale('vi');
const DatePicker = dynamic(import("antd/lib/date-picker"), {
    loading: () => (
        <div className="ant-skeleton ant-skeleton-with-avatar ant-skeleton-active">
            <div className="ant-skeleton-content">
                <ul className="ant-skeleton-paragraph">
                    <li />
                </ul>
            </div>
        </div>
    ),
});

const { Option } = Select;
const { Item } = Form;

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEnable: false,
            isSubmitable: false,
            isConfirmSubmitModal: false, //是否顯示确认提交Modal
            isLoading: false, //是否正在SubmittING
        };
        this.resetForm = this.resetForm.bind(this); // 重置表单
        this.disabledDate = this.disabledDate.bind(this); // 获取生日可选范围
        this.defaultMinDate = new Date(new Date().getTime() - 567648000000);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                this.setState({ isLoading: true });

                let promiseArr = [];
                console.log("values", values);

                if (!this.props.memberInfo.firstName) {
                    promiseArr.push(
                        new Promise((resolve, reject) => {
                            setMemberInfo(
                                {
                                    key: "firstName",
                                    value1: values.RealName.trim(),
                                },
                                (res) => {
                                    if (res && res.isSuccess) {
                                        resolve(res);
                                    } else {
                                        reject(res);
                                    }
                                }
                            );
                        })
                    );
                }

                if (!this.props.memberInfo.dob) {
                    promiseArr.push(
                        new Promise((resolve, reject) => {
                            setMemberInfo(
                                {
                                   key:"dob",
                                   value1:values.birthday
                                },
                                (res) => {
                                    if (res && res.isSuccess) {
                                        resolve(res);
                                    } else {
                                        reject(res);
                                    }
                                }
                            );
                        })
                    );
                }

                if (!this.props.memberInfo.gender) {
                    promiseArr.push(
                        new Promise((resolve, reject) => {
                            setMemberInfo(
                                {
                                    key:"gender",
                                    value1: values.sex,
                                },
                                (res) => {
                                    if (res && res.isSuccess) {
                                        resolve(res);
                                    } else {
                                        reject(res);
                                    }
                                }
                            );
                        })
                    );
                }

                // if (!this.props.memberInfo.documentID) {
                //     promiseArr.push(
                //         new Promise((resolve, reject) => {
                //             setMemberInfo(
                //                 {
                //                     key: "IdentityCard",
                //                     value1: values.cardID,
                //                 },
                //                 (res) => {
                //                     if (res && res.isSuccess) {
                //                         resolve(res);
                //                     } else {
                //                         reject(res);
                //                     }
                //                 }
                //             );
                //         })
                //     );
                // }

                Promise.all(promiseArr)
                    .then(() => {
                        message.success(translate("更新成功"));
                        this.setState({
                            isEnable: false,
                            isConfirmSubmitModal: false,
                        });
                        getMemberInfo((res) => {
                            this.props.setMemberInfo(res);
                            this.props.setSelfMemberInfo(res);
                            this.props.setLoading(false);
                        }, true);
                    })
                    .catch((err) => {
                        this.props.setLoading(false);
                        Array.isArray(err) &&
                            err.forEach((v) => {
                                // if (v.message == "MEM00050") {
                                //     message.error("您并未修改资料。");
                                // } else {
                                    message.error(
                                        v.message || v.result.Message
                                    );
                                // }
                            });
                    })
                    .finally(() => {
                        this.setState({ isLoading: false });
                    });
            }
        });

        Pushgtagdata("Save_personal_personal");
    };
    resetForm() {
        this.setState({ isEnable: false });
        this.props.form.resetFields();
        Pushgtagdata("Cancel_personal_personal");
    }
    disabledDate(current) {
        return (
            current &&
            (current > this.defaultMinDate ||
                current < new Date(new Date().getTime() - 3153600000000))
        );
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { firstName, documentID, dob, gender } = this.props.memberInfo;
        const { isConfirmSubmitModal, isLoading } = this.state;

        const isRealNameInvalid = this.props.form.getFieldError("RealName");
        // const isCardIDInvalid = this.props.form.getFieldError("cardID");
        const isBirthdayInvalid = this.props.form.getFieldError("birthday");
        const isGenderInvalid = this.props.form.getFieldError("sex");

        const isFieldsTouched = this.props.form.isFieldsTouched();
        const isRealNameHasValue = !!this.props.form.getFieldValue("RealName");
        // const isCardIDHasValue = !!this.props.form.getFieldValue("cardID");
        const isBirthdayHasValue =
            !!this.props.form.getFieldValue("birthday") || !!dob;
        const isGenderHasValue = !!this.props.form.getFieldValue("sex");

        let isSubmitable = false;

        if (
            !isRealNameInvalid &&
            // !isCardIDInvalid &&
            !isBirthdayInvalid &&
            !isGenderInvalid &&
            isFieldsTouched &&
            isRealNameHasValue &&
            // isCardIDHasValue &&
            isBirthdayHasValue &&
            isGenderHasValue
        ) {
            isSubmitable = true;
        }

        return (
            <React.Fragment>
                <p className="home-section-title">{translate("基本信息")}</p>
                <Form
                    className="user-form-wrap"
                    {...formItemLayout}
                    onSubmit={this.handleSubmit}
                >
                    <div
                        className={`edit-disabeld${
                            this.state.isEnable ? " enable" : ""
                        } input-box`}
                    >
                        <Row className="ant-form-item" gutter={100}>
                            <Col span={12}>
                                <Item
                                    label={translate("真实姓名")}
                                    className="user-center-account-profile-input-item"
                                >
                                    {getFieldDecorator("RealName", {
                                        initialValue: getMaskHandler(
                                            "RealName",
                                            firstName
                                        ),
                                        rules: [
                                            {
                                                required: true,
                                                message: translate("真实姓名不能为空"),
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback
                                                ) => {
                                                    this.props.form.setFieldsValue({
                                                        RealName: value && replaceMultipleSpacesWithSingle(value)
                                                    })
                                                    if (
                                                        value && !realyNameReg.test(value) && !firstName
                                                    ) {
                                                        callback(
                                                            translate("格式错误")
                                                        );
                                                    }
                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input
                                            className="user-center-account-profile-input realName"
                                            placeholder={translate("请输入您的真实姓名")}
                                            disabled={!!firstName}
                                            minLength={2}
                                            maxLength={50}
                                            size="large"
                                            autoComplete="off"
                                        />
                                    )}
                                </Item>
                            </Col>
                        </Row>
                        {/* <Row className="ant-form-item" gutter={100}>
                            <Col span={12}>
                                <Item
                                    label={translate("身份证号")}
                                    className="user-center-account-profile-input-item"
                                >
                                    {getFieldDecorator("cardID", {
                                        initialValue: getMaskHandler(
                                            "cardID",
                                            documentID
                                        ),
                                        rules: [
                                            {
                                                required: true,
                                                message: translate("请输入身份证号码"),
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback
                                                ) => {
                                                    if (
                                                        value &&
                                                        !memberId.test(value) &&
                                                        !documentID
                                                    ) {
                                                        callback(
                                                            translate("格式错误")
                                                        );
                                                    }
                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input
                                            className="user-center-account-profile-input cardID"
                                            placeholder={translate("请输入身份证号码")}
                                            disabled={!!documentID}
                                            maxLength={18}
                                            size="large"
                                            autoComplete="off"
                                        />
                                    )}
                                </Item>
                            </Col>
                        </Row> */}
                        <Row className="ant-form-item" gutter={80}>
                            <Col span={12}>
                                <Item
                                    label={translate("出生日期")}
                                    className="user-center-account-profile-input-item"
                                >
                                    {getFieldDecorator("birthday", {
                                        rules: [
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback
                                                ) => {
                                                    if (
                                                        !value && !dob
                                                    ) {
                                                        callback(
                                                            translate("请选择您的出生日期")
                                                        );
                                                    }
                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <DatePicker
                                            suffixIcon={
                                                <img
                                                    style={{
                                                        cursor: "pointer",
                                                        top: "20px",
                                                        width: "20px",
                                                        height: "20px",
                                                    }}
                                                    src={`${process.env.BASE_PATH}/img/icons/icon-calender.svg`}
                                                />
                                            }
                                            disabled={!!dob}
                                            className={`user-info-dob-picker ${
                                                dob && "hasDob"
                                            }`}
                                            placeholder={
                                                !dob
                                                    ? translate("请选择您的出生日期")
                                                    : getMaskHandler(
                                                          "Date",
                                                          moment(dob).format(
                                                              "DD/MM/YYYY"
                                                          )
                                                      )
                                            }
                                            format="DD-MM-YYYY"
                                            dropdownClassName="user-info-dob-picker-dropdown"
                                            defaultPickerValue={moment(
                                                this.defaultMinDate
                                            )}
                                            disabledDate={this.disabledDate}
                                            showToday={false}
                                            allowClear={false}
                                            style={{ width: "100%" }}
                                            size="large"
                                            locale={moment.locale()}
                                        />
                                    )}
                                </Item>
                            </Col>
                            <Col span={12}>
                                <Item
                                    label={translate("性别")}
                                    className="user-center-account-profile-input-item"
                                >
                                    {getFieldDecorator("sex", {
                                        initialValue: gender,
                                        rules: [
                                            {
                                                required: true,
                                                message: translate("请选择性别"),
                                            },
                                        ],
                                    })(
                                        <Select
                                            className="select-box"
                                            disabled={!!gender}
                                            size="large"
                                            placeholder={translate("性别")}
                                            dropdownClassName="usercenter-dropdown"
                                            dropdownAlign={{ offset: [1, -4] }}
                                            style={{ width: 100 }}
                                            suffixIcon={<Icon type="caret-down" />}
                                        >
                                            <Option value="Male">{translate("男")}</Option>
                                            <Option value="Female">{translate("女")}</Option>
                                        </Select>
                                    )}
                                </Item>
                            </Col>
                        </Row>
                    </div>
                    <div className="usercenter-button">
                        {this.props.isPersonalDataEditable && (
                            <p className="bottom-sign">
                                <span style={{ color: "red" }}> * </span>
                                {translate("全名/出生日期/性别只能更新一次")}
                            </p>
                        )}
                        {this.state.isEnable ? (
                            <React.Fragment>
                                <Button size="large" onClick={this.resetForm}>
                                    {translate("取消")}
                                </Button>
                                <Button
                                    size="large"
                                    onClick={(e) => {
                                        // this.setState({
                                        //     isConfirmSubmitModal: true,
                                        // });
                                        this.handleSubmit(e)
                                    }}
                                    className="btn-submit"
                                    disabled={!isSubmitable}
                                    type="primary"
                                >
                                    {translate("保存")}
                                </Button>
                            </React.Fragment>
                        ) : this.props.isPersonalDataEditable ? (
                            <Button
                                size="large"
                                type="primary"
                                ghost
                                onClick={() => {
                                    this.setState({ isEnable: true });
                                    Pushgtagdata("Edit_profile_personal");
                                }}
                            >
                                {translate("编辑")}
                            </Button>
                        ) : (
                            ""
                        )}
                    </div>

                    <Modal
                        className="general-modal unclosable-modal user-center-userinfo-comfirm-modal"
                        width={400}
                        style={{ left: "5%" }}
                        title="确认提交"
                        closable={false}
                        visible={isConfirmSubmitModal}
                        okText="确认提交"
                        cancelText="取消"
                        onCancel={() => {
                            this.setState({ isConfirmSubmitModal: false });
                        }}
                        centered
                        okButtonProps={{ style: { width: "50%" } }}
                        onOk={this.handleSubmit}
                        cancelButtonProps={{ style: { width: "50%" } }}
                    >
                        <Spin
                            spinning={isLoading}
                            style={{ backgroundColor: "initial" }}
                        >
                            一旦提交后，无法再进行修改。
                        </Spin>
                    </Modal>
                </Form>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        memberInfo: state.userCenter.memberInfo,
        isPersonalDataEditable: state.userCenter.isPersonalDataEditable,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create({ name: "UserInfo" })(UserInfo));
