import React from "react";
import Router from "next/router";
import ReactCardCarousel from "$DATA/js/reactCardCarousel";
import { lazyLoadImg } from "$ACTIONS/util";
import { Spin, Carousel } from "antd";
import Image from "./img";
import { translate } from "$ACTIONS/Translate";
export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
        };

        this.timer = null;
        this.tlcBanner = React.createRef();

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.goIndex = this.goIndex.bind(this);
        this.afterChange = this.afterChange.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (
            this.props.bannerList.length !== prevProps.bannerList.length &&
            this.props.bannerList.length
        ) {
            this.timer = setTimeout(() => {
                lazyLoadImg("t_banner_wrapper");
            }, 10);
        }
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
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
    }
    render() {
        return (
            <React.Fragment>
                <div
                    id="t_banner_wrapper"
                    className="common-distance-wrap tlc-banner-list"
                >
                    {this.props.bannerList && this.props.bannerList.length ? (
                        <React.Fragment>
                            <ReactCardCarousel
                                ref={this.tlcBanner}
                                afterChange={this.afterChange}
                                disable_keydown={true}
                                autoplay={true}
                                autoplay_speed={3000}
                            >
                                {this.props.bannerList.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`tlc-banner-item ${
                                                item.action &&
                                                item.action.actionId !== 0 &&
                                                "pointer"
                                            }`}
                                        >
                                            <Image
                                                item={item}
                                                type="home"
                                                width={1120}
                                                height={410}
                                            />
                                        </div>
                                    );
                                })}
                            </ReactCardCarousel>
                            <div className="common-distance tlc-carousel-controller">
                                <button
                                    className="slide-arrow slide-prev"
                                    onClick={this.prev}
                                    aria-label="上一张"
                                ></button>
                                <button
                                    className="slide-arrow slide-next"
                                    onClick={this.next}
                                    aria-label="下一张"
                                ></button>
                                <ul className="slide-list">
                                    {this.props.bannerList.map(
                                        (item, index) => {
                                            return (
                                                <li
                                                    key={
                                                        item.cmsImageUrl + index
                                                    }
                                                    className={`slide-item${
                                                        this.state.index ===
                                                        index
                                                            ? " slide-item-active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        this.goIndex(index)
                                                    }
                                                >
                                                    {index}
                                                </li>
                                            );
                                        },
                                    )}
                                </ul>
                            </div>
                        </React.Fragment>
                    ) : (
                        <div className="common-distance">
                            <div className="tlc-banner-item">
                                <Spin size="large" tip={translate("加载中")} />
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}
