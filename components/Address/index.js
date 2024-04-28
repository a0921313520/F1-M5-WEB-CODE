import React from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { Icon } from "antd";
import { get, post, del } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { translate } from "$ACTIONS/Translate";
import { getMaskHandler } from "$ACTIONS/helper";

//显示地址详情
const AddressDetail = dynamic(import("./Details"), {
    loading: () => "",
    ssr: false,
});
class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: [],
            visible: false,
            type: "",
            showDetail: false,
            addressKey: -999
        };
    }
    componentDidMount() {
        this.getShippingAddress();
    }

    /**
     * @description: 获取会员的收礼地址列表
     * @return {Array}
     */
    getShippingAddress = () => {
        this.props.setLoading(true);
        get(ApiPort.ShippingAddress)
            .then((res) => {
                if (res.isSuccess && res.result) {
                    this.setState({
                        address: res.result,
                    });
                    localStorage.setItem("Address", JSON.stringify(res.result));
                }
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                this.props.setLoading(false);
            })
    };

    clearParams = (bool=false) => {
        this.setState({
            showDetail: false,
            addressKey: -999,
            type: ""
        })
        bool && this.getShippingAddress()
    }

    render() {
        const {
            address,
            showDetail,
            type,
            addressKey
        } = this.state;
        return (
            <React.Fragment>
                <div className="account-wrap address-management">
                    <h2>{translate("奖励地址管理")}</h2>
                    <div className="line-distance" />
                    <div className="modal-prompt-info">
                        {translate("请确保此送货地址正确，以确保礼品能够按时送达")}
                    </div>
                    <div className="line-distance" />
                    <div className="address-wrap">
                        {Array.isArray(address) && address.length ? (
                            <div className="address-item-list">
                                {address.map((item, index) => {
                                    return (
                                        <div className="address-item" key={index}>
                                            <div className="info-name-edit">
                                                <div className="info-name">
                                                    {item.lastName}
                                                    {" "}
                                                    {item.firstName}
                                                </div>
                                                <div className="info-edit">
                                                    {item.defaultAddress ? 
                                                        <span
                                                            className="default"
                                                        >
                                                            {translate("默认")}
                                                        </span>:<span/>}
                                                    <span
                                                        className="edit"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            this.setState({
                                                                //编辑
                                                                showDetail: true,
                                                                type: "edit",
                                                                addressKey: item.recordNo,
                                                            });
                                                        }}
                                                    >
                                                        <img style={{ width: "16px" }} src={`${process.env.BASE_PATH}/img/icon/editIcon.svg`} alt="edit" />
                                                    </span>

                                                </div>
                                            </div>
                                            <div className="info-phone">
                                                {(item.cellphoneNo).startsWith("+84") ? item.cellphoneNo : "+84 " + item.cellphoneNo }
                                            </div>
                                            <div className="info-address">
                                                {item.provinceName + item.districtName + item.townName +" "+ item.address}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : null}
                        {address.length < 3 ? (
                            <div className="add-wallet-item"
                                onClick={() => {
                                    this.setState({
                                        showDetail: true,
                                        type: "add",
                                    })
                                }}
                            >
                                <Icon type="plus-circle" />{" "}
                                {translate("添加地址")}
                            </div>
                        ) : null}
                    </div>
                </div>
                <AddressDetail
                    type={type}
                    addressKey={addressKey}
                    onCancel={this.clearParams}
                    visible={showDetail}
                    setType={(v)=>{this.setState({type:v})}}
                    address={address}
                    setLoading={this.props.setLoading}
                />
            </React.Fragment>
        );
    }
}

export default Address;
