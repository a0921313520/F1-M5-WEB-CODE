import React from "react";
import {
    Modal,
    Form,
    Input,
    Button,
    Select,
    Checkbox,
    Spin,
    message,
    Icon,
} from "antd";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { realyNameReg, bankNumberReg } from "$ACTIONS/reg";
import SelectArddress from "../View/SelectArddress";
import { translate } from "$ACTIONS/Translate";
import ImageWithFallback from "@/ImageWithFallback";
const { Item } = Form;
const { Option } = Select;

class AddBankCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            BankList: [],
            isLoading: false,
            submitButtonDisabled: true,
            isSetDefault: false,
            setBankCard: {
                searchValue: "",
                showBankList: false,
                bankAlphabetic: "",
            },
            // provincesIsValid: false,
        };
    }
    componentDidMount() {
        this.getWithdrawalbank();
        this.setState({
            isSetDefault: this.props.alreadyBindBanks.length ? false : true,
        });
    }
    componentWillUnmount() {
        this.setState = () => false;
    }
    /**
     * 获取可添加的银行数据
     */
    getWithdrawalbank = () => {
        const withdrawalbankList =
            !!sessionStorage.getItem("withdrawalbankList");
        if (withdrawalbankList) {
            this.setState({
                BankList: JSON.parse(
                    sessionStorage.getItem("withdrawalbankList"),
                ),
            });
        } else {
            get(ApiPort.GETWithdrawalbank)
                .then((res) => {
                    if (res && res.result) {
                        let filterDupBank = res.result.banks.filter(
                            (obj, pos, arr) => {
                                return (
                                    arr
                                        .map((mapObj) => mapObj.name)
                                        .indexOf(obj.name) == pos
                                );
                            },
                        );
                        this.setState({
                            BankList: filterDupBank,
                        });
                        sessionStorage.setItem(
                            "withdrawalbankList",
                            JSON.stringify(filterDupBank),
                        );
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // const { province, city, district } = values.province;
                // const updatedProvince =
                //     province.name + city.name + district.name;
                this.setState({ isLoading: true });
                post(ApiPort.POSTRememberBanks, {
                    accountHolderName: values.username,
                    accountNumber: values.cardnumber,
                    bankName: values.bankname,
                    // branch: values.branch,
                    // city: values.city,
                    // province: updatedProvince,
                    type: "A",
                    isDefault: this.state.isSetDefault,
                    branch: "",
                    city: "",
                    province: "",
                })
                    .then((res) => {
                        if (res.isSuccess) {
                            message.success(translate("设置成功"));
                            this.onclosed();
                            this.props.getMemberBanksList();
                        }
                        //這裡加else沒有用 因為會是bad request 直接跑到 catch
                        else {
                            for (let i = 0; i < res.errors.length; i++) {
                                let temp = res.errors[i];
                                // if (temp.errorCode == "PII00702") {
                                //     Router.push("/RestrictAccess");
                                //     global.globalBlackListExit();
                                //     break;
                                // } else if (temp.errorCode == "VAL11056") {
                                //     message.error("提款卡保存失败", 3);
                                //     break;
                                // }
                                message.error(temp.message);
                            }
                        }
                    })
                    .catch((error) => {
                        console.log("error", error);
                    })
                    .finally(() => {
                        this.setState({ isLoading: false });
                    });
            }
        });

        Pushgtagdata("Submit_addbankcar_bankacc");
    };
    handleFormChange = () => {
        let status;
        let error = Object.entries(this.props.form.getFieldsError()).every(
            (v) => v[1] === undefined,
        );
        let values = Object.entries(this.props.form.getFieldsValue()).every(
            (v) => v[1] !== undefined,
        );
        status =
            error &&
            values &&
            this.props.form.getFieldValue("bankname") &&
            this.state.setBankCard.searchValue;
        //&& this.state.provincesIsValid;

        this.setState({ submitButtonDisabled: !status });
        console.log(
            "🚀 ~ file: AddBankCard.js:131 ~ AddBankCard ~ submitButtonDisabled:",
            error,
            values,
            this.props.form.getFieldValue("bankname"),
            this.state.setBankCard.searchValue,
        );
    };
    setDefaultAccount = () => {
        this.setState({ isSetDefault: !this.state.isSetDefault });
    };
    openMenu = () => {
        this.setState({
            setBankCard: {
                showBankList: !this.state.setBankCard.showBankList,
            },
        });
    };
    changeBankName = (value, option) => {
        this.props.form.setFieldsValue({ bankname: value });
        this.setState(
            {
                setBankCard: {
                    searchValue: value,
                    showBankList: false,
                    bankAlphabetic:
                        option.props.children.props.children[0].props.src,
                },
            },
            () => {
                this.handleFormChange();
            },
        );
        console.log("getFieldValue1", this.props.form.getFieldsValue());
    };
    onclosed = () => {
        this.setState({
            setBankCard: { showBankList: false, searchValue: "" },
            submitButtonDisabled: true,
            isSetDefault: false,
        });
        this.props.closeModal();
        this.props.form.resetFields();
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { BankList, isSetDefault, setBankCard } = this.state;
        const { alreadyBindBanks, visible } = this.props;
        return (
            <Modal
                title={translate("添加客户账户")}
                visible={visible}
                onCancel={this.onclosed}
                width={400}
                footer={null}
                maskClosable={false}
                centered={true}
                className="modal-pubilc OTP-modal addBankModal"
            >
                <Spin spinning={this.state.isLoading} tip={translate("加载中")}>
                    <Form
                        className="verification-form-wrap"
                        {...formItemLayout}
                        onSubmit={this.handleSubmit}
                        onChange={this.handleFormChange}
                    >
                        <div className="line-distance"></div>
                        <Item
                            label={translate("银行名称")}
                            className={`Item-bankName ${
                                setBankCard.showBankList ? "active" : "inactive"
                            }`}
                        >
                            {getFieldDecorator("bankname", {
                                initialValue: setBankCard.searchValue,
                                rules: [
                                    {
                                        required: true,
                                        message: translate("选择银行"),
                                    },
                                ],
                            })(
                                <div>
                                    <Input
                                        className={`bankNamewrap ${
                                            setBankCard.searchValue
                                                ? "have"
                                                : ""
                                        } ${
                                            setBankCard.showBankList
                                                ? "active"
                                                : "inactive"
                                        }`}
                                        size="large"
                                        autoComplete="off"
                                        readOnly={true}
                                        value={setBankCard.searchValue}
                                        placeholder={translate("选择银行")}
                                        prefix={
                                            setBankCard.searchValue ? (
                                                <ImageWithFallback
                                                    src={
                                                        setBankCard.bankAlphabetic
                                                    }
                                                    width={24}
                                                    height={24}
                                                    alt="app-picture"
                                                    fallbackSrc="/vn/img/bank/generic.png"
                                                    local={true}
                                                />
                                            ) : (
                                                <span />
                                            )
                                        }
                                        suffix={
                                            !setBankCard.showBankList && (
                                                <Icon
                                                    type={`${
                                                        !setBankCard.showBankList
                                                            ? "caret-down"
                                                            : "caret-up"
                                                    }`}
                                                    onClick={this.openMenu}
                                                />
                                            )
                                        }
                                    />
                                    <div id="select-wrap">
                                        {setBankCard.showBankList && (
                                            <Select
                                                size="large"
                                                loading={
                                                    !BankList.length
                                                        ? true
                                                        : false
                                                }
                                                onChange={this.changeBankName}
                                                open={setBankCard.showBankList}
                                                showArrow={false}
                                                showSearch={true}
                                                optionFilterProp="children"
                                                filterOption={(
                                                    input,
                                                    option,
                                                ) => {
                                                    return option.props.value.includes(
                                                        input,
                                                    );
                                                }}
                                                notFoundContent={
                                                    <div
                                                        className="notfind"
                                                        style={{
                                                            width: "100%",
                                                            textAlign: "center",
                                                            minHeight: "195px",
                                                        }}
                                                    >
                                                        <div className="line-distance"></div>
                                                        <img
                                                            src={`${process.env.BASE_PATH}/img/icon/img-no-record.svg`}
                                                            alt="notfind"
                                                            style={{
                                                                width: "80px",
                                                                height: "80px",
                                                            }}
                                                        />
                                                        <p
                                                            style={{
                                                                fontSize: 12,
                                                                color: "#999999",
                                                                lineHeight:
                                                                    "50px",
                                                            }}
                                                        >
                                                            {translate(
                                                                "没有数据",
                                                            )}
                                                        </p>
                                                    </div>
                                                }
                                                className="bankNameSelect"
                                                dropdownClassName="bankNameSelectDropdown"
                                                dropdownStyle={{
                                                    borderTopLeftRadius: 0,
                                                    borderTopRightRadius: 0,
                                                }}
                                                placeholder={
                                                    <div className="searchwrap">
                                                        <Icon
                                                            type="search"
                                                            style={{
                                                                fontSize: 16,
                                                                marginRight: 6,
                                                            }}
                                                        />
                                                        <span>
                                                            {translate("搜索")}
                                                        </span>
                                                    </div>
                                                }
                                                getPopupContainer={() =>
                                                    document.getElementById(
                                                        "select-wrap",
                                                    )
                                                }
                                            >
                                                {BankList.map((val, index) => {
                                                    return (
                                                        <Option
                                                            key={index}
                                                            value={val.name}
                                                        >
                                                            <div className="option-item">
                                                                <ImageWithFallback
                                                                    src={`/vn/img/bank/${
                                                                        val.englishName
                                                                            ? val.englishName
                                                                                  .toUpperCase()
                                                                                  .replace(
                                                                                      /[^0-9a-zA-Z]/gi,
                                                                                      "",
                                                                                  )
                                                                            : "generic"
                                                                    }.png`}
                                                                    width={24}
                                                                    height={24}
                                                                    alt="app-picture"
                                                                    fallbackSrc="/vn/img/bank/generic.png"
                                                                    local={true}
                                                                />
                                                                <span>
                                                                    {val.name}
                                                                </span>
                                                            </div>
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                    </div>
                                </div>,
                            )}
                        </Item>
                        <Item label={translate("账户持有者全名")}>
                            {getFieldDecorator("username", {
                                rules: [
                                    {
                                        required: true,
                                        message: translate("请填写你的名字"),
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (
                                                value &&
                                                !realyNameReg.test(value)
                                            ) {
                                                callback(
                                                    translate("姓名格式无效"),
                                                );
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    size="large"
                                    maxLength={30}
                                    autoComplete="off"
                                    placeholder={translate(
                                        "请填写您的真实姓名",
                                    )}
                                />,
                            )}
                        </Item>
                        <Item label={translate("银行账号")}>
                            {getFieldDecorator("cardnumber", {
                                rules: [
                                    {
                                        required: true,
                                        message:
                                            translate("请填写您的银行帐号"),
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (
                                                value &&
                                                !bankNumberReg.test(value)
                                            ) {
                                                callback(
                                                    translate(
                                                        "帐号必须在6至19位数字范围内",
                                                    ),
                                                );
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    size="large"
                                    maxLength={19}
                                    minLength={6}
                                    autoComplete="off"
                                    placeholder={translate("请填写账号")}
                                />,
                            )}
                        </Item>
                        {/* <Item label="省/自治区">
                            {getFieldDecorator("province")(
                                <SelectArddress
                                    className="forAddBankCard"
                                    type={""}
                                    datavalue={[]}
                                    disabled={false}
                                    onChange={(val) => {
                                        for (let key in val) {
                                            if (!val[key]) {
                                                this.setState(
                                                    {
                                                        provincesIsValid: false,
                                                    },
                                                    () => {
                                                        this.handleFormChange();
                                                    }
                                                );
                                                return;
                                            }
                                        }
                                        this.setState(
                                            {
                                                provincesIsValid: true,
                                            },
                                            () => {
                                                this.handleFormChange();
                                            }
                                        );
                                    }}
                                />
                            )}
                        </Item> */}
                        {/* <Item label="城市/城镇">
                            {getFieldDecorator("city", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入正确的城市/城镇！",
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (value && !_city.test(value)) {
                                                callback("格式不正确");
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    size="large"
                                    maxLength={20}
                                    autoComplete="off"
                                    placeholder="请输入城市/城镇"
                                />
                            )}
                        </Item> */}
                        {/* <Item label="分行">
                            {getFieldDecorator("branch", {
                                rules: [
                                    { required: true, message: "请输入分行！" },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (value && !_branch.test(value)) {
                                                callback("格式不正确");
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    size="large"
                                    maxLength={20}
                                    autoComplete="off"
                                    placeholder="请输入分行"
                                />
                            )}
                        </Item> */}
                        {alreadyBindBanks.length ? (
                            <Item
                                label=""
                                className="small-form-item defaultCheckbox"
                                style={{ textAlign: "left" }}
                            >
                                <Checkbox
                                    checked={isSetDefault}
                                    onChange={this.setDefaultAccount}
                                >
                                    {translate("设置为默认银行")}
                                </Checkbox>
                            </Item>
                        ) : null}
                        <div className="line-distance"></div>
                        <Item {...tailFormItemLayout}>
                            <div className="btn-wrap">
                                <Button
                                    size="large"
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    disabled={this.state.submitButtonDisabled}
                                >
                                    {translate("保存")}
                                </Button>
                            </div>
                        </Item>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create({ name: "AddBankCard" })(AddBankCard);
