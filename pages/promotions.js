import React from "react";
import {
    Tabs,
    Modal,
    Empty,
    Spin,
    Input,
    message,
    Pagination,
    Button,
} from "antd";
import Layout from "@/Layout";
import Router from "next/router";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { mailConversion, numberConversion } from "$ACTIONS/util";
import {
    getQueryVariable,
    getE2BBValue,
    showSmallResultModal,
    isWebPSupported,
} from "$ACTIONS/helper";
import {
    GetWalletList,
    GetWalletBonus,
    TransferSubmit,
    GetAllBalance,
} from "$DATA/wallet";
import RealyName from "@/RealyName";
import Announcement from "@/Announcement";
import MyPromotionTabs from "@/MyPromotionTabs/index";
import MyRebate from "@/MyPromotion/MyRebate";
import PromotionStatusButton from "@/MyPromotion/PromotionStatusButton";
import dynamic from "next/dynamic";
import moment from "moment";
import { AppliedDataModal, TransferModal } from "@/MyPromotionTabs/Modal";
import { connect, Provider } from "react-redux";
import store from "$STORE/store";
import { promotionActions } from "$STORE/promotionSlice";
import {
    getAllPromotionRelatedDataAction,
    getPromotionListAction,
    updateBonusPromotionHistoryAction,
    changeTabAction,
} from "$STORE/thunk/promotionThunk";
import { getPromotionCategories } from "$ACTIONS/promotionRequest";
import ImageWithFallback from "@/ImageWithFallback/";
import { translate } from "$ACTIONS/Translate";
import { getStaticPropsFromStrapiSEOSetting } from "$DATA/seo";
import { pathNameList } from "$DATA/me.static";
const { TabPane } = Tabs;

