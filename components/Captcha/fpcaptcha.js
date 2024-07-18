import React from "react";
import { message, Modal, Spin } from "antd";
import moment from "moment";
import { translate } from "$ACTIONS/Translate";
const STATUS_LOADING = 0; // 还没有图片
const STATUS_READY = 1; // 图片渲染完成,可以开始滑动
const STATUS_MATCH = 2; // 图片位置匹配成功
const STATUS_ERROR = 3; // 图片位置匹配失败
// 278 * 285
class _FpCaptcha extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: "",
            showInfo: false,
            isMovable: false,
            startX: 0, // 开始滑动的 x
            startY: 0, // 开始滑动的 y
            currX: 0, //当前的 x
            currY: 0, // 当前的 y
            status: STATUS_LOADING,
            verifyStatue: "0", //(0:未验证,1:验证成功，2:验证失败)
        };
        this.canvas = null;
        this.ctx = null;
        this.img = null;
        this.options = {
            col: 10,
            row: 2,
            chartUri: "",
            shuffleMatrix: [],
        };
        this.allowRefresh = true;
    }

    componentDidUpdate(prevProps) {
        if (
            !!this.props.chartUri &&
            prevProps.chartUri !== this.props.chartUri
        ) {
            this.setState(
                {
                    chartUri: this.props.chartUri,
                    keyUri: this.props.keyUri,
                    shuffleMatrix: this.props.shuffleMatrix,
                },
                () => {
                    let { chartUri, keyUri, shuffleMatrix } = this.state;
                    this.createCanvas();
                    this.renderImage({ chartUri, keyUri, shuffleMatrix });
                },
            );
        }
        if (prevProps.visible !== this.props.visible && !this.props.visible) {
            this.onReset();
        }
    }
    //创建canvas
    createCanvas() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = "300";
        this.canvas.height = "150";
    }
    async renderImage(options) {
        this.options = { ...this.options, ...options };
        try {
            await this.loadImage();
            this.splitImg();
        } catch (e) {
            console.log(e);
        }
    }
    loadImage = () => {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.crossOrigin = "";
            image.src = this.options.chartUri;
            image.onload = (e) => {
                this.img = image;
                resolve(e);
            };
            image.onerror = (e) => {
                reject(e);
            };
        });
    };
    splitImg() {
        // 切割图片
        let list = [];
        for (let y = 0; y < this.options.row; y++) {
            for (let x = 0; x < this.options.col; x++) {
                let simpleWidth = parseInt(this.img.width / this.options.col);
                let simpleHeight = parseInt(this.img.height / this.options.row);
                list.push({
                    x: x * simpleWidth,
                    y: y * simpleHeight,
                    width: simpleWidth,
                    height: simpleHeight,
                });
            }
        }
        let sortList = this.sortList(list);
        this.setImgBase64(sortList);
    }
    sortList(list) {
        // 图片排序
        list.forEach((element, i) => {
            element.index = this.options.shuffleMatrix[i];
        });
        let newlist = list.sort((param1, param2) => {
            return param1.index - param2.index;
        });
        return newlist;
    }
    async setImgBase64(list) {
        try {
            await this.drawImg(list);
            const base64 = this.canvas.toDataURL();
            this.setState({
                imgSrc: base64,
                status: STATUS_READY,
            });
            this.props.setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }
    drawImg(list) {
        // 绘制图片
        // 清空画布
        if (this.ctx) {
            this.ctx.clearRect(0, 0, 300, 150);
        }
        for (let k = 0; k < list.length; k++) {
            let object = list[k];
            let dx, dy;
            if (k > 9) {
                dx = (k - 10) * 30;
                dy = 75;
            } else {
                dx = (k - 0) * 30;
                dy = 0;
            }
            if (this.ctx) {
                this.ctx.drawImage(
                    this.img,
                    object.x,
                    object.y,
                    object.width,
                    object.height,
                    dx,
                    dy,
                    object.width,
                    object.height,
                );
            }
        }
    }
    onMouseDownEvent = (e) => {
        let that = this;
        if (that.state.status !== STATUS_READY) {
            return;
        }
        let target = document.getElementById("moveElement");
        // 记录滑动开始时的绝对坐标x，y
        let clientX = e.clientX;
        let clientY = e.clientY;
        const startTime = moment();
        that.setState(
            {
                isMovable: true,
                startX: clientX,
                startY: clientY,
                startTime: startTime,
            },
            () => {
                document.onmousemove = function (e) {
                    e.preventDefault();
                    if (
                        that.state.status !== STATUS_READY ||
                        !that.state.isMovable
                    ) {
                        return;
                    }
                    let clientX = e.clientX;
                    let clientY = e.clientY;
                    const distanceX = clientX - that.state.startX;
                    let currX = distanceX;

                    const distanceY = clientY - that.state.startY;
                    let currY = distanceY;

                    const minX = 0;
                    const minY = 0;
                    const maxX = 300 - 60;
                    const maxY = 150 - 60;

                    currX = currX < minX ? 0 : currX > maxX ? maxX : currX;

                    currY = currY < minY ? 0 : currY > maxY ? maxY : currY;

                    that.setState({ currX, currY }, () => {
                        target.onmouseup = function () {
                            e.preventDefault();
                            if (
                                that.state.status !== STATUS_READY ||
                                !that.state.isMovable
                            ) {
                                return;
                            }
                            let { startTime } = that.state;
                            const nowTime = moment();
                            const cost =
                                new Date(nowTime).getTime() -
                                new Date(startTime).getTime(); //滑动用的时间
                            // 将旧的固定坐标x更新
                            that.setState({
                                isMovable: false,
                            });
                            document.onmousemove = null;
                            target.onmouseup = null;
                            that.props.judgement(
                                {
                                    x: that.state.currX,
                                    y: that.state.currY,
                                    cost: cost,
                                },
                                that.judgeResult,
                            );
                        };
                    });
                };
            },
        );
    };
    judgeResult = (code) => {
        if (["10001", "10002", "11001"].includes(String(code))) {
            this.setState({ verifyStatue: "1" });
            setTimeout(() => {
                this.props.onMatch(this.props.challengeUuid);
                this.setState({ verifyStatue: "0" });
            }, 3000);
        } else {
            this.setState({ verifyStatue: "2" });
            const timer = setTimeout(() => {
                this.allowRefresh = false;
                this.resetPosition();
                if (code == "63403") {
                    //超过解答上限
                    this.props.onReload();
                }
                clearTimeout(timer);
            }, 3000);
        }
    };
    resetPosition = () => {
        this.setState({
            currX: 0,
            currY: 0,
            status: STATUS_READY,
            verifyStatue: "0",
        });
    };
    onRefresh = () => {
        if (this.allowRefresh == false) {
            //防惡意刷新
            message.error(translate("操作过于频繁，请稍后再试。"), 3);
            setTimeout(() => {
                this.allowRefresh = true;
            }, 3000);
            return;
        }
        this.allowRefresh = false;
        this.onReset();
        this.props.onReload();
    };
    onReset = () => {
        this.canvas = null;
        this.ctx = null;
        this.img = null;
        this.setState({
            imgSrc: "",
            isMovable: false,
            startX: 0,
            startY: 0, // 开始滑动的 x
            currX: 0, // 滑块当前 x,
            currY: 0, // 滑块当前 x,
            status: STATUS_LOADING,
        });
    };
    onShowInfo = () => {
        this.setState({ showInfo: !this.state.showInfo });
    };
    render() {
        const { imgSrc, showInfo, verifyStatue, keyUri } = this.state;
        const { visible, loading } = this.props;
        return (
            <React.Fragment>
                <Modal
                    width={332}
                    footer={null}
                    visible={visible}
                    maskClosable={false}
                    centered={true}
                    onCancel={() => {
                        this.props.setVisible(false);
                    }}
                    className="fpcaptch-modal"
                    zIndex={2002}
                >
                    <Spin
                        spinning={loading && !imgSrc}
                        tip={translate("加载中")}
                    >
                        <div className="fpcontent">
                            {/* <p>请拖动左边的滑块，来完成拼图</p> */}
                            <div
                                className="fpSection"
                                style={{
                                    background: imgSrc
                                        ? `url(${imgSrc}) no-repeat`
                                        : "#eee",
                                }}
                            >
                                <div
                                    className="moveElement"
                                    id="moveElement"
                                    style={{
                                        background:
                                            imgSrc && keyUri
                                                ? `url(${keyUri}) no-repeat`
                                                : "#eee",
                                        left: this.state.currX + "px",
                                        top: this.state.currY + "px",
                                    }}
                                    onMouseDown={(e) =>
                                        this.onMouseDownEvent(e)
                                    }
                                ></div>
                                {/* <div
                                    className="info"
                                    style={{
                                        display: showInfo ? "block" : "none",
                                    }}
                                >
                                    <img
                                        src={`${process.env.BASE_PATH}/img/icons/icon-closed.png`}
                                        onClick={this.onShowInfo}
                                    />
                                    <p>
                                        按住拼图滑块不放，并向右拖动，将图中小方块拖到缺口位置进行拼合；拼图完成后松手，即可通过验证。
                                    </p>
                                </div> */}
                            </div>
                            {/* <div
                                className="verifySuccess"
                                style={{
                                    display:
                                        verifyStatue === "1"
                                            ? "block"
                                            : "none",
                                }}
                            >
                                <img src={`${process.env.BASE_PATH}/img/icons/success.png`} />
                                <span>验证成功</span>
                            </div> */}
                            <div
                                className="verifyFail"
                                style={{
                                    display:
                                        verifyStatue === "2" ? "block" : "none",
                                }}
                            >
                                {/* <img src={`${process.env.BASE_PATH}/img/icons/fail.png`} /> */}
                                <span>{translate("失败。 请再试一次")}</span>
                            </div>
                            <div className="fpFooter">
                                <img
                                    src={`${process.env.BASE_PATH}/img/icons/icon-refresh.svg`}
                                    onClick={this.onRefresh}
                                />
                                <img
                                    src={`${process.env.BASE_PATH}/img/icons/icon-info.svg`}
                                    onClick={this.onShowInfo}
                                />
                            </div>
                        </div>
                    </Spin>
                </Modal>
            </React.Fragment>
        );
    }
}

export default _FpCaptcha;
