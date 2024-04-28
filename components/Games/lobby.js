import React from "react";
import {
    Empty,
    Input,
    Icon,
    Divider,
    Pagination,
    message,
    Select,
    Spin,
    Alert,
} from "antd";
import Router from "next/router";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { get } from "$ACTIONS/TlcRequest";
import classNames from "classnames";
import FilterMenu from "./filterMenu";
import Tag from "@/Games/Tag";
import OpenGame from "@/Games/openGame";
import { connect } from "react-redux";
import { getFlashProviderListAction } from "$STORE/thunk/gameThunk";
import GameBanner from "@/Games/Banner";
import { platformsGtag, gameLobbyFilterTypeDataPiwik, gameListOpenGamePiwik, gameLobbyPageTrackingPiwik } from "$ACTIONS/piwikData";
import { getUrlVars } from "$ACTIONS/util";
import { CloseCircleOutlined } from "@ant-design/icons";
import { translate } from "$ACTIONS/Translate";
import HostConfig from "$ACTIONS/Host.config";

const { Search } = Input;
const { Option } = Select;
class Gamelobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentList: [], // 当前显示的数据
            pageSize: 22, // 单页数据展示量
            totalRecord: 0, // 数据总数
            isLoading: true, // 游戏数据是否加载中
            imgHeight: "auto", // 游戏图片默认高度
            currentType: "all",
            datalist: [],
            pageNumber: 1,
            DataProvider: [],
            CategoryData: [],
            issearch: false,
            CategoryActive: "",
            FeatureActive: "",
            LineActive: "AllPaylines",
            isSort: "Default", // slot 排序
            isChangeSort: false, // 是否改變排序
            gameSubCatCode: "", // 當前遊戲類型
            isVTG: false,
            isSlot: false,
            gameSubCatCodeArry: "",
        };
        this.datalist = []; // 本地临时数据（分类筛选用的）
        this.filterDataList = []; // 篩選後的清單
        this.slotColumn = 5; // 列数
        this.allGameList = []; // 第三方平台游戏总数据
        this.gameList = []; // 当前游戏平台总数据

        this.filterData = this.filterData.bind(this); // 搜索数据
        this.filterTypeData = this.filterTypeData.bind(this); // 分类查询
        this.dataSplitPages = this.dataSplitPages.bind(this); // 数据分页
        this._getPageSize = this._getPageSize.bind(this); // 根據 pageNumber 判斷 pageSize
        this.gameCardImg = React.createRef(); // 游戏图片节点
        this.showSortedList = ["Slot", "LiveCasino", "P2P", "Sportsbook", "KenoLottery"];
    }
    componentDidMount() {
        let SubCategory = getUrlVars()["catagory"];
        let SortingType = getUrlVars()["sortingType"];
        let FeatureType = getUrlVars()["feature"];
        let Provider = Router?.query?.gamelist;
            Provider = (Provider === "gamelist") ? "" : Provider;
        //分类
        if (SubCategory) {
            this.setState({
                CategoryActive: SubCategory,
            });
        }
        if (FeatureType) {
            this.setState({
                FeatureActive: FeatureType
            })
        }
        //排序
        if (SortingType) {
            this.setState({
                isSort: SortingType,
            });
        }

        if (this.props.Routerpath === "Sportsbook") {
            this.setState({
                isVTG: true,
            });
        } else if (this.props.Routerpath === "Slot") {
            this.setState({
                isSlot: true,
            });
        }

        this.changeGameTypeRun(Provider);
        this.props.getFlashProviderList(this.props.Routerpath, true);
        gameLobbyPageTrackingPiwik(this.props.Routerpath);
        console.log("🚀 ~ Gamelobby ~ componentDidMount ~ Provider:", Router.query, this.props.Routerpath,Provider)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Provider !== this.props.Provider) {
            this.changeGameTypeRun(this.props.Provider);
        }
    }
    componentWillUnmount() {
        this.setState = () => false
    }

    /**
     * //获取游戏的类型 （游戏类型，游戏特色，赔付线）
     * @param {String} 游戏平台
     */
    changeGameTypeRun(type) {
        this.filterTypeData(type || ""); // 获取默认数据
        this.setState({
            currentType: type || "",
        });
        get(ApiPort.CmsSubCategory + `?gameType=${this.props.Routerpath}&api-version=2.0&Platform=Desktop`)
            .then((res) => {
                if (res?.isSuccess && res.result) {
                    let DATA = res.result;
                    DATA.unshift(
                        {
                            id: "",
                            category: "",
                            name: translate("全部"),
                            categoryType: "Category",
                            isNew: false,
                        },
                        {
                            id: "",
                            category: "",
                            name: translate("全部"),
                            categoryType: "Feature",
                            isNew: false,
                        },
                        // {
                        //     id: "",
                        //     category: "",
                        //     name: translate("全部"),
                        //     categoryType: "Line",
                        //     isNew: false,
                        // }
                    );
                    this.setState({
                        CategoryData: DATA,
                    });
                }
            });
    }

    // 游戏平台分类查询
    filterTypeData(val) {
        this.setState({
            issearch: false,
        });

        this.setState(
            { currentType: val, gameSubCatCode: "", keyword: "", pageNumber: 1, pageSize: this._getPageSize(1) },
            () => {
                this.changeGamesType();
            }
        );
    }

    /**
     * @description: 切换游戏类型
     * @return {*}
     */
    changeGamesType() {
        this.setState({
            isLoading: true
        });
        const {
            pageNumber,
            pageSize,
            currentType,
            gameSubCatCode,
            LineActive,
            isSort,
            keyword,
            issearch,
            gameSubCatCodeArry,
            CategoryActive,
            FeatureActive
        } = this.state;

        /* 获取游戏列表 */
        get(
            ApiPort.CmsGames +
            `?gameType=${this.props.Routerpath}&gameSortingType=${isSort || ""}&category=${isSort === "Default" ? CategoryActive || FeatureActive : ""}&api-version=2.0&platform=Desktop`
        )
            .then((res) => {
                if (res.isSuccess && res.result) {
                    let filteredGameDetails = res.result?.gameDetails;

                    if (currentType) {       //篩選平台
                        filteredGameDetails = currentType === "FISHING" //特別處理當點擊navbar的捕魚遊戲時
                            ? filteredGameDetails.filter(item =>
                                item.categories.some(cate => cate.categoryName === "FishingGame"))
                            : filteredGameDetails.filter(item => item.provider === currentType);
                    }

                    if (CategoryActive !== "") {    // 篩選遊戲類型
                        filteredGameDetails = filteredGameDetails.filter(item =>
                            item.categories.some(cate => cate.categoryName === CategoryActive)
                        );
                    }

                    if (FeatureActive !== "") {    // 篩選遊戲特色
                        filteredGameDetails = filteredGameDetails.filter(item =>
                            item.categories.some(cate => cate.categoryName === FeatureActive)
                        )
                    }

                    if (this.props.Routerpath === "Slot") { //老虎機才會有賠付線
                        if (LineActive !== "") {  //篩選賠付線
                            filteredGameDetails = filteredGameDetails.filter(item =>
                                item.categories.some(cate => cate.categoryName === LineActive)
                            );
                        }
                    }

                    if (keyword !== "") {    // 關鍵字搜尋
                        filteredGameDetails = filteredGameDetails.filter(item =>
                            item.gameName.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
                        )
                    }
                    if (HostConfig.Config.IsLIVE || HostConfig.Config.IsSoftLaunch) {  //新增isLive判斷
                        filteredGameDetails = filteredGameDetails.filter(item =>
                            item.isLive == true)
                    }
                    //分頁功能
                    //分頁功能 //第一頁為22筆資料，第一頁之後為每頁25筆資料
                    const currentPosts = pageNumber === 1 ? filteredGameDetails?.slice((pageNumber - 1) * pageSize, pageNumber * pageSize) : filteredGameDetails?.slice((pageNumber - 1) * pageSize - 3, pageNumber * pageSize - 3);
                    if (issearch) {
                        this.setState({
                            totalRecord: filteredGameDetails.length,
                            currentList: currentPosts,
                            issearch: false,
                        });
                    } else {
                        this.setState({
                            totalRecord: filteredGameDetails.length,
                            currentList: currentPosts,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("changeGamesType error: ", error);
                this.setState({
                    issearch: false,
                    keyword: "",
                });
            }).finally(() => {
                this.setState({
                    isLoading: false,
                });
            })
    }

    // 游戏分类和搜寻
    filterData(val) {
        if (val == "") {
            // message.error("请输入搜索的游戏");
            return;
        }
        this.setState(
            {
                keyword: val,
                issearch: true,
                pageNumber: 1,
                pageSize: this._getPageSize(1),
            },
            () => {
                this.changeGamesType();
            }
        );
        switch (this.props.Routerpath) {
            case "Sportsbook":
                Pushgtagdata("V2Sports_Lobby​", "Search Game", "V2Sports_Lobby_C_Search​");
                break;
            case "InstantGames":
                Pushgtagdata("InstantGame_Lobby​", "Search Game", "InstantGame_Lobby_C_Search​");
                break;
            default:
                break;
        }
    }

    // 数据分页
    dataSplitPages = (index, filterResult) => {
        this.setState(
            {
                pageNumber: index || 1,
                isLoading: false,
                pageSize: this._getPageSize(index),
            },
            () => {
                this.changeGamesType();
            }
        );
    };


    // 游戏类型
    subcategory(category) {
        const { CategoryActive, FeatureActive, LineActive } = this.state;
        this.setState((prevState) => {
            const gameSubCatCodeArry = [
                CategoryActive,
                FeatureActive && FeatureActive,
                //LineActive && LineActive,
            ]
                .filter(Boolean)
                .join(",");

            return {
                gameSubCatCode: LineActive ? "" : category,
                gameSubCatCodeArry,
                pageNumber: 1
            };
        }, this.changeGamesType);
    }

    PTloadjs() {
        if (document.getElementById("pt_script_dom")) return;
        const script = document.createElement("script");
        script.src =
            "https://login.mightypanda88.com/jswrapper/integration.js.php?casino=mightypanda88";
        script.id = "pt_script_dom";
        script.async = true;
        document.body.appendChild(script);
    }
    PPloadjs() {
        if (document.getElementById("pp_script_dom")) return;
        const script = document.createElement("script");
        script.src =
            "https://tlc.pragmaticplay.net/gs2c/common/js/lobby/GameLib.js";
        script.id = "pp_script_dom";
        script.async = true;
        document.body.appendChild(script);
    }

    changedSort(v) {
        // 改變排序
        this.setState({ isSort: v }, (v) => this.changeGamesType());
        switch (this.props.Routerpath) {
            case "Sportsbook":
                Pushgtagdata(
                    "V2Sports_Lobby",
                    "Sort Game",
                    `V2Sports_Lobby_C_Sort​​`,
                    "",
                    [
                        { customVariableKey: `V2Sports_Lobby_C_SortType​` },
                        { customVariableValue: v },
                    ]
                );
                break;
            default:
                break;
        }
    }
    _getPageSize(curPage) {
        return curPage === 1 ? 22 : 25;
    }
    render() {
        const {
            currentList,
            pageNumber,
            DataProvider,
            CategoryData,
            issearch,
            keyword,
            isVTG,
            isSlot,
        } = this.state;
        const {
            Routerpath
        } = this.props;

        let gamesContentTitle = "";
        switch (Routerpath) {
            case "LiveCasino":
                gamesContentTitle = translate("真人娱乐场");
                break;
            case "P2P":
                gamesContentTitle = translate("棋牌");
                break;
            case "Slot":
                gamesContentTitle = translate("老虎机");
                break;
            case "Sportsbook":
                gamesContentTitle = translate("V2体育");
                break;
            case "KenoLottery":
                gamesContentTitle = translate("彩票");
                break;
            default:
                break;
        }

        const GamesProvider =
            this.props.GameInfo &&
            this.props.GameInfo[`provider_${this.props.Routerpath}`];
        //第一頁為22筆資料，第一頁之後為每頁25筆資料
        const totalPage = Math.ceil((this.state.totalRecord - 22) / 25) + 1;
        return (
            <Spin spinning={this.state.isLoading} tip={translate("加载中")}>
                <div
                    className="common-distance-wrap"
                    key={JSON.stringify(Router.router && Router.router.query)}
                >
                    <div className="gamesMaintopContainer">
                        <GameBanner Routertype={this.props.Routerpath} />
                    </div>
                    <div
                        className={`common-distance lobby-box-content ${isSlot && "lobby-box-content_slot"}`}
                    >
                        {/* 左侧筛选列表 */}
                        <div className="games-menu">
                            <Search
                                className="games-menu_search"
                                prefix={
                                    <Icon
                                        type="search"
                                        style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                }
                                placeholder={translate("输入关键字")}
                                enterButton={translate("搜")}
                                onChange={(e) => {
                                    this.setState({
                                        keyword: e.target.value,
                                    });
                                }}
                                onSearch={(value) => {
                                    this.filterData(value);
                                }}
                                value={keyword}
                            />
                            {keyword && (
                                <a
                                    href="#"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        this.setState(
                                            {
                                                keyword: "",
                                                issearch: true,
                                                pageNumber: 1,
                                                pageSize: this._getPageSize(1),
                                            },
                                            () => {
                                                this.changeGamesType();
                                            }
                                        );
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: 19,
                                        right: 88,
                                        zIndex: 9,
                                    }}
                                >
                                    <CloseCircleOutlined className="games_search" />
                                </a>
                            )}
                            <div
                                className={`menu-list ${isVTG && "vtg-menu-list"
                                    }`}
                            >
                                {/* <div className="clear-search">
									<h4 style={{ flex: 1 }}>筛选</h4>
									<div
										onClick={() => {
											this.filterTypeData('');
										}}
									>
										清除
									</div>
								</div>
								<Divider /> */}
                                {!isVTG && !isSlot && (
                                    <>
                                        <h4>{translate("平台供应商")}</h4>
                                        <ul
                                            className="game-type"
                                            key={JSON.stringify(
                                                Router.router &&
                                                Router.router.query
                                            )}
                                        >
                                            <li
                                                className={
                                                    this.state.currentType ===
                                                        ""
                                                        ? "curr"
                                                        : ""
                                                }
                                                onClick={() => {
                                                    this.filterTypeData("");
                                                    gameLobbyFilterTypeDataPiwik(this.props.Routerpath, this.state.currentType)
                                                }}
                                            >
                                                {translate("全部")}
                                            </li>
                                            {GamesProvider != "" &&
                                                GamesProvider &&
                                                GamesProvider.filter(
                                                    (item) =>
                                                        item.providerId !=
                                                        "306" &&
                                                        item.providerGameId !==
                                                        -100
                                                ).map((item, index) => {
                                                    if (
                                                        item.providerId ===
                                                        "70" &&
                                                        item.providerGameId !==
                                                        -100
                                                    )
                                                        return; // 擋掉PT
                                                    return (
                                                        <li
                                                            className={classNames(
                                                                {
                                                                    ["curr"]:
                                                                        this
                                                                            .state
                                                                            .currentType ===
                                                                        item.providerCode,
                                                                    isNew: item.isNew,
                                                                    isHot: item.isHot,
                                                                }
                                                            )}
                                                            onClick={() => {
                                                                this.filterTypeData(
                                                                    item.providerCode
                                                                );
                                                                gameLobbyFilterTypeDataPiwik(this.props.Routerpath, this.state.currentType)
                                                            }}
                                                            key={index}
                                                        >
                                                            <span className="name">
                                                                {
                                                                    item.providerName
                                                                }
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            {GamesProvider == "" && <Empty />}
                                        </ul>
                                    </>
                                )}
                                <FilterMenu
                                    typeName={translate("游戏类型")}
                                    categoryData={CategoryData}
                                    typeKey="Category"
                                    subcategory={(category) => {
                                        this.setState(
                                            {
                                                CategoryActive: category,
                                                pageNumber: 1,
                                                pageSize: this._getPageSize(1),
                                            },
                                            () => {
                                                this.subcategory(category);
                                            }
                                        );
                                        Pushgtagdata(
                                            "Game Nav",
                                            "View",
                                            `${category}_${this.props.Routerpath}_ProductPage`
                                        );
                                    }}
                                    gameSubCatCode={this.state.CategoryActive}
                                />
                                <FilterMenu
                                    typeName="Feature"
                                    categoryData={CategoryData}
                                    typeKey="Feature"
                                    subcategory={(category) => {
                                        this.setState(
                                            {
                                                FeatureActive: category,
                                                pageNumber: 1,
                                                pageSize: this._getPageSize(1),
                                            },
                                            () => {
                                                this.subcategory(category);
                                            }
                                        );
                                        gameLobbyFilterTypeDataPiwik(this.props.Routerpath, category)
                                    }}
                                    gameSubCatCode={this.state.FeatureActive}
                                />
                                <FilterMenu
                                    typeName="Line"
                                    categoryData={CategoryData}
                                    typeKey="Line"
                                    subcategory={(category) => {
                                        this.setState(
                                            {
                                                LineActive: category,
                                                pageNumber: 1,
                                                pageSize: this._getPageSize(1),
                                            },
                                            () => {
                                                this.subcategory(category);
                                            }
                                        );
                                        Pushgtagdata(
                                            "Game Nav",
                                            "View",
                                            `${category}_${this.props.Routerpath}_ProductPage`
                                        );
                                    }}
                                    gameSubCatCode={this.state.LineActive}
                                />
                                {isSlot && (
                                    <>
                                        <h4>{translate("平台供应商")}</h4>
                                        <ul
                                            className="game-type"
                                            key={JSON.stringify(
                                                Router.router &&
                                                Router.router.query
                                            )}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <li
                                                className={
                                                    this.state.currentType ===
                                                        ""
                                                        ? "curr"
                                                        : ""
                                                }
                                                onClick={() => {
                                                    this.filterTypeData("");
                                                }}
                                            >
                                                {translate("全部")}
                                            </li>
                                            {GamesProvider != "" &&
                                                GamesProvider &&
                                                GamesProvider.map(
                                                    (item, index) => {
                                                        return (
                                                            <li
                                                                className={classNames(
                                                                    {
                                                                        curr:
                                                                            this
                                                                                .state
                                                                                .currentType ===
                                                                                item.providerCode
                                                                                ? "curr"
                                                                                : "",
                                                                        isNew: item.isNew,
                                                                        isHot: item.isHot,
                                                                    }
                                                                )}
                                                                onClick={() => {
                                                                    this.filterTypeData(
                                                                        item.providerCode
                                                                    );
                                                                    platformsGtag(
                                                                        this
                                                                            .props
                                                                            .Routerpath,
                                                                        item.providerCode
                                                                    );
                                                                }}
                                                                key={index}
                                                            >
                                                                {
                                                                    item.providerName
                                                                }
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            {GamesProvider == "" && <Empty />}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* 右侧游戏列表 */}

                        <div className="games-content">
                            <div>
                                <div className="top-title">
                                    <h3>{gamesContentTitle}</h3>
                                    {this.showSortedList.includes(Routerpath) && (
                                        <div className="filterSlot">
                                            <Select
                                                suffixIcon={
                                                    <img src={`${process.env.BASE_PATH}/img/icon/select-icon.svg`} />
                                                }
                                                dropdownClassName="small-option forGameLobby"
                                                defaultValue={this.state.isSort}
                                                placeholder={translate("默认(小写)")}
                                                dropdownStyle={{
                                                    zIndex: 1,
                                                    color: !this.state
                                                        .isChangeSort
                                                        ? "#999999"
                                                        : "#000",
                                                }}
                                                onChange={this.changedSort.bind(
                                                    this
                                                )}
                                                key={this.state.isSort}
                                            >
                                                <Option value="Default">
                                                    {translate("默认(小写)")}
                                                </Option>
                                                <Option value="AToZ">
                                                    A-Z
                                                </Option>
                                                <Option value="IsNew">
                                                    {translate("最新")}
                                                </Option>
                                                {/* <Option value="Recommended">
                                                    推荐
                                                </Option> */}
                                            </Select>
                                        </div>
                                    )}
                                </div>
                                <div className="list-box">
                                    <div className="box-list">
                                        <div
                                            className={`list-content ${this.props.Routerpath}`}
                                        >
                                            {currentList.map((items, index) => {
                                                return (
                                                    <section
                                                        className={
                                                            (!pageNumber ||
                                                                pageNumber ==
                                                                1) &&
                                                                index == 0
                                                                ? "active"
                                                                : ""
                                                        }
                                                        id={items.provider}
                                                        key={index}
                                                        onClick={() => {
                                                            gameListOpenGamePiwik(items)
                                                        }}
                                                    >
                                                        <OpenGame
                                                            itemsData={{
                                                                gameName:
                                                                    items.gameName,
                                                                provider:
                                                                    items.provider,
                                                                gameId: items.gameId,
                                                                imageUrl:
                                                                    items.imageUrl,
                                                                gameCatCode:
                                                                    this.props
                                                                        .Routerpath,
                                                                launchGameCode:
                                                                    items.launchGameCode,
                                                                OpenGamesListPage: false,
                                                            }}
                                                        />
                                                        <div className="click-btn">
                                                            <div
                                                                className="open"
                                                            >
                                                                {items.gameName}
                                                                <Tag
                                                                    provider={
                                                                        items.provider
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </section>
                                                );
                                            })}
                                            {!currentList.length && (
                                                <Empty
                                                    image={
                                                        "/vn/img/icon/img-no-record.svg"
                                                    }
                                                    description={translate("这里什么都没有，换个游戏试试")}
                                                />
                                            )}
                                        </div>
                                        <div className="PaginationBox">
                                            <Pagination
                                                className="gameLobby-pagination"
                                                key={totalPage * this.state.pageSize}
                                                hideOnSinglePage={true}
                                                total={totalPage * this.state.pageSize}
                                                pageSize={this.state.pageSize}
                                                defaultCurrent={
                                                    this.state.pageNumber
                                                }
                                                onChange={(e) =>
                                                    this.dataSplitPages(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}
const mapStateToProps = function (state) {
    return {
        GameInfo: state.game,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        getFlashProviderList: (categoryType, isShowFishingGames) => {
            dispatch(getFlashProviderListAction(categoryType, isShowFishingGames));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Gamelobby);
