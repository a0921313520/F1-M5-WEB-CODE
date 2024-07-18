import React from "react";
import Layout from "@/Layout";
import { Input, Radio, message, Spin, Select, Modal } from "antd";
import { get, put } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import Router from "next/router";
const { Option } = Select;
import { translate } from "$ACTIONS/Translate";
import moment from "moment";
import { getStaticPropsFromStrapiSEOSetting } from "$DATA/seo";
export async function getStaticProps() {
    return await getStaticPropsFromStrapiSEOSetting("/me/self-exclusion"); //參數帶本頁的路徑
}

const _number = /[^\d]/g;

export default class Selfexclusion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            RadioStatusset: translate("请选择时间限制"),
            loading: false,
            BetLimit: 0,
            limitAmountInputIsEnable: false,
            // 點擊確定 提交後該確定紐會隱藏
            SubmitIsDisabled: false,
            SubmitBtnIsDisabled: true,
            initialCheck: true,
        };
    }
    componentDidMount() {
        let teststatus = !localStorage.getItem("access_token");
        if (teststatus) {
            Router.push("/");
            setTimeout(() => {
                global.goUserSign("1");
            }, 500);
            return;
        }
        this.SelfExclusions();
    }

    ChangeStatus(type, e) {
        if (e) {
            if (type == "Radio") {
                if (e == 0) {
                    this.setState({
                        RadioStatusset: e,
                        SubmitBtnIsDisabled: true,
                    });
                } else {
                    this.setState({
                        RadioStatusset: e,
                        SubmitBtnIsDisabled: false,
                    });
                }
            } else {
                if (e.target.value.length === 0) {
                    this.setState({
                        BetLimit: "",
                        SubmitBtnIsDisabled: true,
                    });
                }

                if (
                    e.target.value.length !== 0 &&
                    !_number.test(e.target.value)
                ) {
                    // check if value is number string
                    const updatedNum = e.target.value.replace(_number, "&"); // turn invalid word to &
                    const updatedNumIsInvalid = updatedNum.indexOf("&") !== -1; // double check if input is invalid

                    if (updatedNumIsInvalid) {
                        this.setState({
                            BetLimit: "",
                            SubmitBtnIsDisabled: true,
                        });
                    } else {
                        this.setState({
                            BetLimit: e.target.value
                                .toString()
                                .replace(/[^\d]/g, ""),
                            SubmitBtnIsDisabled: false,
                        });
                    }
                } else {
                    this.setState({
                        BetLimit: "",
                        SubmitBtnIsDisabled: true,
                    });
                }
            }
        }
    }

    SelfExclusions() {
        get(ApiPort.GETSelfExclusions).then((res) => {
            if (res && res.result) {
                const {
                    transferLimit,
                    transferLimitDayRange,
                    selfExcludeDuration,
                    status,
                } = res.result;
                if (!status) {
                    return;
                }
                if (selfExcludeDuration === 0) {
                    //  Check for limited amount
                    this.setState({
                        BetLimit: transferLimit,
                        SubmitIsDisabled:
                            transferLimit || transferLimitDayRange !== 0
                                ? true
                                : false,
                        limitAmountInputIsEnable: transferLimit ? true : false,
                        initialCheck: transferLimitDayRange != 0 ? true : false,
                    });
                } else {
                    // Check for login exclusion

                    if (
                        selfExcludeDuration === 99999 &&
                        transferLimitDayRange === -1
                    ) {
                        // Permanent exclusion has been set
                        this.setState({
                            RadioStatusset: -1,
                            SubmitIsDisabled: true,
                        });
                        return;
                    }

                    this.setState({
                        RadioStatusset: selfExcludeDuration,
                        SubmitIsDisabled:
                            transferLimit || transferLimitDayRange !== 0
                                ? true
                                : false,
                    });
                }
            }
        });
    }

    SetSelfExclusions() {
        const { RadioStatusset, BetLimit } = this.state;

        // if (RadioStatusset === translate("请选择时间限制") && BetLimit.length === 0) {
        //     Modal.info({
        //         className: "confirm-modal-of-forgetuser",
        //         icon: <div />,
        //         title: translate("自我限制​"),
        //         centered: true,
        //         okText: translate("知道了"),
        //         zIndex: 2000,
        //         content: (
        //             <div
        //                 style={{
        //                     textAlign: "center",
        //                 }}
        //                 dangerouslySetInnerHTML={{
        //                     __html: "金额格式错误",
        //                 }}
        //             />
        //         ),
        //     });
        //     return;
        // }

        // if (BetLimit && Number(BetLimit) > 99999) {
        //     Modal.info({
        //         className: "confirm-modal-of-forgetuser",
        //         icon: <div />,
        //         title: translate("自我限制​"),
        //         centered: true,
        //         okText: translate("知道了"),
        //         zIndex: 2000,
        //         content: (
        //             <div
        //                 style={{
        //                     textAlign: "center",
        //                 }}
        //                 dangerouslySetInnerHTML={{
        //                     __html: "最大金额不能超过99999",
        //                 }}
        //             />
        //         ),
        //     });
        //     return;
        // }

        let setting;
        if (RadioStatusset == translate("请选择时间限制")) {
            setting = "NotAvailable";
        } else if (RadioStatusset == "7") {
            setting = "SevenDays";
        } else if (RadioStatusset == "90") {
            setting = "NinetyDays";
        } else if (RadioStatusset == "-1") {
            setting = "Permanent";
        }

        this.setState({
            loading: true,
        });
        const MemberData = {
            setting: setting,
            isEnabled: setting === "NotAvailable" ? false : true,
            limitAmount: parseInt(BetLimit),
            betLimitDayRange:
                RadioStatusset !== translate("请选择时间限制")
                    ? RadioStatusset
                    : "0",
        };
        let text;
        if (RadioStatusset == "-1") {
            text = (
                <p>
                    {translate("您已成功将自我禁入（永久）设置为") +
                        " " +
                        moment().format("DD/MM/YYYY") +
                        " " +
                        translate("如果您需要任何帮助，请联系")}
                    <span
                        style={{
                            color: "#00A6FF",
                            cursor: "pointer",
                            padding: "0 5px",
                        }}
                        onClick={() => {
                            global.PopUpLiveChat();
                        }}
                    >
                        {translate("在线客服")}
                    </span>
                </p>
            );
        } else if (RadioStatusset == "7" || RadioStatusset == "90") {
            text = (
                <p>
                    {translate("您已成功设置自我禁入") +
                        RadioStatusset +
                        translate("天时间") +
                        " " +
                        moment().format("DD/MM/YYYY") +
                        " " +
                        translate("如果您需要任何帮助，请联系")}
                    <span
                        style={{
                            color: "#00A6FF",
                            cursor: "pointer",
                            padding: "0 5px",
                        }}
                        onClick={() => {
                            global.PopUpLiveChat();
                        }}
                    >
                        {translate("在线客服")}
                    </span>
                </p>
            );
        }
        const DAYS = ["-1", "7", "90"];
        put(ApiPort.PUTSelfExclusions, MemberData).then((res) => {
            this.setState({
                loading: false,
            });

            if (res && res.isSuccess) {
                Modal.info({
                    className: "confirm-modal-of-forgetuser",
                    icon: <div />,
                    title: translate("自我限制​"),
                    centered: true,
                    okText: translate("知道了"),
                    zIndex: 2000,
                    content: (
                        <div
                            style={{
                                textAlign: "left",
                            }}
                        >
                            {DAYS.some((day) => day == RadioStatusset)
                                ? text
                                : translate("成功")}
                        </div>
                    ),
                });
                // 點擊確定 提交後該確定紐會隱藏 待時間到或是客服手動解開才能再次設置
                this.setState({
                    SubmitIsDisabled: true,
                });
                this.SelfExclusions();
            } else {
                Modal.info({
                    className: "confirm-modal-of-forgetuser",
                    icon: <div />,
                    title: translate("自我限制​"),
                    centered: true,
                    okText: translate("知道了"),
                    zIndex: 2000,
                    content: (
                        <div
                            style={{
                                textAlign: "center",
                            }}
                            dangerouslySetInnerHTML={{
                                __html: translate("失败"),
                            }}
                        />
                    ),
                });
            }
        });
        Pushgtagdata("Confirm_selfexclusion_more");
    }

    render() {
        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                status={1}
                seoData={this.props.seoData}
            >
                <Spin spinning={this.state.loading} tip={translate("加载中")}>
                    <div className="common-distance-wrap">
                        <div className="common-distance Selfexclusion-content">
                            <div className="txtbox">
                                <h3>{translate("自我限制")}</h3>
                                <p>
                                    {translate(
                                        "如果您觉得自己很难控制赌博，您可能应该戒赌 7 天或 3 个月。 您可以联系我们的客户服务寻求支持和建议。",
                                    )}
                                </p>
                            </div>
                            <div className="form-submit">
                                <div className="l">
                                    <label>
                                        <input
                                            type="radio"
                                            checked={
                                                this.state
                                                    .limitAmountInputIsEnable
                                            }
                                            onChange={() => {
                                                this.setState({
                                                    limitAmountInputIsEnable: true,
                                                    initialCheck: false,
                                                    SubmitBtnIsDisabled: true,
                                                });

                                                if (
                                                    !this.state.SubmitIsDisabled
                                                ) {
                                                    this.setState({
                                                        RadioStatusset:
                                                            translate(
                                                                "请选择时间限制",
                                                            ),
                                                    });
                                                }
                                            }}
                                        />{" "}
                                        {translate("转账金额限制")}
                                    </label>
                                    <Input
                                        maxLength={50}
                                        placeholder={translate(
                                            "请输入您的转账限额",
                                        )}
                                        value={
                                            this.state.BetLimit !== 0
                                                ? this.state.BetLimit
                                                : ""
                                        }
                                        onChange={(e) =>
                                            this.ChangeStatus("Number", e)
                                        }
                                        style={{ width: 316, height: 45 }}
                                        onFocus={() => {
                                            this.setState({
                                                limitAmountInputIsEnable: true,
                                                initialCheck: false,
                                            });
                                        }}
                                        onBlur={() => {
                                            Pushgtagdata(
                                                "Amount_selfexclusion_more",
                                            );
                                        }}
                                        disabled={
                                            this.state.SubmitIsDisabled
                                                ? true
                                                : this.state.initialCheck
                                                  ? false
                                                  : this.state
                                                          .limitAmountInputIsEnable
                                                    ? false
                                                    : true
                                        }
                                    />
                                    <span
                                        className="red"
                                        style={
                                            !this.state
                                                .limitAmountInputIsEnable &&
                                            !this.state.initialCheck
                                                ? { color: "#BCBEC3" }
                                                : {}
                                        }
                                    >
                                        {translate(
                                            "注：您7天内转账的总金额将以您填写的金额为准。",
                                        )}
                                    </span>
                                </div>
                                <div className="c">
                                    <label>
                                        <input
                                            type="radio"
                                            checked={
                                                this.state.initialCheck
                                                    ? false
                                                    : !this.state
                                                          .limitAmountInputIsEnable
                                            }
                                            onChange={() => {
                                                this.setState({
                                                    limitAmountInputIsEnable: false,
                                                    initialCheck: false,
                                                    SubmitBtnIsDisabled: true,
                                                });

                                                if (
                                                    !this.state.SubmitIsDisabled
                                                ) {
                                                    this.setState({
                                                        BetLimit: "",
                                                    });
                                                }
                                            }}
                                        />{" "}
                                        {translate("登录限制")}
                                    </label>
                                    <Select
                                        className="selfExclusion-selectDays"
                                        suffixIcon={
                                            <img
                                                src={`${process.env.BASE_PATH}/img/selfexclusion/icon.svg`}
                                            />
                                        }
                                        style={{ width: 316 }}
                                        placeholder={translate(
                                            "请选择时间限制",
                                        )}
                                        value={this.state.RadioStatusset}
                                        dropdownClassName="selfExclusion-selectDays-dropdown"
                                        dropdownStyle={{ borderRadius: 8 }}
                                        dropdownMenuStyle={{
                                            padding: 0,
                                            borderRadius: 8,
                                        }}
                                        disabled={
                                            this.state.SubmitIsDisabled
                                                ? true
                                                : this.state.initialCheck
                                                  ? false
                                                  : this.state
                                                          .limitAmountInputIsEnable
                                                    ? true
                                                    : false
                                        }
                                        onFocus={() => {
                                            this.setState({
                                                initialCheck: false,
                                                limitAmountInputIsEnable: false,
                                            });
                                        }}
                                        onChange={(e) => {
                                            this.ChangeStatus("Radio", e);
                                            switch (e) {
                                                case 7:
                                                    Pushgtagdata(
                                                        "7days_selfexclusion_more",
                                                    );
                                                    break;
                                                case 90:
                                                    Pushgtagdata(
                                                        "90days_selfexclusion_more",
                                                    );
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }}
                                    >
                                        <Option value={7}>
                                            {translate("未来 7 天内自我限制")}
                                        </Option>
                                        <Option value={90}>
                                            {translate("未来 90 天内自我限制")}
                                        </Option>
                                        <Option value={-1}>
                                            {translate("永久自我限制")}
                                        </Option>
                                    </Select>
                                    {/* <Radio.Group
										onChange={(e) => {
											this.ChangeStatus('Radio', e);
											switch (e.target.value) {
												case 0:
													Pushgtagdata('None_selfexclusion_more');
													break;
												case 7:
													Pushgtagdata('7days_selfexclusion_more');
													break;
												case 90:
													Pushgtagdata('90days_selfexclusion_more');
													break;
												default:
													break;
											}
										}}
										value={this.state.RadioStatusset}
										disabled={this.state.IsEnable}
									>
										<Radio value={0}>无</Radio>
										<Radio value={7}>7天</Radio>
										<Radio value={90}>90天</Radio>
									</Radio.Group> */}
                                    <span
                                        className="red"
                                        style={
                                            this.state
                                                .limitAmountInputIsEnable &&
                                            !this.state.initialCheck
                                                ? { color: "#BCBEC3" }
                                                : {}
                                        }
                                    >
                                        {translate(
                                            "一旦开通，您将无法在所选时间内充值、转账和玩游戏。",
                                        )}
                                    </span>
                                </div>

                                <div className="r">
                                    <button
                                        disabled={
                                            this.state.SubmitBtnIsDisabled
                                        }
                                        onClick={() => {
                                            this.SetSelfExclusions();
                                        }}
                                        style={{
                                            display: this.state.SubmitIsDisabled
                                                ? "none"
                                                : "block",
                                        }}
                                    >
                                        {translate("保存")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            </Layout>
        );
    }
}
