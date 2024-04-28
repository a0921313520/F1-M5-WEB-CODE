import React from "react";
import { Collapse, Skeleton, Modal } from "antd";
import Router from "next/router";
import OpenGame from "@/Games/openGame";
import { translate } from "$ACTIONS/Translate";
import { gameLobbyOpenGamePiwik } from "$ACTIONS/piwikData"
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
    }

    componentWillReceiveProps(props) {
        this.setState({
            index: props.index,
        });
    }
    componentWillUnmount(){
        this.setState = ()=> false
    }
    render() {
        const { staticdata } = this.props;
        const currentGame = staticdata?.gameList && staticdata.gameList?.find(
            item => item.providerCode === this.props.Gameslist[this.props.index].providerCode
          ) || {};
        const {
        iconLeftText,
        iconBonus,
        iconBonusText,
        iconRightText,
        description
        } = currentGame;
        console.log("🚀 ~ file: GameInfo.js:131 ~ Gamesmain ~ render ~ currentGame:", currentGame,this.props.Gameslist)
        return (
            <div>
                <div className="down-banner">
                    <div className="content-down-banner">
                        <center>
                            <h2>
                                {this.props.Gameslist &&
                                    this.props.Gameslist[this.props.index]
                                        .providerName}
                            </h2>
                            <h4>
                                {staticdata.egameNames}
                            </h4>
                        </center>
                        <div className="left" key={this.props.index}>
                            {description || translate("没有数据")}
                        </div>
                        <div className="right">
                            <p>{translate("亮点特色")}</p>
                            <ul className="icon">
                                <li>
                                    <img src={staticdata.iconleft} />
                                    <p>
                                        {iconLeftText}
                                    </p>
                                </li>
                                <li className="number">
                                    <i>{iconBonus ? `${iconBonus}%` : ""}</i>
                                    <p>{iconBonusText}</p>
                                </li>
                                <li>
                                    <img src={staticdata.iconright} />
                                    <p>{iconRightText}</p>
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
                                                    Type: item.providerCode === "VTG" ? "HeaderMenu" : null,
                                                    gameName:
                                                        item.providerTitle,
                                                    provider: item.providerCode,
                                                    gameId:
                                                        item.providerId || 0,
                                                    imageUrl:
                                                        item.providerIconUrl,
                                                    gameCatCode:
                                                        this.props.Routertype,
                                                    OpenGamesListPage:
                                                        item.providerGameId ===
                                                        -1, //等于-1 就是列表页面
                                                });
                                                gameLobbyOpenGamePiwik(
                                                    this.props.Routertype,
                                                    item.providerCode,
                                                );
                                            }}
                                        >
                                            {translate("立即游戏")}
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

export default Gamesmain;
