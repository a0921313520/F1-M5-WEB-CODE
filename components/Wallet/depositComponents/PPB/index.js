import React from "react";
import { Button, Form, Modal, Icon, Select, message } from "antd";
import MoneyInput from "./../MoneyInput";
import TargetAccount from "./../TargetAccount";
import BankAccount from "./../BankAccount";
import SecondStep from "./SecondStep";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { CommonPostPay } from "$DATA/wallet";
import { formatSeconds, dateFormat } from "$ACTIONS/util";
import { Cookie } from "$ACTIONS/helper";
import USDTBanner from "../../USDTBanner";
import UploadFile from "@/UploadFile";
import Loading from "../../Loading";
import FinishStep from "../FinishStep/";
const { Item } = Form;
const { Option } = Select;

class PPB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bankCodeState: "", // 存款銀行Code值
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
            lbStep: 1, // 网银转账充值步骤
            uploadFileName: "",
            remainingTime: "00:00", // 剩余时间
            visible: false,
        };

        this.payTypeCode = "PPB"; // 当前支付方式Code
        this.timeTimer = null; // 网银转账第二步骤倒计时Timer
        this.collectionInfo = null;
        this.goThirdStep = null; // 前往第三部的方法
        this.transactionId = null;
        this.hasTimeoutSeconds = 0; //detail api返回倒计时时间
    }
    componentDidMount() {
        // 设置在线支付的默认值
        // this.props.bcTypeList.length && this.props.changeBcType(this.props.bcTypeList[0].code, true);
    }
    componentDidUpdate(prevProps, prevState) {
        // 本银充值第三步骤记录
        if (prevState.lbStep !== this.state.lbStep) {
            if (this.state.lbStep === 2) {
                this.startCountDown(
                    this.hasTimeoutSeconds ? this.hasTimeoutSeconds : 300,
                );
            }
            if (this.state.lbStep === 3) {
                this.startCountDown(600);
            }
        }
    }
    componentWillUnmount() {
        Cookie.Create("dateTime", null); // 无需保留倒计时时间状态，切换则消除
        clearInterval(this.timeTimer);
        this.hasTimeoutSeconds = 0;
    }
    goLbHome = () => {
        clearInterval(this.timeTimer);
        this.setState({ lbStep: 1 });
    };
    startCountDown = (countTime) => {
        clearInterval(this.timeTimer);
        const depositDateTime = Cookie.Get("dateTime")
            .replace("-", "/")
            .replace("-", "/");
        let lastSeconds =
            countTime -
            (new Date().getTime() - new Date(depositDateTime).getTime()) / 1000;
        this.timeTimer = setInterval(() => {
            if (lastSeconds <= 0) {
                if (this.state.lbStep === 2) {
                    Modal.confirm({
                        icon: null,
                        centered: true,
                        className: "confirm-modal-of-public",
                        title: "温馨提醒",
                        content: (
                            <div style={{ textAlign: "left" }}>
                                您是否已经成功存款？
                            </div>
                        ),
                        okText: "是，我已经成功存款",
                        cancelText: "否，我想提交新交易",
                        onOk: () => {
                            this.goThirdStep();
                        },
                        onCancel: () => {
                            Cookie.Create("dateTime", null);
                            this.setState({ lbStep: 1 });
                        },
                    });
                } else {
                    this.setState({ lbStep: 1 });
                }
                clearInterval(this.timeTimer);
            }
            this.setState({ remainingTime: formatSeconds(lastSeconds--) });
        }, 1000);
    };
    payConfirm = (e) => {
        e.preventDefault();
        const Paybank =
            this.props.currDepositDetail.banks &&
            this.props.currDepositDetail.banks.find(
                (v) => v.Code === this.state.bankCodeState,
            );
        // if (Paybank == undefined) {
        // 	return message.error('正在维护，请选择其他存款方式。');
        // }
        if (
            typeof this.props.depositStatusCheck(
                this.props.bcType,
                this.state.bankCodeState,
            ) === "undefined"
        )
            return; // 未完成真实姓名验证则呼出完善弹窗
        this.depositName = this.props.form.getFieldValue("accountHolderName");
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Cookie.Create("loadingTime", dateFormat(), { expires: 1.67 });
                this.setState({ visible: true });
                CommonPostPay(
                    {
                        methodcode:
                            this.refs.Channeldefault.state.Channeldefault,
                        accountHolderName:
                            this.depositName != null
                                ? this.depositName
                                : JSON.parse(localStorage.getItem("memberInfo"))
                                      .firstName,
                        accountNumber: "0",
                        amount: values.money,
                        bankName: Paybank ? Paybank.code : "",
                        bonusId: this.state.bonusVal,
                        bonusCoupon: values.bonusCode || "",
                        cardExpiryDate: "",
                        cardName: "",
                        cardNumber: "",
                        cardPIN: "",
                        charges: 0,
                        couponText: "",
                        depositingBankAcctNum: "",
                        depositingWallet: this.state.targetValue, // 目标账户Code
                        domainName: ApiPort.LOCAL_HOST,
                        fileBytes: "",
                        fileName: "",
                        isMobile: false,
                        isPreferredWalletSet: false, // 是否设为默认目标账户
                        isSmallSet: false,
                        language: "zh-cn",
                        mgmtRefNo: "Fun88Desktop",
                        offlineDepositDate: "",
                        offlineRefNo: "0",
                        paymentMethod: "PPB",
                        refNo: "0",
                        secondStepModel: null,
                        successUrl: ApiPort.LOCAL_HOST,
                        transactionType: "Deposit",
                        transferType: null,
                        blackBoxValue: window.E2GetBlackbox
                            ? window.E2GetBlackbox().blackbox == "" ||
                              window.E2GetBlackbox().blackbox == undefined
                                ? ""
                                : window.E2GetBlackbox().blackbox
                            : "",
                        e2BlackBoxValue: window.E2GetBlackbox
                            ? window.E2GetBlackbox().blackbox == "" ||
                              window.E2GetBlackbox().blackbox == undefined
                                ? ""
                                : window.E2GetBlackbox().blackbox
                            : "",
                    },
                    (res) => {
                        this.setState({ visible: false });
                        let resData = res;
                        res = resData.result;
                        res.isSuccess = resData.isSuccess;
                        if (res.isSuccess) {
                            const { currDepositDetail } = this.props;
                            let minute = 5,
                                second = "";
                            if (
                                currDepositDetail &&
                                currDepositDetail.setting &&
                                currDepositDetail.setting.timeoutSeconds &&
                                currDepositDetail.setting.timeoutSeconds > 0
                            ) {
                                //detial api有返回倒计时数就用api返回的，没有返回就用写死的。
                                this.hasTimeoutSeconds =
                                    currDepositDetail.setting.timeoutSeconds;
                                minute = parseInt(
                                    currDepositDetail.setting.timeoutSeconds /
                                        60,
                                )
                                    ? parseInt(
                                          currDepositDetail.setting
                                              .timeoutSeconds / 60,
                                      ) + "分钟"
                                    : "";
                                second = parseInt(
                                    currDepositDetail.setting.timeoutSeconds %
                                        60,
                                )
                                    ? parseInt(
                                          currDepositDetail.setting
                                              .timeoutSeconds % 60,
                                      ) + "秒"
                                    : "";
                            }
                            if (res.vendorCharges) {
                                //有手续费
                                Modal.info({
                                    className: "confirm-modal-of-public",
                                    icon: <div />,
                                    title: "温馨提醒",
                                    centered: true,
                                    okText: "确认",
                                    width: "400px",
                                    content: (
                                        <dl className="deposit-result">
                                            <dd>
                                                订单成立: {res.transactionId}
                                            </dd>
                                            <dt>
                                                此交易将征收平台费用，详情如下。
                                            </dt>
                                            <div className="line-distance" />
                                            <dd>
                                                存款金额：
                                                <span>
                                                    {res.uniqueAmount || ""}
                                                </span>
                                            </dd>
                                            <dd>
                                                第三方手续费：
                                                <span>
                                                    {Math.abs(res.charges) ||
                                                        ""}
                                                </span>
                                            </dd>
                                            <dd>
                                                实际金额：
                                                <span>
                                                    {res.actualAmount || ""}
                                                </span>
                                            </dd>
                                            {res.charges < 0 &&
                                            res.totalWaiveRemain > 0 ? (
                                                <div className="line-distance" />
                                            ) : null}
                                            {res.charges < 0 &&
                                            res.totalWaiveRemain > 0 ? (
                                                <dt>
                                                    注意 :
                                                    交易成功后，才会扣除免手续费的次数。
                                                    <br />
                                                    剩余{" "}
                                                    <span>
                                                        {res.totalWaiveRemain}
                                                    </span>{" "}
                                                    笔交易免手续费。
                                                </dt>
                                            ) : null}
                                            <div className="line-distance" />
                                            <dt
                                                style={{ fontWeight: "bold" }}
                                                className="TextLightYellow"
                                            >
                                                乐天使温馨提醒 : 请在
                                                <span>
                                                    {this.hasTimeoutSeconds
                                                        ? minute + second
                                                        : "5分钟"}
                                                </span>{" "}
                                                之内完成支付，以免到账延迟。
                                            </dt>
                                        </dl>
                                    ),
                                    onOk: () => {
                                        if (!res.showVendorBank) {
                                            openNewWindow(res);
                                        }
                                    },
                                });
                            } else {
                                console.log("------------>", res);
                                //没有手续费
                                Modal.info({
                                    className: "confirm-modal-of-public",
                                    icon: <div />,
                                    title: "温馨提醒",
                                    centered: true,
                                    okText: "确认",
                                    content: (
                                        <dl className="deposit-result">
                                            <dd>
                                                订单成立: {res.transactionId}
                                            </dd>
                                            {res.charges < 0 &&
                                            res.totalWaiveRemain > 0 ? (
                                                <div className="line-distance" />
                                            ) : null}
                                            {res.charges < 0 &&
                                            res.totalWaiveRemain > 0 ? (
                                                <dt>
                                                    注意 :
                                                    交易成功后，才会扣除免手续费的次数。
                                                    <br />
                                                    剩余{" "}
                                                    <span>
                                                        {res.totalWaiveRemain}
                                                    </span>{" "}
                                                    笔交易免手续费。
                                                </dt>
                                            ) : null}
                                            <div className="line-distance" />
                                            <dt
                                                style={{ fontWeight: "bold" }}
                                                className="TextLightYellow"
                                            >
                                                乐天使温馨提醒 : 请在
                                                <span>
                                                    {this.hasTimeoutSeconds
                                                        ? minute + second
                                                        : "5分钟"}
                                                </span>{" "}
                                                之内完成支付，以免到账延迟。
                                            </dt>
                                        </dl>
                                    ),
                                    onOk: () => {
                                        if (!res.showVendorBank) {
                                            openNewWindow(res);
                                        }
                                    },
                                });
                            }
                            const openNewWindow = (res) => {
                                var RBWindow = window.open(
                                    "",
                                    "_blank",
                                    "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=1245, height=559",
                                );
                                RBWindow.document.write(res.redirectUrl);
                                RBWindow.focus();
                                this.transactionId = res.transactionId;
                                Cookie.Create(
                                    "dateTime",
                                    res.submittedAt
                                        .split("T")
                                        .join(" ")
                                        .split(".")[0],
                                    {
                                        expires: 10,
                                    },
                                );

                                this.setState({
                                    Finish: true,
                                    FinishData: res,
                                    lbStep: 3,
                                });
                                this.props.form.resetFields();
                            };
                            if (res.showVendorBank) {
                                // 第二步骤
                                Cookie.Create(
                                    "dateTime",
                                    res.submittedAt
                                        .split("T")
                                        .join(" ")
                                        .split(".")[0],
                                    {
                                        expires: 5,
                                    },
                                );
                                this.collectionInfo = res;
                                this.setState({ lbStep: 2, FinishData: res });
                                this.props.form.resetFields();
                                this.props.bonusApplication(res);
                            }
                        } else {
                            Modal.info({
                                className: "confirm-modal-of-public",
                                icon: <div />,
                                title: (
                                    <div style={{ textAlign: "center" }}>
                                        温馨提示
                                    </div>
                                ),
                                centered: true,

                                okText: "我知道了",
                                content:
                                    resData.errors[0].description ||
                                    "哎呀！系统开小差了，请稍后重试。",
                            });
                        }
                    },
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_P2Pbanking_Deposit");
    };
    goUserCenterRecords = () => {
        this.goLbHome();
        this.props.onCancel();
        this.props.goUserCenter("records");
        sessionStorage.setItem("selectTabKey", "deposit");
        typeof global.changeRecordFilterType === "function" &&
            global.changeRecordFilterType("deposit");
        Pushgtagdata &&
            Pushgtagdata(
                "Transaction Record",
                "View",
                "View_TransactionRecord_Deposit",
            );
    };

    submitBtnEnable = () => {
        let { setting } = this.props.currDepositDetail;
        let errors = Object.values(this.props.form.getFieldsError()).some(
            (v) => v !== undefined,
        );
        let values = Object.values(this.props.form.getFieldsValue()).some(
            (v) => v == "" || v == undefined,
        );
        if (
            setting &&
            setting.showDepositorNameField &&
            !setting.prefillRegisteredName
        ) {
            return (
                !values &&
                this.props.form.getFieldValue("money") !== "" &&
                !errors
            );
        }
        return this.props.form.getFieldValue("money") !== "" && !errors;
    };

    render() {
        let { setting, banks } = this.props.currDepositDetail; // 当前支付方式的详情
        const {
            getFieldsError,
            getFieldDecorator,
            getFieldValue,
            setFieldsValue,
            setFields,
            getFieldError,
        } = this.props.form;
        const { bcTypeList } = this.props;
        const {
            bankCodeState,
            targetValue,
            bonusVal,
            lbStep,
            visible,
            Finish,
            FinishData,
        } = this.state;

        console.log("真实姓名", getFieldValue("accountHolderName"));
        return (
            <React.Fragment>
                <USDTBanner />
                <Loading
                    visible={visible}
                    setVisible={(v) => {
                        this.setState({ visible: v });
                    }}
                />
                <Form
                    className="form-wrap"
                    style={{ display: lbStep === 1 ? "block" : "none" }}
                    {...formItemLayout}
                    onSubmit={this.payConfirm}
                >
                    <div
                        className="modal-prompt-info"
                        style={{
                            display: this.props.isShowBankCardVerif
                                ? "block"
                                : "none",
                            color: "#2962FF",
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => this.props.openBankAccountVerif()}
                    >
                        <span className="spanText">开启更多充值和提现方式</span>
                        <p className="pText">
                            点击上方按钮完成验证，小同为您承担网银转账 5% 手续费
                        </p>
                    </div>
                    <MoneyInput
                        {...this.props.dialogTabKey}
                        getFieldDecorator={getFieldDecorator}
                        payTypeCode={this.payTypeCode}
                        payMethodList={this.props.payMethodList}
                        setCurrDepositDetail={this.props.setCurrDepositDetail}
                        setting={setting}
                        setFieldsValue={setFieldsValue}
                        setLoading={this.props.setLoading}
                        ref="Channeldefault"
                        setFields={setFields}
                        getFieldError={getFieldError}
                    />

                    {banks && banks != "" && (
                        <BankAccount
                            keyName={["name", "code"]}
                            isAutoAssign={setting && setting.isAutoAssign}
                            bankAccounts={banks}
                            bankCodeState={bankCodeState}
                            setBankCode={(v) => {
                                this.setState({ bankCodeState: v });
                            }}
                        />
                    )}

                    <TargetAccount
                        {...this.props.dialogTabKey}
                        getFieldDecorator={getFieldDecorator}
                        getFieldValue={getFieldValue}
                        setLoading={this.props.setLoading}
                        targetValue={targetValue}
                        setTargetValue={(v, name) => {
                            this.setState({ targetValue: v, targetName: name });
                        }}
                        bonusVal={bonusVal}
                        setBonusValue={(v, name) => {
                            this.setState({ bonusVal: v, bonusName: name });
                        }}
                    />
                    <Item {...tailFormItemLayout}>
                        <div className="btn-wrap">
                            <Button
                                disabled={
                                    // Object.values(getFieldsError()).some(
                                    //     (v) => v !== undefined
                                    // )
                                    !this.submitBtnEnable()
                                }
                                // disabled={
                                //     Object.values(getFieldsError()).some(
                                //         (v) => v !== undefined
                                //     ) ||
                                //     !getFieldValue("money") ||
                                //     !getFieldValue("accountHolderName")
                                //     // ||
                                //     // (bankAccounts && bankAccounts.length == 0)
                                // }
                                size="large"
                                type="primary"
                                htmlType="submit"
                                block
                            >
                                提交
                            </Button>
                        </div>
                    </Item>
                </Form>
                {/* 第二步骤 */}
                <SecondStep
                    lbStep={lbStep}
                    setLbStep={(v) => {
                        this.setState({ lbStep: v });
                    }}
                    setLoading={this.props.setLoading}
                    collectionInfo={this.collectionInfo}
                    remainingTime={this.state.remainingTime}
                    setGoThirdStep={(v) => {
                        this.goThirdStep = v;
                    }}
                    hasTimeoutSeconds={this.hasTimeoutSeconds}
                />
                {/* 第三步骤 */}
                {/* 成功提交的页面 */}
                {lbStep === 3 && (
                    <FinishStep
                        collectionInfo={FinishData}
                        Time={this.state.remainingTime}
                        goRecord={() => {
                            this.goUserCenterRecords();
                        }}
                        goHome={() => {
                            this.props.onCancel("ToHome");
                        }}
                        payTypeCode={"PPB"}
                        uploadFile={true}
                    />
                )}
                {/* goUserCenterRecords */}
                {/* <div style={{ display: lbStep === 3 ? 'block' : 'none' }}>
					<div className="lb-third-step-wrap">
						<Icon type="check-circle" theme="filled" />
						<div className="check-success">
							<div>提交成功</div>
							<div className="cuccess">{this.state.remainingTime}</div>
						</div>
						<p style={{ marginBottom: 14 }}>交易需要一段时间，请稍后再检查您的目标账户。</p>
						<div className="tlc-deposit-receipt radius">
							<ul>
								<li className="item-wrap upload-wrapper">
									<h2>上传收据（推荐使用）</h2>
									<span className="item-label">小同建议 直接上传充值收据以便加快充值审核哦！</span>
									{!!this.state.uploadFileName ? (
										<Button block>{this.state.uploadFileName}</Button>
									) : (
										<UploadFile
											paymentType={this.payTypeCode}
											transactionId={this.transactionId}
											uploadFileName={this.state.uploadFileName}
											setFileName={(v) => {
												this.setState({ uploadFileName: v });
											}}
											children={
												<Button block className="link">
													上传
												</Button>
											}
										/>
									)}
									<span className="item-label" style={{ padding: 0 }}>
										若您无法上传收据，请联系<Button
											className="inline"
											type="link"
											onClick={global.PopUpLiveChat}
										>
											在线客服
										</Button>。
									</span>
								</li>
							</ul>
						</div>
						<div className="btn-wrap">
							<Button
								size="large"
								type="primary"
								htmlType="submit"
								onClick={this.goUserCenterRecords}
								block
							>
								查看交易记录
							</Button>
						</div>
					</div>
				</div> */}
                <div
                    className="deposit-help-wrap"
                    style={{ display: lbStep === 3 ? "none" : "block" }}
                >
                    <h4>乐天使温馨提醒：</h4>

                    <ul>
                        <li>
                            请确保您的存款金额与输入的金额一致，并且建议您上传存款凭证，以利及时到账。{" "}
                        </li>
                        <li>
                            ​请确保您的账户正确，勿存款到旧账户，且不要重复提交，以免导致系统记录异常而无法成功到账。{" "}
                        </li>
                        <li>
                            ​银行账号会不定期更换，请确保您使用的是存款页面上最新的账号，再进行转账。
                        </li>
                        <li>
                            ​如有任何问题请联系
                            <Button
                                type="link"
                                className="inline"
                                onClick={global.PopUpLiveChat}
                            >
                                在线客服
                            </Button>
                            。
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "PPB" })(PPB);
