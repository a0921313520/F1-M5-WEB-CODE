import React, { Component } from "react";
import { Modal, message, Spin, Button } from "antd";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { GetAllBalance } from "$DATA/wallet";
import Router from "next/router";
import dynamic from "next/dynamic";
import SelectAddress from "../Address/Address.js";
import { Provider, connect } from "react-redux";
import store from "../../store/store.js";
import { userCenterActions } from "$STORE/userCenterSlice";
import { translate } from "$ACTIONS/Translate";

// Modal加载状态组件
const ModalLoading = (
    <Spin spinning={true} size="large" tip={translate("加载中")} />
);
// 财务管理
const DynamicWallet = dynamic(import("@/Wallet"), {
    loading: () => ModalLoading,
    ssr: true,
});

class Detail extends Component {
    state = {
        Detail: [],
        commonModal: false,
        isModalLoad: true,
        walletVisible: false,
        balanceList: [],
        modalTabKey: {},
        showSelectAddressModal: false,
        bonusId: "",
        loading: false,
    };
    componentDidMount() {
        this.getPromotionInfo();
    }
    /* -------------------------------------------
	 * @description: 获取优惠详情的内容
	 * @param {*}
	 * @return {*}
  	---------------------------------------------- */

    getPromotionInfo() {
        let params = {
            id: this.props.BonusData.promoId,
        };
        this.setState({ loading: true });
        get(ApiPort.CMSPromotionDetail + `id=${params.id}`)
            .then((res) => {
                res.History = this.props.History;
                this.setState({
                    Detail: res,
                });
            })
            .catch((error) => {
                message.error(error);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    goUserCenter = (key) => {
        if (~global.location.pathname.indexOf("/vn/me")) {
            this.props.changeUserCenterTabKey(key);
        } else {
            this.props.changeUserCenterTabKey(key);
            Router.push("/me");
        }
    };

    // 获取余额
    getBalance = (call) => {
        this.setState({ balanceLoading: true });
        GetAllBalance((res) => {
            res.result.map(function (item, index) {
                window[item.name] = item.balance;
            });
            const allBalance = res.result[res.result.length - 1].balance;
            // this.props.setUserCenterMoney &&
            // 	this.props.setUserCenterMoney({
            // 		balanceList: res.result,
            // 		mainMoney: allBalance
            // 	});
            // this.props.setUserAllBalance(allBalance);
            this.setState({
                balanceList: res.result,
                // balanceLoading: false,
                // countBalance: res.result && res.result.length ? res.result[0].balance : 0
            });
            typeof call === "function" && call(allBalance);
        });
    };

    // 关闭钱包弹层
    closeWallet = () => {
        this.setState({ walletVisible: false });
        typeof global.openLearnDialog === "function" &&
            global.openLearnDialog();
    };

    showModal = ({ key }) => {
        if (typeof key !== "string") return null;
        const keySpacer = key.indexOf(":");
        const dialogKey = key.substring(0, keySpacer);
        const keyMap = key.substring(keySpacer + 1);
        const currentParentModalMap =
            typeof keyMap !== "" ? JSON.parse(keyMap) : {}; // 当前呼出窗口携带的默认属性
        this.setState({
            [dialogKey + "Visible"]: true,
            modalTabKey: currentParentModalMap,
        });
    };

    /* -------------------------------------------
	 * @description: 申请红利
	 * @param {*} Info 优惠详情
	 * @return {*}
  	---------------------------------------------- */
    // ApplyDailyDeals(Info) {
    //     if (!checkIsLogin()) {
    //         redirectToLogin();
    //         return;
    //     }

    //     /* 填写礼品申请资料 */
    //     Router.push(`/promotions/Manual?id=${Info.bonusId}&title=${Info.promoTitle}`);
    // }

    /* -------------------------------------------
	 * @description: 申请每日好礼优惠
	 * @param {*} Detail 详情
	 * @return {*}
  	---------------------------------------------- */

    ApplyDailyDeals = (Detail) => {
        let data = {
            bonusRuleId: Detail.bonusId,
        };
        this.setState({ loading: true });
        post(ApiPort.PostDailyDeals + `&bonusRuleId=${data.bonusRuleId}&`, data)
            .then((res) => {
                if (!res) {
                    hide();
                }
                if (res) {
                    if (res.isSuccess && res.result) {
                        Modal.confirm({
                            title: translate("领取奖励成功"),
                            icon: null,
                            centered: true,
                            okText: translate("立即游戏"),
                            cancelText: translate("关闭"),
                            className: `confirm-modal-of-public`,
                            content: (
                                <div className="note">{res.result.message}</div>
                            ),
                            onOk: () => {
                                Router.push("/");
                            },
                            onCancel: () => {},
                        });
                    } else {
                        Modal.confirm({
                            title: translate("条件不足"),
                            icon: null,
                            closable: false,
                            centered: true,
                            okText: translate("存款"),
                            cancelText: translate("关闭"),
                            className: `commonModal`,
                            content: (
                                <div className="note">{res.result.message}</div>
                            ),
                            onOk: () => {
                                this.showModal({
                                    key: 'wallet:{"type": "deposit"}',
                                });
                            },
                            onCancel: () => {},
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("PostDailyDeals error : ", error);
                message.error(error);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    render() {
        const { ShowDetail, CloseDetail, BonusData } = this.props;
        const { Detail, bonusId, showSelectAddressModal, loading } = this.state;
        return (
            <>
                <Modal
                    closable={true}
                    visible={ShowDetail}
                    className="PromoDetail"
                    maskClosable={false}
                    footer={null}
                    title={translate("奖励详情")}
                    onCancel={() => {
                        CloseDetail();
                    }}
                >
                    <Spin
                        spinning={loading}
                        size="large"
                        tip={translate("加载中")}
                    >
                        <div className="PromoDetail-info">
                            {Detail && (
                                <React.Fragment>
                                    <div>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: Detail.body,
                                            }}
                                        />
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                        {!Detail && (
                            <li className="center">
                                <Empty
                                    image={"/vn/img/icon/img-no-record.svg"}
                                    className="big-empty-box"
                                />
                            </li>
                        )}

                        {Detail && (
                            <div className="PromoDetail-submitBtn">
                                {(() => {
                                    if (!BonusData.bonusData) {
                                        return;
                                    }
                                    /* 售罄 */
                                    if (!BonusData.bonusData) {
                                        return;
                                    }
                                    if (
                                        BonusData.bonusData.maxApplications ==
                                        BonusData.bonusData.currentApplications
                                    ) {
                                        BonusData.bonusData.bonusGivenType =
                                            "SoldOut";
                                    }
                                    switch (
                                        BonusData.bonusData.bonusGivenType
                                    ) {
                                        /* 填写礼品地址申请 */
                                        case "Manual Items":
                                            return (
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            localStorage.getItem(
                                                                "access_token",
                                                            ) === null
                                                        ) {
                                                            return;
                                                        }
                                                        console.log(
                                                            "Detail.bonusId: ",
                                                            Detail.bonusId,
                                                        );
                                                        this.setState({
                                                            showSelectAddressModal: true,
                                                            bonusId:
                                                                Detail.bonusId,
                                                        });
                                                        Router.push(
                                                            `/daily-gift/?id=${Detail.bonusId}`,
                                                        );
                                                    }}
                                                >
                                                    {translate("获得奖励")}
                                                </button>
                                            );
                                        /* 直接申请 */
                                        case "Money":
                                        case "FreeSpin":
                                        case "Rewards Point":
                                            return (
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            !localStorage.getItem(
                                                                "access_token",
                                                            )
                                                        ) {
                                                            global.goUserSign(
                                                                "1",
                                                            );
                                                            return;
                                                        }
                                                        this.ApplyDailyDeals(
                                                            Detail,
                                                        );
                                                    }}
                                                >
                                                    {translate("获得奖励")}
                                                </button>
                                            );
                                        case "SoldOut":
                                            return (
                                                <Button disband>
                                                    {translate("获得奖励")}
                                                </Button>
                                            );
                                        default:
                                            return null;
                                    }
                                })()}
                            </div>
                        )}
                    </Spin>
                </Modal>
                {/* 财务管理，DynamicWallet內有元件使用到redux，需加上Provider以免抓不抓不到store */}
                <Modal
                    title="钱包"
                    footer={null}
                    maskClosable={!this.state.isModalLoad}
                    keyboard={!this.state.isModalLoad}
                    width={750}
                    className="wallet-modal"
                    visible={this.state.walletVisible}
                    onCancel={this.closeWallet}
                    destroyOnClose={true}
                >
                    <Provider store={store}>
                        <Spin
                            className={this.state.isModalLoad ? "show" : "hide"}
                            size="large"
                            tip={translate("加载中")}
                        />
                        {this.state.modalTabKey !== "" ? (
                            <DynamicWallet
                                dialogTabKey={this.state.modalTabKey}
                                getBalance={this.getBalance}
                                balanceList={this.state.balanceList}
                                onCancel={this.closeWallet}
                                visible={this.state.walletVisible}
                                goUserCenter={this.goUserCenter}
                                setModalTabKey={(v, run) =>
                                    this.setState({ modalTabKey: v }, () => {
                                        typeof run === "function" && run();
                                    })
                                }
                                setLoading={(v) =>
                                    this.setState({ isModalLoad: v })
                                }
                            />
                        ) : null}
                    </Provider>
                </Modal>
                {/* 填寫地址modal */}
                {showSelectAddressModal && (
                    <SelectAddress
                        bonusId={bonusId}
                        onCancel={() => {
                            this.setState({
                                showSelectAddressModal: false,
                                bonusId: "",
                            });
                            CloseDetail();
                        }}
                        showSelectAddressModal={showSelectAddressModal}
                    />
                )}
            </>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        userCenterTabKey: state.userCenter.userCenterPageTabKey,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        changeUserCenterTabKey: (tabkey) => {
            dispatch(userCenterActions.changeUserCenterTabKey(tabkey));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
