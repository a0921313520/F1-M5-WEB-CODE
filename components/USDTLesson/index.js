import React from "react";
import { Carousel, Tabs } from "antd";

const { TabPane } = Tabs;

class USDTLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rapidIndex: 0,
            generalIndex: 0,
            otcIndex: 0,
            toPage: 0,
            activepage: 1,
            changepage: false,
            autIndex: 0,
        };
        this.RapidSlider = React.createRef();
        this.GeneralSlider = React.createRef();
        this.OtcSlider = React.createRef();
        this.autSlider = React.createRef();
    }

    componentDidMount() {
        document.addEventListener(
            "keydown",
            function (event) {
                event.stopPropagation();
                console.log(event);
            },
            true
        );
    }

    handleChange = (key) => {
        this.props.handleChangeDepositLessonTab(key);
    };

    rapidPrevClick = () => {
        this.RapidSlider.current.slick.slickPrev();
    };

    rapidNextClick = () => {
        this.RapidSlider.current.slick.slickNext();
    };

    generalPrevClick = () => {
        this.GeneralSlider.current.slick.slickPrev();
    };

    generalNextClick = () => {
        this.GeneralSlider.current.slick.slickNext();
    };

    otcPrevClick = () => {
        this.OtcSlider.current.slick.slickPrev();
    };

    otcNextClick = () => {
        this.OtcSlider.current.slick.slickNext();
    };

    rapidOnChange = (n) => {
        console.log(n);
        this.setState({ rapidIndex: n });
    };

    generalOnChange = (n) => {
        console.log(n);
        this.setState({ generalIndex: n });
    };

    otcOnChange = (n) => {
        this.setState({ otcIndex: n });
    };

    handleClick = () => {
        console.log("close modal");
        this.props.onhandleCancel();
    };
    autPrevClick = () => {
        this.autSlider.current.slick.slickPrev();
    };

    autNextClick = () => {
        console.log("checkpoint", this.refs);
        this.autSlider.current.slick.slickNext();
    };

    autOnChange = (n) => {
        this.setState({ autIndex: n });
    };

    render() {
        const defaultTabNum = this.props.tabNum;

        const rapidCryptoLessons = [
            {
                index: 0,
                id: "huobi-ls-1",
                content: () => <></>,
            },
            {
                index: 1,
                id: "huobi-ls-2",
                content: () => <></>,
            },
            {
                index: 2,
                id: "huobi-ls-3",
                content: () => <></>,
            },
            {
                index: 3,
                id: "huobi-ls-4",
                content: () => <></>,
            },
            {
                index: 4,
                id: "huobi-ls-5",
                content: () => <></>,
            },
        ];

        const rapidCryptoComment = [
            {
                id: 1,
                title: "步骤一",
                content: "如何买币",
            },
            {
                id: 2,
                title: "步骤二",
                content: "输入购买金额与数量。",
            },
            {
                id: 3,
                title: "步骤三",
                content: "选择支付方式 ",
            },
            {
                id: 4,
                title: "步骤四",
                content:
                    "付款确认后，等待卖家放币。等待过程中， 您可以联系卖家或平台客服，详见文末附注。",
            },
            {
                id: 5,
                title: "步骤五",
                content: "订单完成后， 可以将数字资产划转至币币交易账户。 ",
            },
        ];

        const generalCryptoLessons = [
            {
                index: 0,
                id: "okex-ls-1",
                content: () => <></>,
            },
            {
                index: 1,
                id: "okex-ls-2",
                content: () => <></>,
            },
            {
                index: 2,
                id: "okex-ls-3",
                content: () => <></>,
            },
            {
                index: 3,
                id: "okex-ls-4",
                content: () => <></>,
            },
        ];

        const generalCryptoComment = [
            {
                id: 1,
                title: "步骤一",
                content: "如何充币",
            },
            {
                id: 2,
                title: "步骤二",
                content: "如何买币",
            },
            {
                id: 3,
                title: "步骤三",
                content: "选择支付方式",
            },
            {
                id: 4,
                title: "步骤四",
                content: "成功付款后",
            },
        ];

        const otcCryptoLessons = [
            {
                index: 0,
                id: "bian-ls-1",
                content: () => <></>,
            },
            {
                index: 1,
                id: "bian-ls-2",
                content: () => <></>,
            },
            {
                index: 2,
                id: "bian-ls-3",
                content: () => <></>,
            },
            {
                index: 3,
                id: "bian-ls-4",
                content: () => <></>,
            },
            {
                index: 4,
                id: "bian-ls-5",
                content: () => <></>,
            },
            {
                index: 5,
                id: "bian-ls-6",
                content: () => <></>,
            },
        ];

        const otcCryptoComment = [
            {
                id: 1,
                title: "步骤一",
                content: "选择要购买的币种",
            },
            {
                id: 2,
                title: "步骤二",
                content: "输入购买信息与支付方式，完成后点击购买即可。",
            },
            {
                id: 3,
                title: "步骤三",
                content:
                    "点击右下方的“<strong>去付款</strong>”，并在规定的时间内请根据卖家提供的收款方式完成付款，并点击下方的“<strong>我已完成付款</strong>”。",
            },
            {
                id: 4,
                title: "步骤四",
                content: "付款确认",
            },
            {
                id: 5,
                title: "步骤五",
                content:
                    "付款确认后，等待卖家放币。等待过程中，您可以联系卖家或平台客服，详见文末附注。",
            },
            {
                id: 6,
                title: "步骤六",
                content: "将购买后的数字资产划转至币币交易账户。",
            },
        ];

        const INVOICE_AUTComment = [
            {
                id: 1,
                title: "步骤一",
                content: "如何创建身份",
            },
            {
                id: 2,
                title: "步骤二",
                content: "如何备份钱包，按照顺序抄写助记词",
            },
        ];
        const INVOICE_AUTLessons = [
            {
                index: 0,
                id: "im-ls-1",
                content: () => <></>,
            },
            {
                index: 1,
                id: "im-ls-2",
                content: () => <></>,
            },
        ];

        return (
            <React.Fragment>
                <div
                    style={{
                        textAlign: "center",
                        fontWeight: "1000",
                        fontSize: "20px",
                        marginBottom: "10px",
                        paddingTop: "25px",
                        fontFamily: "Microsoft YaHei",
                    }}
                >
                    第三平台方钱包使用指南
                </div>
                <div style={{ textAlign: "center" }}>
                    <Tabs
                        defaultActiveKey={defaultTabNum.toString()}
                        activeKey={this.props.tabNum.toString()}
                        onChange={this.handleChange}
                        centered={true}
                        keyboard={false}
                    >
                        <TabPane tab="火币" key="1">
                            <Carousel
                                key={0}
                                ref={this.RapidSlider}
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
                                    </div>
                                ))}
                            </Carousel>
                            {this.state.rapidIndex > 0 && (
                                <div
                                    className="left-next"
                                    onClick={this.rapidPrevClick}
                                >
                                    <img
                                        className="arrowLeftRight"
                                        src={
                                            "/vn/img/depositlesson/icon-left.svg"
                                        }
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
                                        src={
                                            "/vn/img/depositlesson/icon-right.svg"
                                        }
                                        alt="right"
                                    />
                                </div>
                            )}
                            {
                                <div className="deposit-comment-title">
                                    {
                                        rapidCryptoComment[
                                            this.state.rapidIndex
                                        ].title
                                    }
                                </div>
                            }
                            {
                                <div className="deposit-comment-content">
                                    {
                                        rapidCryptoComment[
                                            this.state.rapidIndex
                                        ].content
                                    }
                                </div>
                            }
                            <button
                                className="deposit-comment-button"
                                onClick={() => {
                                    this.handleClick();
                                    console.log("clicked");
                                }}
                            >
                                确认
                            </button>
                        </TabPane>
                        <TabPane tab="币安" key="2">
                            <Carousel
                                key={2}
                                ref={this.OtcSlider}
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
                                    </div>
                                ))}
                            </Carousel>
                            {this.state.otcIndex > 0 && (
                                <div
                                    className="left-next"
                                    onClick={this.otcPrevClick}
                                >
                                    <img
                                        className="arrowLeftRight"
                                        src={
                                            "/vn/img/depositlesson/icon-left.svg"
                                        }
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
                                        src={
                                            "/vn/img/depositlesson/icon-right.svg"
                                        }
                                        alt="right"
                                    />
                                </div>
                            )}
                            {
                                <div className="deposit-comment-title">
                                    {
                                        otcCryptoComment[this.state.otcIndex]
                                            .title
                                    }
                                </div>
                            }
                            {
                                <div
                                    className="deposit-comment-content"
                                    dangerouslySetInnerHTML={{
                                        __html: otcCryptoComment[
                                            this.state.otcIndex
                                        ].content,
                                    }}
                                ></div>
                            }
                            <button
                                className="deposit-comment-button"
                                onClick={() => {
                                    this.handleClick();
                                    console.log("clicked");
                                }}
                            >
                                确认
                            </button>
                        </TabPane>
                        <TabPane tab="OKEX" key="3">
                            <Carousel
                                key={1}
                                ref={this.GeneralSlider}
                                className="custom-Carousel"
                                afterChange={(current) => {
                                    this.generalOnChange(current);
                                }}
                            >
                                {generalCryptoLessons.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`crypto-lesson-wrap ${item.id}`}
                                    >
                                        <div className="crypto-lesson-body">
                                            {item.content()}
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                            {this.state.generalIndex > 0 && (
                                <div
                                    className="left-next"
                                    onClick={this.generalPrevClick}
                                >
                                    <img
                                        className="arrowLeftRight"
                                        src={
                                            "/vn/img/depositlesson/icon-left.svg"
                                        }
                                        alt="left"
                                    />
                                </div>
                            )}
                            {this.state.generalIndex !=
                                generalCryptoLessons.length - 1 && (
                                <div
                                    className="right-next"
                                    onClick={this.generalNextClick}
                                >
                                    <img
                                        className="arrowLeftRight"
                                        src={
                                            "/vn/img/depositlesson/icon-right.svg"
                                        }
                                        alt="right"
                                    />
                                </div>
                            )}
                            {
                                <div className="deposit-comment-title">
                                    {
                                        generalCryptoComment[
                                            this.state.generalIndex
                                        ].title
                                    }
                                </div>
                            }
                            {
                                <div className="deposit-comment-content">
                                    {
                                        generalCryptoComment[
                                            this.state.generalIndex
                                        ].content
                                    }
                                </div>
                            }
                            <button
                                className="deposit-comment-button"
                                onClick={() => {
                                    this.handleClick();
                                    console.log("clicked");
                                }}
                            >
                                确认
                            </button>
                        </TabPane>
                        <TabPane tab="imToken" key="4">
                            <Carousel
                                key={3}
                                ref={this.autSlider}
                                className="custom-Carousel"
                                afterChange={(current) => {
                                    this.autOnChange(current);
                                }}
                            >
                                {INVOICE_AUTLessons.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`crypto-lesson-wrap ${item.id}`}
                                    >
                                        <div className="crypto-lesson-body">
                                            {item.content()}
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                            {this.state.autIndex > 0 && (
                                <div
                                    className="left-next"
                                    onClick={this.autPrevClick}
                                >
                                    <img
                                        className="arrowLeftRight"
                                        src={
                                            "/vn/img/depositlesson/icon-left.svg"
                                        }
                                        alt="left"
                                    />
                                </div>
                            )}
                            {this.state.autIndex !=
                                INVOICE_AUTLessons.length - 1 && (
                                <div
                                    className="right-next"
                                    onClick={this.autNextClick}
                                >
                                    <img
                                        className="arrowLeftRight"
                                        src={
                                            "/vn/img/depositlesson/icon-right.svg"
                                        }
                                        alt="right"
                                    />
                                </div>
                            )}
                            {
                                <div className="deposit-comment-title">
                                    {
                                        INVOICE_AUTComment[this.state.autIndex]
                                            .title
                                    }
                                </div>
                            }
                            {
                                <div className="deposit-comment-content">
                                    {
                                        INVOICE_AUTComment[this.state.autIndex]
                                            .content
                                    }
                                </div>
                            }
                            <button
                                className="deposit-comment-button"
                                onClick={() => {
                                    this.handleClick();
                                    console.log("clicked");
                                }}
                            >
                                确认
                            </button>
                        </TabPane>
                    </Tabs>
                </div>

                <div></div>
            </React.Fragment>
        );
    }
}
export default USDTLesson;
