import React from "react";
import dynamic from "next/dynamic";
import Layout from "@/Layout";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import EmailVerify from "@/Verification/EmailVerify";
import PhoneVerify from "@/Verification/PhoneVerify";
import { formatAmount } from "$ACTIONS/util";
import { Button, Icon, Spin, message,Modal } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getMemberInfo } from "$DATA/userinfo";
import QRCode from "qrcode-react";
import moment from "moment";
import { translate } from "$ACTIONS/Translate";
import { getStaticPropsFromStrapiSEOSetting } from '$DATA/seo';
export async function getStaticProps() {
    return await getStaticPropsFromStrapiSEOSetting('/referrer-activity'); //參數帶本頁的路徑/resetpassword
}
const DynamicOtpPopUp = dynamic(import("@/Refer/OtpPopUp"), {
    ssr: false,
});
export default class IM extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailVisible: false,
            phoneVisible: false,
            otpVisible:false,
            memberInfo: {},
            isNext: false, // 是否是手机号以及邮箱都未验证
            applyStep: 1,
            referUrl: "",
            totalDeposits: 0, // 会员已存款金额
            totalBets: 0,
            infoObj: null, // 推荐人的奖励信息
            totalDepositRequired: 0, // 需要满足的最低存款金额
            totalBetAmountRequired: 0, // 需要满足的最低流水要求
            campaignRewardDetails: [],
            isLoading: false,
            referPromptInfo: "",
            startDate: "", // 活动开始时间
            isDepositMet: false,
            isBetAmountMet: false,
            isRegisteredMet: false,
            isVerificationMet: false,
            showLiJiJiaRu: true,
            attemptRemaining:5,
            emailattemptRemaining:5
        };

        this.setMemberInfo = function () { }; // HasHeader传递过来的方法（设置会员信息）
        this.addActive = this.addActive.bind(this);
        this.correctMemberInfo = this.correctMemberInfo.bind(this); // 更正会员信息
        this.ReferrerSignUp = this.ReferrerSignUp.bind(this);
        this.ReferrerRewardStatus = this.ReferrerRewardStatus.bind(this);
        this.GetQueleaActiveCampaign = this.GetQueleaActiveCampaign.bind(this);
        this.referrerEligible = this.referrerEligible.bind(this); // 获取会员是否满足条件的详情
        this.checkMemberInfo = this.checkMemberInfo.bind(this); // 检查用户是否已经加入活动，以及获取用户信息
        this.goVerified = this.goVerified.bind(this); // 立即进行邮箱与手机号验证流程
        this.autoClearPrompt = this.autoClearPrompt.bind(this);
        this.downloadCanvas = this.downloadCanvas.bind(this);
        this.qrcodeDOM = React.createRef();
    }
    componentDidMount() {
        // 查询活动信息
        this.GetQueleaActiveCampaign();
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.memberInfo.registerDate !==
            this.state.memberInfo.registerDate &&
            this.state.memberInfo.registerDate
        ) {
            // 获取用户已存款金额
            get(ApiPort.ReferrerActivity).then((data) => {
                if (data.isSuccess && data.result) {
                    this.setState({
                        totalDeposits: data.result[0].totalDeposits,
                        totalBets: data.result[0].totalBets,
                    });
                }
            });
            // 检查用户是否已经加入活动，以及获取用户信息
            this.checkMemberInfo();
            // 查询活动信息
            this.GetQueleaActiveCampaign();
            // 获取被推荐人的信息
            this.ReferrerRewardStatus();
            // 获取用户参与活动条件的详情
            this.referrerEligible();
        }
    }

    addActive() {
        Pushgtagdata("Joinnow_raf");
        this.setState({ isLoading: true });
        get(ApiPort.GetQueleaActiveCampaign).then((data) => {
            if (data?.isSuccess) {
                if (!localStorage.getItem("access_token")) {
                    global.goUserSign("1");
                } else {
                    !(JSON.stringify(this.state.memberInfo) === "{}") &&
                        this.setState({ showLiJiJiaRu: false });
                }
            } else {
                Modal.confirm({
                    className: "confirm-modal-of-public dont-show-close-button",
                    title: translate('不符合资格的账户'),
                    centered: true,
                    okText: translate('在线客服'),
                    cancelText: translate("明白了"),
                    closable:true,
                    content: <div>
                        <img src={`${process.env.BASE_PATH}/img/icons/icon-warn.svg`}/>
                        <div className="line-distance"></div>
                        <p>{translate('抱歉，您的帐户目前不符合推荐朋友计划的资格。 请尝试参与其他免费奖金或联系在线聊天寻求建议。')}</p>
                    </div>,
                    icon:null,
                    onOk: () => {
                        ContactCustomerService();
                    },
                });
            }
        }).finally(()=>{
            this.setState({ isLoading: false });
        })
    }
    ReferrerRewardStatus() {
        get(ApiPort.ReferrerRewardStatus).then((data) => {
            if (data && data.isSuccess && data.result) {
                let {
                    linkClicked,
                    memberRegistered,
                    memberDeposited,
                    firstTierRewardAmount,
                    firstTierMetCount,
                    firstTierMsg,
                    secondTierMetCount,
                    secondTierRewardAmount,
                    secondTierMsg,
                    referrerPayoutAmount,
                    firstTierRewardAmountSetting,
                    secondTierRewardAmountSetting,
                } = data.result;
                this.setState({
                    infoObj: {
                        linkClicked,
                        memberRegistered,
                        memberDeposited,
                        firstTierRewardAmount,
                        firstTierMetCount,
                        firstTierMsg,
                        secondTierMetCount,
                        secondTierRewardAmount,
                        secondTierMsg,
                        referrerPayoutAmount,
                        firstTierRewardAmountSetting,
                        secondTierRewardAmountSetting,
                    },
                });
            }
        });
    }
    // 查询活动信息
    GetQueleaActiveCampaign() {
        get(ApiPort.GetQueleaActiveCampaign).then((data) => {
            data &&
                data.result &&
                this.setState({
                    campaignRewardDetails: data.result.campaignRewardDetails,
                    totalDepositRequired:
                        data.result.campaignSignUpPreCondition
                            .totalDepositRequired,
                    totalBetAmountRequired:
                        data.result.campaignSignUpPreCondition
                            .totalBetAmountRequired,
                    startDate: data.result.startDate
                        ? moment(data.result.startDate).format("DD/MM/YYYY")
                        : "",
                });
        });
    }
    checkMemberInfo() {
        this.setState({ isLoading: true });
        get(ApiPort.GetQueleaInfo).then((data) => {
            if (data && data.isSuccess && data.result) {
                if (!data.result.referrerID && !data.result.campaignName) {
                    this.setState({ applyStep: 1 }); // 显示立即加入按钮
                } else {
                    // 显示分享链接以及二维码
                    this.setState({
                        applyStep: 3,
                        referUrl: data.result.queleaUrl,
                        referCode: data.result.referrerID,
                    });
                }
            }
        }).finally(()=>{
            this.setState({ isLoading: false });
        })
    }
    correctMemberInfo() {
        getMemberInfo((res) => {
            // 更新当前界面memberInfo
            this.setState({ memberInfo: res });
            // 更新全局memberInfo
            this.setMemberInfo(res);
        }, true);
        this.referrerEligible();
    }
    // 注册活动，获取连接
    ReferrerSignUp() {
        this.setState({ isLoading: true });
        post(ApiPort.ReferrerSignUp).then((data) => {
            if ( data && data.isSuccess) {
                this.setState({
                    applyStep: 3,
                    isLoading: false,
                    referUrl: data.result.queleaUrl,
                    referCode: data.result.referrerID,
                });
            }
            this.setState({ isLoading: false });
        });

        Pushgtagdata("Generatelink_raf");
    }
    downloadCanvas() {
        let save_link = document.createElementNS(
            "http://www.w3.org/1999/xhtml",
            "a"
        );
        save_link.href =
            this.qrcodeDOM.current.refs.canvas.toDataURL("image/png");
        save_link.download = "fun88vn_share_ref_qrcode.png";

        let event = document.createEvent("MouseEvents");
        event.initMouseEvent(
            "click",
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
        );
        save_link.dispatchEvent(event);

        this.autoClearPrompt("保存成功");
        Pushgtagdata("Share_raf");
    }
    autoClearPrompt(text) {
        // this.setState({ referPromptInfo: text });
        message.success(
            translate(text)
        );
    }
    goVerified() {
        const { memberInfo } = this.state;
        console.log("🚀 ~ file: Refer.js:249 ~ IM ~ goVerified ~ memberInfo:", memberInfo)
        if (!memberInfo.isVerifiedPhone) {
            return;
        }
        switch (true) {
            case !memberInfo.isVerifiedPhone[1] &&
                !(memberInfo.isVerifiedEmail && memberInfo.isVerifiedEmail[1]):
                this.setState({ otpVisible: true });
                break;
            case !memberInfo.isVerifiedPhone[1]:
                this.setState({ phoneVisible: true });
                break;
            case !(memberInfo.isVerifiedEmail && memberInfo.isVerifiedEmail[1]):
                this.setState({ emailVisible: true });
                break;
            default:
                break;
        }

        Pushgtagdata("Verify_raf");
    }
    // 获取用户是否满足申请条件
    referrerEligible() {
        get(ApiPort.ReferrerEligible).then((data) => {
            if(data && data.isSuccess && data.result){
                this.setState({
                    isDepositMet: data.result.isDepositMet,
                    isBetAmountMet: data.result.isBetAmountMet,
                    isRegisteredMet: data.result.isRegisteredMet,
                    isVerificationMet: data.result.isVerificationMet,
                });
            }
        });
    }
    render() {
        const {
            memberInfo,
            isDepositMet,
            isBetAmountMet,
            isRegisteredMet,
            isVerificationMet,
            infoObj,
        } = this.state;
        // console.log(">>>>>>>>>>", this.state.showLiJiJiaRu);
        // console.log("--------------------->", this.state.infoObj);
        // console.log(this.state.applyStep + "---------" + this.state.referUrl);
        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                status={1}
                setUserCenterMemberInfo={(v, setMemberInfo, getBalance) => {
                    this.setState({ memberInfo: v }); // HasHeader传入进的会员信息（只有在第一次进入界面才会传入，并不会实时响应）
                    this.setMemberInfo = setMemberInfo; // 设置HasHeader会员信息以及更新全部信息
                }}
                seoData={this.props.seoData}
            >
                <div className="common-distance-wrap">
                    <Spin size="large" spinning={this.state.isLoading}>
                        <div className="common-distance">
                            <div className="im-wrap">
                                <div className="invite-friend-banner"></div>
                                <div className="invite-friend-content">
                                    <div className="invite-step-wrap">
                                        {this.state.showLiJiJiaRu &&
                                            !this.state.referUrl ? (
                                            <React.Fragment>
                                                <h4 className="invite-title">
                                                    {translate("过程")}
                                                </h4>
                                                <ul className="invite-list-step">
                                                    <li>
                                                        <div className="invite-step-number">
                                                            1
                                                        </div>
                                                        <div className="invite-step-content">
                                                            <h4>
                                                                {translate("单击按钮")}
                                                                {" "}
                                                                "
                                                                {translate("现在加入")}
                                                                "
                                                            </h4>
                                                            <p>
                                                                {translate("任务完成后将生成推荐链接")}
                                                            </p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="invite-step-number">
                                                            2
                                                        </div>
                                                        <div className="invite-step-content">
                                                            <h4>
                                                                {translate("分享推荐链接或二维码")}
                                                            </h4>
                                                            <p>
                                                                {translate("推荐的朋友必须通过链接注册并玩游戏。")}
                                                            </p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="invite-step-number">
                                                            3
                                                        </div>
                                                        <div className="invite-step-content">
                                                            <h4>
                                                                {translate("检查进度并获得奖金")}
                                                            </h4>
                                                            <p>
                                                                {translate("访问“推荐朋友”页面，查看您朋友的注册、存款和收入进度。")}
                                                            </p>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <p className="fail-color center">
                                                    {translate("活动开始时间")}
                                                    {this.state.startDate}
                                                </p>
                                                <Button
                                                    size="large"
                                                    type="primary"
                                                    onClick={this.addActive}
                                                    block
                                                >
                                                    {translate("立即加入")}
                                                </Button>
                                            </React.Fragment>
                                        ) : this.state.applyStep === 3 &&
                                            this.state.referUrl ? (
                                            <div className="refer-qrcode-wrap">
                                                {/* {!!this.state
                                                    .referPromptInfo ? (
                                                    <div
                                                        className={`prompt-center-box refer-friend-prompt${this.state
                                                            .referPromptInfo ===
                                                            "已保存"
                                                            ? " _2"
                                                            : ""
                                                            }`}
                                                    >
                                                        {
                                                            this.state
                                                                .referPromptInfo
                                                        }
                                                    </div>
                                                ) : null} */}
                                                <h4>
                                                    {translate("推荐好友")}
                                                </h4>
                                                <p className="gray-color">
                                                    {translate("分享链接")}
                                                </p>
                                                <div
                                                    className="refer-href-link margin-distance black-color"
                                                    title={this.state.referUrl}
                                                >
                                                    {this.state.referUrl}
                                                </div>
                                                <CopyToClipboard
                                                    text={this.state.referUrl}
                                                    onCopy={() => {
                                                        this.autoClearPrompt(
                                                            translate("复制成功")
                                                        );
                                                        Pushgtagdata(
                                                            "Copylink_raf"
                                                        );
                                                    }}
                                                >
                                                    <Button
                                                        className="margin-distance"
                                                        type="danger"
                                                        size="large"
                                                        block
                                                        ghost
                                                    >
                                                        {translate("复制推荐链接")}
                                                    </Button>
                                                </CopyToClipboard>
                                                <p className="margin-distance black-color">
                                                    {translate("分享二维码")}
                                                </p>
                                                <div className="margin-distance center">
                                                    <QRCode
                                                        size={120}
                                                        value={
                                                            this.state.referUrl
                                                        }
                                                        ref={this.qrcodeDOM}
                                                    />
                                                </div>
                                                <Button
                                                    className="margin-distance"
                                                    type="danger"
                                                    size="large"
                                                    block
                                                    onClick={
                                                        this.downloadCanvas
                                                    }
                                                >
                                                    {translate("保存二维码")}
                                                </Button>
                                                <p className="fail-color">
                                                    {translate("分享链接或二维码给您的朋友，推荐FUN88并获得诱人优惠。 推荐人可以通过链接或二维码注册FUN88帐户，推荐人可以在“进度”部分查看奖金状态")}
                                                </p>
                                            </div>
                                        ) : (
                                            <React.Fragment>
                                                <h4 className="invite-title">
                                                    {translate("过程")}
                                                </h4>
                                                <ul className="invite-list-step has-login">
                                                    {/* <li>
                                                        <div className="invite-step-number">
                                                            1
                                                        </div>
                                                        <div className="invite-step-content">
                                                            <h4>
                                                                注册满一个月
                                                            </h4>
                                                            <p>
                                                                您注册于：
                                                                {memberInfo.registerDate &&
                                                                    memberInfo.registerDate
                                                                        .substring(
                                                                            0,
                                                                            memberInfo.registerDate.indexOf(
                                                                                "T"
                                                                            )
                                                                        )
                                                                        .replace(
                                                                            "-",
                                                                            "年"
                                                                        )
                                                                        .replace(
                                                                            "-",
                                                                            "月"
                                                                        )}
                                                                日
                                                            </p>
                                                        </div>
                                                        {isRegisteredMet ? (
                                                            <Icon
                                                                type="check-circle"
                                                                theme="filled"
                                                                className="success"
                                                            />
                                                        ) : (
                                                            <Icon type="check-circle" />
                                                        )}
                                                    </li> */}
                                                    <li>
                                                        <div className="invite-step-number">
                                                            1
                                                        </div>
                                                        <div className="invite-step-content">
                                                            <h4>
                                                                {translate("本月存款")}{" "}
                                                                {formatAmount(this.state.totalDepositRequired)}{" "}đ
                                                            </h4>
                                                            <p>
                                                                <i
                                                                    className={`tlc-sprite user-deposit-currency${isDepositMet
                                                                        ? " curr"
                                                                        : ""
                                                                        }`}
                                                                />
                                                                <span>
                                                                    {translate("存款")}:{" "}{this.state.totalDeposits}/{this.state.totalDepositRequired}
                                                                </span>
                                                            </p>
                                                            {isDepositMet ? null : (
                                                                <Button
                                                                    type="danger"
                                                                    onClick={() => {
                                                                        global.showDialog(
                                                                            {
                                                                                key: 'wallet:{"type": "deposit"}',
                                                                            }
                                                                        );
                                                                        Pushgtagdata(
                                                                            "Deposit_raf"
                                                                        );
                                                                    }}
                                                                    disabled={
                                                                        !isRegisteredMet
                                                                    }
                                                                >
                                                                    {translate("立即存款")}
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {isDepositMet &&
                                                            isBetAmountMet ? (
                                                            <Icon
                                                                type="check-circle"
                                                                theme="filled"
                                                                className="success"
                                                            />
                                                        ) : (
                                                            <Icon type="check-circle" />
                                                        )}
                                                    </li>
                                                    <li>
                                                        <div className="invite-step-number">
                                                            2
                                                        </div>
                                                        <div className="invite-step-content">
                                                            <h4>
                                                                {translate("本月收入")}{" "}
                                                                {formatAmount(this.state.totalBetAmountRequired)}{" "}đ
                                                            </h4>
                                                            <p>
                                                                <i
                                                                    className={`tlc-sprite user-bonus-currency${isBetAmountMet ? " curr" : ""}`}
                                                                />
                                                                <span>
                                                                    {translate("收入")}:{this.state.totalBets}/{this.state.totalBetAmountRequired}
                                                                </span>
                                                            </p>
                                                            {/* {isDepositMet ? null : (
                                                                <Button
                                                                    type="danger"
                                                                    onClick={() => {
                                                                        global.showDialog(
                                                                            {
                                                                                key: 'wallet:{"type": "deposit"}',
                                                                            }
                                                                        );
                                                                        Pushgtagdata(
                                                                            "Deposit_raf"
                                                                        );
                                                                    }}
                                                                    disabled={
                                                                        !isRegisteredMet
                                                                    }
                                                                >
                                                                    马上存款
                                                                </Button>
                                                            )} */}
                                                        </div>
                                                        {isDepositMet &&
                                                            isBetAmountMet ? (
                                                            <Icon
                                                                type="check-circle"
                                                                theme="filled"
                                                                className="success"
                                                            />
                                                        ) : (
                                                            <Icon type="check-circle" />
                                                        )}
                                                    </li>
                                                    <li>
                                                        <div className="invite-step-number">
                                                            3
                                                        </div>
                                                        <div className="invite-step-content">
                                                            <h4>
                                                                {translate("验证电子邮件和电话号码")}
                                                            </h4>
                                                            <p>
                                                                <i
                                                                    className={`tlc-sprite user-email ${memberInfo.isVerifiedEmail &&
                                                                        memberInfo
                                                                            .isVerifiedEmail[1] &&
                                                                        "curr"
                                                                        }`}
                                                                />
                                                                <span>
                                                                    {memberInfo.isVerifiedEmail &&
                                                                        memberInfo
                                                                            .isVerifiedEmail[1]
                                                                        ? translate("已验证")
                                                                        : translate("未验证")}
                                                                </span>
                                                                <br/>
                                                                <i
                                                                    className={`tlc-sprite user-phone ${memberInfo.isVerifiedPhone &&
                                                                        memberInfo
                                                                            .isVerifiedPhone[1] &&
                                                                        "curr"
                                                                        }`}
                                                                />
                                                                <span>
                                                                    {memberInfo.isVerifiedPhone &&
                                                                        memberInfo
                                                                            .isVerifiedPhone[1]
                                                                        ? translate("已验证")
                                                                        : translate("未验证")}
                                                                </span>
                                                            </p>
                                                            {isVerificationMet ? null : (
                                                                <Button
                                                                    type="danger"
                                                                    onClick={this.goVerified}
                                                                    disabled={!isRegisteredMet}
                                                                >
                                                                    {translate("立即验证")}
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {isVerificationMet ? (
                                                            <Icon
                                                                type="check-circle"
                                                                theme="filled"
                                                                className="success"
                                                            />
                                                        ) : (
                                                            <Icon type="check-circle" />
                                                        )}
                                                    </li>
                                                </ul>
                                                <Button
                                                    type="danger"
                                                    size="large"
                                                    disabled={
                                                        !(
                                                            isRegisteredMet &&
                                                            isDepositMet &&
                                                            isBetAmountMet &&
                                                            isVerificationMet
                                                        )
                                                    }
                                                    onClick={
                                                        this.ReferrerSignUp
                                                    }
                                                    block
                                                >
                                                    {translate("生成推荐代码")}
                                                </Button>
                                            </React.Fragment>
                                        )}
                                        {/* <p className="fail-color center">活动开始时间：{this.state.startDate}</p> */}
                                    </div>
                                    <div className="invite-prize-wrap">
                                        {this.state.referUrl && infoObj ? (
                                            <React.Fragment>
                                                <h4 className="invite-title">
                                                    {translate("奖金进度")}
                                                </h4>
                                                <div className="prize-process fail-color">
                                                    <div className="prize-list">
                                                        <div
                                                            className={`process-step${infoObj.linkClicked >
                                                                0
                                                                ? " light-blue"
                                                                : ""
                                                                }`}
                                                        >
                                                            <p>
                                                                <span
                                                                    className={
                                                                        infoObj.linkClicked >
                                                                        0 &&
                                                                        "active-blue"
                                                                    }
                                                                >
                                                                    {translate("路径")}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        infoObj.linkClicked >
                                                                        0 &&
                                                                        "active-black"
                                                                    }
                                                                >
                                                                    {
                                                                        infoObj.linkClicked
                                                                    }
                                                                    {translate("点击次数")}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={`process-step${infoObj.memberRegistered >
                                                                0
                                                                ? " light-blue"
                                                                : ""
                                                                }`}
                                                        >
                                                            <p>
                                                                <span
                                                                    className={
                                                                        infoObj.memberRegistered >
                                                                        0 &&
                                                                        "active-blue"
                                                                    }
                                                                >
                                                                    {translate("已经登记过了")}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        infoObj.memberRegistered >
                                                                        0 &&
                                                                        "active-black"
                                                                    }
                                                                >
                                                                    {
                                                                        infoObj.memberRegistered
                                                                    }
                                                                    {translate("朋友")}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={`process-step${infoObj.memberDeposited >
                                                                0
                                                                ? " light-blue"
                                                                : ""
                                                                }`}
                                                        >
                                                            <p>
                                                                <span
                                                                    className={
                                                                        infoObj.memberDeposited >
                                                                        0 &&
                                                                        "active-blue"
                                                                    }
                                                                >
                                                                    {translate("存款")}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        infoObj.memberDeposited >
                                                                        0 &&
                                                                        "active-black"
                                                                    }
                                                                >
                                                                    {
                                                                        infoObj.memberDeposited
                                                                    }
                                                                    {translate("朋友")}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={`process-step${infoObj.firstTierMetCount >
                                                                0
                                                                ? " light-blue"
                                                                : ""
                                                                }`}
                                                        >
                                                            <p>
                                                                <span
                                                                    className={`gray-color${infoObj.firstTierMetCount >
                                                                        0
                                                                        ? " active-black"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    {translate("更多")}{" "}
                                                                    {
                                                                        infoObj.firstTierRewardAmountSetting
                                                                    }
                                                                    {" đ"}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        infoObj.firstTierMetCount >
                                                                        0 &&
                                                                        "active-black"
                                                                    }
                                                                >
                                                                    {
                                                                        infoObj.firstTierMetCount
                                                                    }
                                                                    {translate("朋友")}
                                                                </span>
                                                            </p>
                                                            <p>
                                                                {
                                                                    infoObj
                                                                        .firstTierMsg
                                                                        .depositMsg
                                                                }
                                                                ／
                                                                {
                                                                    infoObj
                                                                        .firstTierMsg
                                                                        .turnoverMsg
                                                                }
                                                                ／
                                                                {
                                                                    infoObj
                                                                        .firstTierMsg
                                                                        .rulesMsg
                                                                }
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={`process-step${infoObj.secondTierMetCount >
                                                                0
                                                                ? " light-blue"
                                                                : ""
                                                                }`}
                                                        >
                                                            <p>
                                                                <span
                                                                    className={`gray-color${infoObj.secondTierMetCount >
                                                                        0
                                                                        ? " active-black"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    {translate("更多")} {" "}
                                                                    {
                                                                        infoObj.secondTierRewardAmountSetting
                                                                    }
                                                                    {" đ"}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        infoObj.secondTierMetCount >
                                                                        0 &&
                                                                        "active-black"
                                                                    }
                                                                >
                                                                    {
                                                                        infoObj.secondTierMetCount
                                                                    }
                                                                    {translate("朋友")}
                                                                </span>
                                                            </p>
                                                            <p>
                                                                {
                                                                    infoObj
                                                                        .secondTierMsg
                                                                        .depositMsg
                                                                }
                                                                ／
                                                                {
                                                                    infoObj
                                                                        .secondTierMsg
                                                                        .turnoverMsg
                                                                }
                                                                ／
                                                                {
                                                                    infoObj
                                                                        .secondTierMsg
                                                                        .rulesMsg
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`prize-total${infoObj.referrerPayoutAmount >
                                                            0
                                                            ? " light-blue"
                                                            : ""
                                                            }`}
                                                    >
                                                        <p>
                                                            <span className="black-color">
                                                                {translate("总得奖金")}
                                                            </span>
                                                            <span className="black-color">
                                                                {
                                                                    infoObj.referrerPayoutAmount
                                                                }
                                                                {" đ"}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ) : null}
                                        {this.state.campaignRewardDetails
                                            .length ? (
                                            <React.Fragment>
                                                <h4 className="invite-title">
                                                    {translate("奖金")}
                                                </h4>
                                                <table className="invite-list-table">
                                                    <thead>
                                                        <tr className="head">
                                                            <th colSpan="2">
                                                                {translate("被推荐人")}
                                                            </th>
                                                            <th>{translate("推荐人")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{translate("存款")}</td>
                                                            <td>{translate("流水")}</td>
                                                            <td>{translate("可得彩金")}</td>
                                                        </tr>
                                                        {this.state.campaignRewardDetails.map(
                                                            (v, index) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {formatAmount(
                                                                                v.depositAmount
                                                                            )}{" "}
                                                                            đ
                                                                        </td>
                                                                        <td>
                                                                            {formatAmount(
                                                                                v.turnoverAmount
                                                                            )}{" "}
                                                                            đ
                                                                        </td>
                                                                        <td className="theme-color">
                                                                            {formatAmount(
                                                                                v.referralRewardAmount
                                                                            )}{" "}
                                                                            đ
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </React.Fragment>
                                        ) : null}
                                        <div className="prize-example-wrap gray-color">
                                            <h4>{translate("示例 A 推荐 B")}</h4>
                                            <p>
                                                {translate("B于20年1月1日注册，自注册起存入200,000越南盾（包括押金费用），并有资格参加促销活动，A将获得100,000越南盾免费投注。 B将收到新会员奖励包。")}
                                            </p>
                                        </div>
                                        <div className="prize-example-wrap gray-color">
                                            <p>{translate("注意")}:</p>
                                            <ul className="prize-example-list">
                                                {/* <li>
                                                    需要被推荐人在活动时间内完成相应的存款和流水后推荐人才能获取彩金。
                                                    {this.state
                                                        .campaignRewardDetails
                                                        .length >= 2
                                                        ? `（${this.state.campaignRewardDetails[0].referralRewardAmount} 彩金和${this.state.campaignRewardDetails[1].referralRewardAmount} 彩金推荐人可以同时获得）`
                                                        : ""}
                                                </li> */}
                                                <li>
                                                    {translate("最多推荐 10 人。")}
                                                </li>
                                                <li>
                                                    {translate("如果您想推荐超过 10 人，请加入联盟计划。")}
                                                </li>
                                            </ul>
                                        </div>
                                        <h4 className="invite-title">
                                            FAQ
                                        </h4>
                                        <div className="invite-question">
                                            <ul className="question-list">
                                                <li>
                                                    <div className="black-color">
                                                        <b>Q:</b>
                                                        <b>
                                                            {translate("我可以与其他促销活动一起参加此促销活动吗？")}
                                                        </b>
                                                    </div>
                                                    <div className="gray-color">
                                                        <p>A:</p>
                                                        <p>{translate("是的，您仍然可以参加其他促销活动。")}</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="black-color">
                                                        <b>Q:</b>
                                                        <b>{translate("奖金需要经过多少轮投注才可以提取？")}</b>
                                                    </div>
                                                    <div className="gray-color">
                                                        <p>A:</p>
                                                        <p>{translate("提款前必须至少下注一次奖金。")}</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="black-color">
                                                        <b>Q:</b>
                                                        <b>{translate("如果我无法验证我的电话号码和电子邮件，我该怎么办？")}</b>
                                                    </div>
                                                    <div className="gray-color">
                                                        <p>A:</p>
                                                        <p>{translate("提供 24/7 支持。 请联系相关部门")}
                                                            <Button
                                                                type="link"
                                                                className="inline"
                                                                onClick={() =>
                                                                    global.PopUpLiveChat()
                                                                }
                                                            >
                                                                {translate("在线聊天")}
                                                            </Button>
                                                        </p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <h4 className="invite-title">
                                            {translate("Điều Kiện Bổ Sung")}
                                        </h4>
                                        <ul className="decimal-list gray-color">
                                            <li>
                                                <p>
                                                    {translate("通过 Fun88 Affiliate 注册帐户的推荐人和被推荐人没有资格享受此促销活动。")}
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    {translate("具有相同信息（IP 地址、设备 ID、电话号码）的推荐人和被推荐人将没有资格享受此促销活动。")}
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    {translate("被推荐人必须注册以下账号")}
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    {translate("推荐人。 被推荐人只有资格从 1 位推荐人那里获得促销。")}
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    {translate("通过该计划被朋友推荐加入Fun88的新注册会员可以选择仅从“新会员注册奖金”或“推荐奖励筏”两个计划之一中获得欢迎奖金。")}
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    {translate("用于注册 Fun88 账户（注册或开立账户）的全名必须与用于存款和取款的银行账户名称一致。")}
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    {translate("推荐奖金（200,000 VND/成功推荐人）在提款前必须下注至少三次。")}
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    {translate("推荐人每年最多可获得 10,000,000 越南盾的奖金（每年 50 名成功推荐人）。")}
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    {translate("如果发现会员有作弊、不良行为或利用促销活动的行为，Fun88保留取消所有奖金或阻止/取消整个促销申请的权利。")}
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Spin>
                </div>
                {this.state.memberInfo.registerDate ? (
                    <React.Fragment>
                        <PhoneVerify
                            memberInfo={memberInfo}
                            visible={this.state.phoneVisible}
                            closeModal={() =>
                                this.setState({ phoneVisible: false })
                            }
                            correctMemberInfo={this.correctMemberInfo}
                            isNext={this.state.isNext}
                            otpParam={"recommendFriend-otp"}
                            changeVerify={() => {
                                this.setState({ phoneVisible: false });
                            }}
                            attemptRemaining={this.state.attemptRemaining}
                            setAttemptRemaining={(v) =>
                                this.setState({ attemptRemaining: v })
                            }
                        />
                        <EmailVerify
                            memberInfo={memberInfo}
                            visible={this.state.emailVisible}
                            closeModal={() =>
                                this.setState({ emailVisible: false })
                            }
                            correctMemberInfo={this.correctMemberInfo}
                            otpParam={"recommendFriend-otp"}
                            changeVerify={() => {
                                this.setState({ emailVisible: false });
                            }}
                            emailattemptRemaining={this.state.emailattemptRemaining}
                            setEmailAttemptRemaining={(v) =>
                                this.setState({ emailattemptRemaining: v })
                            }
                        />
                        <DynamicOtpPopUp
                            otpVisible={this.state.otpVisible}
                            memberInfo={memberInfo}
                            otpModal={(v) => {
                                this.setState({otpVisible: v})
                            }}
                            allowClose={true}
                            setPhoneVisible={(v) =>
                                this.setState({ phoneVisible: v })}
                            setEmailVisible={(v) =>
                                this.setState({ emailVisible: v })}
                        />
                    </React.Fragment>
                ) : null}
            </Layout>
        );
    }
}
