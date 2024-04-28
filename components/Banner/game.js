import React from "react";
import ReactCardCarousel from "$DATA/js/reactCardCarousel";
import Router from "next/router";
import OpenGame from "@/Games/openGame";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            queryname: "",
        };
        this.tlcBanner = React.createRef();
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.goIndex = this.goIndex.bind(this);
        this.afterChange = this.afterChange.bind(this);
    }
    componentDidMount() {
        this.setState({
            queryname: Router.router.query.name,
        });
    }
    componentWillReceiveProps(props) {
        if (props.Gameslist) {
            var index = props.Gameslist.findIndex(
                (x) => x.providerCode == props.bannertype.name
            );
            if (index != -1) {
                this.setState({
                    index: index,
                });
            }
        }
    }
    next() {
        this.tlcBanner.current.next();
    }
    prev() {
        this.tlcBanner.current.prev();
    }
    goIndex(index) {
        this.tlcBanner.current.goTo(index);
    }
    afterChange() {
        this.setState({ index: this.tlcBanner.current.getCurrentIndex() });
        this.props.changeset(this.tlcBanner.current.getCurrentIndex());
    }
    render() {
        const { queryname, index } = this.state;
        const { CmsProvidersList, Gameslist } = this.props;
        console.log("游戏列表------------->", this.props.Gameslist);
        return (
            <React.Fragment>
                <div className="tlc-banner-list" id="game_banner">
                    {this.props.Gameslist && this.props.Gameslist.length ? (
                        <React.Fragment>
                            <ReactCardCarousel
                                ref={this.tlcBanner}
                                afterChange={this.afterChange}
                                disable_keydown={true}
                                autoplay={false}
                                autoplay_speed={3000}
                                initial_index={index}
                                spread={
                                    this.props.Gameslist.length < 5
                                        ? ["-108%", "8%", "-118%"]
                                        : ["-108%", "8%", "-119%", "18%"]
                                }
                            >
                                {this.props.Gameslist.filter(
                                    (item) => ["YBS","IPSB-Virtual","SB2"].every !==item.providerCode 
                                ).map((item, index) => {
                                    if (item.providerId == "70") return;
                                    return (
                                        <OpenGame
                                            key={index + "List"}
                                            customHtml={(porps) => {
                                                return (
                                                    <div
                                                        key={index + "item"}
                                                        className="tlc-banner-item"
                                                        style={{
                                                            backgroundColor:
                                                                "#ffffffd9",
                                                            padding:
                                                                "14px 15px",
                                                        }}
                                                        onClick={() => {
                                                            if (
                                                                this.state
                                                                    .index ==
                                                                index
                                                            ) {
                                                                porps.openGame({
                                                                    Type: "HeaderMenu",
                                                                    gameName:
                                                                        item.providerName,
                                                                    provider:
                                                                        item.providerCode,
                                                                    gameId: 0,
                                                                    imageUrl:
                                                                        item.imageUrl,
                                                                    gameCatCode:
                                                                        this
                                                                            .props
                                                                            .Routertype,
                                                                    OpenGamesListPage:
                                                                        item.providerGameId ===
                                                                        -1, //等于-1 就是列表页面
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <div
                                                            className={`img-left menu-bar-children ${
                                                                item.providerIconClass &&
                                                                item.providerIconClass.toString()
                                                            }`}
                                                        >
                                                            <img
                                                                src={
                                                                    item.imageUrl
                                                                }
                                                            />
                                                        </div>
                                                        <div
                                                            className={`txt-right ${
                                                                item.providerIconClass &&
                                                                item.providerIconClass.toString()
                                                            }`}
                                                        >
                                                            <h3>
                                                                {
                                                                    item.providerName
                                                                }
                                                            </h3>
                                                            <p
                                                                style={{
                                                                    textAlign:
                                                                        "left",
                                                                }}
                                                            >
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />
                                    );
                                })}
                            </ReactCardCarousel>
                            <div className="">
                                <button
                                    className="slide-arrow slide-prev"
                                    onClick={this.prev}
                                />
                                <button
                                    className="slide-arrow slide-next"
                                    onClick={this.next}
                                />
                            </div>
                        </React.Fragment>
                    ) : null}
                </div>
            </React.Fragment>
        );
    }
}