// Modal加载状态组件
const ModalLoading = (
    <Spin spinning={true} size="large" tip={translate("加载中")} />
);
// 财务管理
const DynamicWallet = dynamic(import("@/Wallet"), {
    loading: () => ModalLoading,
    ssr: true,
});
export async function getStaticProps() {
    return await getStaticPropsFromStrapiSEOSetting("/promotions"); //參數帶本頁的路徑
}
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //所需基本資料
            // Promotions: [], //所有Promotion item
            filterdata: this.props.promotions, //依產品類別篩選好的Promotion item
            selectedPromotionDetail: {}, //所選Promotion詳細內容 (為取得最低/最大申請優惠金額)
            currentMoney: {}, // Header > HasLogged Component 传入的金额
            memberInfo: {}, // HasHeader 传入进来的会员相关信息
            cmsBanner: "",
            isLogin: false,
            selectedPromotionItem: null, //所點選Promotion item
            startDate: moment(new Date())
                .subtract(90, "d")
                .startOf("day")
                .utcOffset(8)
                .format("YYYY-MM-DD HH:mm:ss"),
            endDate: moment(new Date())
                .utcOffset(8)
                .format("YYYY-MM-DDTHH:mm:ss"),
            appliedPromotionHistory: [],
            remarks: "",

            //Modal Open 相關
            isManualApplyModalVisible: false,
            isManualAppliedDataVisible: false,
            isManualFullOfApplicantsModal: false, //是否顯示Manual申請已滿Modal
            isPromotionDetailModal: false, //是否顯示優惠詳情Modal
            isDepositWarningModel: false, //是否顯示存款錢包Modal
            isTransferModal: false, // 是否显示轉帳Modal
            isTransferSuccessModal: false, //是否顯示轉帳成功，優惠已申請modal
            isWalletModal: false, //是否顯示存款錢包Modal
            isShowManualResultModal: false, //是否show Manual申請結果

            //資料顯示狀態判斷
            isManualApplySuccess: false, //是否Manual優惠申請成功結果
            moneyModalLoading: false, // 是否正在Loading计算优惠申请金额可得彩金与流水
            getBonusLoading: false,
            selectedTopTabIndex: "1", //上方Tab選單index (Start from 1, 優惠、我的優惠、返水)
            Tabkey: "0", //左側Tab選單index (Start from 0, 各產品category)
            manualApplyFormSpinning: false,
            pageIndex: 1,
            isRefreshingBalance: false, //是否正在刷新錢包
            isRefreshingPromotion: false, //是否正在更新Bonus優惠狀態 (未申請 => 已申請)

            // 轉帳相關
            isOneClickTransfer: false, //是否為一鍵轉帳
            modalTabKey: { type: "deposit" }, //錢包動作tab值 (存、提、領)
            fromWalletList: [], // 游戏账户类别（转账优惠申请需要）
            toWalletList: [], // 游戏账户类别（转账优惠申请需要）
            toWalletName: "", // 转账目标账户名称

            //疑似沒用到的
            isDirectModal: false, // 直接申请优惠的窗口
            isDisableImTransfer: "", // Im体育优惠申请一键转入主账户按钮禁用（欧冠）
            ActivePromotionsContent: "",
            searchStr: "", // 搜索优惠值
            promotionDepositValue: 0, // 优惠申请金额
            disabledApplicatioin: false, // 欧冠体育转账申请按钮禁用
            defaultDisabledDirectTransferBtn: true, // 欧冠体育转账默认按钮禁用
            sosAppllication: false, // 救援金申请Loading状态
            isOpenRealyName: false, // 是否打开完善姓名
            realyName: "", // 为了触发完善姓名后的value更新
            manualResultMessage: "", //优惠申请提交结果 message
        };

        this.setTlcGameIframeHeightCount = 0;
        this.hasCategoriesdata = false;
        this.Categoriesdata = null;
        this.timer = null; // 输入金额请求间隔时间段
        this.textareaValue = ""; // 自填表单备注信息值（每次都setState会有卡顿现象）
        this.finishRealyNameNextStepInfo = {}; // 完善真实姓名下一步所需（当前优惠详情信息）
        this.promotionIsLogin = false; // 为了避免静态登陆之后重复调用获取优惠的API，本地记录获取状态
        this.setMemberInfo = function () {}; // HasHeader传递过来的方法（设置会员信息）
        this.getBalance = function () {}; // HasHeader传递过来的方法（更新余额）

        this.getBonusDetail = this.getBonusDetail.bind(this); //取得優惠對應之bonus資料
        this.searchPromotion = this.searchPromotion.bind(this); // 搜索优惠
        this.handleTransfer = this.handleTransfer.bind(this); // 优惠申请（转账提交）
        this.SOSPromotionApplications =
            this.SOSPromotionApplications.bind(this); // SOS 电子救援金申请
        this.getPromotionBanner = this.getPromotionBanner.bind(this); // 获取优惠Banner
        this.submitDirectApplication = this.submitDirectApplication.bind(this); // 提交直接申请优惠
        this.getIsManualApplicantFull =
            this.getIsManualApplicantFull.bind(this);
        //---------------------------------------------------
    }

    componentDidMount() {
        this.getCategories();
        this.props.getAllPromotionRelatedData();
        this.getPromotionBanner();
        global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("promo");
        //由首頁banner點擊跳轉進
        const { id, jumpfrom } = Router.router.query;
        if (id && jumpfrom) {
            const item = {
                history: { status: "Apply" },
                promoId: id,
            };
            // 開啟優惠詳細
            this.openPromotionDetailHandler(item, jumpfrom);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isLogin !== this.state.isLogin && this.state.isLogin) {
        }

        if (!prevState.isPromotionDetailModal) {
            this.props.setSelectedBonus(null);
        }
        if (prevProps.promotions !== this.props.promotions) {
            this.setState({ filterdata: this.props.promotions });
            if (!this.state.selectedPromotionItem) return;

            const newSelectedPromotionItem = this.props.promotions.find(
                (item) =>
                    item.promoId === this.state.selectedPromotionItem.promoId,
            );
            console.log(
                "promotion update!!",
                "\n",
                prevProps.promotions,
                "\n",
                this.props.promotions,
                "\n",
                "newSelectedPromotionItem",
                newSelectedPromotionItem,
            );

            this.setState({
                selectedPromotionItem: newSelectedPromotionItem,
                isRefreshingPromotion: false,
            });
        }

        if (
            prevState.currentMoney.balanceList !==
            this.state.currentMoney.balanceList
        ) {
            const mainWallet = this.state.currentMoney.balanceList.find(
                (account) => account.name === "MAIN",
            );
            if (
                mainWallet.balance >=
                parseFloat(this.state.selectedPromotionDetail.bonusMinAmount)
            ) {
                this.setState({ isOneClickTransfer: false });
            } else {
                this.setState({ isOneClickTransfer: true });
            }
        }

        if (
            prevProps.openPromotionDetail !== this.props.openPromotionDetail &&
            typeof this.props.openPromotionDetail === "object" &&
            this.props.openPromotionDetail !== "{}"
        ) {
            if (
                Object.prototype.hasOwnProperty.call(
                    this.props.openPromotionDetail,
                    "promotionId",
                )
            ) {
                const promotionItem = {
                    promoId: this.props.openPromotionDetail.promotionId,
                };
                console.log(
                    "🚀 ~ Main ~ componentDidUpdate ~ promotionItem.promoId:",
                    promotionItem.promoId,
                );
                this.openPromotionDetailHandler(promotionItem);
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        this.setState = () => false;
    }

    /**
     * @description: 获取优惠分类
     * @return {*}
     */
    async getCategories() {
        /* 获取全优惠分类 */
        const appliedHistories = await getPromotionCategories();
        if (appliedHistories && appliedHistories.length > 0) {
            const all = {
                PromoCatID: "",
                PromoCatCode: "All",
                resourcesName: translate("全部"),
                promoCatImageUrl: "/vn/img/promotions/icon/icon-all.png",
                parentId: "",
                parentName: "Rebate",
            };

            //篩選出需show在左邊Menu的item
            const categories = appliedHistories.filter(
                (res) => res.parentName === "General",
            );

            this.props.setCategories([all, ...categories]);
            this.Categoriesdata = categories;
            this.hasCategoriesdata && this.props.setPromotions();
        }
    }

    getIsManualApplicantFull(promoID) {
        // if (!this.state.remarks) {
        //     message.error("留言為必填欄位", 3);
        //     this.setState({
        //         manualApplyFormSpinning: false,
        //     });
        //     return;
        // }

        this.setState({
            isRefreshingPromotion: true,
        });
        get(ApiPort.GETManualPromoMaxApplicant + "&promoid=" + promoID)
            .then((res) => {
                if (res && res.isSuccess) {
                    if (res.result) {
                        this.setState({ isManualFullOfApplicantsModal: true });
                    }
                    if (!res.result) {
                        //this.PromApplications();
                        this.setState({
                            isManualApplyModalVisible: true,
                        });
                    }
                } else {
                    message.error(
                        "something wrong with checking max applicant of promotion",
                        2,
                    );
                }
            })
            .finally(() => {
                this.setState({
                    isRefreshingPromotion: false,
                });
            });
    }

    setIframeHeight(iframe) {
        if (iframe) {
            var iframeWin =
                iframe.contentWindow || iframe.contentDocument.parentWindow;
            if (iframeWin.document.body) {
                // 内置padding手动设15像素，所以此处额外增加32像素高度
                iframe.style.height =
                    (iframeWin.document.documentElement.offsetHeight ||
                        iframeWin.document.body.offsetHeight) +
                    32 +
                    "px";
            }
        }
    }

    callback(key) {
        if (key === null || key === "0") {
            return this.setState({
                filterdata: this.props.promotions,
                Tabkey: "0",
                pageIndex: 1,
            });
        }
        let filterdata = this.props.promotions.filter((item) =>
            item.category.includes(this.props.categories[key].PromoCatCode),
        );
        this.setState({
            filterdata: filterdata,
            Tabkey: key.toString(),
            pageIndex: 1,
        });
        const gtagData = [
            "Special_sidenavbar_promopage",
            "Sport_sidenavbar_promopage",
            "Esport_sidenavbar_promopage",
            "Live_sidenavbar_promopage",
            "P2P_sidenavbar_promopage",
            "Slot_sidenavbar_promopage",
            "Keno_sidenavbar_promopage",
            "Fishing_sidenavbar_promopage",
            "VIP_sidenavbar_promopage",
            "8store_sidenavbar_promopage",
        ];
        Pushgtagdata(gtagData[key]);
    }

    getPromotionBanner(loginStatus) {
        //目前说是自己写死,不用api
        // get(
        //     CMSAPIUrl +
        //     "/vi-vn/api/v1/web/webbanners/position/promotion_feature"
        // ).then((res) => {
        //     if (Array.isArray(res) && res.length != 0) {
        //         this.setState({ cmsBanner: res[0].cmsImageUrl });
        //     }
        // });
    }

    getBonusDetail = (wallet, promotionDetailItem, promotionItem) => {
        console.log(
            "🚀 ~ file: Promotions.js:381 ~ Main ~ promotionDetailItem:",
            promotionDetailItem,
        );
        if (
            promotionDetailItem.actionType === "NO_ACTION" ||
            promotionDetailItem.promoType === "Manual"
        ) {
            this.props.setSelectedBonus(null);

            this.setState({ WalletBonusProfile: null, getBonusLoading: false });
            return;
        }
        GetWalletBonus(
            wallet,
            (res) => {
                if (res) {
                    const bonus = res.result.find((bonusItem) => {
                        return (
                            String(bonusItem.id) === promotionDetailItem.bonusId
                        );
                    });
                    console.log(
                        "🚀 ~ file: Promotions.js:400 ~ Main ~ bonus ~ bonus:",
                        bonus,
                    );
                    // if (!bonus && !promotionItem.history) {
                    //     message.error(
                    //         `api未回傳符合Bonus ID${promotionDetailItem.bonusId}的bonus`
                    //     );
                    // }
                    if (bonus) {
                        this.props.setSelectedBonus(bonus ? bonus : null);
                    }

                    this.setState({
                        WalletBonusProfile: bonus ? bonus : null,
                        getBonusLoading: false,
                    });
                }
            },
            "Transfer",
        );
    };

    imSportPrompt = (value, status, callback) => {
        if (this.imSportPromptShow) return;
        this.imSportPromptShow = true;
        typeof status === "undefined" && (status = true);
        Modal.info({
            title: ``,
            centered: true,
            mask: false,
            content: (
                <div>
                    <img
                        src={`${process.env.BASE_PATH}/img/user/otpVerify/${
                            status ? "icon-success" : "icon-error"
                        }.png`}
                    />
                    <p
                        style={{
                            marginTop: 10,
                            marginBottom: 0,
                            padding: "0 14px",
                        }}
                    >
                        {value}
                    </p>
                </div>
            ),
            className: "showInfoModal opacity _initail",
        });
        // setTimeout(() => {
        //   Modal.destroyAll();
        //   this.imSportPromptShow = false;
        //         typeof callback === 'function' && callback();
        // }, 2000);
    };
    submitDirectApplication(promotionContent) {
        this.setState({ moneyModalLoading: true });
        post(ApiPort.DirectApplyBonus, {
            bonusId: promotionContent.bonusId,
            amount: this.state.promotionDepositValue,
            bonusMode: "Transfer",
            targetWallet: promotionContent.bonusProduct,
            couponText: "",
            isMax: false,
            successBonusId: 0,
            funpodiumPromoId: 0,
            blackBoxValue: getE2BBValue(),
            e2BlackBoxValue: getE2BBValue(),
        }).then((res) => {
            this.setState({ moneyModalLoading: false });
            if (res) {
                if (res.bonusResult && res.bonusResult.message === "Success") {
                    this.imSportPrompt(res.message, true);
                } else {
                    this.setState({ disabledApplicatioin: true });
                    this.imSportPrompt(res.message, false);
                }
            }
        });
    }

    // 轉帳Handler
    handleTransfer(data) {
        console.log("轉帳ing", data);
        const {
            inputAmount,
            fromWalletDetail,
            fromWalletName,
            toWalletName,
            selectedPromotionDetail,
            isOneClickTransfer,
        } = data;
        const currentSelfContent = this.state.selectedPromotionDetail;
        const totalWalletBalance = this.state.currentMoney.balanceList.find(
            (wallet) => wallet.name === "TotalBal",
        ).balance;

        if (fromWalletDetail.name === "") {
            message.error(translate("请选择转出账户或转入账户！"));
            return;
        }

        const submitData = {
            fromAccount: isOneClickTransfer ? "All" : fromWalletDetail.name,
            toAccount: isOneClickTransfer
                ? fromWalletDetail.name
                : toWalletName,
            amount: isOneClickTransfer ? totalWalletBalance : inputAmount,
            bonusId: isOneClickTransfer
                ? 0
                : Number(selectedPromotionDetail.bonusId),
            bonusCoupon: "",
            blackBoxValue: getE2BBValue(),
        };

        if (!isOneClickTransfer) {
            if (inputAmount < selectedPromotionDetail.bonusMinAmount) {
                // message.error(`请输入正确的申请金额，低於最低申請金額 ¥ ${selectedPromotionDetail.bonusMinAmount}`)
                message.error(translate("请输入正确的申请金额"));
                return;
            }

            if (inputAmount > fromWalletDetail.balance) {
                message.error(translate("转出账户金额不足！"));

                Modal.confirm({
                    icon: null,
                    title: null,
                    centered: true,
                    closable: false,
                    content: (
                        <React.Fragment>
                            <p className="svg">
                                <svg
                                    viewBox="64 64 896 896"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z" />
                                </svg>
                            </p>
                            <p>
                                {translate("很抱歉，您的")}
                                {fromWalletDetail.localizedName}
                                {translate(
                                    "余额不足，请先进行充值再申请此优惠。",
                                )}
                            </p>
                        </React.Fragment>
                    ),
                    className: "pormotion-confirm",
                    okText: translate("存款"),
                    cancelText: translate("取消"),
                    onOk: () => {
                        global.showDialog({
                            key:
                                'wallet:{"type": "deposit", "targetAccount": "' +
                                currentSelfContent.bonusProduct +
                                '", "bonusId": ' +
                                currentSelfContent.bonusId +
                                ', "money": ' +
                                inputAmount +
                                "}",
                        });
                    },
                });
                return;
            }
        }
        this.setState({ moneyModalLoading: true });
        TransferSubmit(submitData, (res) => {
            this.setState({
                moneyModalLoading: false,
                isDisableImTransfer: isOneClickTransfer ? "curr" : "",
            }); // 欧冠新增：isDisableImTransfer
            if (res) {
                // 0 – failed 失败
                // 1 - success 成功
                // 2 – pending  等待
                if (
                    res.result.status === 1 &&
                    res.result.bonusResult !== "Fail" &&
                    res.result.bonusResult !== ""
                ) {
                    // this.imSportPrompt(res.messages, true, () => {
                    //   // 除了一键转入主账户的按钮外成功后全部关闭本申请窗口
                    //               !isOneClickTransfer && this.setState({ isDirectModal: false, isTransferModal: false });
                    // });
                    GetAllBalance(
                        (data) => {
                            if (!data || !data.isSuccess) {
                                this.getBalance();
                                this.setState({ isTransferModal: false });
                            }
                            this.setState({
                                currentMoney: { balanceList: data.result },
                            });
                        },
                        (status) => {
                            this.setState({ isRefreshingBalance: status });
                        },
                    );
                    // 若為一鍵轉帳成功
                    if (this.state.isOneClickTransfer) {
                        showSmallResultModal(true, translate("转账成功"));
                        setTimeout(() => {
                            Modal.destroyAll();
                        }, 3000);
                        this.setState({
                            isRefreshingPromotion: false,
                        });
                        // 一般轉帳成功
                    } else {
                        this.setState({
                            isTransferModal: false,
                            isTransferSuccessModal: true,
                            isRefreshingPromotion: true,
                        });
                        this.props.updateBonusPromotionHistory(
                            selectedPromotionDetail.promoId,
                        );
                    }
                    return;
                } else {
                    if (
                        res.result.status === 1 &&
                        res.result.bonusResult !== "" &&
                        res.result.messages !== ""
                    ) {
                        //"转账成功|申请红利失败"
                        GetAllBalance(
                            (data) => {
                                if (!data || !data.isSuccess) {
                                    this.getBalance();
                                    this.setState({ isTransferModal: false });
                                }
                                this.setState({
                                    currentMoney: { balanceList: data.result },
                                });
                            },
                            (status) => {
                                this.setState({ isRefreshingBalance: status });
                            },
                        );
                        showSmallResultModal(
                            true,
                            translate(res.result.messages),
                        );
                        setTimeout(() => {
                            Modal.destroyAll();
                        }, 3000);
                    } else {
                        message.error(res.result.messages);
                    }
                }
            } else {
                message.error(translate("系统错误，请稍后重试！"));
            }
        });
    }

    searchPromotion() {
        this.setState({
            filterdata: this.props.promotions.filter((item) => {
                return ~item.promoTitle.indexOf(this.state.searchStr)
                    ? item
                    : false;
            }),
        });
        Pushgtagdata("Search_sidenavbar_promopage");
    }

    setTlcGameIframeHeight = () => {
        if (document.getElementById("tlc_game_ifame")) {
            //可能已經load完畢，需要檢查document.readyState狀態
            let iframeObj = document.getElementById("tlc_game_ifame");
            let iframeDoc =
                iframeObj.contentDocument || iframeObj.contentWindow
                    ? iframeObj.contentWindow.document
                    : null;
            if (iframeDoc && iframeDoc.readyState == "complete") {
                this.setIframeHeight(iframeObj);
            } else {
                //還沒load完畢 => 等待onload
                iframeObj.onload = () => {
                    this.setIframeHeight(iframeObj);
                };
            }
        } else {
            //最多重試50次(10秒)
            this.setTlcGameIframeHeightCount =
                this.setTlcGameIframeHeightCount + 1;
            if (this.setTlcGameIframeHeightCount <= 50) {
                setTimeout(this.setTlcGameIframeHeight, 200);
            }
        }
    };

    //開啟優惠詳細的handler
    openPromotionDetailHandler(item, jumpfrom) {
        this.setState({ getBonusLoading: true });
        if (item.promoTitle === "not eligible bonus") {
            message.error(translate("暂无优惠申请资格"));
            return;
        }

        // 獲取Promotion Detail
        let params;
        if (jumpfrom) {
            params = "?id=" + item.promoId + "&jumpfrom=" + jumpfrom;
        } else {
            params = "?id=" + item.promoId;
        }
        get(ApiPort.PromotionContent + params).then((res) => {
            if (res) {
                (res.bonusMinAmount = parseInt(res.bonusMinAmount) || 0),
                    (res.bonusMaxAmount = parseInt(res.bonusMaxAmount) || 0);
                this.props.setSelectedBonus(res);
                setTimeout(() => {
                    if (localStorage.getItem("access_token")) {
                        this.getBonusDetail(
                            item.bonusData?.account ||
                                item.history?.wallet ||
                                res.bonusProduct ||
                                "",
                            res,
                            item,
                        );
                    } else {
                        this.setState({ getBonusLoading: false });
                    }

                    this.setState({ selectedPromotionDetail: res }, () => {
                        that.setTlcGameIframeHeight();
                    });
                }, 500);
            }
        });

        this.setState({
            selectedPromotionItem: item,
            isPromotionDetailModal: true,
        });

        let that = this;
    }

    SOSPromotionApplications(SOSBonusId) {
        this.setState({ sosAppllication: true });
        post(ApiPort.SosBonusVerifications)
            .then((res) => {
                if (res.isSuccess === true) {
                    post(
                        ApiPort.SosBonusApplications +
                            "&SOSBonusId=" +
                            SOSBonusId,
                    ).then((res) => {
                        this.setState({ sosAppllication: false });
                        if (res.isSuccess === true) {
                            message.success(res.message);
                            this.getBalance();
                        } else if (res.isSuccess === false) {
                            message.error(res.message);
                        }
                        this.state.sosButton = true;
                    });
                } else if (res.isSuccess === false) {
                    this.setState({ sosAppllication: false });
                    message.error(res.errorMessage);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * 充值申请优惠
     * @param {Object} item
     */
    openDepositModal = (item = {}) => {
        const reminderModal = Modal.confirm({
            icon: null,
            title: translate("余额不足"),
            centered: true,
            closable: false,
            content: (
                <React.Fragment>
                    {translate(
                        "抱歉，您的余额目前不足以参与本次活动，请“充值”并继续参与。",
                    )}
                </React.Fragment>
            ),
            className:
                "confirm-modal-of-public dont-show-close-button elementTextLeft",
            okText: translate("存款"),
            cancelText: translate("取消"),
            onOk: () => {
                sessionStorage.setItem(
                    "promoDeposit",
                    JSON.stringify({
                        bonusId: item.bonusId ?? "",
                        bonusProduct: item.bonusProduct ?? "",
                        bonusMinAmount: item.bonusMinAmount ?? "",
                        bonusTitle: item.promoTitle ?? "",
                    }),
                );
                this.setState({ isPromotionDetailModal: false });
                reminderModal.destroy();
                global.showDialog({
                    key: 'wallet:{"type": "deposit"}',
                });
            },
        });
    };

    // 申請優惠Handler
    Application(item) {
        console.log(
            "🚀 ~ Main ~ Application ~ item.promoType:",
            item.promoType,
        );
        // 会员未登录
        if (!this.state.isLogin) {
            global.goUserSign(getQueryVariable("isAgent") === "1" ? "2" : "1");
            return;
        }

        // 会员登录信息未返回，不做任何操作
        if (JSON.stringify(this.state.memberInfo) == "{}") {
            return;
        }

        switch (item.promoType) {
            case "Bonus":
                //跳转到外部网站 充值 转账 提款 的类型
                switch (item.actionType) {
                    case "External":
                        window.open(item.actionLinkUrl, `_blank`);
                        break;
                    case "Deposit Page Only":
                    case "DEPOSIT_PAGE_ONLY":
                        this.openDepositModal(item);
                        break;
                    case "Withdrawal":
                        global.showDialog({
                            key: 'wallet:{"type": "withdraw"}',
                        });
                        break;
                    case "SOS":
                        // this.SOSPromotionApplications(item.bonusId);
                        break;
                    default:
                        let isBalance = false,
                            isSBbalance = false;
                        if (
                            this.state.currentMoney.balanceList &&
                            !this.state.isRefreshingBalance
                        ) {
                            const totalBal =
                                this.state.currentMoney.balanceList.find(
                                    (account) => (account.name = "TotalBal"),
                                );

                            const mainWallet =
                                this.state.currentMoney.balanceList.find(
                                    (account) => account.name === "MAIN",
                                );

                            if (
                                totalBal.balance <
                                parseFloat(item.bonusMinAmount)
                            ) {
                                console.log("跳轉至存款頁");
                                // this.setState({ isDepositWarningModel: true });
                                this.openDepositModal(item);
                            } else {
                                const bonusProductResult =
                                    this.state.fromWalletList.find(
                                        (v) => v.key === item.bonusProduct,
                                    );

                                if (
                                    mainWallet.balance >=
                                    parseFloat(item.bonusMinAmount)
                                ) {
                                    console.log("跳轉一般轉帳");
                                    this.setState({
                                        isOneClickTransfer: false,
                                        isTransferModal: true,
                                        toWalletName: bonusProductResult
                                            ? bonusProductResult.name
                                            : "",
                                    });
                                } else {
                                    console.log("跳轉一鍵轉帳");
                                    this.setState({
                                        isOneClickTransfer: true,
                                        isTransferModal: true,
                                        toWalletName: bonusProductResult
                                            ? bonusProductResult.name
                                            : "",
                                    });
                                }
                            }
                        } else {
                            console.error("获取钱包api数据失败");
                            message.error(translate("系统错误，请稍后重试！"));
                            return;
                        }

                        if (isBalance || isSBbalance) {
                            console.log("isSBlance", isSBbalance);
                            const bonusProductResult =
                                this.state.fromWalletList.find(
                                    (v) => v.key === item.bonusProduct,
                                );

                            // 获取会员是否持有服务奖金 (疑似沒用到)
                            // post(ApiPort.POSTCalculateAPI, {
                            //   BonusId: item.bonusId,
                            //   Amount: 0,
                            //   wallet: item.bonusProduct,
                            // }).then((res) => {
                            //   if (res && res.inPlan) {
                            //     this.setState({ disabledApplicatioin: true });
                            //     this.imSportPrompt(res.errorMessage, false);
                            //   }
                            // });
                        }
                        break;
                }
                break;
            default:
                break;
        }
    }

    // Manual Promotion 申請Handler
    PromApplications() {
        this.setState({
            manualApplyFormSpinning: true,
        });
        const { memberInfo } = this.state;
        // if (
        //     !memberInfo.firstName ||
        //     !(memberInfo.isVerifiedPhone && memberInfo.isVerifiedPhone[0]) ||
        //     !(memberInfo.isVerifiedEmail && memberInfo.isVerifiedEmail[0])
        // ) {
        //     message.error(
        //         translate("请完善您的个人资料"),
        //         3,
        //         Router.push("/me/account-info")
        //     );
        //     this.props.changeUserCenterTabKey("userinfo");
        //     return;
        // }

        if (!this.state.remarks) {
            message.error(translate("留言为必填栏位"));
            this.setState({
                manualApplyFormSpinning: false,
            });
            return;
        }

        let Data = {
            memberCode: memberInfo.firstName,
            promoId: Number(this.state.selectedPromotionDetail.promoId),
            applySite: 14,
            contactNo:
                memberInfo.isVerifiedPhone && memberInfo.isVerifiedPhone[0],
            remarks: this.state.remarks,
            emailAddress:
                memberInfo.isVerifiedEmail && memberInfo.isVerifiedEmail[0],
            currency: "VND",
        };
        post(ApiPort.POSTPromotionApplications, Data)
            .then((data) => {
                if (data?.result) {
                    this.setState({
                        isManualApplySuccess: true,
                        isShowManualResultModal: true,
                    });
                } else {
                    this.setState({
                        isManualApplySuccess: false,
                        isShowManualResultModal: true,
                        manualResultMessage:
                            (data.errors && data.errors[0]?.message) ||
                            translate("系统错误，请联系在线支持！"),
                    });
                }
                this.setState({
                    manualApplyFormSpinning: false,
                    remarks: "",
                });
            })
            .catch((e) => {
                console.error(e);
                this.setState({
                    isManualApplySuccess: false,
                    isShowManualResultModal: true,
                    manualApplyFormSpinning: false,
                    manualResultMessage:
                        translate("系统错误，请联系在线支持！"),
                });
            });
    }

    handleTextareaChange(e) {
        this.setState({ remarks: e.target.value });
    }

    render() {
        const {
            filterdata,
            manualApplyFormSpinning,
            Tabkey,
            appliedPromotionHistory,
            selectedPromotionItem,
            selectedPromotionDetail,
            isManualApplyModalVisible,
            isManualAppliedDataVisible,
            isLogin,
            currentMoney,
            moneyModalLoading,
            fromWalletList,
            toWalletName,
            isTransferModal,
            WalletBonusProfile,
            isOneClickTransfer,
            isPromotionDetailModal,
            isTransferSuccessModal,
            selectedTopTabIndex,
            pageIndex,
            isManualFullOfApplicantsModal,
            isRefreshingBalance,
            isRefreshingPromotion,
            getBonusLoading,
            manualResultMessage,
        } = this.state;
        const appliedPromotion = appliedPromotionHistory.find((item) => {
            return (
                item?.promoId === selectedPromotionItem?.promoId ||
                String(item?.promotionId) === selectedPromotionItem?.promoId
            );
        });
        console.log(
            "🚀 ~ file: Promotions.js:1155 ~ Main ~ render ~ this.props.categories:",
            isRefreshingPromotion,
            !selectedPromotionDetail.body,
            getBonusLoading,
        );
        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                status={1}
                setUserCenterMoney={(v) => {
                    this.setState({ currentMoney: v });

                    // 设置会员信息，顺便更新登陆之后的Banner
                    this.getPromotionBanner(true);

                    !this.promotionIsLogin && this.props.setPromotions();
                }}
                getPromotionList={() => {
                    this.props.setPromotions();
                }}
                setUserCenterMemberInfo={(v, setMemberInfo, getBalance) => {
                    // 转账优惠申请（转账类型）
                    GetWalletList((res) => {
                        this.setState({
                            fromWalletList: res.result.fromWallet,
                            toWalletList: res.result.toWallet,
                        });
                    });

                    this.setState({ memberInfo: v }); // HasHeader传入进的会员信息
                    this.setMemberInfo = setMemberInfo; // 设置HasHeader会员信息以及更新全部信息
                    this.getBalance = getBalance; // HasHeader传入进的获取余额方法
                }}
                setLoginStatus={(v) => {
                    this.setState({ isLogin: v });
                }}
                seoData={this.props.seoData}
            >
                <div className="promotions-banner">
                    <img
                        src={`${process.env.BASE_PATH}/img/promotions/Banner-for-promotion.${isWebPSupported() ? "webp" : "jpg"}`}
                        style={{ width: "100%", borderRadius: 10 }}
                    />
                </div>
                <div className="common-distance-wrap promotions-content">
                    <div className="common-distance promotion-tabs">
                        {(!this.props.promotions?.length ||
                            !this.props.categories?.length) && (
                            <ul className="loading_card_list">
                                {[...Array(9)].map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <div className="box">
                                                <div className="box_title" />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        {this.props.promotions != "" &&
                            this.props.categories.length != 0 && (
                                <React.Fragment>
                                    {/* <Input
									className="promotion-search"
									addonAfter={<div onClick={this.searchPromotion}>搜索</div>}
									value={this.state.searchStr}
									onChange={({ target: { value: v } }) => {
										this.setState({ searchStr: v });
									}}
									onPressEnter={this.searchPromotion}
									size="large"
									placeholder="更多"
									autoComplete="off"
								/> */}
                                    <Tabs
                                        defaultActiveKey="1"
                                        className="border-tabs"
                                        activeKey={this.props.topTabIndex}
                                        onChange={(tabKey) => {
                                            if (tabKey !== 1) {
                                                if (!this.state.isLogin) {
                                                    global.goUserSign(
                                                        getQueryVariable(
                                                            "isAgent",
                                                        ) === "1"
                                                            ? "2"
                                                            : "1",
                                                    );
                                                } else {
                                                    this.props.changeTab(
                                                        `${tabKey}`,
                                                    );
                                                }
                                            }
                                            // Pushgtagdata(
                                            //   v === "1"
                                            //     ? "Message_PMA_profilepage"
                                            //     : "Announcement_PMA_profilepage"
                                            // );
                                        }}
                                    >
                                        <TabPane
                                            className="upper-tab"
                                            tab={<div>{translate("优惠")}</div>}
                                            key="1"
                                        >
                                            <Tabs
                                                tabPosition={"left"}
                                                className="tlc-promotions-sidebar"
                                                activeKey={Tabkey}
                                                onChange={(e) =>
                                                    this.callback(e)
                                                }
                                            >
                                                {this.props.categories.map(
                                                    (item, index) => (
                                                        <TabPane
                                                            tab={
                                                                <span className="icon-list">
                                                                    <img
                                                                        className={`icon-image ${
                                                                            Tabkey ===
                                                                                index.toString() &&
                                                                            "icon-image-active"
                                                                        }`}
                                                                        src={
                                                                            item.promoCatImageUrl
                                                                        }
                                                                        style={{
                                                                            filter: "greyscale(1)",
                                                                        }}
                                                                    />
                                                                    {
                                                                        item.resourcesName
                                                                    }
                                                                </span>
                                                            }
                                                            key={index}
                                                        >
                                                            {/* 每項item (右半邊) */}
                                                            <div className="promotion-list-box">
                                                                <Spin
                                                                    spinning={
                                                                        isRefreshingPromotion
                                                                    }
                                                                    tip={translate(
                                                                        "加载中",
                                                                    )}
                                                                >
                                                                    <ul className="Pms_data_list">
                                                                        {filterdata.length ? (
                                                                            filterdata
                                                                                .slice(
                                                                                    (pageIndex -
                                                                                        1) *
                                                                                        9,
                                                                                    pageIndex *
                                                                                        9,
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        item,
                                                                                        key,
                                                                                    ) => {
                                                                                        return (
                                                                                            <li
                                                                                                key={
                                                                                                    "pms-data-" +
                                                                                                    key
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    this.openPromotionDetailHandler(
                                                                                                        item,
                                                                                                    );
                                                                                                    Pushgtagdata(
                                                                                                        "Promo Click",
                                                                                                        "View",
                                                                                                        `${item.promoId}_PromoPage`,
                                                                                                    );
                                                                                                }}
                                                                                                className="promotion-item-box"
                                                                                            >
                                                                                                <div className="content-box">
                                                                                                    <div className="item-list">
                                                                                                        <ImageWithFallback
                                                                                                            src={
                                                                                                                item.promoImage
                                                                                                            }
                                                                                                            width={
                                                                                                                282
                                                                                                            }
                                                                                                            height={
                                                                                                                108
                                                                                                            }
                                                                                                            alt={
                                                                                                                item.promoTitle
                                                                                                            }
                                                                                                            fallbackSrc={`${process.env.BASE_PATH}/img/logo/logo.svg`}
                                                                                                        />

                                                                                                        <div className="text-box">
                                                                                                            <p className="title">
                                                                                                                {
                                                                                                                    item.promoTitle
                                                                                                                }
                                                                                                            </p>
                                                                                                            <div className="period">
                                                                                                                <span>
                                                                                                                    <img
                                                                                                                        src={`${process.env.BASE_PATH}/img/promotions/time.svg`}
                                                                                                                    />
                                                                                                                </span>
                                                                                                                <p>{`${moment(
                                                                                                                    item.startDate,
                                                                                                                ).format(
                                                                                                                    "DD-MM-YYYY HH:mm:ss",
                                                                                                                )}-${moment(
                                                                                                                    item.endDate,
                                                                                                                ).format(
                                                                                                                    "DD-MM-YYYY HH:mm:ss",
                                                                                                                )}`}</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </li>
                                                                                        );
                                                                                    },
                                                                                )
                                                                        ) : (
                                                                            <Empty
                                                                                image={
                                                                                    "/vn/img/promotions/non-promotion.png"
                                                                                }
                                                                                description={
                                                                                    <p>
                                                                                        {translate(
                                                                                            "目前没有促销活动。",
                                                                                        )}
                                                                                    </p>
                                                                                }
                                                                            />
                                                                        )}
                                                                    </ul>
                                                                </Spin>
                                                                {filterdata.length >
                                                                    9 && (
                                                                    <Pagination
                                                                        className="general-pagination"
                                                                        style={{
                                                                            textAlign:
                                                                                "left",
                                                                        }}
                                                                        defaultCurrent={
                                                                            1
                                                                        }
                                                                        pageSize={
                                                                            9
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            this.setState(
                                                                                {
                                                                                    pageIndex:
                                                                                        e,
                                                                                },
                                                                            );
                                                                        }}
                                                                        total={
                                                                            filterdata.length
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </TabPane>
                                                    ),
                                                )}
                                            </Tabs>
                                        </TabPane>
                                        <TabPane
                                            tab={
                                                <div>
                                                    {translate("我的优惠")}
                                                </div>
                                            }
                                            key="2"
                                        >
                                            <MyPromotionTabs />
                                        </TabPane>

                                        <TabPane
                                            tab={<div>{translate("返水")}</div>}
                                            key="3"
                                        >
                                            <MyRebate />
                                        </TabPane>
                                    </Tabs>
                                </React.Fragment>
                            )}
                    </div>
                </div>

                {/*優惠詳情Modal*/}
                <Modal
                    className="theme-modal promotion-modal promotion-detail-modal promotion-detail"
                    title={translate("优惠详情")}
                    centered={true}
                    footer={false}
                    width={1120}
                    visible={isPromotionDetailModal}
                    onCancel={() => {
                        this.props.setSelectedBonus(null);

                        this.setState({
                            isPromotionDetailModal: false,
                            selectedPromotionDetail: [],
                        });
                        if (Router.router.query.jumpfrom) {
                            Router.push("/");
                        }
                        this.props.openPromotionDetail({});
                    }}
                    destroyOnClose={true}
                >
                    <Provider store={store}>
                        <Spin
                            spinning={isRefreshingPromotion || getBonusLoading}
                            tip={translate("加载中")}
                        >
                            <iframe
                                id="tlc_game_ifame"
                                className="apply-promotion-detail-box"
                                style={{
                                    width: "100%",
                                    minHeight: "500px",
                                    border: "none",
                                }}
                                srcDoc={
                                    selectedPromotionDetail.body
                                        ? "<style>html,body{margin:0;padding:0;}body{padding:15px;}</style>" +
                                          selectedPromotionDetail.body
                                        : ""
                                }
                            ></iframe>
                            {selectedPromotionDetail.body && (
                                <div className="button-box">
                                    <PromotionStatusButton
                                        selectedPromotionItem={
                                            selectedPromotionItem
                                        }
                                        selectedPromotionDetail={
                                            selectedPromotionDetail
                                        }
                                        applyManualPromotion={() => {
                                            if (!isLogin) {
                                                global.goUserSign(
                                                    getQueryVariable(
                                                        "isAgent",
                                                    ) === "1"
                                                        ? "2"
                                                        : "1",
                                                );
                                                return;
                                            }
                                            this.getIsManualApplicantFull(
                                                selectedPromotionDetail.promoId,
                                            );
                                        }}
                                        applyBonusPromotion={() => {
                                            this.Application(
                                                selectedPromotionDetail,
                                            );
                                            Pushgtagdata(
                                                "Promo Application",
                                                "Submit",
                                                `Apply_${selectedPromotionDetail.promoId}_PromoPage`,
                                            );
                                        }}
                                    />
                                </div>
                            )}
                        </Spin>
                    </Provider>
                </Modal>
                {/* Bonus優惠申請成功Modal */}
                <Modal
                    className="general-modal bonus-apply-success-modal only-apply-success"
                    maskClosable={false}
                    visible={isTransferSuccessModal}
                    width={400}
                    destroyOnClose={true}
                    centered
                    title={translate("优惠申请")}
                    onCancel={() => {
                        this.setState({
                            isTransferSuccessModal: false,
                            isTransferModal: false,
                            isPromotionDetailModal: false,
                        });
                    }}
                    footer={[
                        <Button
                            onClick={() => {
                                this.setState({
                                    isTransferSuccessModal: false,
                                    isTransferModal: false,
                                    isPromotionDetailModal: false,
                                });
                            }}
                        >
                            {translate("关闭")}
                        </Button>,
                        <Button
                            type="primary"
                            onClick={() => {
                                global.PopUpLiveChat();
                            }}
                        >
                            {translate("在线客服")}
                        </Button>,
                    ]}
                >
                    <img
                        src={`${process.env.BASE_PATH}/img/icons/icon-checked.png`}
                    />
                    <h4>{translate("转账及优惠申请成功")}</h4>
                </Modal>

                {/* Manual填寫申請資料 */}
                <Modal
                    className="theme-modal Form-modal promotion-modal manual-apply-modal"
                    title={translate("优惠申请资料")}
                    centered={true}
                    destroyOnClose={true}
                    footer={false}
                    visible={isManualApplyModalVisible}
                    width={400}
                    onCancel={() =>
                        this.setState({
                            isManualApplyModalVisible: false,
                            remarks: "",
                        })
                    }
                >
                    <div>
                        <Spin
                            spinning={manualApplyFormSpinning}
                            size="large"
                            tip={translate("加载中")}
                        >
                            <div className="Formbox">
                                <h3>{selectedPromotionDetail.promoTitle}</h3>
                                <div className="user-info-box">
                                    <Input
                                        addonBefore={translate("用户名(大写)")}
                                        defaultValue={
                                            this.state.memberInfo.userName
                                        }
                                        disabled
                                    />
                                    <div>
                                        <Input
                                            addonBefore={translate("邮箱")}
                                            defaultValue={mailConversion(
                                                this.state.memberInfo
                                                    ?.isVerifiedEmail?.[0] ??
                                                    "",
                                            )}
                                            disabled
                                        />
                                        <p>
                                            {translate(
                                                "如果您想更新您的电子邮件地址，请联系我们的",
                                            )}
                                            <span
                                                onClick={() =>
                                                    global.PopUpLiveChat()
                                                }
                                            >
                                                &nbsp; {translate("客服")}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <Input
                                            addonBefore={translate(
                                                "联系电话(大写)",
                                            )}
                                            defaultValue={numberConversion(
                                                this.state.memberInfo
                                                    ?.isVerifiedPhone?.[0] ??
                                                    "",
                                            )}
                                            disabled
                                        />
                                        <p>
                                            {translate(
                                                "如果您想更新您的电话号码，请联系我们的",
                                            )}
                                            <span
                                                onClick={() =>
                                                    global.PopUpLiveChat()
                                                }
                                            >
                                                &nbsp;{translate("客服")}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="remarks-box">
                                    <label>{translate("备注")}</label>
                                    <textarea
                                        cols={5}
                                        rows={3}
                                        value={this.state.remarks}
                                        onChange={(E) =>
                                            this.handleTextareaChange(E)
                                        }
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className="ps_bottom">
                                <button
                                    disabled={!this.state.remarks.trim().length}
                                    className="button"
                                    onClick={() => {
                                        // this.getIsManualApplicantFull(
                                        //     selectedPromotionDetail.promoId
                                        // );
                                        this.PromApplications();
                                        Pushgtagdata(
                                            "Promo Application​",
                                            "Submit",
                                            "Apply_" +
                                                selectedPromotionDetail.promoId,
                                        );
                                    }}
                                >
                                    {selectedPromotionDetail.actionType ===
                                    "LiveChat"
                                        ? translate("在线客服")
                                        : translate("提交")}
                                </button>
                            </div>
                        </Spin>
                    </div>
                </Modal>

                {/* Manual已提交資料Modal */}
                <AppliedDataModal
                    isVisible={isManualAppliedDataVisible}
                    onCancel={() => {
                        this.setState({ isManualAppliedDataVisible: false });
                    }}
                    appliedItem={appliedPromotion}
                />

                {/* 轉帳Modal */}
                {/* {console.log(
                    "檢查開啟轉帳Modal條件",
                    "\n",
                    "fromWalletList",
                    fromWalletList,
                    "\n",
                    "currentMoney",
                    currentMoney,
                    "\n",
                    "toWalletName",
                    toWalletName,
                    "\n",
                    "selectedPromotionDetail",
                    selectedPromotionDetail,
                    "\n",
                    "WalletBonusProfile",
                    WalletBonusProfile
                )} */}
                {fromWalletList?.length &&
                    currentMoney?.balanceList?.length &&
                    toWalletName &&
                    selectedPromotionDetail &&
                    WalletBonusProfile && (
                        <TransferModal
                            isOneClickTransfer={isOneClickTransfer}
                            visible={isTransferModal}
                            onCancel={() => {
                                this.setState({ isTransferModal: false });
                            }}
                            moneyModalLoading={moneyModalLoading} //控制提交時Loading
                            isRefreshingBalance={isRefreshingBalance} //控制更新錢包時Loading
                            fromWalletList={fromWalletList} //來源帳戶清單(無餘額)
                            currentMoneyList={currentMoney.balanceList} //各帳戶餘額清單
                            toWalletName={toWalletName} //目的帳戶名稱
                            selectedPromotionDetail={selectedPromotionDetail}
                            WalletBonusProfile={WalletBonusProfile}
                            onTransferSubmit={this.handleTransfer}
                            onDepositSubmit={() => {
                                this.setState({ isWalletModal: true });
                            }}
                        />
                    )}

                {/* 财务管理 */}
                <Modal
                    title={translate("钱包")}
                    footer={null}
                    maskClosable={!this.state.isModalLoad}
                    keyboard={!this.state.isModalLoad}
                    width={750}
                    className="wallet-modal"
                    visible={this.state.isWalletModal}
                    destroyOnClose={true}
                    onCancel={() => {
                        this.setState({ isWalletModal: false });
                    }}
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
                                onCancel={(type) => {
                                    this.setState({ isWalletModal: false });
                                    if (type && type == "ToHome") {
                                        Router.push("/");
                                    }
                                }}
                                visible={this.state.walletVisible}
                                goUserCenter={(key) => {
                                    const path = `/me/${pathNameList[key]}`;
                                    if (path) {
                                        this.props.changeUserCenterTabKey(key);
                                        Router.push(path);
                                    }
                                }}
                                setModalTabKey={(v, run) =>
                                    this.setState({ modalTabKey: v }, () => {
                                        typeof run === "function" && run();
                                    })
                                }
                                setLoading={(v) =>
                                    this.setState({ isModalLoad: v })
                                }
                                bonusDetail={selectedPromotionDetail}
                            />
                        ) : null}
                    </Provider>
                </Modal>
                {/* Manual優惠人數過多Modal */}
                <Modal
                    className="general-modal promotion-modal bonus-apply-success-modal"
                    visible={isManualFullOfApplicantsModal}
                    width={365}
                    centered
                    destroyOnClose={true}
                    cancelButtonProps={{ style: { display: "none" } }}
                    okText={translate("我的优惠")}
                    onOk={() => {
                        this.setState({
                            isManualFullOfApplicantsModal: false,
                            isPromotionDetailModal: false,
                            isManualApplyModalVisible: false,
                            remarks: "",
                            selectedPromotionDetail: {},
                        });
                    }}
                >
                    <img
                        src={`${process.env.BASE_PATH}/img/icons/failed-filled.png`}
                    />
                    <h1>{translate("无法领取奖励")}</h1>
                    <span style={{ textAlign: "center" }}>
                        {translate(
                            "抱歉，此促销活动目前已超额认购，请尝试注册其他促销活动。",
                        )}
                    </span>
                </Modal>

                {/* Manual優惠申請Result */}
                <Modal
                    title={null}
                    footer={null}
                    destroyOnClose={true}
                    maskClosable={!this.state.isModalLoad}
                    keyboard={!this.state.isModalLoad}
                    width={400}
                    className="manual-result-modal"
                    visible={this.state.isShowManualResultModal}
                    centered={true}
                >
                    <Spin
                        className={this.state.isModalLoad ? "show" : "hide"}
                        size="large"
                        tip={translate("加载中")}
                    />
                    <div className="result-content-box">
                        <img
                            src={`${process.env.BASE_PATH}/img/promotions/${
                                this.state.isManualApplySuccess
                                    ? "success"
                                    : "error"
                            }.png`}
                        />
                        <p className="text-status">
                            {this.state.isManualApplySuccess
                                ? translate("成功获得奖励")
                                : translate("无法领取奖励")}
                        </p>
                        <p className="text-desription">
                            {this.state.isManualApplySuccess
                                ? translate("优惠申请成功")
                                : manualResultMessage}
                        </p>
                        <div className="button-box">
                            {this.state.isManualApplySuccess ? (
                                <>
                                    <button
                                        onClick={() => {
                                            this.setState({
                                                isShowManualResultModal: false,
                                                isManualApplyModalVisible: false,
                                                isPromotionDetailModal: false,
                                            });
                                        }}
                                    >
                                        {translate("关闭")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            this.props.changeTab("2");
                                            this.setState({
                                                isShowManualResultModal: false,
                                                isManualApplyModalVisible: false,
                                                isPromotionDetailModal: false,
                                            });
                                        }}
                                    >
                                        {translate("我的优惠")}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            global.PopUpLiveChat();
                                        }}
                                    >
                                        {translate("在线客服")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            this.textareaValue = "";
                                            this.setState({
                                                remarks: "",
                                                isShowManualResultModal: false,
                                                isManualApplyModalVisible: false,
                                            });
                                        }}
                                    >
                                        {translate("关闭")}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </Modal>

                {/* 餘額不足Modal */}
                <Modal
                    title={translate("余额不足")}
                    destroyOnClose={true}
                    maskClosable={!this.state.isModalLoad}
                    keyboard={!this.state.isModalLoad}
                    width={400}
                    centered
                    className="promotion-modal general-modal deposit-warning-modal"
                    visible={this.state.isDepositWarningModel}
                    onCancel={() => {
                        this.setState({ isDepositWarningModel: false });
                    }}
                    cancelText={translate("取消")}
                    okText={translate("存款")}
                    onOk={() => {
                        this.setState({ isWalletModal: true });
                    }}
                >
                    <Spin
                        className={this.state.isModalLoad ? "show" : "hide"}
                        size="large"
                        tip={translate("加载中")}
                    />
                    <div className="result-content-box">
                        <p>
                            {translate(
                                "抱歉，目前您的余额不足以参与本次活动，请“充值”并继续参与。",
                            )}
                        </p>
                    </div>
                </Modal>
                <RealyName
                    type="promotion"
                    // 类型为promotion必须传递下一步方法
                    nextStep={() => {
                        this.Application(this.finishRealyNameNextStepInfo);
                    }}
                    onCancel={() => this.setState({ isOpenRealyName: false })}
                    onChangeName={(v) => this.setState({ realyName: v })}
                    realyNameVisible={this.state.isOpenRealyName}
                />
                {/* 紧急公告弹窗 */}
                <Announcement />
            </Layout>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        topTabIndex: state.promotion.topTabIndex,
        categories: state.promotion.categories,
        promotions: state.promotion.promotions,
        appliedPromotions: state.promotion.appliedPromotions,
        openPromotionDetail: state.promotion.openPromotionDetail,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        changeTab: (i) => {
            dispatch(changeTabAction(i));
        },
        setSelectedBonus: (bonusItem) => {
            dispatch(promotionActions.setSelectedBonus(bonusItem));
        },
        setCategories: (result) => {
            dispatch(promotionActions.setCategories(result));
        },
        setPromotions: () => {
            dispatch(getPromotionListAction());
        },
        updateBonusPromotionHistory: (promoId) => {
            dispatch(updateBonusPromotionHistoryAction(promoId));
        },
        getAllPromotionRelatedData: () => {
            dispatch(getAllPromotionRelatedDataAction());
        },
        changeUserCenterTabKey: (tabkey) => {
            dispatch(userCenterActions.changeUserCenterTabKey(tabkey));
        },
        openPromotionDetail: (item) => {
            dispatch(promotionActions.openPromotionDetail(item));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
