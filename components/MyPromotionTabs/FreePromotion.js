import React from "react";
import Router from "next/router";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import { Button, Popover, Modal, Spin, message, Empty } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import { BsInfoCircle } from "react-icons/bs";
import SelectUI, { Option } from "../UI/Select/Select";
import { connect } from "react-redux";
import { promotionActions } from "../../store/promotionSlice";
import {
    getFreePromotionsAction,
    getAppliedHistoryAction,
} from "../../store/thunk/promotionThunk";
import { showLargeResultModal } from "../../actions/helper";
import { translate } from "$ACTIONS/Translate";

class FreePromotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /*詳細資料*/
            PromotionsContent: [],
            /* 隐藏失效的优惠 */
            HideInvalid: true,
            /*申請窗口*/
            ApplyVisible: false,
            /* 优惠详情窗口 */
            ShowDetail: false,
            /*提示窗口*/
            HintVisible: false,
            /* 钱包显示状态 */
            formShow: false,
            CodeState: "",
            /* 当前免费投注钱包 */
            PromoitemActive: {},

            open: false, //是否開啟popover
            selectedPromotionIndex: null, //選擇哪個promotion的popover
            selectedFreebet: null, //選擇Freebet item
            clickedWalletIndex: null, //點擊錢包index
            selectedWalletIndex: null, //選擇錢包index

            isTempSwitchWallet: false,
            isModalOpen: false,
            isLoading: false, //是否Modal該呈現Loading狀態
        };
        this.handleOpenChange = this.handleOpenChange.bind(this); //判斷hint狀態
        this.hide = this.hide.bind(this);
    }
    componentDidMount() {
        this.props.setFreePromotions();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.topTabIndex !== this.props.topTabIndex) {
            this.setState({
                selectedPromotionIndex: null,
            });
        }
    }

    handleOpenChange(index) {
        this.setState({
            selectedPromotionIndex: index,
            open: true,
        });
    }
    hide() {
        this.setState({
            open: false,
        });
    }
    showModal(item) {
        this.setState({
            ApplyVisible: true,
            selectedFreebet: item,
        });
        get(ApiPort.PromotionContent + "?id=" + item.promoId)
            .then((res) => {
                console.log("promotionContent", res);
                this.setState({
                    PromotionsContent: res,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getE2BBValue() {
        return window.E2GetBlackbox
            ? window.E2GetBlackbox().blackbox == "" ||
              window.E2GetBlackbox().blackbox == undefined
                ? ""
                : window.E2GetBlackbox().blackbox
            : "";
    }

    GetBonus(Bonus) {
        this.setState({ isLoading: true });
        {
            console.log("Bonus", Bonus);
        }
        let data = {
            blackBox: this.getE2BBValue(),
            bonusId: Bonus.bonusData[this.state.selectedWalletIndex].id,
            amount: Bonus.bonusData[this.state.selectedWalletIndex]
                .releaseValue,
            bonusMode: "Transfer",
            targetWallet:
                Bonus.bonusData[this.state.selectedWalletIndex].wallet,
            couponText: "",
            isMax: false,
            transferBonus: {
                fromWallet: "",
                transactionId: 0,
                isFreeBet: true,
            },
            depositBonus: {
                depositCharges: 0,
                depositId: "",
            },
            successBonusId: "",
        };
        const failModal =()=> showLargeResultModal(
            false,
            "OK",
            translate("在线聊天"),
            translate("无法领取奖励"),
            translate("似乎有问题，请重试或联系在线聊天寻求支持。"),
            () => {
                this.setState({ HintVisible: false });
            },
            () => {
                global.PopUpLiveChat();
            },
            true
        );
        post(ApiPort.POSTBonusApplications, data)
            .then((res) => {
                if(res?.isSuccess && res?.result?.bonusResult?.message){
                    const msg = res.result.bonusResult.message.toLowerCase();
                    if(msg === "success"){
                        showLargeResultModal(
                            true,
                            translate("我的优惠"),
                            translate("关闭"),
                            translate("成功获得奖励"),
                            translate("优惠申请成功"),
                            () => {
                                this.setState({
                                    HintVisible: false,
                                    ApplyVisible: false,
                                });
                            },
                            () => {}
                        );
                        this.props.setAppliedPromotions();
                    } else {
                        failModal();
                    }
                } else {
                    failModal();
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(()=>{
                this.setState({ isLoading: false });
            })
    }

    render() {
        const {
            selectedFreebet,
            selectedWalletIndex,
            ApplyVisible,
            HintVisible,
            isLoading,
        } = this.state;
        console.log("this.props.freePromotions: ",this.props.freePromotions )
        return (
            <>
                {this.props.freePromotions && this.props.freePromotions.length ? (
                    <div className="PromotionsFreeBet">
                        {this.props.freePromotions.map((item, index) => {
                            return (
                                <div key={index} className="FreeBet-item">
                                    <div flexFlow="column" className="Content">
                                        <div
                                            flexFlow="column"
                                            className="content"
                                        >
                                            <label className="Name">
                                                <h4>{item.promoTitle}</h4>
                                                <Popover
                                                    placement="bottomRight"
                                                    className="Freebet-popover"
                                                    align={{ offset: [13, 10] }}
                                                    visible={
                                                        this.state
                                                            .selectedPromotionIndex ===
                                                        index
                                                            ? this.state.open
                                                            : false
                                                    }
                                                    onVisibleChange={() => {
                                                        this.handleOpenChange(
                                                            index
                                                        );
                                                    }}
                                                    trigger="click"
                                                    content={
                                                        <>
                                                            <div style={{width:"260px"}}>
                                                                {translate("为您提供特别的免费投注奖金。 单击以在优惠到期前领取奖励。")}
                                                            </div>
                                                            <button
                                                                className="btn-close-popover"
                                                                onClick={
                                                                    this.hide
                                                                }
                                                            >
                                                                <CloseOutlined />
                                                            </button>
                                                        </>
                                                    }
                                                >
                                                    <BsInfoCircle
                                                        size={17}
                                                        color="#00A6FF"
                                                    />
                                                </Popover>
                                            </label>
                                            <small className="Time">
                                                {translate("结束于")}:{" "}
                                                {moment(item.endDate).format(
                                                    "DD-MM-YYYY HH:mm:ss"
                                                )}
                                            </small>
                                        </div>

                                        <Button
                                            type="primary"
                                            className="btn-apply-freebet"
                                            onClick={() => {
                                                this.showModal(item);
                                            }}
                                        >
                                            {translate("立即领取")}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <Empty
                        image={"/vn/img/icon/img-no-record.svg"}
                        className="big-empty-box"
                        description={translate("暂无任何免费投注")}
                    />
                )}
                {selectedFreebet && (
                    <>
                        <Modal
                            className="promotion-modal"
                            title={translate("每天免费奖金")}
                            centered
                            width={400}
                            visible={ApplyVisible}
                            onCancel={() =>
                                this.setState({
                                    ApplyVisible: false,
                                    selectedWalletIndex: null,
                                })
                            }
                            cancelButtonProps={{ style: { display: "none" } }}
                            okText={translate("确认")}
                            footer={null}
                            destroyOnClose
                            onOk={() => {
                                if (selectedWalletIndex === null)
                                    return message.error("请选择产品钱包");
                                this.setState({ HintVisible: true });
                            }}
                        >
                            <div className="promotion-info-box">
                                <h3>
                                    {selectedWalletIndex !== null ?
                                        selectedFreebet.bonusData[
                                            selectedWalletIndex
                                        ].bonusGroupTitle: "--"}
                                </h3>
                                <div className="amount-status-box">
                                    <div>
                                        <p className="title">{translate("投注金额2")}</p>
                                        <p className="amount">
                                            {selectedWalletIndex !== null
                                                ? "￥" +
                                                  selectedFreebet.bonusData[
                                                      selectedWalletIndex
                                                  ].releaseValue
                                                : "--"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="title">{translate("所需流水")}</p>
                                        <p className="amount">
                                            {selectedWalletIndex !== null
                                                ? selectedFreebet.bonusData[
                                                      selectedWalletIndex
                                                  ].givenAmount
                                                : "--"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <SelectUI
                                placeholder={translate("请选择钱包以更新奖金")}
                                menuTitle={translate("选择钱包")}
                                labelTitle={translate("来源账户")}
                                selectedTitle={
                                    selectedWalletIndex !== null
                                        ? selectedFreebet.bonusData[
                                              selectedWalletIndex
                                          ].walletLocalizedName
                                        : null
                                }
                                onConfirmSelect={(index) => {
                                    this.setState({
                                        selectedWalletIndex: index,
                                    });
                                }}
                            >
                                {selectedFreebet.bonusData.map((bonus, i) => (
                                    <Option
                                        key={i}
                                        index={i}
                                        optionName={bonus.walletLocalizedName}
                                        confirmedOptionIndex={
                                            selectedWalletIndex
                                        }
                                    />
                                ))}
                            </SelectUI>
                            <Button
                                size="large"
                                type="primary"
                                block
                                style={{ marginTop: "30px" }}
                                disabled={selectedWalletIndex === null}
                                onClick={() => {
                                    if (selectedWalletIndex === null)
                                        return message.error("请选择产品钱包");
                                    this.setState({ HintVisible: true });
                                }}
                            >
                                {translate("确认")}
                            </Button>
                        </Modal>
                        <Modal
                            title={translate("通知(小写)")}
                            width={400}
                            className="warm-reminder-modal promotion-modal"
                            centered
                            visible={HintVisible}
                            onCancel={() =>
                                this.setState({ HintVisible: false })
                            }
                            okText={translate("我的优惠")}
                            cancelText={translate("关闭")}
                            destroyOnClose
                            onOk={() => this.GetBonus(selectedFreebet)}
                        >
                            <Spin
                                spinning={isLoading}
                                size="large"
                                tip={translate("加载中")}
                            >
                                <span>
                                    {translate("请注意，确认奖励后，钱包将被暂时锁定，直到达到要求的流水后才能转账。")}
                                </span>
                            </Spin>
                        </Modal>
                    </>
                )}
            </>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        topTabIndex: state.promotion.topTabIndex,
        freePromotions: state.promotion.freePromotions,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        changeTab: (i) => {
            dispatch(promotionActions.changeTab(i));
        },
        setFreePromotions: () => {
            dispatch(getFreePromotionsAction());
        },
        setAppliedPromotions: () => {
            dispatch(getAppliedHistoryAction());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FreePromotion);
