import React from "react";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { get, post } from "$ACTIONS/TlcRequest";
import { Cookie } from "$ACTIONS/helper";
import { message } from "antd";
import FpCaptcha from "./fpcaptcha";
import {translate} from "$ACTIONS/Translate";
class _Captcha extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiURL: "",
            challengeUuid: "",
            keyUri: "", //拖动的image元素
            chartUri: "", //后端返回的待拼凑图表
            shuffleMatrix: [], //拼凑顺序
            loading: false,
        };
    }
    componentDidMount() {
		this.props.getCaptchaInfo(this);
	}
    componentDidUpdate(prevProps) {
        if (
            prevProps.captchaVisible !== this.props.captchaVisible &&
            this.props.captchaVisible === true
        ) {
            this.getCaptchaChallengeId();
            global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("captcha_code",this.props.type === "Login" ? "Wrong Password 3 Times Pop Up Captcha":"Register Capcha Verification");
        }
    }
    getCaptchaInfo(name) {
		get(ApiPort.CaptchaInfo + `&username=${name}`)
			.then((data) => {
				if (data.isSuccess) {
					this.setState({
						attempts: data.result.attempts,
						apiURL: data.result.serviceUrl,
						isEnabled: data.result.isEnabled //是否开启了 滑动验证
					});
				}
			})
			.catch((error) => {
				message.error(translate('网络错误，请重试'));
				console.log(error);
			});
	}
    /**
     * 获取Uuid,这个Uuid是验证中用到的唯一Key
     */
    getCaptchaChallengeId = () => {
        const data = {
            captchaType: "SLIDE",
            applicationLanguage: "vi",
            siteId: 40,
        };
        this.setState({ loading: true });
        post(ApiPort.RequestCaptchaChallengeId, data)
            .then((res) => {
                if (res.isSuccess) {
                    this.setState({
                        challengeUuid: res.challengeUuid,
                    });
                    this.getFpCaptcha(this.state.apiURL, res.result.challengeUuId);
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
            });
    };
    /**
     * 获取初始的验证图形
     * @param {*} url
     * @param {*} id
     */
    getFpCaptcha = (url, id) => {
        const data = {
            applicationLanguage: "vi",
            device: {},
        };
        post(url + "/api/v1.0/challenge/" + id, data)
            .then((res) => {
                if (res) {
                    if (
                        ["10001", "10002", "11001"].includes(String(res.code))
                    ) {
                        this.setState({
                            challengeUuid: res.challengeUuid,
                            keyUri: res.keyUri,
                            chartUri: res.chartUri,
                            shuffleMatrix: res.shuffleMatrix,
                        });
                    } else {
                        //63301:超过可换图次数  63302:Challenge過期或不存在（验证逾时）
                        this.getCaptchaChallengeId();
                    }
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
            });
    };
    //判断坐标正确
    judgement = ({ x, y, cost }, callback) => {
        const { apiURL, challengeUuid } = this.state;
        const data = {
            challengeUuid: challengeUuid,
            activity: {
                answers: { x: x, y: y },
                cost: cost,
            },
            applicationLanguage: "vi",
            device: {},
        };
        this.setState({ loading: true });
        post(apiURL + "/api/v1.0/judgement", data)
            .then((res) => {
                if (res) {
                    typeof callback === "function" && callback(res.code);
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                console.log("坐标:", error.message);
                this.setState({ loading: false });
                typeof callback === "function" && callback(error.code);
            });
    };
    onReload = () => {
        //刷新加载img
        const { apiURL, challengeUuid } = this.state;
        let data = {
            applicationLanguage: "vi",
            device: {},
        };
        this.setState({ loading: true });
        post(apiURL + "/api/v1.0/chart/" + challengeUuid, data)
            .then((res) => {
                if (["10001", "10002", "11001"].includes(String(res.code))) {
                    this.setState({
                        chartUri: res.chartUri,
                        keyUri: res.keyUri,
                        shuffleMatrix: res.shuffleMatrix,
                    });
                } else {
                    //63301:超过可换图次数  63302:Challenge過期或不存在（验证逾时）
                    this.getCaptchaChallengeId();
                }
            })
            .catch((error) => {
                message.error(translate("网络错误，请重试"));
                this.getCaptchaChallengeId();
            }).finally(()=>{
                this.setState({ loading: false });
            })
    };
    onclosed = (id) => {
        this.props.onMatch(id);
        this.props.setCaptchaVisible(false);
    };

    render() {
        const { keyUri, chartUri, shuffleMatrix, challengeUuid, loading } =
            this.state;
        const { captchaVisible } = this.props;
        return (
            <React.Fragment>
                <FpCaptcha
                    visible={captchaVisible}
                    setVisible={this.props.setCaptchaVisible}
                    keyUri={keyUri}
                    chartUri={chartUri}
                    shuffleMatrix={shuffleMatrix}
                    challengeUuid={challengeUuid}
                    judgement={this.judgement}
                    onMatch={this.onclosed}
                    onReload={this.onReload}
                    loading={this.state.loading}
                    setLoading={(v) => {
                        this.setState({ loading: v });
                    }}
                />
            </React.Fragment>
        );
    }
}

export default _Captcha;
