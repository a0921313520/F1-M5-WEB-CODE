import React from "react";
import { Button, Icon, Modal, message } from "antd";
import { post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Cookie, formatSeconds } from "$ACTIONS/util";
import { translate } from "$ACTIONS/Translate";
class CreateSecurityCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isStillValid: false, //Code是否還在有效期限
            created: "",
            expiredDateTime: "00:00",
            isInit: true, // 是否是第一次进入
            codeStatus: "", // failed or copied
            isAbleCreateCode: true, //是否能創建安全碼
        };

        this.cookieInterval = "=-=-=";
        this.timeTimer = null;
        this.copyTimer = null;
        this.getSecurityCode = this.getSecurityCode.bind(this);
        this.copyEvent = this.copyEvent.bind(this);
        this.isRecords = this.isRecords.bind(this);
    }
    componentDidMount() {
        this.isRecords();
        this.props.setLoading(false);
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.memberInfo.memberCode !==
                this.props.memberInfo.memberCode &&
            this.props.memberInfo.memberCode
        ) {
            this.isRecords();
        }
    }
    componentWillUnmount() {
        clearTimeout(this.copyTimer);
        clearTimeout(this.timeTimer);
    }
    isRecords() {
        const memberCode =
            this.props.memberInfo && this.props.memberInfo.memberCode;
        if (memberCode) {
            const securityCodeUUID = Cookie(memberCode);

            if (securityCodeUUID) {
                const securityCodeUUIDArr = securityCodeUUID.split(
                    this.cookieInterval,
                );
                this.setState({
                    isInit: false,
                    created: securityCodeUUIDArr[0],
                    expiredDateTime: securityCodeUUIDArr[1],
                });
                this.startCountDown(securityCodeUUIDArr[1]);
            }
        }
    }
    copyEvent() {
        if (this.state.codeStatus === "failed") {
            return;
        }
        this.setState({ codeStatus: "copied" });
        this.copyTimer = setTimeout(() => {
            this.setState({ codeStatus: "" });
        }, 1500);
        Pushgtagdata("Copy_passcode_profilepage");
    }

    getSecurityCode(isNew) {
        const memberCode =
            this.props.memberInfo && this.props.memberInfo.memberCode;
        if (memberCode) {
            this.props.setLoading(true);
            post(ApiPort.GetSecurityCode).then((data) => {
                this.props.setLoading(false);
                if (data) {
                    if (data?.result?.passcode) {
                        this.setState({
                            isInit: false,
                            created: data.result.passcode,
                            codeStatus: "",
                            isAbleCreateCode: true,
                        });
                        const backTimeCount =
                            new Date(data.result.expiredDateTime).getTime() /
                            1000;
                        Cookie(
                            memberCode,
                            data.result.passcode +
                                this.cookieInterval +
                                backTimeCount,
                            { expires: 20 },
                        );
                        this.startCountDown(backTimeCount);
                    } else {
                        // Generate passcode failed.
                        if (
                            !data ||
                            data?.errors[0]?.errorCode === "VERI9999"
                        ) {
                            this.setState({ isAbleCreateCode: false });
                        }
                    }
                } else {
                    this.setState({ isAbleCreateCode: false });
                }
            });
        } else {
            message.error(translate("系统错误，请联系在线支持！"));
        }

        Pushgtagdata(
            "Verification",
            "Click",
            isNew ? "Regenerate_Passcode" : "Generate_Passcode",
        );
    }
    /**
     * 开启倒计时（memberInfo 获取成功之后才可调用）
     * @param {string} time 已记录的getTIme();
     */
    startCountDown(time) {
        clearInterval(this.timeTimer);
        this.setState({ expiredDateTime: "00:00" });
        let lastSeconds = time - new Date().getTime() / 1000;
        if (lastSeconds && lastSeconds > 0) {
            if (lastSeconds >= 297 && lastSeconds <= 300) {
                this.setState({ isStillValid: false });
            } else {
                this.setState({ isStillValid: true });
            }
            this.timeTimer = setInterval(() => {
                if (lastSeconds <= 0) {
                    Cookie(this.props.memberInfo.memberCode, "failed");
                    clearInterval(this.timeTimer);
                    this.setState({
                        created: "",
                        codeStatus: "failed",
                        isStillValid: false,
                    });
                }
                this.setState({
                    expiredDateTime: formatSeconds(lastSeconds--),
                });
            }, 1000);
        } else {
            Cookie(this.props.memberInfo.memberCode, "failed");
            this.setState({
                created: "",
                codeStatus: "failed",
            });
        }
    }
    render() {
        const { created, isInit, codeStatus, isAbleCreateCode, isStillValid } =
            this.state;
        return (
            <div className="account-wrap">
                <h2>{translate("创建安全码")}</h2>
                <div className="security-code-wrap">
                    <p>
                        {translate(
                            "需要取消促销、流水、输赢投注或自我禁入设置吗？ 请点击生成安全代码并将该代码提供给部门",
                        )}
                        <Button
                            type="link"
                            className="inline"
                            style={{ color: "#00A6FF" }}
                            onClick={() => {
                                global.PopUpLiveChat();
                                Pushgtagdata("Contactcs_passcode_profilepage");
                            }}
                        >
                            {translate("在线聊天")}
                        </Button>
                        。
                    </p>
                    {!isInit ? (
                        <div className="security-realm border">
                            <div className="create-code-wrap">
                                {(codeStatus === "" ||
                                    codeStatus === "copied") && (
                                    <>
                                        <div className="code-box">
                                            {codeStatus === "copied" && (
                                                <div className="copy-result-box">
                                                    <img
                                                        src={`${process.env.BASE_PATH}/img/icons/icon-checked.png`}
                                                    />
                                                    <p>
                                                        {translate("复制成功")}
                                                    </p>
                                                </div>
                                            )}
                                            <div
                                                className={`security-code ${this.state.codeStatus}`}
                                            >
                                                {[...created].map((l, i) => (
                                                    <span
                                                        key={i}
                                                        className="code-letter theme-color"
                                                    >
                                                        {l}
                                                    </span>
                                                ))}
                                            </div>
                                            <CopyToClipboard
                                                text={created}
                                                onCopy={this.copyEvent}
                                            >
                                                <button className="btn-copy">
                                                    <img
                                                        src={`${process.env.BASE_PATH}/img/icons/copy.png`}
                                                    />
                                                </button>
                                            </CopyToClipboard>
                                        </div>
                                        <p className="countdown-message">
                                            {translate(
                                                "安全码将在以下时间内过期",
                                            )}
                                            <strong
                                                style={{ color: "#EE0001" }}
                                            >
                                                {this.state.expiredDateTime}
                                            </strong>
                                            {translate("分钟")}
                                        </p>
                                    </>
                                )}
                                {codeStatus === "failed" && (
                                    <div className="expired-reminder-box">
                                        <img
                                            src={`${process.env.BASE_PATH}/img/icons/failed-filled.png`}
                                        />
                                        <p>{translate("安全码已过期")}</p>
                                    </div>
                                )}

                                <div className="line-distance" />
                                {isStillValid && (
                                    <div className="still-valid-text">
                                        {translate(
                                            "该安全码仍然可以使用。 请使用此安全码或等待超时生成新的安全码。",
                                        )}
                                    </div>
                                )}

                                <Button
                                    size="large"
                                    type="primary"
                                    className="btn-create-code"
                                    disabled={codeStatus !== "failed"}
                                    onClick={() => {
                                        this.getSecurityCode(true);
                                    }}
                                >
                                    {translate("创建安全码")}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            size="large"
                            type="primary"
                            className="security-code-btn"
                            onClick={() => {
                                this.getSecurityCode();
                            }}
                        >
                            {translate("创建安全码")}
                        </Button>
                    )}
                </div>
                {!isAbleCreateCode && (
                    <Modal
                        className="security-code-reminder-modal"
                        title={translate("注意")}
                        okText={translate("在线客服")}
                        width={316}
                        style={{ top: 280, left: 120 }}
                        cancelButtonProps={{ style: { display: "none" } }}
                        visible={!isAbleCreateCode}
                        onOk={() => {
                            global.PopUpLiveChat();
                        }}
                        onCancel={() => {
                            this.setState({ isAbleCreateCode: true });
                        }}
                    >
                        <>
                            <img
                                src={`${process.env.BASE_PATH}/img/icons/icon-warn.svg`}
                            />
                            <span className="sub-title">
                                {translate("安全代码生成失败")}
                            </span>
                            <p>
                                {translate(
                                    "不幸的是，我们目前无法生成安全代码。 请稍后重试或联系在线聊天寻求帮助。",
                                )}
                            </p>
                        </>
                    </Modal>
                )}
            </div>
        );
    }
}

export default CreateSecurityCode;
