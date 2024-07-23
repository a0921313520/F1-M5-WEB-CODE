import React, { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { get, post } from "$SERVICES/TlcRequest";
import { ApiPort, APISETS, APISET } from "$SERVICES/TLCAPI";
import Flexbox from "@/Flexbox/";
import { lazyLoadImg } from "$SERVICES/util";
import {
    SetPiwikData,
    HeaderGameNavPiwik,
    HeaderGameNavMoreBtnPiwik,
} from "$SERVICES/piwikData";
import { Carousel, Menu, Icon, Button, Col, message } from "antd";
import QRCode from "qrcode-react";
import {
    menuRightBarData,
    hoverSecondary,
    hoverSecondaryDetail,
} from "$DATA/header.static";
import { connect } from "react-redux";
import { getGameCategoryListAction } from "$STORE/thunk/gameThunk";
import { GetGameNavStatus } from "$SERVICES/gameRequest";
import classNames from "classnames";
import ImageWithFallback from "@/ImageWithFallback/imgLocal";
import { getAffiliateReferralCode } from "$SERVICES/helper";
import OpenGame from "@/Games/openGame";

/* 二级菜单Dom结构 url是跳转路径、图片层级路径 */
function SecondaryDom(props) {
    let secondaryMenuBar = [],
        pageSize = -1;
    if (props.index < 7) {
        hoverSecondary[props.index] = props.ProviderData;
    } else {
        hoverSecondary[props.index] = hoverSecondary[props.index];
    }
    let hoverData = hoverSecondary[props.index];
    if (props.index === 0) {
        hoverData = hoverData.filter(
            (data) =>
                data.code !== "SB2" &&
                data.code !== "YBS" &&
                data.code !== "IPSB-Virtual",
        );
    }
    const detailData = hoverSecondaryDetail.find(
        (item) => item.dataCategory == props.itemdata?.code,
    );
    const detailPercentage = detailData.promotionVal.indexOf("%");
    if (Array.isArray(hoverData) && hoverData.length && hoverData.length) {
        hoverData.forEach((item, index) => {
            if (index % 5 === 0) {
                pageSize++;
            }
            if (!secondaryMenuBar[pageSize]) {
                secondaryMenuBar[pageSize] = [];
            }

            secondaryMenuBar[pageSize].push(item);
        });
        return (
            <div
                className={`menu-placeholder-bar ${detailData.type}`}
                key={props.index + "Menu"}
            >
                <div className="menu-placeholder-inner-bar">
                    {/* Hover游戏菜单 两侧的文字说明和介绍 */}
                    {HoverContent(
                        props,
                        hoverData,
                        detailData,
                        detailPercentage,
                        secondaryMenuBar,
                    )}
                </div>
            </div>
        );
    } else {
        return null;
    }
}

let currentPageCasino = "firstcasino";
let currentPageSlot = "firstslot";
let currentPageMore = "firstmore";
let currentPageCasinoIndex = 0;
let currentPageSlotIndex = 0;
let currentPageMoreIndex = 0;

function HoverContent(
    props,
    hoverData,
    detailData,
    detailPercentage,
    secondaryMenuBar,
) {
    let currentIndex = 0;
    const GameSlider = useRef();
    useEffect(() => {
        if (detailData.type === "casino") {
            GameSlider.current.goTo(currentPageCasinoIndex);
        } else if (detailData.type === "slotgame") {
            GameSlider.current.goTo(currentPageSlotIndex);
        } else if (detailData.type === "more") {
            GameSlider.current.goTo(currentPageMoreIndex);
        }
    }, []);

    function onChange(from, to) {
        let menuLength;
        if (detailData.type === "casino") {
            currentIndex = to;
            currentPageCasinoIndex = to;
            menuLength = secondaryMenuBar.length - 1;
            if (currentIndex === menuLength) {
                currentPageCasino = "lastcasino";
            } else if (currentIndex == 0) {
                currentPageCasino = "firstcasino";
            }
        } else if (detailData.type === "slotgame") {
            currentIndex = to;
            currentPageSlotIndex = to;
            menuLength = secondaryMenuBar.length - 1;
            if (currentIndex === menuLength) {
                currentPageSlot = "lastslot";
            } else if (currentIndex == 0) {
                currentPageSlot = "firstslot";
            }
        } else if (detailData.type === "more") {
            currentIndex = to;
            currentPageMoreIndex = to;
            menuLength = secondaryMenuBar.length - 1;
            if (currentIndex === menuLength) {
                currentPageMore = "lastmore";
            } else if (currentIndex == 0) {
                currentPageMore = "firstmore";
            }
        }
    }
    /**
     * Content-List: hover每个游戏后显示的菜单
     * english，promotion，promotionVal 这三个目前写死。
     */
    return (
        <div className="Content-List">
            {detailData.type != "more" ? (
                <div className="menu-sign-bar ">
                    <h2>
                        {props.itemdata && props.itemdata.name
                            ? props.itemdata.name
                            : ""}
                    </h2>
                    <p className="sign-color">{detailData.english}</p>
                    <div className="sign-brief">
                        <p>{detailData.promotion}</p>
                        <p className="sign-color">{detailData.promotionVal}</p>
                    </div>
                </div>
            ) : (
                <div className="menu-sign-bar ">
                    <h2>{detailData.chinese}</h2>
                    <p className="sign-color">{detailData.english}</p>
                </div>
            )}
            <div
                className={`menu-bar ${
                    detailData.type === "casino"
                        ? currentPageCasino
                        : detailData.type === "slotgame"
                          ? currentPageSlot
                          : detailData.type === "more"
                            ? currentPageMore
                            : ""
                }`}
            >
                {/* 游戏左右滑动列表 */}
                <Carousel
                    ref={GameSlider}
                    arrows={true}
                    beforeChange={onChange}
                >
                    {secondaryMenuBar.map((value, index) => {
                        const currWidth = hoverData.length >= 5 ? 100 : 100;
                        return (
                            <div key={index} className="menu-bar-pages">
                                {value.map((innerItem, innerIndex) => {
                                    return (
                                        <div
                                            id={
                                                innerItem.category +
                                                "_" +
                                                innerItem.code
                                            }
                                            className={`menu-bar-children`}
                                            key={innerIndex}
                                            onClick={() => {
                                                SetPiwikData(
                                                    innerItem.category,
                                                    innerItem.code,
                                                    innerItem.providerId,
                                                );
                                            }}
                                        >
                                            {/* 静态的菜单 */}
                                            {innerItem.type == "static" && (
                                                <div
                                                    className="list-content"
                                                    onClick={() => {
                                                        props.goPages(
                                                            innerItem.provider,
                                                        );
                                                    }}
                                                >
                                                    <ImageWithFallback
                                                        src={
                                                            innerItem.providerImageUrl ||
                                                            "/vn/img/icon/bluebg.png"
                                                        }
                                                        width={currWidth}
                                                        height={currWidth}
                                                        alt="static-gameimg"
                                                        fallbackSrc="/vn/img/icon/bluebg.png"
                                                    />
                                                    <p>
                                                        {innerItem.providerTitle ||
                                                            innerItem.title}
                                                    </p>
                                                </div>
                                            )}
                                            {innerItem.name && (
                                                <OpenGame
                                                    className={classNames({
                                                        "list-content": true,
                                                        HOT: innerItem.isHot,
                                                        NEW: innerItem.isNew,
                                                    })}
                                                    itemsData={{
                                                        Type: "HeaderMenu",
                                                        gameName:
                                                            innerItem.name,
                                                        provider:
                                                            innerItem.code,
                                                        gameId: innerItem.providerId,
                                                        imageUrl:
                                                            innerItem.providerHomepageImage,
                                                        image: innerItem.image,
                                                        gameCatCode:
                                                            innerItem.category,
                                                        OpenGamesListPage:
                                                            innerItem.type ===
                                                            "Category",
                                                        isNew: innerItem.isNew,
                                                        isHot: innerItem.isHot,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </Carousel>
            </div>
            {detailData.type === "more" ? (
                <div className="menu-section app-down">
                    <h3>app</h3>
                    <div>
                        <QRCode
                            size={80}
                            key={global.downloadLinks}
                            value={global.downloadLinks}
                        />
                    </div>
                    <a
                        className="ant-btn ant-btn-primary ant-btn-sm app-down-address"
                        target="__blank"
                        href={global.downloadLinks}
                        onClick={() => {
                            Pushgtagdata(
                                "Home",
                                "Go to Download Page",
                                "Home_TopNav_C_DownloadApp",
                            );
                        }}
                    >
                        download
                    </a>
                </div>
            ) : (
                <div className="menu-section">
                    <p>{props.itemdata && props.itemdata.description}</p>
                    <Button
                        type="link"
                        ghost
                        onClick={() => {
                            Router.push("/games" + detailData.gameAddress);
                            HeaderGameNavMoreBtnPiwik(detailData.dataCategory);
                        }}
                    >
                        more
                        <Icon type="right" />
                        <Icon type="right" />
                    </Button>
                </div>
            )}
        </div>
    );
}
class HeaderMenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: "",
            asPath: "/",
            a: 1,
            ProviderData: [],
            hostname: "",
            GameNavStatusData: [],
            rewardUrl: "https://www.fun88vn2.com/Rewards/MyVIP.aspx?Pop=1",
        };
        this.goPages = this.goPages.bind(this); // 导航菜单界面跳转
    }
    componentDidMount() {
        this.setState({
            hostname: window.location.origin,
            route: Router.router.route,
        });
        //获取导航菜单数据和导航菜单游戏分类数据
        this.props.getGameCategoriesList();
        //获取代理affcode
        getAffiliateReferralCode();

        // Header 二级菜单图片延迟加载
        const lazyLoadSecondImg = () => {
            lazyLoadImg("t_menu_wrapper");
        };
        document.getElementById("t_menu_box_1").onmouseenter =
            lazyLoadSecondImg;
        document.getElementById("t_menu_box_2").onmouseenter =
            lazyLoadSecondImg;

        let GameNav = ["Sportsbook", "InstantGames", "LiveCasino"];
        let promises = [];
        GameNav.forEach((nav) => {
            promises.push(GetGameNavStatus(nav));
        });
        Promise.all(promises).then((data) => {
            this.setState({
                GameNavStatusData: data,
            });
        });
        // this.getClubUrl();
    }
    componentWillUnmount() {
        document.getElementById("t_menu_box_1").onmouseenter = null;
        document.getElementById("t_menu_box_2").onmouseenter = null;
        this.setState = () => false;
    }
    //获取天王俱乐部链接
    getClubUrl() {
        get(ApiPort.CMSConfigs).then((res) => {
            if (res && res.rewardUrl) {
                this.setState({
                    rewardUrl: res.rewardUrl,
                });
            }
        });
    }

    goPages(link) {
        console.log("🚀 ~ HeaderMenuBar ~ goPages ~ link:", link, typeof link);
        if (link === "/referrer-activity") {
            global.goReferFriend();
        } else {
            Router.push(link);
        }
        switch (link) {
            case "/help/sponsorship":
                Pushgtagdata("Home", "View Sponsor", "Home_TopNav_C_Sponsor");
                break;
            case "/referrer-activity":
                Pushgtagdata(
                    "Home",
                    "Go to Refer Friend",
                    "Home_TopNav_C_ReferFriend",
                );
                break;
            // case "/download-app":
            //     Pushgtagdata("Home","Go to Download Page","Home_TopNav_C_DownloadApp");
            //     break;
            case "/diamond-club":
                Pushgtagdata("Home", "Go to VIP", "Home_TopNav_C_VIP");
                break;
            case "/me/self-exclusion":
                Pushgtagdata(
                    "Home",
                    "Go to Self Exclusion",
                    "Home_TopNav_C_SelfExclusion",
                );
                break;
            case "/faq":
                Pushgtagdata("Home", "View FAQ", "Home_TopNav_C_FAQ");
                break;
            default:
                break;
        }
    }

    render() {
        const { GameNavStatusData, rewardUrl } = this.state;
        const { GameCategory } = this.props;
        return (
            <div id="t_menu_wrapper" className="menu-wrapper">
                <Menu
                    id="t_menu_box_1"
                    className="ant-col-16 Header-Menu Header-Menu-list"
                    mode="horizontal"
                    selectable={false}
                >
                    {/* 首页 */}
                    <Menu.Item className="Home-Icon" key="home">
                        <a
                            onClick={() => {
                                Router.push({ pathname: "/" });
                            }}
                            aria-label="goHome"
                        >
                            <i className="tlc-sprite home" />
                        </a>
                    </Menu.Item>
                    {/* 游戏导航菜单 */}
                    {GameCategory &&
                        Array.isArray(GameCategory) &&
                        GameCategory.length &&
                        GameCategory.map((item, index) => {
                            // 新增 category 字段
                            const providersWithCategory =
                                item.subProviders &&
                                item.subProviders.map((provider) => ({
                                    ...provider,
                                    category: item.code,
                                    providerId: 0,
                                }));
                            if (item.expression) {
                                return;
                            }
                            const statusInfo = GameNavStatusData.find(
                                (s) => s.providerCode == item.code,
                            );
                            const gameItem = hoverSecondaryDetail.find(
                                (game) => game.dataCategory == item.code,
                            );
                            return (
                                <Menu.Item key={index}>
                                    <Flexbox
                                        alignItems="center"
                                        onClick={() => {
                                            Router.push({
                                                pathname:
                                                    "/games" +
                                                    gameItem.gameAddress,
                                            });
                                            HeaderGameNavPiwik(item);
                                        }}
                                        className={classNames({
                                            ["ant-menu-item-active-list"]:
                                                this.state.route.indexOf(
                                                    item.code,
                                                ) != -1,
                                            ["Menu_item"]: true,
                                        })}
                                    >
                                        {item.name?.length > 9
                                            ? item.name.slice(0, 13)
                                            : item.name}
                                        {statusInfo && statusInfo.isNew ? (
                                            <div className="SetNew">new</div>
                                        ) : statusInfo && statusInfo.isHot ? (
                                            <div className="SetHot">hot</div>
                                        ) : null}
                                        <i className="tlc-sprite" />
                                    </Flexbox>

                                    <SecondaryDom
                                        index={index}
                                        itemdata={item}
                                        // 传入已经增加了 category 字段的 subProviders 数组
                                        ProviderData={providersWithCategory}
                                    />
                                </Menu.Item>
                            );
                        })}
                    {/* 空的占位 防止偏移 */}
                    {GameCategory.length == 0 &&
                        [...Array(7)].map((_, index) => (
                            <Menu.Item key={index}></Menu.Item>
                        ))}
                </Menu>
                {/*右边的菜单*/}
                <Menu
                    id="t_menu_box_2"
                    className="ant-col-7 Header-Menu Header-Menu-list-Right"
                    mode="horizontal"
                    selectable={false}
                >
                    {menuRightBarData.map((item, idx) => {
                        return typeof item.isDown !== "undefined" ? (
                            <Menu.Item key={item.key + idx}>
                                <Flexbox
                                    alignItems="center"
                                    className={classNames({
                                        ["ant-menu-item-active-list"]:
                                            this.state.route.indexOf(
                                                item.key,
                                            ) != -1
                                                ? "ant-menu-item-active"
                                                : "",
                                        ["Menu_item"]: true,
                                    })}
                                >
                                    {item.expression}
                                    <i className="tlc-sprite" />
                                </Flexbox>

                                <SecondaryDom
                                    index={item.isDown}
                                    hostname={this.state.hostname}
                                    goPages={this.goPages}
                                    // ProviderData={item.isDown}
                                />
                            </Menu.Item>
                        ) : (
                            <Menu.Item key={item.key + idx}>
                                <Flexbox
                                    alignItems="center"
                                    className={classNames({
                                        ["ant-menu-item-active-list"]:
                                            this.state.route.indexOf(
                                                item.key,
                                            ) != -1
                                                ? "ant-menu-item-active"
                                                : "",
                                        ["Menu_item"]: true,
                                    })}
                                    onClick={() => {
                                        if (item.key === "Alliance") {
                                            window.open(
                                                "https://www.luckyf86.com/zh-cn",
                                                `_blank`,
                                            );
                                        } else if (item.key === "KingsClub") {
                                            window.open(rewardUrl, `_blank`);
                                        } else if (item.key === "promotions") {
                                            Router.push({
                                                pathname: "/" + item.key,
                                            });
                                            Router.router.route ==
                                                "/vn/promotions" &&
                                                this.props.getPromotionList();
                                        }
                                        HeaderGameNavPiwik(item.key);
                                    }}
                                >
                                    {item.expression}
                                </Flexbox>
                            </Menu.Item>
                        );
                    })}
                </Menu>
                {/* 在线客服按钮 */}
                <Col span={1} className="csBtn">
                    <div
                        className="live-server-btn"
                        onClick={() => {
                            global.PopUpLiveChat();
                            Pushgtagdata("Home", "Contact CS", "Home_C_CS");
                        }}
                    >
                        <div className="tlc-sprite live-service" />
                    </div>
                </Col>
            </div>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        GameCategory: state.game.categories,
        GameHideArray: state.game.gamesToFilter,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        getGameCategoriesList: () => {
            dispatch(getGameCategoryListAction());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenuBar);
