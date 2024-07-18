/*
 * @Author: Alan
 * @Date: 2023-01-31 00:10:16
 * @LastEditors: Alan
 * @LastEditTime: 2023-01-31 22:52:14
 * @Description: Banner
 * @FilePath: \F1-M1-WEB-Code\components\Wallet\USDTBanner\index.js
 */
import React from "react";
import { Icon } from "antd";
import { CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { get } from "$ACTIONS/TlcRequest";
import { Cookie } from "$ACTIONS/util";

class USDTBanner extends React.Component {
    static defaultProps = {
        type: 0,
        cmsImageUrl: "",
    };
    constructor(props) {
        super(props);
        this.state = {
            showUSDTPromotion: true,
        };

        this.propsParams = [
            [
                "/vi-vn/api/v1/web/webbanners/position/deposit_USDT?login=after",
                "/vn/img/promotions/depositpagebanner.png",
                "Deposit_USDT_banner",
                "Deposit_USDT_banner_close",
                "USDTPromotionIDDeposit",
            ],
            [
                "/vi-vn/api/v1/web/webbanners/position/Withdrawal_USDT?login=after",
                "/vn/img/promotions/withdrawalpagebanner.png",
                "Withdrawal_USDT_banner",
                "Withdrawal_USDT_banner_close",
                "USDTPromotionIDWithdrawal",
            ],
        ];
    }
    componentDidMount() {
        get(CMSAPIUrl + this.propsParams[this.props.type][0]).then((res) => {
            if (res && res.length != 0) {
                this.USDTPromotionID = res[0].action.ID;
                this.setState({ cmsImageUrl: res[0].cmsImageUrl });
            }
        });
    }
    goUSDTPromotion = () => {
        if (typeof this.USDTPromotionID == "undefined") {
            return;
        } else {
            window.location.href = `/vn/promotions?id=${this.USDTPromotionID}`;
        }

        Pushgtagdata(this.propsParams[this.props.type][2]);
    };
    render() {
        return this.state.showUSDTPromotion && this.state.cmsImageUrl ? (
            <div className="USDT-promotion-wrap" onClick={this.goUSDTPromotion}>
                <Icon
                    type="close"
                    onClick={(e) => {
                        e.stopPropagation();
                        this.setState({ showUSDTPromotion: false });
                        Pushgtagdata(this.propsParams[this.props.type][3]);
                    }}
                />
                <img
                    src={this.state.cmsImageUrl}
                    style={{ height: 82, borderRadius: 20 }}
                />
            </div>
        ) : null;
    }
}
export default USDTBanner;
