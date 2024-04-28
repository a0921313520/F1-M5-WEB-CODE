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
        };
        this.phcListWrapRef = React.createRef();
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
    componentWillUnmount(){
        this.setState =()=> false;
        this.phcListWrapRef  = null
    }

    rapidPrevClick = () => {
        this.phcListWrapRef.current.slick.slickPrev();
    };

    rapidNextClick = () => {
        this.phcListWrapRef.current.slick.slickNext();
    };

    rapidOnChange = (n) => {
        this.setState({ rapidIndex: n });
    };

    handleClick = () => {
        this.props.onhandleCancel();
    };
    
    render() {
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
                title: translate("步骤")+" "+1,
                content: translate("选择存款方式“刮刮卡”"),
            },
            {
                id: 2,
                title: translate("步骤")+" "+2,
                content: translate("选择刮刮卡。 存款费用将显示在下面"),
            },
            {
                id: 3,
                title: translate("步骤")+" "+3,
                content: translate("选择刮刮卡面额。 下面显示扣除费用后的实际存款金额。")
            },
            {
                id: 4,
                title: translate("步骤")+" "+4,
                content: translate("点击下一步”。"),
            },
            {
                id: 5,
                title: translate("步骤")+" "+5,
                content: translate("出现第三方屏幕。 选择刮刮卡类型。 填写序列号。 填写卡代码。 点击“发送”完成存款订单。"),
            }
        ];

        return (
            <React.Fragment>
                <div className="lesson-box deposit-phc" style={{ textAlign: "center" }}>
                    <Carousel
                        key={1}
                        ref={this.phcListWrapRef}
                        className="custom-Carousel"
                        afterChange={(current) => {
                            this.rapidOnChange(current);
                        }}
                    >
                        {rapidCryptoLessons.map((item, index) => (
                            <div
                                key={item.id}
                                className={`phc-lesson-wrap ${item.id}`}
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
                                            src={
                                                `${process.env.BASE_PATH}/img/depositlesson/icon-left.svg`
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
                                                `${process.env.BASE_PATH}/img/depositlesson/icon-right.svg`
                                            }
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
                    <div className="deposit-comment-content">{rapidCryptoComment[this.state.rapidIndex].content}</div>
                    <button
                        className="deposit-comment-button"
                        onClick={() => {
                        this.handleClick();
                        }}
                    >
                            {translate("下一个")}
                    </button>
                </div>
            </React.Fragment>
        );
    }
}
export default DepositLesson;
