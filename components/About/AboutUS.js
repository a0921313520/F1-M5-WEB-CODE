import React from "react";
import { Icon, Spin } from "antd";
import ReactCardCarousel from "$DATA/js/reactCardCarousel";
import Router from "next/router";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Tabactive: "1",
            vipArray: [],
            coinArray: [],
        };
        this.tlcBanner = React.createRef();
    }

    componentDidMount() {
        get(ApiPort.GetVipIntroductioinPicture)
            .then((res) => {
                this.setState({ vipArray: res });
            })
            .catch((error) => {
                console.log("GetVipIntroductioinPicture error:", error);
                return null;
            });
        get(ApiPort.GetCoinIntroductioinPicture)
            .then((res) => {
                this.setState({ coinArray: res });
            })
            .catch((error) => {
                console.log("GetCoinIntroductioinPicture error:", error);
                return null;
            });
    }

    render() {
        return (
            <React.Fragment>
                {this.props.Contentdata ? (
                    <div id="tlc_about">
                        {this.props.Tabactive ==
                            CMSOBJ[HostConfig.CMS_ID][42] && (
                            <React.Fragment>
                                <div
                                    id="about_us"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .about_us,
                                    }}
                                />
                                <div
                                    id="partners"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .partners,
                                    }}
                                />
                                <span
                                    className="partners"
                                    onClick={() => {
                                        Router.push("/Sponsor");
                                    }}
                                >
                                    了解更多
                                </span>
                                <div
                                    id="licenses"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .licenses,
                                    }}
                                />
                                <span
                                    className="licenses"
                                    onClick={() => {
                                        Router.push(
                                            `/About?type=Sub0&key=${
                                                CMSOBJ[HostConfig.CMS_ID][39]
                                            }`,
                                        );
                                    }}
                                >
                                    查看牌照
                                    <Icon type="arrow-right" />
                                </span>
                            </React.Fragment>
                        )}
                        {this.props.Tabactive ==
                            CMSOBJ[HostConfig.CMS_ID][39] && (
                            <div
                                id="guarantee"
                                dangerouslySetInnerHTML={{
                                    __html: this.props.Contentdata.body
                                        .guarantee,
                                }}
                            />
                        )}
                        {this.props.Tabactive ==
                            CMSOBJ[HostConfig.CMS_ID][40] && (
                            <div id="cooperation_partner">
                                <h2>合作伙伴</h2>
                                <div
                                    className="year-cooperation"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .cross_year_party,
                                    }}
                                />
                                <div
                                    className="year-cooperation"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .southhampton,
                                    }}
                                />
                                <div
                                    className="year-cooperation"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .marathon,
                                    }}
                                />
                                <div
                                    className="year-cooperation"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .siburan,
                                    }}
                                />
                                <div
                                    className="year-cooperation"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .sunderan,
                                    }}
                                />
                            </div>
                        )}
                        {this.props.Tabactive ==
                            CMSOBJ[HostConfig.CMS_ID][41] && (
                            <div
                                id="slogan"
                                dangerouslySetInnerHTML={{
                                    __html: this.props.Contentdata.body.slogan,
                                }}
                            />
                        )}
                        {this.props.Tabactive ==
                            CMSOBJ[HostConfig.CMS_ID][38] && (
                            <div id="tlc_currency_introduction">
                                <div
                                    className="currency-introduction"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .about_coin,
                                    }}
                                />
                                {this.state.coinArray.length ? (
                                    <React.Fragment>
                                        <div className="">
                                            <table>
                                                <caption>同乐币介绍</caption>
                                            </table>
                                        </div>
                                        <div className="Carouselbody">
                                            <ReactCardCarousel
                                                ref={this.tlcBanner}
                                                disable_keydown={true}
                                                autoplay={true}
                                                autoplay_speed={3000}
                                                spread={[
                                                    "-108%",
                                                    "8%",
                                                    "-118%",
                                                ]}
                                            >
                                                {this.state.coinArray.map(
                                                    (item, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <img
                                                                    src={
                                                                        item.cmsImageUrl
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </ReactCardCarousel>
                                        </div>
                                    </React.Fragment>
                                ) : null}
                                {/* <div
							className="currency-introduction"
							dangerouslySetInnerHTML={{
								__html: this.props.Contentdata.body.shop_change_rule
							}}
						/> */}
                                <div
                                    className="currency-introduction"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .coin_expiration,
                                    }}
                                />
                                <div
                                    className="currency-introduction"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .coin_rule,
                                    }}
                                />
                            </div>
                        )}

                        {this.props.Tabactive ==
                            CMSOBJ[HostConfig.CMS_ID][37] && (
                            <div id="tlc_member_power">
                                {this.state.vipArray.length ? (
                                    <React.Fragment>
                                        <div className="currency-introduction">
                                            <table>
                                                <caption>会员权益</caption>
                                            </table>
                                        </div>
                                        <div className="Carouselbody">
                                            <ReactCardCarousel
                                                ref={this.tlcBanner}
                                                disable_keydown={true}
                                                autoplay={true}
                                                autoplay_speed={3000}
                                                spread={[
                                                    "-108%",
                                                    "8%",
                                                    "-118%",
                                                ]}
                                            >
                                                {this.state.vipArray.map(
                                                    (item, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <img
                                                                    src={
                                                                        item.cmsImageUrl
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </ReactCardCarousel>
                                        </div>
                                    </React.Fragment>
                                ) : null}
                                <div
                                    className="help-table"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .VIP_special,
                                    }}
                                />
                                <div
                                    className="help-table"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .VIP_application,
                                    }}
                                />
                                <div
                                    className="help-table"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .VIP_keep,
                                    }}
                                />
                                <div
                                    className="help-table"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .VIP_rule,
                                    }}
                                />
                            </div>
                        )}
                        {this.props.Tabactive ==
                            CMSOBJ[HostConfig.CMS_ID][36] && (
                            <div id="contact_we">
                                <div
                                    id="contact_us"
                                    className="contact-we"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .contact_us,
                                    }}
                                />
                                <div
                                    id="e_mail"
                                    className="contact-we"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .e_mail,
                                    }}
                                />
                                <div
                                    id="phone"
                                    className="contact-we"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .phone,
                                    }}
                                />
                                <div
                                    id="customer_care"
                                    className="contact-we"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .customer_care,
                                    }}
                                />
                                <div
                                    id="media"
                                    className="contact-we help-table"
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.Contentdata.body
                                            .media,
                                    }}
                                />
                            </div>
                        )}
                        {this.props.Tabactive ==
                            CMSOBJ[HostConfig.CMS_ID][44] && (
                            <div
                                id="refer"
                                dangerouslySetInnerHTML={{
                                    __html: this.props.Contentdata.body.refer,
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <Spin tip="玩命加载中..." />
                )}
            </React.Fragment>
        );
    }
}
