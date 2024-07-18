import React from "react";
import { Collapse, Skeleton, Modal } from "antd";
import Router from "next/router";
const { Panel } = Collapse;
import { CMSAPIUrl } from "$ACTIONS/TLCAPI";
import OpenGame from "@/Games/openGame";
import { connect } from "react-redux";
import { getFlashProviderListAction } from "$STORE/thunk/gameThunk";
function staticHeaderGtag(gameCatCode, providerCode, providerId) {
    sessionStorage.setItem("isGamePage", true);
    if (gameCatCode === "Sportsbook") {
        switch (providerCode) {
            case "SBT":
                Pushgtagdata("Game", "Launch", "BTi_Sports_ProductPage");
                break;
            case "IPSB":
                Pushgtagdata("Game", "Launch", "IM_Sports_ProductPage");
                break;
            case "OWS":
                Pushgtagdata(
                    "Game",
                    "Launch",
                    "OW_Sports_ProductPage(沙巴体育)",
                );
                break;
            case "AIS":
                Pushgtagdata("Game", "Launch", "AI_Sports_ProductPage");
                break;
            // case "YBS":
            //     Pushgtagdata("Game", "Launch", "YBS_Sports_ProductPage");
            //     break;
            case "VTG":
                Pushgtagdata("Game", "Launch", "V2_Sports_ProductPage");
                break;
            default:
                break;
        }
    }

    if (gameCatCode === "Esports") {
        switch (providerCode) {
            case "IPES":
                Pushgtagdata(
                    "Game​",
                    "Launch",
                    "IM_Esports_ProductPage(乐天堂电竞)",
                );
                break;
            case "TFG":
                Pushgtagdata("Game​", "Launch", "TF_Esports_ProductPage");
                break;
            case "OWS":
                Pushgtagdata("Game​", "Launch", "OW_Esports_ProductPage");
                break;
            default:
                break;
        }
    }

    if (gameCatCode === "Lottery") {
        switch (providerCode) {
            case "TCG":
                Pushgtagdata("Game", "Launch", "TC_Lottery_ProductPage");
                break;
            case "BOY":
                Pushgtagdata("Game", "Launch", "BY_Lottery_ProductPage");
                break;
            case "VRL":
                Pushgtagdata("Game", "Launch", "VR_Lottery_ProductPage");
                break;
            case "YBK":
                Pushgtagdata(
                    "Game",
                    "Launch",
                    "OBG_Lottery_ProductPage(醉心彩票)",
                );
                break;
            case "SGW":
                Pushgtagdata(
                    "Game",
                    "Launch",
                    "SGW_Lottery_ProductPage(双赢彩票)",
                );
                break;
            case "LBK":
                Pushgtagdata(
                    "Game",
                    "Launch",
                    "LB_Lottery_ProductPage(LB 快乐彩)",
                );
                break;
            default:
                break;
        }
    }
}
export class Gamesmaintop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }
    componentDidMount() {
        const AllGameID = JSON.parse(localStorage.getItem("AllGameID"));

        const data = AllGameID.find(
            (item) =>
                this.props.Routertype.toLowerCase().indexOf(
                    item.gameCatCode.toLowerCase(),
                ) !== -1,
        );
        console.log("--->", data);
        this.setState({
            data: [data],
        });
    }
    render() {
        const { Routertype } = this.props;
        const { data } = this.state;
        return (
            <div key={JSON.stringify(data)}>
                {data && data.length != 0 && (
                    <div
                        className="top-banner"
                        style={{
                            background: `linear-gradient(#00a6ffb0 0%, #00A6FF 100%) 0% 0% no-repeat padding-box padding-box transparent`,
                        }}
                    >
                        {/* <div className="top-banner-txt">
						<center>{data && data[0].gameCatSubtitle}</center>
						<center>
							<h1>{data && data[0].gameCatTitle}</h1>
						</center>
					</div> */}

                        <img
                            src={data[0].gameCatDefaultImageUrl}
                            style={{ height: 200 }}
                        />
                    </div>
                )}
            </div>
        );
    }
}

import { get } from "$ACTIONS/TlcRequest";

