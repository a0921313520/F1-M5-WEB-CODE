import React, { Component } from "react";
import Router, { withRouter } from "next/router";
import {
    Row,
    Col,
    Modal,
    message,
    Input,
    Checkbox,
    Select,
    Button,
    Spin
} from "antd";
import { createForm } from "rc-form";
import Item from "../View/Formitem";
import SelectArddress from "../View/SelectArddress";
import { ApiPort } from "../../actions/TLCAPI";
import { post, del,put } from "$ACTIONS/TlcRequest";
import {translate}  from "$ACTIONS/Translate";
import {realyNameReg,phoneReg,address2Reg,postalCodeReg} from "$ACTIONS/reg";
import { getMaskHandler,getDisplayPublicError } from "$ACTIONS/helper";

class PromotionsAddressform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultAddress: true,
            postalCode: "",
            contactNo: "",
            email: "",
            address: "",
            datavalue: [],
            showArddress: false,
            name: "",
            loading:false
        };
    }
    componentDidUpdate(prevProps, prevState){
        if(prevProps.visible !== this.props.visible && this.props.visible){
            this.getAddressdata();
        }
        if(prevProps.address !== this.props.address && this.props.address?.length){
            if (!this.props.address.some(item => item.defaultAddress)) {
                this.setNextAccountToDefault();
            }
        }
    }
    getAddressdata() {
        const {type, addressKey } = this.props;
        console.log("🚀 ~ file: Details.js:49 ~ PromotionsAddressform ~ componentDidMount ~ addresskey:",type, addressKey)
        if(type === "add"){
            this.setState({
                datavalue: [],
                name: "",
                contactNo: "",
                email: "",
                postalCode: "",
                address: ""
            });
        } else {
            let Addressdata = this.props.address;
            if (Addressdata && Addressdata != "") {
                let activeData = Addressdata.find(
                    (item) => item.recordNo == addressKey
                );
                if (activeData) {
                    let city = [
                        {
                            name: activeData.provinceName,
                            id: activeData.provinceID,
                        },
                        {
                            name: activeData.districtName,
                            id: activeData.districtID,
                        },
                        { 
                            name: activeData.townName, 
                            id: activeData.townID 
                        },
                    ];
                    let name = activeData.firstName + activeData.lastName;
                    let phone = activeData.cellphoneNo;
                    let email = activeData.email;
                    this.setState({
                        datavalue: city,
                        name,
                        contactNo: phone,
                        email: email,
                        postalCode: activeData.postalCode,
                        address: activeData.address
                    });
                }
            }
        }
    }
    
    /**
     * @description:  添加一个新的地址和编辑地址公用一个方法
     * @param {String}  address            详细地址
     * @param {Number}  postalCode		   邮编
     * @param {Number}  contactNo          手机号
     * @param {Number}  provinceId		   省份
     * @param {Number}  districtId         市区
     * @param {Number}  townId             县
     * @param {Boolean}  defaultAddress	   设置为默认地址
     * @return {Object}
     */
    AddNewAddress = () => {
        const {
            defaultAddress,
            postalCode,
            contactNo,
            address,
            datavalue
        } = this.state;
        const memberInfo = !!localStorage.getItem("memberInfo") && JSON.parse(localStorage.getItem("memberInfo"));
        const email = memberInfo?.contacts.find((item)=>item.contactType === "Email").contact;
        let Data = {
            recipientFirstName: this.props.form.getFieldValue("name"),
            recipientLastName: "",
            postalCode: postalCode,
            contactNo: contactNo,
            email: email,
            provinceId: datavalue[0].id,
            districtId: datavalue[1].id,
            townId: datavalue[2].id,
            villageId: 0,
            houseNumber: "",
            zone: "",
            address: address,
            defaultAddress: defaultAddress
        };
        if(this.props.type === "edit"){
            Data.recordNo = this.props.addressKey
        }
        this.setState({loading: true})
        const RequestMethed = this.props.type === "edit" ? put : post;
        RequestMethed(ApiPort.ShippingAddress, Data)
            .then((res) => {
                if (res && res.isSuccess && res.result) {
                    if(this.props.type === "add"){
                        message.success(translate("添加成功"))
                    }
                    this.props.form.resetFields();
                    this.props.onCancel(true);
                    this.setState({
                        datavalue:[]
                    })
                } else {
                    res.errors &&  message.error(res.errors[0].message);
                }
            })
            .catch((error) => {
                error.errors && message.error(error.errors[0].message);
            }).finally(()=>{
                this.setState({loading: false})
            })
    };

    /**
     * @description: 删除地址
     * @param {Number}
     * @return {Object}
     */
    DeleteAddress = () => {
        Modal.confirm({
            icon: null,
            centered: true,
            title: translate("删除地址"),
            content: translate("您想删除该奖励地址吗？"),
            okText: translate("删除"),
            cancelText: translate("不是"),
            className:"confirm-modal-of-public dont-show-close-button",
            closable: "",
            onOk: () => {
                this.setState({
                    loading: true
                });
                del(ApiPort.ShippingAddress + `&recordNo=${this.props.addressKey}`)
                    .then((res) => {
                        if(res && res.isSuccess && res.result){
                            this.props.onCancel(true);
                            message.success(translate("删除成功"))
                        } else {
                            res.errors &&  message.error(res.errors[0].message);
                        }
                    }).catch(()=>{
                        message.error(translate("删除失败"));
                    }).finally(()=>{
                        this.setState({
                            loading: false
                        })
                    })
            },
            cancelButtonProps: {
                ghost: true,
                type: "danger",
                shape: "round",
            },
        })
       
    };

    /**
     * @description: 验证地址相关信息填写
     * @return {*}
     */
    submitBtnEnable = () => {
        let error = Object.values(this.props.form.getFieldsError()).some(
            (v) => v !== undefined
        );
        let errors = Object.values(this.props.form.getFieldsValue()).some(
            (v) => v == "" || v == undefined
        );
        let addressIsCompleted = true;

        if (this.state.datavalue.length === 0) {
            addressIsCompleted = false;
        }

        this.state.datavalue.forEach((data) => {
            if (!data || data === undefined) {
                addressIsCompleted = false;
            }
        });
        console.log("🚀 ~ file: Details.js:185 ~ PromotionsAddressform ~ this.state.datavalue:", !errors , !error , addressIsCompleted)
        return !errors && !error && addressIsCompleted;
    };

    /**
     * 当删除的账户是默认的账户时自动默认第一个账户为默认账户
     */
    setNextAccountToDefault =()=> {
        this.props.setType("setDefault");
        const addressData = this.props.address;
        const data = {
            recipientFirstName: addressData[0].firstName + addressData[0].lastName,
            recipientLastName: "",
            postalCode: addressData[0].postalCode,
            contactNo: addressData[0].cellphoneNo,
            email: addressData[0].email,
            provinceId: addressData[0].provinceID,
            districtId:  addressData[0].districtID,
            townId:  addressData[0].townID,
            villageId: addressData[0].villageID,
            houseNumber: addressData[0].houseNum,
            zone: addressData[0].zone,
            address: addressData[0].address,
            recordNo: addressData[0].recordNo,
            defaultAddress: true
        }
        this.props.setLoading(true);
        put(ApiPort.ShippingAddress, data)
            .then((res) => {
                if (res && res.isSuccess && res.result) {
                    this.props.onCancel(true);
                } else {
                    getDisplayPublicError(res);
                }
            })
            .catch((error) => {
                getDisplayPublicError(error);
            }).finally(()=>{
                this.props.setLoading(false)
            })
    }

    render() {
        const {
            defaultAddress,
            showArddress,
            datavalue,
            contactNo,
            address,
            name,
            email,
            postalCode,
            loading
        } = this.state;
        const {visible} = this.props;
        const { getFieldDecorator, getFieldError } = this.props.form;
        return (
                <Modal
                    closable={true}
                    visible={visible}
                    centered={true}
                    className="DailyGiftAddressDetail modal-pubilc"
                    maskClosable={false}
                    footer={null}
                    title={translate("奖励地址管理")}
                    onCancel={() => {
                        this.props.onCancel(false);
                    }}
                >
                    <Spin spinning={loading} size="large" tip={translate("加载中")}>
                    <div
                        className="DailyGiftAddressDetail-text"
                    >
                        {translate("请确保此送货地址正确，以确保礼品能够按时送达")}
                    </div>

                    {/* -------------------用户名----------------- */}
                    <Item errorMessage={getFieldError("name")}>
                        <div
                            className="item-text"
                            style={{ marginTop: "15px" }}
                        >
                            {translate("名字和姓氏")}
                        </div>
                        <Col style={{ display: "flex", gap: "10px" }}>
                            {getFieldDecorator("name", {
                                initialValue: name,
                                rules: [
                                    {
                                        required: true,
                                        message: translate("请输入您的真实姓名2"),
                                    },
                                    {
                                        validator: (
                                            rule,
                                            value,
                                            callback
                                        ) => {
                                            if (
                                                value && !realyNameReg.test(value) 
                                            ) {
                                                callback(translate("格式错误，真实姓名需要2-50个字母数字字符"));
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    className="lastname-input"
                                    placeholder={translate("输入名字和姓氏")}
                                    size="large"
                                    maxLength={50}
                                />
                            )}
                        </Col>
                    </Item>
                    

                    {/* -------------------联系电话----------------- */}
                    <Item errorMessage={getFieldError("phone")}>
                        <Col style={{ marginTop: "15px" }}>
                            <div className="item-text">{translate("电话号码")}</div>
                            {getFieldDecorator("phone", {
                                initialValue: contactNo,
                                rules: [
                                    {
                                        required: true,
                                        message: translate("请输入电话号码"),
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (
                                                value && !phoneReg.test(value)
                                            ) {
                                                callback(
                                                    translate("电话号码必须由9个数字组成，不要在前面填写0")
                                                );
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Row className="phone-numbner-row">
                                    <Col span={4}><span>{'84 +'}</span></Col>
                                    <Col span={19} offset={1}>
                                        <Input
                                            type="phone"
                                            placeholder={translate("输入你的电话号码")}
                                            size="large"
                                            maxLength={9}
                                            onChange={(e) => {
                                                this.setState({
                                                    contactNo: e.target.value,
                                                });
                                            }}
                                            value={contactNo}
                                        />
                                    </Col>
                                </Row>
                            )}
                        </Col>
                    </Item>

                    {/* -------------------邮箱地址----------------- */}
                    {/* <Item errorMessage={getFieldError("email")}>
                        <Col style={{ marginTop: "15px" }}>
                            <div className="item-text">{translate("邮箱")}</div>
                            {getFieldDecorator("email", {
                                initialValue: email,
                                rules: [
                                    {
                                        required: true,
                                        message: translate("请输入电子邮箱"),
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (
                                                value &&
                                                value.length <= 50 &&
                                                (!emailReg.test(value) ||
                                                    value.includes(".."))
                                            ) {
                                                callback(translate("请填写有效的电子邮件地址"));
                                            }
                                            if (value && value.length > 50) {
                                                callback(translate("请填写有效的电子邮件地址"));
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    type="text"
                                    size="large"
                                    placeholder={translate("电子邮箱地址")}
                                    maxLength={50}
                                    onChange={(e) => {
                                        this.setState({
                                            email: e.target.value,
                                        });
                                    }}
                                />
                            )}
                        </Col>
                    </Item> */}

                    {/* -------------------详细地址----------------- */}
                    <Item
                        errorMessage={
                            getFieldError("address") ||
                            getFieldError("datavalue")
                        }
                    >
                        <Col style={{ marginTop: "15px" }}>
                            <div className="item-text">{translate("地址")}</div>
                            <SelectArddress
                                type={this.props.type}
                                show={showArddress}
                                datavalue={datavalue}
                                isShow={(val) => {
                                    this.setState({
                                        showArddress: val,
                                    });
                                }}
                                onChange={(val) => {
                                    const newDataValue = [];
                                    for (const key in val) {
                                        newDataValue.push(val[key]);
                                    }
                                    this.setState({
                                        datavalue: newDataValue,
                                    });
                                    this.props.form.setFieldsValue({
                                        datavalue: newDataValue,
                                    });
                                }}
                                value={datavalue}
                                className="selectArddress-wrap"
                            />
                            {getFieldDecorator("address", {
                                initialValue: address,
                                rules: [
                                    {
                                        required: true,
                                        message: translate("请输入门牌号和街道名称"),
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (
                                                value && !address2Reg.test(value)
                                                ) {
                                                callback(translate("格式错误。 只接受特殊字符 # ' 。 , - / & ( )"));
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={translate("输入门牌号码和街道名称")}
                                    size="large"
                                    maxLength={100}
                                    onChange={(e) => {
                                        this.setState({
                                            address: e.target.value,
                                        });
                                    }}
                                />
                            )}
                        </Col>
                    </Item>

                    {/* -------------------邮政编码----------------- */}
                    <Item errorMessage={getFieldError("postalCode")}>
                        <Col style={{ marginTop: "15px" }}>
                            <div className="item-text">{translate("邮政编码")}</div>
                            {getFieldDecorator("postalCode", {
                                initialValue:postalCode,
                                rules: [
                                    {
                                        required: true,
                                        message: translate("请输入邮政编码"),
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (
                                                value && !postalCodeReg.test(value)
                                            ) {
                                                callback(translate("邮政编码无效（仅输入数字）"));
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={translate("输入邮政编码")}
                                    size="large"
                                    maxLength={6}
                                    onChange={(e) => {
                                        this.setState({
                                            postalCode: e.target.value,
                                        });
                                    }}
                                />
                            )}
                        </Col>
                    </Item>

                    {/* -------------------设为默认运送地址----------------- */}
                    <Col style={{ marginTop: "15px" }}>
                        <Checkbox
                            checked={defaultAddress}
                            onChange={(e) => {
                                this.setState({
                                    defaultAddress: e.target.checked,
                                });
                            }}
                        >
                            {translate("设置为默认送货地址")}
                        </Checkbox>
                    </Col>
                    <div className="DailyGiftAddressDetail-btn">
                        <Button
                            onClick={() => {
                                this.AddNewAddress();
                            }}
                            type="primary"
                            disabled={!this.submitBtnEnable()}
                            key="save"
                            block
                        >
                            {translate("保存")}
                        </Button>
                    </div>
                    {this.props.type === "edit" ? <div className="delete-btn">
                        <Button
                            onClick={this.DeleteAddress}
                            key='del'
                            block
                        >
                            {translate("删除")}
                        </Button>
                    </div> : null}
                </Spin>
            </Modal>
        );
    }
}

export default withRouter(
    createForm({ fieldNameProp: "address" })(PromotionsAddressform)
)
