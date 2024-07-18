import React from "react";
import {
    Row,
    Col,
    Tabs,
    Modal,
    Empty,
    Spin,
    Slider,
    Select,
    Input,
    InputNumber,
    message,
    Table,
    Radio,
    Icon,
    Pagination,
} from "antd";
import Router from "next/router";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { formatAmount } from "$ACTIONS/util";
import moment from "moment/moment";
import DateRange from "@/DateRange";
import { promotionActions } from "../../store/promotionSlice";
import { getRebateListAction } from "../../store/thunk/promotionThunk";
import { connect } from "react-redux";
import { getPromotionCategories } from "$ACTIONS/promotionRequest";
import { isWebPSupported } from "$ACTIONS/helper";
import { translate } from "$ACTIONS/Translate";
const { TabPane } = Tabs;

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rebateDetailTitle: [
                {
                    title: translate("要求"),
                    dataIndex: "turnover",
                    key: "turnover",
                },
                {
                    title: translate("可得红利"),
                    dataIndex: "rebate",
                    key: "rebate",
                },
                {
                    title: translate("参考编号"),
                    dataIndex: "rebateId",
                    key: "rebateId",
                },
                {
                    title: translate("日期"),
                    dataIndex: "date",
                    key: "date",
                },
            ],
            rebateDetailSource: null,
            isSelfDefined: false, //是否為自訂義區間
            visible: false,
            Categories: [],
            Promotions: [],
            filterdata: this.props.rebateData,
            activeproms: "",
            PromotionsContent: [],
            rulestatus: false,
            OpenForm: false,
            ActivePromotionsContent: "",
            currentMoney: {}, // Header > HasLogged Component 传入的金额
            remark: "",
            formspinning: false,
            Tabkey: "0",
            memberInfo: {}, // HasHeader 传入进来的会员相关信息
            realyName: "", // 为了触发完善姓名后的value更新
            cmsBanner: "",
            isLogin: false,
            dateRadio: "1",
            //-----------New
            RebateList: [], //拿取反水的icon
            ReabteIcon: {
                Sport: "",
                ESports: "",
                Casino: "",
                P2P: "",
                Slot: "",
                Lottery: "",
            }, //專存icon
            RebateDataList: [], //返水的全部資料
            RebateHistoryList: [], //返水歷史紀錄
            SelectedCategory: "All",
            RebateTotal: 0,
            ApplyDate: "",
            columns: [
                {
                    title: "流水",
                    dataIndex: "bet",
                },
                {
                    title: "返水",
                    dataIndex: "amount",
                },
                {
                    title: "編號",
                    dataIndex: "id",
                },
                {
                    title: "日期",
                    dataIndex: "date",
                },
            ],
            definedDate: {
                startTime: moment().format("YYYY-MM-DD"),
                endTime: moment().format("YYYY-MM-DD"),
            },
            visibleDateRange: false, // 自定义时间范围
            pageIndex: 1, //返水頁碼
            isLoading: false, //是否換日期區間Loading中
            openModalDetail: [],
            PromotionCategories: "",
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
        this.changeRadio = this.changeRadio.bind(this); // 改变单选框
        this.setFilterData = this.setFilterData.bind(this); //設定filterData資料
    }

    componentDidMount() {
        /* 获取优惠分类 */
        this.getCategories();

        /* 优惠列表*/
        // this.getPromotionList();

        // get(ApiPort.CmsPromotionRule).then((res) => {
        //     res &&
        //         this.setState({
        //             ruleContent: Array.isArray(res) ? res[0] : res,
        //         });
        // });

        this.getPromotionBanner();
        if (localStorage.getItem("access_token")) {
            this.props.setRebateData(
                this.state.definedDate.startTime,
                this.state.definedDate.endTime,
                this.state.SelectedCategory,
                () => {
                    this.setState({ isLoading: false });
                },
            );
            return;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.topTabIndex !== this.props.topTabIndex &&
            this.props.topTabIndex === "3"
        ) {
            this.setState({ dateRadio: "1", isSelfDefined: false });
        }

        if (prevProps.rebateData !== this.props.rebateData) {
            if (this.state.SelectedCategory === "All") {
                this.setState({ filterdata: this.props.rebateData });
            } else {
                this.setState({
                    filterdata: this.props.rebateData.filter(
                        (item) =>
                            item.promotionCategory ===
                            this.state.SelectedCategory,
                    ),
                });
            }
        }

        if (prevState.SelectedCategory !== this.state.SelectedCategory) {
            const filterdata = this.props.rebateData.filter(
                (item) =>
                    item.promotionCategory === this.state.SelectedCategory,
            );
            console.log("filterdata", filterdata);

            let total = 0;
            if (this.state.SelectedCategory === "All") {
                total = this.props.rebateData.reduce((acc, item) => {
                    acc += item.totalGivenAmount;
                    return acc;
                }, 0);
            } else {
                total = filterdata.reduce((acc, item) => {
                    acc += item.totalGivenAmount;
                    return acc;
                }, 0);
            }

            this.props.setRebateFilterTotalAmount(total);
            this.setState({
                filterdata:
                    this.state.SelectedCategory === "All"
                        ? this.props.rebateData
                        : filterdata,
            });
        }
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    /**
     * @description: 获取优惠分类
     * @return {*}
     */
    async getCategories() {
        /* 获取全优惠分类 */
        const appliedHistories = await getPromotionCategories();
        if (appliedHistories && appliedHistories.length > 0) {
            const rebateCategory = appliedHistories.filter(
                (item) => item.parentName === "Rebate",
            );
            const all = {
                PromoCatID: "",
                PromoCatCode: "All",
                resourcesName: translate("全部"),
                promoCatImageUrl: "/vn/img/promotions/icon/icon-all.png",
                parentId: "",
                parentName: "Rebate",
            };

            this.setState({
                RebateList: [all, ...rebateCategory],
                PromotionCategories: rebateCategory,
            });
            this.Categoriesdata = this.state.RebateList;
            this.hasCategoriesdata && this.getPromotionList();
        }
    }

    setFilterData(data) {
        this.setState({ filterdata: data });
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
        console.log(key);
        if (key === null || key === "0") {
            return this.setState({
                filterdata: this.state.RebateDataList,
                Tabkey: "0",
            });
        }

        const selectedCategory = this.state.RebateList[key].PromoCatCode;
        console.log("selectedCategory", selectedCategory);

        this.setState({
            Tabkey: key.toString(),
            SelectedCategory: selectedCategory,
        });

        const gtagData = [
            "Casino_sidenavbar_promopage",
            "Sport_sidenavbar_promopage",
            "Esport_sidenavbar_promopage",
            "P2P_sidenavbar_promopage",
            "Slot_sidenavbar_promopage",
            "Lottery_sidenavbar_promopage",
        ];
        Pushgtagdata(gtagData[key]);
    }

    getPromotionBanner(loginStatus) {
        const isSupportWebp = isWebPSupported() ? "&displaying_webp" : "";
        get(
            CMSAPIUrl +
                "/vi-vn/api/v1/web/webbanners/position/promo_main?login=" +
                (loginStatus
                    ? `after${isSupportWebp}`
                    : `before${isSupportWebp}`),
        ).then((res) => {
            // res && Array.isArray(res) && this.setState({ cmsBanner: res[0].cmsImageUrl });
        });
    }

    //拿資料 有三類 待確認
    getPromotionList() {
        const isSupportWebp = isWebPSupported() ? "&displaying_webp" : "";
        if (localStorage.getItem("access_token")) {
            this.promotionIsLogin = true;
        }
        get(ApiPort.Promotions + "?type=general" + isSupportWebp).then(
            (res) => {
                //   console.log("----------");
                //   console.log(res);
                const queryId = Router.router.query && Router.router.query.id;
                const queryIsLogin =
                    Router.router.query && Router.router.query.notLogin;
                if (!Array.isArray(this.Categoriesdata) && queryId) {
                    this.hasCategoriesdata = true;
                    return;
                }
                if (!Array.isArray(this.Categoriesdata)) {
                    this.hasCategoriesdata = true;
                    return;
                }
                if (res) {
                    if (
                        res.message &&
                        res.message ===
                            "User is not eligible to access the promotion"
                    ) {
                        message.error("暂无优惠申请资格");
                        return;
                    }
                    this.setState(
                        {
                            Promotions: res.data,
                        },
                        () => {
                            if (queryId) {
                                let index = res.data.findIndex(
                                    (x) => x.promoId == queryId,
                                );
                                if (
                                    !queryIsLogin &&
                                    !localStorage.getItem("access_token")
                                ) {
                                    global.goUserSign("1");
                                    return;
                                }
                                if (res.data[index]) {
                                    let intkey = this.Categoriesdata.findIndex(
                                        (x) =>
                                            x.PromoCatCode ==
                                            res.data[index].category[0],
                                    );
                                    this.openmodal(res.data[index]);
                                    this.callback(intkey == "-1" ? 0 : intkey);
                                } else {
                                    message.error("哎呀！没有找到此优惠！");
                                    this.callback(0);
                                }
                            } else {
                                this.callback(0);
                            }
                        },
                    );
                }
            },
        );
    }
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
        setTimeout(() => {
            Modal.destroyAll();
            this.imSportPromptShow = false;
            typeof callback === "function" && callback();
        }, 1000);
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
            blackBoxValue: window.E2GetBlackbox
                ? window.E2GetBlackbox().blackbox == "" ||
                  window.E2GetBlackbox().blackbox == undefined
                    ? ""
                    : window.E2GetBlackbox().blackbox
                : "",
            e2BlackBoxValue: window.E2GetBlackbox
                ? window.E2GetBlackbox().blackbox == "" ||
                  window.E2GetBlackbox().blackbox == undefined
                    ? ""
                    : window.E2GetBlackbox().blackbox
                : "",
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

    depositSliderValue(value) {
        clearTimeout(this.timer);
        this.setState({ promotionDepositValue: value || 0 });
        this.timer = setTimeout(() => {
            const { PromotionsContent } = this.state;
            post(ApiPort.POSTCalculateAPI, {
                BonusId: PromotionsContent.bonusId,
                Amount: parseInt(value),
                wallet: PromotionsContent.bonusProduct,
            }).then((res) => {
                if (res) {
                    this.setState({
                        bonusAmount: res.bonusAmount,
                        turnoverNeeded: res.turnoverNeeded,
                    });
                    if (res.inPlan) {
                        this.setState({ disabledApplicatioin: true });
                        this.imSportPrompt(res.errorMessage, false);
                    } else {
                        this.setState({
                            defaultDisabledDirectTransferBtn:
                                parseInt(value) <
                                PromotionsContent.bonusMinAmount,
                        });
                    }
                }
            });
        }, 500);
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

    openmodal(selectedItem) {
        let rebateData = [];
        const results = selectedItem.datas;
        for (let i = 0; i < results.length; i++) {
            const resultItem = results[i];
            rebateData.push({
                key: i + 1,
                turnover: resultItem.totalBetAmount,
                rebate: `￥${resultItem.totalGivenAmount}`,
                rebateId: resultItem.rebateId,
                date: moment(resultItem.applyDate).format("DD/MM/YYYY"),
            });
        }
        this.setState({
            visible: true,
            sameRebateItems: rebateData,
            openModalDetail: selectedItem,
        });
    }

    PromApplications() {
        this.setState({
            formspinning: true,
        });
        const { memberInfo, ActivePromotionsContent } = this.state;

        // if (
        //     !memberInfo.firstName ||
        //     !(memberInfo.isVerifiedPhone && memberInfo.isVerifiedPhone[0]) ||
        //     !(memberInfo.isVerifiedEmail && memberInfo.isVerifiedEmail[0])
        // ) {
        //     message.error(
        //         "资料不完整，请至个人资料完善！",
        //         3,
        //         Router.push("/me")
        //     );
        //     return;
        // }
        let Data = {
            FirstName: memberInfo.firstName,
            // promoId: ActivePromotionsContent.promoId,
            promoId: "",
            promoTitle: ActivePromotionsContent.promoTitle,
            remark: this.textareaValue,
            Mobile: memberInfo.isVerifiedPhone && memberInfo.isVerifiedPhone[0],
            Email: memberInfo.isVerifiedEmail && memberInfo.isVerifiedEmail[0],
            platform: "Desktop",
        };
        post(ApiPort.PromApplications, Data).then((data) => {
            //   console.log(data);

            if (data.isPromoApplied) {
                message.success(data.message, 2);
            } else {
                message.error(data.message, 2);
            }
            this.setState({
                formspinning: false,
            });
        });
    }

    handleTextareaChange(e) {
        this.textareaValue = e.target.value;
    }

    changeRadio(e) {
        this.setState({ isLoading: true });
        switch (e.target.value) {
            case "1":
                Pushgtagdata("Today_myrebate_profilepage");
                break;
            case "7":
                Pushgtagdata("7daysrecord_myrebate_profilepage");
                break;
            case "30":
                Pushgtagdata("30daysrecord_myrebate_profilepage");
                break;
            case "0":
                Pushgtagdata("Customization_myrebate_profilepage");
                break;
            default:
                break;
        }

        if (e.target.value === "0") {
            return this.setState({
                visibleDateRange: true,
            });
        } else {
            this.setState({
                isSelfDefined: false,
            });
        }

        this.setState(
            {
                dateRadio: e.target.value,
                definedDate: {
                    startTime: moment()
                        .day(moment().day() - (parseInt(e.target.value) - 1))
                        .format("YYYY-MM-DD"),
                    endTime: moment().format("YYYY-MM-DD"),
                },
            },
            () => {
                this.props.setRebateData(
                    this.state.definedDate.startTime,
                    this.state.definedDate.endTime,
                    this.state.SelectedCategory,
                    () => {
                        this.setState({ isLoading: false });
                    },
                );
            },
        );
    }

    /**
     * @description: 返水总计分类列表页
     * @param {*} data  返水数据
     * @return {*}
     */
    RebateData(data, categories) {
        // console.log("返水数据--------------------->", data);
        if (!categories) return null;
        let aggregatedData = [];

        categories.forEach((category) => {
            let filterData = data.filter((element) => {
                return element.promotionCategory.includes(
                    category.PromoCatCode,
                );
            });
            if (filterData && filterData.length > 0) {
                aggregatedData.push({
                    ...category,
                    datas: [...filterData],
                    totalGivenAmount: filterData.reduce(
                        (acc, currentItem) =>
                            acc + currentItem.totalGivenAmount,
                        0,
                    ),
                    totalBetAmount: filterData.reduce(
                        (acc, currentItem) => acc + currentItem.totalBetAmount,
                        0,
                    ),
                });
            }
        });

        return (
            <React.Fragment>
                {aggregatedData.map((item) => (
                    <li
                        className="rebate-item-box"
                        key={"pms-data-" + item.PromoCatCode}
                    >
                        <div className="header-box">
                            <div className="profile">
                                <div className="text-box">
                                    <img
                                        className="icon-image"
                                        src={item.promoCatImageUrl}
                                    />
                                    <div>
                                        <h3>
                                            {this.changeCategoryName(
                                                item.PromoCatCode,
                                            )}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    this.openmodal(item);
                                }}
                            >
                                <Icon type="right" />
                            </button>
                        </div>
                        <div className="rebate-info-box">
                            <div className="content_item">
                                <p className="title">
                                    {translate("1天内投注")}
                                </p>
                                <p> {item.totalBetAmount}</p>
                            </div>
                            <div className="content_item">
                                <p className="title">
                                    {translate("1天内返水")}
                                </p>
                                <p className="total-amount">
                                    ￥ {item.totalGivenAmount}
                                </p>
                            </div>

                            <div></div>
                        </div>
                    </li>
                ))}
            </React.Fragment>
        );
    }

    changeCategoryName(name) {
        switch (name) {
            case "Special":
                return "独家";
            case "VIP":
                return "钻石会员";
            case "Sports":
                return "体育";
            case "ESports":
                return "电竞";
            case "Instant Games":
                return "小游戏";
            case "Casino":
                return "真人娱乐";
            case "P2P":
                return "棋牌";
            case "Slot":
                return "老虎机";
            case "Lottery":
                return "彩票";
            default:
                return name;
        }
    }
    render() {
        const {
            filterdata,
            PromotionsContent,
            Tabkey,
            RebateList,
            SelectedCategory,
            rebateDetailTitle,
            rebateDetailSource,
            definedDate,
            isSelfDefined,
            pageIndex,
            isLoading,
            sameRebateItems,
            openModalDetail,
        } = this.state;
        return (
            <div className="rebate-container">
                {this.state.cmsBanner ? (
                    <div className="common-distance-wrap common-distance promotions-banner">
                        <img
                            src={this.state.cmsBanner}
                            style={{ width: "100%", borderRadius: 10 }}
                        />
                    </div>
                ) : null}

                {(!this.props.rebateData || !RebateList.length) && (
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
                {this.props.rebateData && (
                    <React.Fragment>
                        <Tabs
                            className="rebate-leftside-tab"
                            tabPosition={"left"}
                            //   className="tlc-promotions-wrap"

                            activeKey={Tabkey}
                            onChange={(e) => this.callback(Number(e))}
                        >
                            {RebateList.map((item, index) => (
                                <TabPane
                                    tab={
                                        <span className="icon-list">
                                            <img
                                                className={`icon-image ${
                                                    Tabkey ===
                                                        index.toString() &&
                                                    "icon-image-active"
                                                }`}
                                                src={item.promoCatImageUrl}
                                                style={{
                                                    filter: "greyscale(1)",
                                                }}
                                            />
                                            {item.resourcesName}
                                        </span>
                                    }
                                    key={index}
                                >
                                    {/* 每項item (右半邊) */}
                                    {/* {console.log(filterdata, 1111111111111)} */}
                                    <div className="filter-box">
                                        <div className="usercenter-title-brief">
                                            {filterdata.length && !isLoading ? (
                                                <>
                                                    <p>
                                                        {translate("返水总额")}
                                                        ：
                                                        <strong>
                                                            ￥
                                                            {this.props.rebateFilteredTotalAmount.toFixed(
                                                                2,
                                                            )}
                                                        </strong>
                                                    </p>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </div>

                                        <Radio.Group
                                            buttonStyle="solid"
                                            className="interval-selector-box"
                                            value={this.state.dateRadio}
                                            onChange={this.changeRadio}
                                        >
                                            <Radio.Button value="1">
                                                {translate("今天")}
                                            </Radio.Button>
                                            <Radio.Button value="7">
                                                {translate("7天内")}
                                            </Radio.Button>
                                            <Radio.Button value="30">
                                                {translate("30天内")}
                                            </Radio.Button>
                                            <Radio.Button value="0">
                                                {translate("自定义")}
                                            </Radio.Button>
                                        </Radio.Group>
                                    </div>

                                    <div className="Pms_data_rebate">
                                        {isSelfDefined && (
                                            <p className="defined-date-description">
                                                {translate("从")}
                                                {`${moment(definedDate.startTime).format("DD/MM/YYYY")}`}
                                                {translate("至")}
                                                {`${moment(definedDate.endTime).format("DD/MM/YYYY")}`}
                                                <span
                                                    onClick={() => {
                                                        this.setState({
                                                            visibleDateRange: true,
                                                        });
                                                    }}
                                                >
                                                    {translate("更改")}
                                                </span>
                                            </p>
                                        )}
                                        <Spin spinning={isLoading}>
                                            <ul
                                                className="rebate-list"
                                                style={{
                                                    marginTop: `${
                                                        isSelfDefined
                                                            ? "unset"
                                                            : "30px"
                                                    }`,
                                                }}
                                            >
                                                {!isLoading &&
                                                    this.RebateData(
                                                        this.state.filterdata,
                                                        this.state
                                                            .PromotionCategories,
                                                    )}
                                                {!this.state.filterdata
                                                    .length &&
                                                    !isLoading && (
                                                        <Empty
                                                            description={translate(
                                                                "没有数据",
                                                            )}
                                                            image={
                                                                "/vn/img/icon/img-no-record.svg"
                                                            }
                                                        />
                                                    )}
                                            </ul>
                                            {this.state.filterdata.length >
                                                10 && (
                                                <Pagination
                                                    className="general-pagination"
                                                    style={{
                                                        textAlign: "left",
                                                    }}
                                                    defaultCurrent={1}
                                                    pageSize={10}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            pageIndex: e,
                                                        });
                                                    }}
                                                    total={
                                                        this.state.filterdata
                                                            .length
                                                    }
                                                />
                                            )}
                                        </Spin>
                                    </div>
                                </TabPane>
                            ))}
                        </Tabs>
                        <DateRange
                            title={translate("选择时间")}
                            classNameDatePicker="rebate-time-picker-container"
                            classNameModal="rebate-time-picker-modal promotion-modal"
                            visible={this.state.visibleDateRange}
                            forMyRebate={true}
                            dateRangeLimit={90}
                            closeRange={() => {
                                this.setState({
                                    visibleDateRange: false,
                                    isLoading: false,
                                });
                            }}
                            setDate={(v) => {
                                this.setState(
                                    {
                                        definedDate: v,
                                        dateRadio: "0",
                                        visibleDateRange: false,
                                        isSelfDefined: true,
                                    },
                                    () => {
                                        this.props.setRebateData(
                                            this.state.definedDate.startTime,
                                            this.state.definedDate.endTime,
                                            this.state.SelectedCategory,
                                            () => {
                                                this.setState({
                                                    isLoading: false,
                                                });
                                            },
                                        );
                                    },
                                );
                            }}
                        />
                    </React.Fragment>
                )}

                <Modal
                    className="theme-modal promotion-modal promotion-detail"
                    title={
                        this.changeCategoryName(openModalDetail.PromoCatCode) ||
                        " "
                    }
                    centered={true}
                    footer={false}
                    visible={this.state.visible}
                    width={800}
                    onCancel={() => {
                        this.setState({
                            visible: false,
                            PromotionsContent: [],
                            rebateDetailSource: null,
                        });
                    }}
                    destroyOnClose={true}
                >
                    <Table
                        className="table-rebate-detail"
                        columns={rebateDetailTitle}
                        dataSource={rebateDetailSource}
                        pagination={{ pageSize: 6 }}
                    />
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        rebateData: state.promotion.rebateData,
        rebateFilteredTotalAmount: state.promotion.rebateFilteredTotalAmount,
        topTabIndex: state.promotion.topTabIndex,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setRebateData: (startTime, endTime, selectedCategory, stopLoading) => {
            dispatch(
                getRebateListAction(
                    startTime,
                    endTime,
                    selectedCategory,
                    stopLoading,
                ),
            );
        },
        setRebateFilterTotalAmount: (result) => {
            dispatch(promotionActions.setRebateFilterTotalAmount(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
