import React from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import Layout from "@/Layout";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { formatAmount } from "$ACTIONS/util";
import { Popover, Spin, Button, Icon } from "antd";
import { getMemberInfo } from "$DATA/userinfo";
import { connect } from "react-redux";
import { promotionActions } from "$STORE/promotionSlice";
import {
    userCenterActions,
    WILLUPDATETODEFAULT_KEYARRAY,
} from "$STORE/userCenterSlice";
import { translate } from "$ACTIONS/Translate";

// 个人中心
const DynamicAccount = dynamic(import("@/Account"), {
    loading: () => "",
    ssr: true,
});
//奖励地址管理
const Address = dynamic(import("@/Address"), {
    loading: () => "",
    ssr: true,
});
// 银行账户
const DynamicBankAccount = dynamic(import("@/BankAccount"), {
    loading: () => "",
    ssr: true,
});
//帐户验证
const SecurityCheck = dynamic(import("@/SecurityCheck"), {
    loading: () => "",
    ssr: false,
});
//上传文件
const UploadFilesUserCenter = dynamic(import("@/UploadFilesUserCenter"), {
    loading: () => "",
    ssr: true,
});
// 消息中心
const DynamicMessage = dynamic(import("@/Message"), {
    loading: () => "",
    ssr: true,
});
// 交易记录
const DynamicRecords = dynamic(import("@/Records"), {
    loading: () => "",
    ssr: true,
});
// 投注记录
const DynamicBetRecords = dynamic(import("@/BetRecords"), {
    loading: () => "",
    ssr: true,
});
// 创建安全码
const DynamicCreateSecurityCode = dynamic(import("@/CreateSecurityCode"), {
    loading: () => "",
    ssr: false,
});

