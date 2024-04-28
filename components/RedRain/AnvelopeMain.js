import React from "react";
import { Button, Modal, Icon, Spin, message } from "antd";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { post } from "$ACTIONS/TlcRequest";

class AnvelopeMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showResult: false,
        };

        this.isPass = true;
        this.redRainMain = null;
    }
    componentDidMount() {
        // 传递开启抽奖事件
        this.props.setStartPrizeEvent((e) => {
            this.startPrize(e);
        });

        // 绘制红包雨视窗
        let self = this;
        var global = window,
            body = document.body,
            documentElement = document.documentElement,
            argumnetsRange = function () {
                if (arguments.length === 1) {
                    if (Array.isArray(arguments[0])) {
                        var index = Math.round(
                            argumnetsRange(0, arguments[0].length - 1)
                        );
                        return arguments[0][index];
                    }
                    return argumnetsRange(0, arguments[0]);
                }
                return arguments.length === 2
                    ? Math.random() * (arguments[1] - arguments[0]) +
                          arguments[0]
                    : 0;
            },
            boxSizeCount = function () {
                var width = Math.max(
                        0,
                        global.innerWidth ||
                            documentElement.clientWidth ||
                            body.clientWidth ||
                            0
                    ),
                    height = Math.max(
                        0,
                        global.innerHeight ||
                            documentElement.clientHeight ||
                            body.clientHeight ||
                            0
                    ),
                    offsetX =
                        Math.max(
                            0,
                            global.pageXOffset ||
                                documentElement.scrollLeft ||
                                body.scrollLeft ||
                                0
                        ) - (documentElement.clientLeft || 0),
                    offsetY =
                        Math.max(
                            0,
                            global.pageYOffset ||
                                documentElement.scrollTop ||
                                body.scrollTop ||
                                0
                        ) - (documentElement.clientTop || 0);

                return {
                    width: width,
                    height: height,
                    ratio: width / height,
                    centerx: width / 2,
                    centerY: height / 2,
                    scrollLeft: offsetX,
                    scrollTop: offsetY,
                };
            },
            // 内置方法对象
            Grocery = function (t, i) {
                (this.x = 0), (this.y = 0), this.set(t, i);
            };

        Grocery.prototype = {
            constructor: Grocery,
            set: function (t, i) {
                (this.x = t || 0), (this.y = i || 0);
            },
            copy: function (t) {
                return (this.x = t.x || 0), (this.y = t.y || 0), this;
            },
            add: function (t, i) {
                return (this.x += t || 0), (this.y += i || 0), this;
            },
            subtract: function (t, i) {
                return (this.x -= t || 0), (this.y += i || 0), this;
            },
        };

        var DrawRedRain = function () {
            (this.size = boxSizeCount()),
                (this._canvas = null),
                (this._context = null),
                (this._sto = null),
                (this._width = this.size.width),
                (this._height = this.size.height),
                (this._scroll = 0),
                (this._redbags = []),
                (this._options = {
                    horizontalSpeed: 150,
                    maxRedBag: 16,
                }),
                (this._onDraw = this._onDraw.bind(this)),
                (this._onResize = this._onResize.bind(this));
        };

        DrawRedRain.prototype = {
            constructor: DrawRedRain,
            setOptions: function (t) {
                if ("object" === typeof t)
                    for (var i in t)
                        t.hasOwnProperty(i) && (this._options[i] = t[i]);
            },
            init: function () {
                try {
                    (this._particleImage = new Image()),
                        (this._particleImage.src =
                            "/vn/img/redrain_2022/hongbao.png"),
                        (this._canvas = document.getElementById("canvas")),
                        (this._canvas.width = this._width),
                        (this._canvas.height = this._height),
                        (this._canvas.style.position = "fixed"),
                        (this._canvas.style.left = "0"),
                        (this._canvas.style.top = "0"),
                        (this._canvas.style.zIndex = "3"),
                        (this._canvas.style.pointerEvents = "none"),
                        this._onResize(),
                        (this._context = this._canvas.getContext("2d")),
                        this._context.clearRect(
                            0,
                            0,
                            this._width,
                            this._height
                        ),
                        window.addEventListener("resize", this._onResize),
                        (this._particleImage.onload = () => {
                            for (var i = 0; i < this._options.maxRedBag; ++i) {
                                this.addRedBag();
                            }
                            this._onDraw();
                        });
                    // 点击事件主体赋值
                    self.redRainMain = this._canvas;
                } catch (err) {
                    // 此处加void表明不需要对此函数的返回值做处理
                    return void console.warn(
                        "Canvas Context Error: " + err.toString()
                    );
                }
            },
            randomPlace: function () {
                var direction =
                        5 > Math.round(argumnetsRange(1, 9)) ? "right" : "left",
                    bagWidth = Math.round(argumnetsRange(80, 117)),
                    positionX = Math.round(
                        argumnetsRange(-30, this._width + 30)
                    ),
                    startPosition = new Grocery(
                        positionX,
                        argumnetsRange(-400, -1000)
                    );
                return {
                    point: startPosition,
                    width: bagWidth,
                    dir: direction,
                };
            },
            addRedBag: function () {
                var place = this.randomPlace();
                this._redbags.push(place);
            },
            resetRedBag: function (redbag) {
                const { point, width, dir } = this.randomPlace();
                (redbag.point = point),
                    (redbag.width = width),
                    (redbag.dir = dir);
            },
            _drawRedRainSection: function () {
                for (var n = 0; n < this._options.maxRedBag; ++n) {
                    var redbag = this._redbags[n];
                    var i = 2 * Math.sin((redbag.width * Math.PI) / 2);
                    "right" === redbag.dir
                        ? redbag.point.add(i, redbag.width / 36)
                        : redbag.point.subtract(i, redbag.width / 36);
                    redbag.point.y > this._height && this.resetRedBag(redbag);
                    // 此处设置图片宽高比例
                    this._context.drawImage(
                        this._particleImage,
                        redbag.point.x,
                        redbag.point.y,
                        redbag.width,
                        redbag.width / 0.78
                    );
                }
            },
            _onDraw: function () {
                this._context.clearRect(0, 0, this._width, this._height);
                this._drawRedRainSection();
                self.requestAnimate = requestAnimationFrame(this._onDraw);
            },
            _onResize: function () {
                const size = boxSizeCount();
                (this._width = size.width),
                    (this._height = size.height),
                    this._canvas &&
                        ((this._canvas.width = this._width),
                        (this._canvas.height = this._height));
            },
        };

        var Rain = new DrawRedRain();
        Rain.init();
    }
    showDepositModal = () => {
        Modal.destroyAll();
        this.setState({ showResult: false });
        global.showDialog({ key: 'wallet:{"type": "deposit"}' });
    };
    startPrize = (e) => {
        if (
            this.props.activeStatus === "start" &&
            this.isPass &&
            this.redRainMain &&
            this.redRainMain
                .getContext("2d")
                .getImageData(e.clientX, e.clientY, 1, 1).data[0] !== 0
        ) {
            e.stopPropagation();
            if (localStorage.getItem("access_token") === null) {
                global.goUserSign("1");
                return;
            }
            this.isPass = false;
            this.setState({ isLoading: true });
            Pushgtagdata("Engagement Event", "Click", "Angpao_CNY2022");
            post(ApiPort.RainLuckySpin)
                .then((res) => {
                    this.isPass = true;
                    this.setState({ isLoading: false });

                    if (res.isAllowSpin) {
                        // 获取充值总额和红包次数
                        typeof this.props.GetPlayerLuckySpinDetail ===
                            "function" && this.props.GetPlayerLuckySpinDetail();

                        let currentValue = this.props.prizeList.find(
                            (ele) => ele.cnName === res.wonPrizes.prizeName
                        );
                        const title = currentValue ? "恭喜中奖" : "再接再厉";

                        switch (res.responseStatus) {
                            case 0:
                            case 3:
                                this.setState({
                                    rotateResultTitle: title,
                                    showResult: true,
                                    rotateResultContent: (
                                        <div>
                                            {currentValue ? (
                                                <h4>
                                                    {" "}
                                                    恭喜您获得{" "}
                                                    <span className="theme-color">
                                                        {currentValue.cnName}
                                                    </span>{" "}
                                                    !
                                                </h4>
                                            ) : (
                                                <h4>
                                                    {" "}
                                                    很遗憾您的红包是空的，请再接再厉！
                                                </h4>
                                            )}
                                            <div className="result-picture">
                                                <img
                                                    src={
                                                        currentValue
                                                            ? currentValue.img
                                                            : "/vn/img/redrain_2022/prize-null.png"
                                                    }
                                                />
                                            </div>
                                            <p>
                                                {" "}
                                                您今天还剩余{" "}
                                                <span className="theme-color">
                                                    {res.remaining}
                                                </span>{" "}
                                                次红包次数
                                            </p>
                                            <div className="ant-modal-confirm-btns">
                                                <Button
                                                    type="primary"
                                                    block
                                                    onClick={() => {
                                                        this.setState({
                                                            showResult: false,
                                                        });
                                                    }}
                                                >
                                                    继续游戏
                                                </Button>
                                            </div>
                                        </div>
                                    ),
                                });
                                break;
                            case 2:
                            case 4:
                                this.setState({
                                    rotateResultTitle: title,
                                    showResult: true,
                                    rotateResultContent: (
                                        <div>
                                            {currentValue ? (
                                                <h4>
                                                    {" "}
                                                    恭喜您获得{" "}
                                                    <span className="theme-color">
                                                        {currentValue.cnName}
                                                    </span>{" "}
                                                    !
                                                </h4>
                                            ) : (
                                                <h4>
                                                    {" "}
                                                    很遗憾您的红包是空的，请再接再厉！
                                                </h4>
                                            )}
                                            <div className="result-picture">
                                                <img
                                                    src={
                                                        currentValue
                                                            ? currentValue.img
                                                            : "/vn/img/redrain_2022/prize-null.png"
                                                    }
                                                />
                                            </div>
                                            <p> 您的红包次数已用完</p>
                                            <div className="ant-modal-confirm-btns">
                                                <Button
                                                    type="primary"
                                                    block
                                                    onClick={() => {
                                                        this.showDepositModal();
                                                        Pushgtagdata(
                                                            "Deposit Nav​",
                                                            "Click",
                                                            "Deposit_CNY2022"
                                                        );
                                                    }}
                                                >
                                                    立即充值
                                                </Button>
                                            </div>
                                        </div>
                                    ),
                                });
                                break;
                            case 1:
                            case 5:
                                this.setState({
                                    rotateResultTitle: title,
                                    showResult: true,
                                    rotateResultContent: (
                                        <div>
                                            {currentValue ? (
                                                <h4>
                                                    {" "}
                                                    恭喜您获得{" "}
                                                    <span className="theme-color">
                                                        {currentValue.cnName}
                                                    </span>{" "}
                                                    !
                                                </h4>
                                            ) : (
                                                <h4>
                                                    {" "}
                                                    很遗憾您的红包是空的，
                                                    <br />
                                                    明天请再接再厉吧！
                                                </h4>
                                            )}
                                            <div className="result-picture">
                                                <img
                                                    src={
                                                        currentValue
                                                            ? currentValue.img
                                                            : "/vn/img/redrain_2022/prize-null.png"
                                                    }
                                                />
                                            </div>
                                            {/* 红包为空无需提示此内容，特此判定 */}
                                            {currentValue ? (
                                                <p>
                                                    {" "}
                                                    您今天的红包次数已用完，{" "}
                                                    <br />
                                                    请明天再续好运！
                                                </p>
                                            ) : null}
                                            <div className="ant-modal-confirm-btns">
                                                <Button
                                                    type="primary"
                                                    block
                                                    onClick={() => {
                                                        this.setState({
                                                            showResult: false,
                                                        });
                                                    }}
                                                >
                                                    确认
                                                </Button>
                                            </div>
                                        </div>
                                    ),
                                });
                                break;
                            default:
                                message.error(res.message);
                                break;
                        }
                    } else {
                        switch (res.responseStatus) {
                            case 6:
                                Modal.info({
                                    icon: "",
                                    okText: "立即充值",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                充值 500
                                                元及以上即可开始抢红包哦~
                                            </p>
                                        </div>
                                    ),
                                    onOk: () => {
                                        Pushgtagdata(
                                            "Deposit Nav​",
                                            "Click",
                                            "Deposit_CNY2022"
                                        );
                                        this.showDepositModal();
                                    },
                                });
                                break;
                            case 14:
                                Modal.info({
                                    icon: "",
                                    okText: "立即充值",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                您今天还未达到充值要求，
                                                <br />
                                                请您立即充值
                                            </p>
                                        </div>
                                    ),
                                    onOk: () => {
                                        Pushgtagdata(
                                            "Deposit Nav​",
                                            "Click",
                                            "Deposit_CNY2022"
                                        );
                                        this.showDepositModal();
                                    },
                                });
                                break;
                            case 18:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                您的充值尚未通过审核， <br />
                                                请您耐心等待。
                                            </p>
                                        </div>
                                    ),
                                });
                                break;
                            case 17:
                                Modal.info({
                                    icon: "",
                                    okText: "立即充值",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                您的累积充值不足，
                                                <br />
                                                请充值后再试吧
                                            </p>
                                        </div>
                                    ),
                                    onOk: () => {
                                        Pushgtagdata(
                                            "Deposit Nav​",
                                            "Click",
                                            "Deposit_CNY2022"
                                        );
                                        this.showDepositModal();
                                    },
                                });
                                break;
                            case 7:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                您今天的红包次数已用完， <br />
                                                请明天再续好运！
                                            </p>
                                        </div>
                                    ),
                                });
                                break;
                            case 9:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                {" "}
                                                很遗憾您的红包是空的， <br />
                                                请再接再厉吧！
                                            </p>
                                        </div>
                                    ),
                                });
                                break;
                            case 10:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>
                                                抱歉
                                                ，您的账号无法参加此次优惠，详情请联系客服
                                            </p>
                                        </div>
                                    ),
                                });
                                break;
                            case 11:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p> 活动尚未开始，敬请期待~</p>
                                        </div>
                                    ),
                                });
                                break;
                            case 19:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>活动已结束，期待明年与您相见~</p>
                                        </div>
                                    ),
                                });
                                break;
                            default:
                                Modal.info({
                                    icon: "",
                                    okText: "确认",
                                    className: "midautumn-info-dialog",
                                    title: (
                                        <div style={{ textAlign: "center" }}>
                                            温馨提示
                                        </div>
                                    ),
                                    content: (
                                        <div style={{ textAlign: "center" }}>
                                            <p>{res.message}</p>
                                        </div>
                                    ),
                                });
                                break;
                        }
                    }
                })
                .catch((error) => console.log(error));
        }
    };
    componentWillUnmount() {
        cancelAnimationFrame(this.requestAnimate);
    }
    render() {
        return (
            <React.Fragment>
                <Spin
                    className="rain-spin"
                    size="large"
                    spinning={this.state.isLoading}
                />
                <canvas id="canvas"></canvas>
                {/* 抽奖结果提示 */}
                <Modal
                    title={this.state.rotateResultTitle}
                    className={`midautumn-direction rotate-result defined-btn${
                        this.state.rotateResultTitle === "再接再厉"
                            ? " null-bag"
                            : ""
                    }`}
                    centered={true}
                    footer={false}
                    visible={this.state.showResult}
                    closeIcon={<Icon type="close-circle" />}
                    width={460}
                    onCancel={() => {
                        this.setState({ showResult: "" });
                    }}
                >
                    <div style={{ paddingTop: 22 }}>
                        {this.state.rotateResultContent}
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

export default AnvelopeMain;
