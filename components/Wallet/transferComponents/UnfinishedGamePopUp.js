/*
 * @Author: Alan
 * @Date: 2022-07-28 10:59:58
 * @LastEditors: Alan
 * @LastEditTime: 2023-05-13 16:05:13
 * @Description: 正在游戏弹窗提示
 * @FilePath: \F1-M1-WEB-Code\components\Wallet\transferComponents\UnfinishedGamePopUp.js
 */
import React from "react";
import { Modal, Button } from "antd";
import LaunchGameImg from "@/Games/openGame";
import Flexbox from "@/Flexbox/";
import Tag from "@/Games/Tag";

class UnfinishedGamePopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.GameSet = React.createRef();
    }
    componentDidMount() {}

    Game(props) {
        this.gameOpen = props;
    }

    render() {
        const {
            visible,
            unfinishedGames,
            CloseVisible,
            unfinishedGamesMessages,
        } = this.props;
        return (
            <React.Fragment>
                <Modal
                    closable={true}
                    onCancel={() => {
                        CloseVisible();
                    }}
                    className="confirm-modal-of-public UnfinishedGamePopUp"
                    title="温馨提醒"
                    visible={visible}
                    footer={null}
                    center={true}
                >
                    <div className="Content">
                        {unfinishedGames ? (
                            <div className="GamesContent">
                                <img
                                    src={"/vn/img/icons/icon-warn_yellow.png"}
                                />
                                <div className="Modal-text">
                                    <b style={{ fontSize: "16px" }}>
                                        交易申请失败
                                    </b>
                                </div>
                                <div className="modal-info">
                                    系统侦测到您的账号正在进行游戏, <br />
                                    请联系在线客服, 为您提供最贴心的服务
                                </div>
                                <div className="GameMiniLogo">
                                    {unfinishedGames.map((item, index) => {
                                        let gameInfo = {};
                                        Object.assign(gameInfo, item);
                                        gameInfo.imageUrl = item.imgGameName;
                                        return (
                                            <Flexbox
                                                alignItems="center"
                                                key={index + "list"}
                                                justifyContent="space-between"
                                                className="list"
                                            >
                                                <LaunchGameImg
                                                    itemsData={gameInfo}
                                                    height={"auto"}
                                                    OnRef={(QuickStartGame) =>
                                                        (this.QuickStartGame =
                                                            QuickStartGame)
                                                    }
                                                />
                                                <Button
                                                    ghost
                                                    onClick={() => {
                                                        this.QuickStartGame.openGame(
                                                            gameInfo
                                                        );
                                                    }}
                                                    block
                                                    className="GameOpen"
                                                >
                                                    <small>立即游戏</small>
                                                </Button>
                                            </Flexbox>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p>{unfinishedGamesMessages}</p>
                        )}
                        <br />
                        <Button
                            size="large"
                            type="primary"
                            onClick={() => {
                                CloseVisible();
                            }}
                            block
                        >
                            我知道了
                        </Button>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}
export default UnfinishedGamePopUp;
