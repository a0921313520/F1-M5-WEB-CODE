import React from "react";
import { Carousel, Tabs, Button } from "antd";
import Router from "next/router";
import { translate } from "$ACTIONS/Translate";
const { TabPane } = Tabs;

class DepositLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rapidIndex: 0,
            otcIndex: 0,
        };
        this.ctcRapidSliderListWrapRef = React.createRef();
        this.ctcOtcSliderListWrapRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener(
            "keydown",
            function (event) {
                event.stopPropagation();
                console.log(event);
            },
            true,
        );
    }
    componentWillUnmount() {
        this.setState = () => false;
        this.ctcRapidSliderListWrapRef = null;
        this.ctcOtcSliderListWrapRef = null;
    }
    handleChange = (key) => {
        this.props.handleChangeDepositLessonTab(key);
    };

    rapidPrevClick = () => {
        this.ctcRapidSliderListWrapRef.current.slick.slickPrev();
    };

    rapidNextClick = () => {
        this.ctcRapidSliderListWrapRef.current.slick.slickNext();
    };

    otcPrevClick = () => {
        this.ctcOtcSliderListWrapRef.current.slick.slickPrev();
    };

    otcNextClick = () => {
        this.ctcOtcSliderListWrapRef.current.slick.slickNext();
    };

    rapidOnChange = (n) => {
        this.setState({ rapidIndex: n });
    };

    otcOnChange = (n) => {
        this.setState({ otcIndex: n });
    };

    handleClick = () => {
        this.props.onhandleCancel();
    };

    render() {
        const defaultTabNum = this.props.tabNum;

        const rapidCryptoLessons = [
            {
                index: 0,
                id: "rapid-ls-1",
                content: () => <></>,
            },
            {
                index: 1,
                id: "rapid-ls-2",
                content: () => <></>,
            },
            {
                index: 2,
                id: "rapid-ls-3",
                content: () => <></>,
            },
            {
                index: 3,
                id: "rapid-ls-4",
                content: () => <></>,
            },
            {
                index: 4,
                id: "rapid-ls-5",
                content: () => <></>,
            },
        ];

        const rapidCryptoComment = [
            {
                id: 1,
                title: translate("步骤") + " " + 1,
                content: translate(
                    "选择您要充值的端口“快捷支付”和“加密货币”。",
                ),
            },
            {
                id: 2,
                title: translate("步骤") + " " + 2,
                content: translate("点击“确认”确认存款。"),
            },
            {
                id: 3,
                title: translate("步骤") + " " + 3,
                content: (
                    <>
                        {translate(
                            "使用加密货币钱包扫描二维码或转账至步骤2中的收款地址。",
                        )}
                        <br />
                        {translate(
                            "*注：该钱包地址是为您保留的，可以多次使用。",
                        )}
                    </>
                ),
            },
            {
                id: 4,
                title: translate("步骤") + " " + 4,
                content: (
                    <>
                        {translate(
                            "在充值历史中，点击“查看交易明细”即可查看交易明细。",
                        )}{" "}
                        <br />
                        {translate(
                            "一旦您的加密钱包成功确认交易，存入的金额将成功存入您的 Fun88 账户。",
                        )}
                    </>
                ),
            },
            {
                id: 5,
                title: translate("步骤") + " " + 5,
                content: translate(
                    "想要了解更多有关加密货币的信息。 您可以访问这些网站。",
                ),
            },
        ];

        const otcCryptoLessons = [
            {
                index: 0,
                id: "otc-ls-1",
                content: () => <></>,
            },
            {
                index: 1,
                id: "otc-ls-2",
                content: () => <></>,
            },
            {
                index: 2,
                id: "otc-ls-3",
                content: () => <></>,
            },
            {
                index: 3,
                id: "otc-ls-4",
                content: () => <></>,
            },
            {
                index: 4,
                id: "otc-ls-5",
                content: () => <></>,
            },
        ];

        const otcCryptoComment = [
            {
                id: 1,
                title: translate("步骤") + " " + 1,
                content: translate(
                    "选择“定期付款”端口。 输入存款金额并点击“发送”。",
                ),
            },
            {
                id: 2,
                title: translate("步骤") + " " + 2,
                content: translate("点击“确认”确认存款。"),
            },
            {
                id: 3,
                title: translate("步骤") + " " + 3,
                content: (
                    <>
                        {translate(
                            "使用加密钱包扫描二维码或转账至第三页收款地址。",
                        )}
                        <br />
                        {translate("*汇款注意事项：")}
                        <ul className="list-style">
                            <li>
                                {translate(
                                    "二维码和钱包地址只能使用一次，请勿重复使用，以免资金汇入您的Fun88账户。",
                                )}
                            </li>
                            <li>
                                {translate(
                                    "Fun88充值页面输入的充值金额必须与实际转账金额一致",
                                )}
                            </li>
                            <li>
                                {translate(
                                    "有些交易所会收取手续费，第3页会显示充值金额+手续费。 转账时请输入总金额。 例如：您要转账15 USDT，手续费为3 USDT，那么您转账时输入的总金额为18 USDT。",
                                )}
                            </li>
                        </ul>
                    </>
                ),
            },
            {
                id: 4,
                title: translate("步骤") + " " + 4,
                content: (
                    <>
                        {translate(
                            "在充值历史中，点击“查看交易明细”即可查看交易明细。",
                        )}{" "}
                        <br />
                        {translate(
                            "一旦您的加密钱包成功确认交易，存入的金额将成功存入您的 Fun88 账户。",
                        )}
                    </>
                ),
            },
            {
                id: 5,
                title: translate("步骤") + " " + 5,
                content: translate(
                    "想要了解更多有关加密货币的信息。 您可以访问这些网站。",
                ),
            },
        ];
        return (
            <React.Fragment>
                <div
                    className="lesson-box deposit-ctc"
                    style={{ textAlign: "center" }}
                >
                    <Tabs
                        defaultActiveKey={defaultTabNum.toString()}
                        activeKey={this.props.tabNum.toString()}
                        onChange={this.handleChange}
                        centered={true}
                        keyboard={false}
                    >
                        <TabPane tab={translate("快速转账2")} key="1">
                            <Carousel
                                key={1}
                                ref={this.ctcRapidSliderListWrapRef}
                                className="custom-Carousel"
                                afterChange={(current) => {
                                    this.rapidOnChange(current);
                                }}
                            >
                                {rapidCryptoLessons.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`crypto-lesson-wrap ${item.id}`}
                                    >
                                        <div className="crypto-lesson-body">
                                            {item.content()}
                                        </div>
                                        {this.state.rapidIndex > 0 && (
                                            <div
                                                className="left-next"
                                                onClick={this.rapidPrevClick}
                                            >
                                                <img
                                                    className="arrowLeftRight"
                                                    src={`${process.env.BASE_PATH}/img/depositlesson/icon-left.svg`}
                                                    alt="left"
                                                />
                                            </div>
                                        )}
                                        {this.state.rapidIndex !=
                                            rapidCryptoLessons.length - 1 && (
                                            <div
                                                className="right-next"
                                                onClick={this.rapidNextClick}
                                            >
                                                <img
                                                    className="arrowLeftRight"
                                                    src={`${process.env.BASE_PATH}/img/depositlesson/icon-right.svg`}
                                                    alt="right"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </Carousel>
                            {
                                <div className="deposit-comment-title">
                                    {
                                        rapidCryptoComment[
                                            this.state.rapidIndex
                                        ].title
                                    }
                                </div>
                            }
                            <div className="deposit-comment-content">
                                {
                                    rapidCryptoComment[this.state.rapidIndex]
                                        .content
                                }
                            </div>
                            <button
                                className="deposit-comment-button"
                                onClick={() => {
                                    this.handleClick();
                                    console.log("clicked");
                                }}
                            >
                                {translate("下一个")}
                            </button>
                        </TabPane>
                        <TabPane tab={translate("定期转账")} key="2">
                            <Carousel
                                key={2}
                                ref={this.ctcOtcSliderListWrapRef}
                                className="custom-Carousel"
                                afterChange={(current) => {
                                    this.otcOnChange(current);
                                }}
                            >
                                {otcCryptoLessons.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`crypto-lesson-wrap ${item.id}`}
                                    >
                                        <div className="crypto-lesson-body">
                                            {item.content()}
                                        </div>
                                        {this.state.otcIndex > 0 && (
                                            <div
                                                className="left-next"
                                                onClick={this.otcPrevClick}
                                            >
                                                <img
                                                    className="arrowLeftRight"
                                                    src={`${process.env.BASE_PATH}/img/depositlesson/icon-left.svg`}
                                                    alt="left"
                                                />
                                            </div>
                                        )}
                                        {this.state.otcIndex !=
                                            otcCryptoLessons.length - 1 && (
                                            <div
                                                className="right-next"
                                                onClick={this.otcNextClick}
                                            >
                                                <img
                                                    className="arrowLeftRight"
                                                    src={`${process.env.BASE_PATH}/img/depositlesson/icon-right.svg`}
                                                    alt="right"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </Carousel>
                            {
                                <div className="deposit-comment-title">
                                    {
                                        otcCryptoComment[this.state.otcIndex]
                                            .title
                                    }
                                </div>
                            }
                            <div className="deposit-comment-content">
                                {otcCryptoComment[this.state.otcIndex].content}
                            </div>
                            <button
                                className="deposit-comment-button"
                                onClick={() => {
                                    this.handleClick();
                                }}
                            >
                                {translate("下一个")}
                            </button>
                        </TabPane>
                    </Tabs>
                </div>
            </React.Fragment>
        );
    }
}
export default DepositLesson;