export class Gamesmain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productCode: "",
            index: 0,
            Howtoplaydata: "",
        };
    }
    componentDidMount() {
        this.setState({
            productCode: Router.router.pathname || "",
        });
        console.log(this.props.index);
        //this.Howtoplay();
    }

    Howtoplay() {
        get(
            `${CMSAPIUrl}/vi-vn/api/v1/web/faq/detail/${this.props.staticdata.howtoplayid}`,
        ).then((res) => {
            if (res) {
                console.log(res);
                this.setState({
                    Howtoplaydata: res,
                });
            }
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            index: props.index,
        });
    }

    open() {
        let teststatus = !localStorage.getItem("access_token");
        if (Router.router.pathname == "/vn/Games/Lottery") {
            if (teststatus) {
                global.goUserSign("1");
                return;
            }
        }
        let datatype = this.props.Gameslist[this.props.index];

        if (datatype.providerGameId != "-1") {
            Router.push(
                `${Router.router.pathname}/game?name=${datatype.providerCode}&type=${datatype.providerGameId}`,
            );
        } else {
            Router.push(
                `${Router.router.pathname}/lobby?name=${datatype.providerCode}&type=${datatype.providerId}`,
            );
        }
        // if (this.props.Routertype === 'Sportsbook') {
        // 	switch (item.providerCode) {
        // 		case 'AIS':
        // 			Pushgtagdata('Game', 'Launch', 'Ai_sportpage');
        // 			break;
        // 		default:
        // 			break;
        // 	}
        // }
        if (this.props.Routertype === "Lottery") {
            switch (datatype.providerCode) {
                case "TCG":
                    Pushgtagdata("Game Nav", "Click", "TC_KenoPage");
                    break;
                case "YBK":
                    Pushgtagdata("Game", "Launch", "TY_kenopage");
                    break;
                default:
                    break;
            }
        }
        if (Router.router.pathname === "/vn/Games/Slot") {
            switch (datatype.providerCode) {
                case "YBF":
                    Pushgtagdata("Game", "Launch", "TY_fishing_slotpage");
                    break;
                case "PGS":
                    Pushgtagdata("Game Nav", "Click", "PGS_ ProductPage");
                    break;
                default:
                    break;
            }
        }
        if (Router.router.pathname === "/vn/Casino") {
            switch (datatype.providerCode) {
                case "EVO":
                    Pushgtagdata("Game Nav​", "Click", "EVO_LivePage");
                    break;
                // case "BGG":
                // 	Pushgtagdata("BG_live_topnav");
                // 	break;
                // case "GPI":
                // 	Pushgtagdata("GP_live_topnav");
                // 	break;
                // case "AGL":
                // 	Pushgtagdata("AG_live_topnav");
                // 	break;
                // case "GDL":
                // 	Pushgtagdata("GD_live_topnav");
                // 	break;
                // case "ABT":
                // 	Pushgtagdata("ALLBET_live_topnav");
                // 	break;
                // case "NLE":
                // 	Pushgtagdata("N2L_live_topnav");
                // 	break;
                // case "SAL":
                // 	Pushgtagdata("SAG_live_topnav");
                // 	break;
                default:
                    break;
            }
        }
    }

    render() {
        const { staticdata, Gametypedata } = this.props;
        console.log(this.props.index);
        console.log(this.props.Gameslist);
        return (
            <div>
                <div className="down-banner">
                    <div className="content-down-banner">
                        <center>
                            <h2>
                                {this.props.Gameslist &&
                                    this.props.Gameslist[this.props.index]
                                        .providerTitle}
                            </h2>
                            <h4 /* style={{ color: `${staticdata.color[0]}` }} */
                            >
                                {this.props.Gametypedata &&
                                    this.props.Gametypedata[0].gameCatSubtitle}
                            </h4>
                        </center>
                        <div className="left" key={this.props.index}>
                            {(this.props.Gameslist &&
                                this.props.Gameslist[this.props.index]
                                    .providerDesc) ||
                                "暂无数据"}
                        </div>
                        <div className="right">
                            <p>- 亮点特色 -</p>
                            <ul className="icon">
                                <li>
                                    <img src={staticdata.iconleft} />
                                    <p>
                                        {this.props.Gameslist &&
                                            this.props.Gameslist[
                                                this.props.index
                                            ].providerClass &&
                                            this.props.Gameslist[
                                                this.props.index
                                            ].providerClass[0]}
                                    </p>
                                </li>
                                <li
                                    className="number" /* style={{ color: `${staticdata.color[0]}` }} */
                                >
                                    {this.props.Gameslist &&
                                        this.props.Gameslist[this.props.index]
                                            .providerClass &&
                                        this.props.Gameslist[this.props.index]
                                            .providerClass[3]}
                                    <p>
                                        {(this.props.Gameslist &&
                                            this.props.Gameslist[
                                                this.props.index
                                            ].providerClass &&
                                            this.props.Gameslist[
                                                this.props.index
                                            ].providerClass[1]) ||
                                            "暂无数据"}
                                    </p>
                                </li>
                                <li>
                                    <img src={staticdata.iconright} />
                                    <p>
                                        {this.props.Gameslist &&
                                            this.props.Gameslist[
                                                this.props.index
                                            ].providerClass &&
                                            this.props.Gameslist[
                                                this.props.index
                                            ].providerClass[2]}
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <center style={{ top: "80%" }}>
                            <OpenGame
                                key={this.props.index + "List"}
                                customHtml={(porps) => {
                                    return (
                                        <button
                                            className="submit_btn"
                                            onClick={() => {
                                                let item =
                                                    this.props.Gameslist[
                                                        this.props.index
                                                    ];
                                                porps.openGame({
                                                    gameName:
                                                        item.providerTitle,
                                                    provider: item.providerCode,
                                                    gameId: item.providerId,
                                                    imageUrl:
                                                        item.providerIconUrl,
                                                    gameCatCode:
                                                        item.gameCatCode,
                                                    OpenGamesListPage:
                                                        item.providerGameId ===
                                                        -1, //等于-1 就是列表页面
                                                });
                                                staticHeaderGtag(
                                                    item.gameCatCode,
                                                    item.providerCode,
                                                    item.providerId,
                                                );
                                            }}
                                            // style={{ background: `${staticdata.color[0]}` }}
                                        >
                                            进入游戏
                                        </button>
                                    );
                                }}
                            />
                        </center>
                    </div>
                </div>
            </div>
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
        getFlashProviderList: (categoryType) => {
            dispatch(getFlashProviderListAction(categoryType));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sportsbook);
