/*
 * @Author: Alan
 * @Date: 2023-04-11 22:50:51
 * @LastEditors: Alan
 * @LastEditTime: 2023-05-04 23:11:47
 * @Description: 更新 生日联系地址
 * @FilePath: \F1-M1-WEB-Code\components\Wallet\withdrawComponents\WithdrawalVerify\Address.js
 */

import React from "react";
import { Input, Button, Spin } from "antd";
import { createForm } from "rc-form";
import { setMemberInfoPut } from "$DATA/userinfo";
import { addressReg } from "$ACTIONS/reg";
import { BiCalendar } from "react-icons/bi";
import dynamic from "next/dynamic";
import moment from "moment";
// import { now } from '@/lib/js/datePickerUtils';
import Item from "@/View/Formitem";
import SelectArddress from "@/View/SelectArddress";
import { showResultModal } from "$ACTIONS/helper";
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

class RealyName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Loading: false,
            showArddress: false,
            birthday: "",
            datavalue: [],
        };

        this.handleOk = this.handleOk.bind(this);
    }
    componentDidMount() {
        //this.props.onRef(this);
    }

    /**
     * @description: 提交生日 联系地址
     * @param {*}
     * @return {*}
     */
    handleOk(e) {
        if (!this.submitBtnEnable()) return;

        let cityAddress = this.props.form.getFieldValue("useridCityState");
        let Address = this.props.form.getFieldValue("useridAddressState");
        let birthday = this.props.form.getFieldValue("birthday");
        this.props.setLoading(true);
        console.log("-------------------------->", cityAddress);
        let userInfo = {
            dob: moment(new Date(birthday)).format("YYYY-MM-DD"),
            addresses: {
                address: Address,
                city:
                    cityAddress.province.name +
                    cityAddress.city.name +
                    cityAddress.district.name,
                // zipCode: null,
                // country: null,
                // nationId: 0
            },
        };
        setMemberInfoPut(userInfo, (res) => {
            if (res.isSuccess) {
                showResultModal(
                    "验证成功",
                    true,
                    1501,
                    "otp",
                    "authentication-succeeded",
                );
                this.props.getMemberData();
            }
            this.props.setLoading(false);
        });
        Pushgtagdata(`Verification`, "Submit", `Submit_DOB_WithdrawPage`);
    }

    /**
     * @description: 信息验证
     * @param {*}
     * @return {*}
     */
    submitBtnEnable = () => {
        let errors = Object.values(this.props.form.getFieldsError()).some(
            (v) => v !== undefined,
        );
        let cityAddress = this.props.form.getFieldValue("useridCityState");
        let dAddress = this.props.form.getFieldValue("useridAddressState");
        let birthday = this.props.form.getFieldValue("birthday");
        let city = false;
        if (
            cityAddress &&
            cityAddress.province &&
            cityAddress.city &&
            cityAddress.district &&
            cityAddress.province.name &&
            cityAddress.city.name &&
            cityAddress.district.name
        ) {
            city = true;
        } else {
            city = false;
        }

        return (
            birthday &&
            birthday !== "" &&
            dAddress &&
            dAddress !== "" &&
            city &&
            !errors
        );
    };

    render() {
        const { getFieldDecorator, getFieldError } = this.props.form;
        const { birthday, showArddress, datavalue } = this.state;
        const minDate = moment(new Date("1930-01-01"))._d;
        const maxDate = moment(new Date())._d;
        return (
            <div>
                {" "}
                <div className="AddressVerify">
                    <h3>完善个人资料</h3>
                    <p className="note">填写您的出生日期及联系地址</p>

                    <Item
                        errorMessage={getFieldError("birthday")}
                        label="出生日期"
                    >
                        {getFieldDecorator("birthday", {
                            rules: [
                                { required: true, message: "请输入出生日期" },
                                {
                                    validator: (rule, value, callback) => {
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
                                        src="/vn/img/icons/icon-calender.svg"
                                    />
                                }
                                disabled={false}
                                placeholder={"选择出生日期"}
                                format="YYYY年MM月DD日"
                                // dropdownClassName="user-info-dob-picker-dropdown"
                                //defaultPickerValue={moment(this.defaultMinDate)}
                                //disabledDate={this.disabledDate}
                                showToday={false}
                                allowClear={false}
                                style={{ width: "100%" }}
                                size="large"
                            />,
                            // <DatePicker
                            // 	datePickerProps={{
                            // 		defaultDate: now,
                            // 		mode: 'date',
                            // 		maxDate: maxDate,
                            // 		minDate: minDate
                            // 	}}
                            // 	title="选择日期"
                            // 	isOpen={this.state.isOpen}
                            // 	onChange={(v) => {
                            // 		this.setState({
                            // 			birthday: moment(v).format('YYYY-MM-DD')
                            // 		});
                            // 	}}
                            // 	onClose={() => {
                            // 		this.setState({ isOpen: false });
                            // 	}}
                            // >
                            // 	<Flexbox
                            // 		onClick={() => {
                            // 			this.setState({
                            // 				isOpen: !this.state.isOpen
                            // 			});
                            // 		}}
                            // 		className="TimeBox"
                            // 	>
                            // 		<span>{birthday ? moment(new Date(birthday)).format('YYYY-MM-DD') : ''}</span>
                            // 		<BiCalendar color="#999999" size="20" />
                            // 	</Flexbox>
                            // </DatePicker>
                        )}
                    </Item>
                    <br />
                    <Item
                        errorMessage={getFieldError("useridCityState")}
                        label="省市/自治市"
                    >
                        {getFieldDecorator("useridCityState", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入省市/自治市",
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        callback();
                                    },
                                },
                            ],
                        })(
                            <SelectArddress
                                show={showArddress}
                                datavalue={datavalue}
                                isShow={(val) => {
                                    this.setState({
                                        showArddress: val,
                                    });
                                }}
                                onChange={(val) => {
                                    console.log(val);
                                    this.setState({
                                        datavalue: val,
                                    });
                                }}
                            />,
                        )}
                    </Item>
                    <br />
                    <Item
                        errorMessage={getFieldError("useridAddressState")}
                        label="联系地址"
                    >
                        {getFieldDecorator("useridAddressState", {
                            rules: [
                                { required: true, message: "请输入联系地址" },
                                {
                                    validator: (rule, value, callback) => {
                                        //console.log(value);
                                        if (value && !addressReg.test(value)) {
                                            callback("联系地址格式错误");
                                        }
                                        callback();
                                    },
                                },
                            ],
                        })(
                            <Input
                                size="large"
                                placeholder=""
                                onChange={(e) => {
                                    this.setState({
                                        userAddressState: e.target.value,
                                    });
                                }}
                                maxLength="100"
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
