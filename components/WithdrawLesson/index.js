import React from "react";
import { Carousel, Tabs ,Button} from "antd";
import { translate } from "$ACTIONS/Translate";
const { TabPane } = Tabs;

class WithdrawLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rapidIndex: 0,
            generalIndex: 0,
        };
        this.RapidSlider = React.createRef()
        this.GeneralSlider = React.createRef()
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
        console.log(key);
    };

    rapidPrevClick = () => {
        this.RapidSlider.current.slick.slickPrev();
    };

    rapidNextClick = () => {
        console.log("checkpoint", this.refs);
        this.RapidSlider.current.slick.slickNext();
    };

    generalPrevClick = () => {
        this.GeneralSlider.current.slick.slickPrev();
    };

    generalNextClick = () => {
        console.log("checkpoint", this.refs);
        this.GeneralSlider.current.slick.slickNext();
    };

    rapidOnChange = (n) => {
        console.log(n);
        this.setState({ rapidIndex: n });
    };

    generalOnChange = (n) => {
        console.log(n);
        this.setState({ generalIndex: n });
    };

    handleClick = () => {
        this.props.onhandleCancel();
    };

    render() {
        const withdrawCryptoLessons = [
            {
                index: 0,
                id: "withdraw-ls-1",
                content: () => <></>,
            },
            {
                index: 1,
                id: "withdraw-ls-2",
                content: () => <></>,
            },
            {
                index: 2,
                id: "withdraw-ls-3",
                content: () => <></>,
            },
            {
                index: 3,
                id: "withdraw-ls-4",
                content: () => <></>,
            },
        ];

        const withdrawCryptoComment = [
            {
                id: 1,
                title: translate("步骤")+"1",
                content: translate("输入 VND 金额并检查等值加密货币金额。 请注意，交易将按交易时的实际汇率计算。"),
            },
            {
                id: 2,
                title: translate("步骤")+"2",
                content: translate("点击添加USDT钱包地址，输入钱包名称和钱包地址，然后点击保存。"),
            },
            {
                id: 3,
                title: translate("步骤")+"3",
                content: translate("点击“提交”，查看交易状态。"),
            },
            {
                id: 4,
                title: translate("步骤")+"4",
                content: translate("想要了解更多有关加密货币的信息。 您可以访问这些网站。"),
            }
        ];

        const addressCryptoLessons = [
            {
                index: 0,
                id: "address-ls-1",
                content: () => <></>,
            },
            {
                index: 1,
                id: "address-ls-2",
                content: () => <></>,
            },
            {
                index: 2,
                id: "address-ls-3",
                content: () => <></>,
            },
            {
                index: 3,
                id: "address-ls-4",
                content: () => <></>,
            },
            {
                index: 4,
                id: "address-ls-5",
                content: () => <></>,
            },
        ];

        const addressCryptoComment = [
            {
                id: 1,
                title: translate("步骤")+"1",
                content: translate("点击“添加钱包地址”。"),
            },
            {
                id: 2,
                title: translate("步骤")+"2",
                content: translate("输入有效的钱包名称和钱包地址。"),
            },
            {
                id: 3,
                title: translate("步骤")+"3",
                content: translate("点击“确认”确认存款。"),
            },
            {
                id: 4,
                title: translate("步骤")+"4",
                content: translate("钱包地址可以从您的加密货币帐户的接收钱包中复制。"),
            },
            {
                id: 5,
                title: translate("步骤")+"5",
                content: translate("想要了解更多有关加密货币的信息。 您可以访问这些网站。"),
            },
        ];

        return (
            <React.Fragment>
                <div className="ccw-withdrawLesson">
                    <Tabs
                        defaultActiveKey="1"
                        onChange={this.handleChange}
                        centered={true}
                    >
                        <TabPane tab={translate("提交提款")} key="1">
                            <Carousel
                                key={0}
                                ref={this.RapidSlider}
                                className="custom-Carousel"
                                afterChange={(current) => {
                                    this.rapidOnChange(current);
                                }}
                            >
                                {withdrawCryptoLessons.map((item, index) => (
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
                                        src={`${process.env.BASE_PATH}/img/withdrawlesson/icon-left.svg`}
                                        alt="left"
                                    />
                                </div>
                            )}
                            {this.state.rapidIndex !=
                                withdrawCryptoLessons.length - 1 && (
                                <div
                                    className="right-next"
                                    onClick={this.rapidNextClick}
                                >
                                    <img
                                        className="arrowLeftRight"
                                        src={`${process.env.BASE_PATH}/vn/img/withdrawlesson/icon-right.svg`}
                                        alt="right"
                                    />
                                </div>
                            )}
                            {
                                <div className="deposit-comment-title">
                                    {
                                        withdrawCryptoComment[
                                            this.state.rapidIndex
                                        ].title
                                    }
                                </div>
                            }
                            {<div className="deposit-comment-content">{withdrawCryptoComment[this.state.rapidIndex].content}</div>}
                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={() => {
                                    this.handleClick();
                                }}
                            >
                                {translate("关闭")}
                            </Button>
                        </TabPane>
                        <TabPane tab={translate("添加钱包地址")} key="2">
                            <Carousel
                                key={1}
                                ref={this.GeneralSlider}
                                className="custom-Carousel"
                                afterChange={(current) => {
                                    this.generalOnChange(current);
                                }}
                            >
                                {addressCryptoLessons.map((item, index) => (
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
                                        src={`${process.env.BASE_PATH}/vn/img/withdrawlesson/icon-left.svg`}
                                        alt="left"
                                    />
                                </div>
                            )}
                            {this.state.generalIndex !=
                                addressCryptoLessons.length - 1 && (
                                <div
                                    className="right-next"
                                    onClick={this.generalNextClick}
                                >
                                    <img
                                        className="arrowLeftRight"
                                        src={`${process.env.BASE_PATH}/img/withdrawlesson/icon-right.svg`}
                                        alt="right"
                                    />
                                </div>
                            )}
                            {
                                <div className="deposit-comment-title">
                                    {
                                        addressCryptoComment[
                                            this.state.generalIndex
                                        ].title
                                    }
                                </div>
                            }
                            {<div className="deposit-comment-content">{addressCryptoComment[this.state.generalIndex].content}</div>}
                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={() => {
                                    this.handleClick();
                                }}
                            >
                                {translate("关闭")}
                            </Button>
                        </TabPane>
                    </Tabs>
                </div>
            </React.Fragment>
        );
    }
}
export default WithdrawLesson;
