import React, { Component } from "react";
import {
    Row,
    Col,
    Modal,
    message,
    Radio,
    Input,
    Button,
    Icon,
    Spin,
} from "antd";
import { get, post, del } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import dynamic from "next/dynamic";
import { translate } from "$ACTIONS/Translate";
import { getMaskHandler } from "$ACTIONS/helper";

//显示地址详情
const AddressDetail = dynamic(import("./Details"), {
    loading: () => "",
    ssr: false,
});
class PromotionsAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Address: [],
            Remark: "",
            Active: -1,
            ShowDeletPopup: false,
            showDetail: false,
            type: "",
            addressKey: -999,
            loading: false,
        };
    }

    componentDidMount() {
        let Addressdata = JSON.parse(localStorage.getItem("Address"));
        if (Addressdata) {
            this.setState({
                Address: Addressdata,
            });
            if (Addressdata.length !== 0) {
                let havedefault = Addressdata.find(
                    (item) => item.defaultAddress == true,
                );
                if (havedefault) {
                    this.setState({
                        Active: havedefault.recordNo,
                    });
                } else {
                    this.setState({
                        Active: Addressdata[0].recordNo,
                    });
                }
            }
        }
        this.GetShippingAddress();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (
            prevState.showDetail != this.state.showDetail ||
            prevState.ShowDeletPopup != this.state.ShowDeletPopup
        ) {
            this.GetShippingAddress();
        }
    };

    /**
     * @description: 获取会员的收礼地址列表
     * @return {Array}
     */
    GetShippingAddress = () => {
        get(ApiPort.ShippingAddress)
            .then((res) => {
                if (res.isSuccess && res.result) {
                    this.setState({
                        Address: res.result,
                    });

                    localStorage.setItem("Address", JSON.stringify(res.result));

                    if (res.result.length !== 0) {
                        let havedefault = res.result.find(
                            (item) => item.defaultAddress == true,
                        );
                        if (havedefault) {
                            this.setState({
                                Active: havedefault.recordNo,
                            });
                        } else {
                            this.setState({
                                Active: res.result[0].recordNo,
                            });
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /**
     * @description: 申请每日好礼优惠
     * @param {*}
     * @return {Object}
     */
    ApplyDailyDeals = () => {
        let Addressdata =
            this.state.Active == -1
                ? this.state.Address.find((item) => item.defaultAddress == true)
                : this.state.Address.find(
                      (item) => item.recordNo == this.state.Active,
                  );
        let data = {
            recipientFirstName: Addressdata.firstName,
            recipientLastName: Addressdata.lastName,
            postalCode: Addressdata.postalCode,
            contactNo: Addressdata.cellphoneNo,
            email: Addressdata.email,
            province: Addressdata.provinceName,
            district: Addressdata.districtName,
            town: Addressdata.townName,
            village: Addressdata.villageName || "my village",
            houseNumber: Addressdata.houseNum,
            zone: Addressdata.zone,
            address: Addressdata.address || "my home",
            remark: this.state.Remark,
            bonusRuleId: this.props.bonusId,
        };

        console.log("POST API的postData ======> ", data);
        this.setState({ loading: true });
        post(ApiPort.PostDailyDeals + `&bonusRuleId=${data.bonusRuleId}`, data)
            .then((res) => {
                if (res) {
                    if (res.isSuccess) {
                        message.success(translate("提交成功"));
                        this.props.onCancel();
                    } else {
                        message.error(res.errors[0].description);
                    }
                }
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    DeleteAddress = () => {
        this.setState({ loading: true });
        del(ApiPort.ShippingAddress + `&recordNo=${this.state.addressKey}`)
            .then((res) => {
                if (res.isSuccess && res.result) {
                    message.success(translate("删除成功"));
                    this.setState({
                        ShowDeletPopup: false,
                        type: "",
                        addressKey: -999,
                    });
                    this.GetShippingAddress();
                }
            })
            .catch((error) => {
                message.error(translate("删除失败"));
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    render() {
        const { Address, Remark, Active, loading, showDetail } = this.state;
        const { showSelectAddressModal } = this.props;
        return (
            <>
                <Modal
                    closable={true}
                    visible={showSelectAddressModal}
                    centered={true}
                    className="DailyGiftAddress"
                    maskClosable={false}
                    footer={null}
                    title={translate("奖励地址管理")}
                    onCancel={() => {
                        this.props.onCancel();
                    }}
                >
                    <Spin
                        spinning={loading}
                        size="large"
                        tip={translate("加载中")}
                    >
                        <Row>
                            <Col>
                                <div className="DailyGiftAddress-info">
                                    {translate(
                                        "请确保此送货地址正确，以确保礼品能够按时送达",
                                    )}
                                </div>
                            </Col>

                            {/* ------------------- 地址清單 ------------------- */}
                            {Address &&
                                Address.map((data, index) => {
                                    const {
                                        firstName,
                                        lastName,
                                        cellphoneNo,
                                        provinceName,
                                        districtName,
                                        townName,
                                        address,
                                        postalCode,
                                        recordNo,
                                        defaultAddress,
                                    } = data;
                                    let status =
                                        this.state.Active == -1
                                            ? defaultAddress
                                            : Active == recordNo;
                                    return (
                                        <React.Fragment>
                                            <Col
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    marginBottom: "15px",
                                                }}
                                                key={index}
                                            >
                                                <div
                                                    className="DailyGiftAddress-list"
                                                    style={{
                                                        position: "relative",
                                                    }}
                                                    onClick={() => {
                                                        this.setState({
                                                            Active: recordNo,
                                                        });
                                                    }}
                                                >
                                                    <div className="radioBox">
                                                        <Radio
                                                            checked={status}
                                                        />
                                                    </div>

                                                    <div
                                                        className="DailyGiftAddress-list-info"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            this.setState({
                                                                showDetail: true,
                                                                type: "readOnly",
                                                                addressKey:
                                                                    recordNo,
                                                            });
                                                        }}
                                                    >
                                                        <div className="mid-info-nameAndPhone">
                                                            <span className="name">
                                                                {getMaskHandler(
                                                                    "Security answer",
                                                                    lastName,
                                                                )}{" "}
                                                                {getMaskHandler(
                                                                    "Security answer",
                                                                    firstName,
                                                                )}
                                                            </span>
                                                            <span>
                                                                {getMaskHandler(
                                                                    "Phone",
                                                                    cellphoneNo,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="mid-info-address">
                                                            {provinceName +
                                                                districtName +
                                                                townName +
                                                                address}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className="editBox"
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: "20px",
                                                            right: "18px",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            this.setState({
                                                                //编辑
                                                                showDetail: true,
                                                                type: "edit",
                                                                addressKey:
                                                                    recordNo,
                                                            });
                                                        }}
                                                    >
                                                        <img
                                                            style={{
                                                                width: "16px",
                                                            }}
                                                            src={`${process.env.BASE_PATH}/img/icon/editIcon.svg`}
                                                            alt="edit"
                                                        />
                                                    </span>
                                                    {defaultAddress && (
                                                        <span className="default">
                                                            {translate("默认")}
                                                        </span>
                                                    )}
                                                </div>
                                            </Col>
                                        </React.Fragment>
                                    );
                                })}
                            {/* ------------------- 新增运送地址 ------------------- */}
                            {Array.isArray(Address) && Address.length < 3 ? (
                                <Col>
                                    <div className="DailyGiftAddress-btn">
                                        <Button
                                            onClick={() => {
                                                this.setState({
                                                    showDetail: true,
                                                    type: "add",
                                                    addressKey: -999,
                                                });
                                                // Router.push(`/daily-gift/Address/Details?id=${this.props.router.query.id}&type=${'add'}`);
                                            }}
                                        >
                                            <Icon
                                                type="plus-circle"
                                                style={{ color: "#00a6ff" }}
                                            />
                                            {translate("添加地址")}
                                        </Button>
                                    </div>
                                </Col>
                            ) : null}

                            {/* ------------------- 备注 ------------------- */}
                            {Address.length > 0 && (
                                <>
                                    <Col
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <div className="DailyGiftAddress-remark">
                                            <label>{translate("备注")}</label>
                                            <Input
                                                size="large"
                                                placeholder=""
                                                value={Remark}
                                                maxLength={1500}
                                                onChange={(e) => {
                                                    this.setState({
                                                        Remark: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <React.Fragment>
                                        <Col>
                                            <div className="DailyGiftAddress-submit">
                                                <Button
                                                    onClick={() => {
                                                        if (
                                                            this.state.Active ==
                                                            -1
                                                        ) {
                                                            message.error(
                                                                translate(
                                                                    "请选择",
                                                                ),
                                                            );
                                                            return;
                                                        }
                                                        this.ApplyDailyDeals();
                                                    }}
                                                >
                                                    {translate("提交")}
                                                </Button>
                                            </div>
                                        </Col>
                                    </React.Fragment>
                                </>
                            )}
                        </Row>
                    </Spin>
                </Modal>

                <AddressDetail
                    type={this.state.type}
                    addressKey={this.state.addressKey}
                    onCancel={() => {
                        this.setState({
                            showDetail: false,
                            type: "",
                            addressKey: -999,
                        });
                    }}
                    visible={showDetail}
                />
            </>
        );
    }
}

export default PromotionsAddress;