class MeModule extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageKey: "",
            memberInfo: {},
            loading: false,
            memberInfoRefresh: false, // flag for refresh memberInfo everytime enter Usercenter
        };

        this.setLoading = this.setLoading.bind(this); // 设置等待状态
        this.pageArr = [
            "userinfo",
            "addresses",
            "bankaccount",
            "securitycheck",
            "message",
            "createsecuritycode",
            "uploadFiles",
            "records",
            "betrecords",
            "mypromotion",
            "mybonus",
            "dailybonus",
        ];
        this.pageNameArr = [
            "个人信息",
            "奖励地址管理",
            "银行和钱包",
            "帐户验证",
            "信息和通知",
            "创建安全码",
            "上传个人凭证",
            "交易记录",
            "投注记录",
            "我的优惠",
            "返水",
            "每日优惠",
        ];
        this.pageArrGroup = [];
        let i = 0;
        this.pageArr.forEach((val, index) => {
            (index === 7 || index === 9) && i++;
            typeof this.pageArrGroup[i] === "undefined" &&
                (this.pageArrGroup[i] = []);
            this.pageArrGroup[i].push({
                key: val,
                name: translate(this.pageNameArr[index]),
            });
        });
    }
    componentDidMount() {
        if (this.props.memberInfo) {
            this.setState({
                pageKey: this.props.userCenterTabKey,
                memberInfoRefresh:
                    this.props.userCenterTabKey === "userinfo" ? true : false,
                loading: true,
                memberInfo: this.props.memberInfo,
            });
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.userCenterTabKey !== this.props.userCenterTabKey &&
            this.props.userCenterTabKey
        ) {
            this.setState({
                pageKey: this.props.userCenterTabKey,
            });
        }
        if (
            prevProps.memberInfo !== this.props.memberInfo &&
            this.props.memberInfo !== "{}"
        ) {
            this.setState({
                memberInfo: this.props.memberInfo,
            });
        }
    }
    componentWillUnmount() {
        this.setState = () => false;
    }

    /**
     * 公用跳转UserCenterFunction
     * @param {string} key 需要跳转的界面
     */
    navigatorPage = (key) => {
        let currKey = !!key ? key : this.pageArr[0];
        if (currKey === this.props.userCenterTabKey) return; //禁止重复选择一样的tab
        if (WILLUPDATETODEFAULT_KEYARRAY.some((item) => item === currKey)) {
            switch (currKey) {
                case "mypromotion":
                    this.props.changeTab("2");
                    Router.push("/promotions");
                    break;
                case "mybonus":
                    this.props.changeTab("3");
                    Router.push("/promotions");
                    break;
                case "dailybonus":
                    Router.push("/daily-gift");
                default:
                    break;
            }
        } else {
            switch (currKey) {
                case "bankaccount":
                    this.props.changeUserCenterTabKey(currKey);
                    Router.push("/me/bank-account");
                    break;
                case "createsecuritycode":
                    this.props.changeUserCenterTabKey(currKey);
                    Router.push("/me/security-code");
                    break;
                case "uploadFiles":
                    this.props.changeUserCenterTabKey(currKey);
                    Router.push("/me/upload-files");
                    break;
                case "securitycheck":
                    this.props.changeUserCenterTabKey(currKey);
                    Router.push("/me/verifications");
                    break;
                case "userinfo":
                    this.props.changeUserCenterTabKey(currKey);
                    Router.push("/me/account-info");
                    break;
                case "addresses":
                    this.props.changeUserCenterTabKey(currKey);
                    Router.push("/me/shipment-address");
                    break;
                case "message":
                    this.props.changeUserCenterTabKey(currKey);
                    Router.push("/notification");
                    break;
                case "records":
                    this.props.changeUserCenterTabKey(currKey);
                    Router.push("/transaction-record");
                    break;
                case "betrecords":
                    this.props.changeUserCenterTabKey(currKey);
                    Router.push("/betting-record");
                    break;
                default:
                    break;
            }
        }
    };
    /**
     * @description: 获取会员信息 并更新本地数据
     * @return {*}
     */
    getmemberInfo(props) {
        this.setState({ memberInfoRefresh: false }, () => {
            this.setLoading(true);
            getMemberInfo((res) => {
                if (res) {
                    this.setLoading(false);
                    this.props.setUserCenterMemberInfo(res);
                    this.setState({ memberInfoRefresh: true }, () => {
                        props.SecurityCheckInfo(res);
                    });
                }
            }, true);
        });
    }

    setLoading(status) {
        this.setState({ loading: status });
    }

    render() {
        const { userCenterTabKey, currentMoney, hasUnRead } = this.props;
        const { pageKey, loading } = this.state;
        console.log(
            "🚀 ~ file: usercenter.js:234 ~ UserCenter ~ render ~ userCenterTabKey:",
            userCenterTabKey,
            ",",
            "pageKey:",
            pageKey,
        );
        let pageComponent = null;
        switch (pageKey) {
            case this.pageArr[0]:
                pageComponent = (
                    <DynamicAccount
                        setLoading={this.setLoading}
                        memberInfoRefresh={this.state.memberInfoRefresh}
                        // 更新HadHeader组件的memberInfo，此memberInfo公用到个人信息弹出层和钱包弹出层
                        setMemberInfo={(v) => {
                            this.props.setUserCenterMemberInfo(v);
                        }}
                        // 更新userCenter Page的memberInfo
                        setSelfMemberInfo={(v) => {
                            this.setState({ memberInfo: v });
                        }}
                    />
                );
                break;
            case this.pageArr[1]:
                pageComponent = <Address setLoading={this.setLoading} />;
                break;
            case this.pageArr[2]:
                pageComponent = (
                    <DynamicBankAccount setLoading={this.setLoading} />
                );
                break;
            case this.pageArr[3]:
                pageComponent = (
                    <SecurityCheck
                        setLoading={this.setLoading}
                        goPage={() => {
                            this.navigatorPage("userinfo");
                        }}
                        memberInfo={this.state.memberInfo}
                        getmemberInfo={(props) => {
                            this.getmemberInfo(props);
                        }}
                    />
                );
                break;
            case this.pageArr[4]:
                pageComponent = (
                    <DynamicMessage
                        setLoading={this.setLoading}
                        setCircleHasUnRead={(status) => {
                            this.props.setHeaderIsRead(status);
                        }}
                        clearRedDot={() => {
                            this.props.setUserCenterHasUnRead(false);
                        }}
                        memberCode={this.state.memberInfo.memberCode}
                    />
                );
                break;
            case this.pageArr[5]:
                pageComponent = (
                    <DynamicCreateSecurityCode
                        setLoading={this.setLoading}
                        memberInfo={this.state.memberInfo}
                    />
                );
                break;
            case this.pageArr[6]:
                pageComponent = (
                    <UploadFilesUserCenter setLoading={this.setLoading} />
                );
                break;
            case this.pageArr[7]:
                pageComponent = (
                    <DynamicRecords
                        setLoading={this.setLoading}
                        getBalance={this.props.getBalance}
                        memberInfo={this.state.memberInfo}
                    />
                );
                break;
            case this.pageArr[8]:
                pageComponent = (
                    <DynamicBetRecords setLoading={this.setLoading} />
                );
                break;
            default:
                break;
        }

        return (
            <React.Fragment>
                <div className="common-distance-wrap">
                    <div className="common-distance">
                        <div className="user-center-wrap">
                            <div className="left-nav-wrap user-title-wrap">
                                <div className="tlc-user-picture-wrap">
                                    <div className="tlc-user-picture">
                                        <img
                                            src={`${process.env.BASE_PATH}/img/icons/head.svg`}
                                        />
                                    </div>
                                    <h4 className="tlc-user-name">
                                        {this.props.memberInfo.userName}
                                    </h4>
                                    <div className="user-info-thumb">
                                        <div className="inline-block">
                                            <i
                                                className={`tlc-sprite member-grade _${
                                                    this.props.memberInfo
                                                        .levelName !==
                                                    "普通会员"
                                                        ? "1"
                                                        : "2"
                                                }`}
                                            />
                                            <span>
                                                {
                                                    this.props.memberInfo
                                                        .levelName
                                                }
                                            </span>
                                        </div>
                                        <span className="inline-block">
                                            &nbsp;
                                        </span>
                                        <div className="inline-block">
                                            <i
                                                className={`tlc-sprite user-email ${
                                                    this.props.memberInfo
                                                        .isVerifiedEmail &&
                                                    this.props.memberInfo
                                                        .isVerifiedEmail[1] &&
                                                    "curr"
                                                }`}
                                            />
                                            <i
                                                className={`tlc-sprite user-phone ${
                                                    this.props.memberInfo
                                                        .isVerifiedPhone &&
                                                    this.props.memberInfo
                                                        .isVerifiedPhone[1] &&
                                                    "curr"
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="tlc-user-wallet-wrap">
                                    <div className="tlc-user-wallet">
                                        <div className="tlc-all-balance-title">
                                            <span>{translate("总余额")}</span>
                                        </div>
                                        <div className="tlc-all-balance">
                                            <span className="inline-block">
                                                ￥
                                            </span>
                                            <span className="inline-block">
                                                {formatAmount(
                                                    currentMoney?.mainMoney,
                                                )}
                                            </span>
                                        </div>
                                        <Button.Group
                                            size="default"
                                            className="tlc-btn-group"
                                        >
                                            <Button
                                                type="primary"
                                                className="btnYellow"
                                                onClick={() => {
                                                    global.showDialog({
                                                        key: 'wallet:{"type": "deposit"}',
                                                    });
                                                    Pushgtagdata(
                                                        "Deposit_profilepage",
                                                    );
                                                }}
                                            >
                                                {translate("存款")}
                                            </Button>
                                            <Button
                                                type="danger"
                                                className="btnBlue"
                                                onClick={() => {
                                                    global.showDialog({
                                                        key: 'wallet:{"type": "transfer"}',
                                                    });
                                                    Pushgtagdata(
                                                        "Transfer_profilepage",
                                                    );
                                                }}
                                            >
                                                {translate("转账")}
                                            </Button>
                                            <Button
                                                type="primary"
                                                className="btnPurple"
                                                onClick={() => {
                                                    global.showDialog({
                                                        key: 'wallet:{"type": "withdraw"}',
                                                    });
                                                    Pushgtagdata(
                                                        "Withdrawal_profilepage",
                                                    );
                                                }}
                                            >
                                                {translate("提款")}
                                            </Button>
                                        </Button.Group>
                                    </div>
                                </div>
                                {this.pageArrGroup.map((val, index) => {
                                    return (
                                        <ul
                                            className="user-nav-list"
                                            key={index}
                                        >
                                            {val.map((item, itemIndex) => {
                                                return (
                                                    <li
                                                        key={`navItem${itemIndex}`}
                                                        className={`${pageKey === item.key ? "active" : ""}`}
                                                        onClick={() =>
                                                            this.navigatorPage(
                                                                item.key,
                                                            )
                                                        }
                                                    >
                                                        <span>{item.name}</span>
                                                        {item.key ===
                                                            "message" &&
                                                        hasUnRead ? (
                                                            <div className="remind-circle" />
                                                        ) : (
                                                            ""
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    );
                                })}
                            </div>
                            <div className="right-content-wrap">
                                <Spin
                                    spinning={loading}
                                    tip={translate("加载中")}
                                >
                                    {pageComponent ? pageComponent : null}
                                </Spin>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        promotionTabIndex: state.promotion.topTabIndex,
        memberInfo: state.userCenter.memberInfo,
        userCenterTabKey: state.userCenter.userCenterPageTabKey,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        changeTab: (i) => {
            dispatch(promotionActions.changeTab(i));
        },
        setMemberInfo: (memberObj) => {
            dispatch(userCenterActions.setMemberInfo(memberObj));
        },
        changeUserCenterTabKey: (key) => {
            dispatch(userCenterActions.changeUserCenterTabKey(key));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeModule);
