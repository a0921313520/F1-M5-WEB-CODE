import React from "react";
import { Modal, Button, Form, Radio, Icon, Steps } from "antd";
import SecondStep from "./SecondStep";
import MoneyInput from "./../MoneyInput";
import TargetAccount from "./../TargetAccount";
import BankAccount from "./../BankAccount";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { formatSeconds, dateFormat } from "$ACTIONS/util";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { CommonPostPay } from "$DATA/wallet";
import USDTBanner from "../../USDTBanner";
import { Cookie } from "$ACTIONS/helper";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";
import Router from "next/router";
const { Item } = Form;
const { Step } = Steps;
class ALB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bankCodeState: "", // 收款银行Code值
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
            showType: Cookie.Get("ALBtype") || "1", // 显示方式（二维码显示、银行账户显示）
            lbStep: 1, // 支付宝转账步骤
            remainingTime: "00:00", // 剩余时间
        };

        this.startCountDown = this.startCountDown.bind(this); // 第三步骤倒计时
        this.changeShowType = this.changeShowType.bind(this); // 更换支付宝转账订单显示类型

        this.payTypeCode = "ALB"; // 当前支付方式Code
        this.collectionInfo = Cookie.Get("isAlbSecond")
            ? JSON.parse(Cookie.Get("isAlbSecond"))
            : null; // 第二步骤所需数据初始化
        this.goThirdStep = null; // 前往第三部的方法
    }
    componentDidMount() {
        // 第三步骤倒计时记录
        Cookie.Get("isAlbThird") === "true" && this.setState({ lbStep: 3 });
        // 第二步骤倒计时记录

        this.collectionInfo !== null &&
            this.collectionInfo !== "null" &&
            this.setState({ lbStep: 2 });
    }
    componentDidUpdate(prevProps, prevState) {
        // 支付宝转账第三步骤记录
        if (prevState.lbStep !== this.state.lbStep) {
            if (this.state.lbStep === 2) {
                this.startCountDown("isAlbSecond");
            }
            this.state.lbStep === 3 && this.startCountDown("isAlbThird");
        }
    }
    componentWillUnmount() {
        clearInterval(this.timeTimer);
    }
    goLbHome = () => {
        Cookie.Create("isAlbThird", null);
        clearInterval(this.timeTimer);
        //this.setState({ lbStep: 1 });
        this.props.onCancel();
        setTimeout(() => {
            if (Router.router.pathname != "/cn") {
                Router.push("/cn");
            }
        }, 300);
    };
    startCountDown(stepName) {
        clearInterval(this.timeTimer);
        this.setState({ remainingTime: "00:00" });
        const depositDateTime = Cookie.Get("dateTime")
            .replace("-", "/")
            .replace("-", "/");
        // 900millisecond = 15minute * 60second
        // const timeCount = this.state.lbStep === 3 ? 1800 : (this.state.showType === "1" ? 300 : 1800);
        const timeCount = 1800;
        let lastSeconds =
            timeCount -
            (new Date().getTime() - new Date(depositDateTime).getTime()) / 1000;
        depositDateTime !== null && depositDateTime !== ""
            ? (this.timeTimer = setInterval(() => {
                  if (lastSeconds <= 0) {
                      if (
                          this.state.lbStep === 2 &&
                          this.state.showType === "1"
                      ) {
                          Modal.confirm({
                              icon: null,
                              centered: true,
                              className: "confirm-modal-of-public",
                              title: "温馨提醒",
                              content: (
                                  <div
                                      style={{ textAlign: "left" }}
                                      dangerouslySetInnerHTML={{
                                          __html: "您是否已经成功存款?",
                                      }}
                                  />
                              ),
                              okText: "是，我已经成功存款",
                              cancelText: "否，我想提交新交易",
                              onOk: () => {
                                  this.goThirdStep();
                              },
                              onCancel: () => {
                                  //   this.props.onCancel();
                                  //   global.showDialog({
                                  //       key: 'wallet:{"type": "deposit"}',
                                  //   });
                                  this.setState({
                                      lbStep: 1,
                                  });
                                  Cookie.Create("isAlbSecond", null);
                                  // Cookie.Create('dateTime', dateFormat(), { expires: 30 });
                                  // this.setState({ showType: '2' }, () => {
                                  // 	this.startCountDown('isAlbSecond');
                                  // });
                              },
                          });
                      } else {
                          this.state.lbStep === 3 ||
                              (this.state.lbStep === 2 &&
                                  this.setState({ lbStep: 1 }));
                      }
                      Cookie.Create(stepName, null);
                      clearInterval(this.timeTimer);
                  }
                  this.setState({
                      remainingTime: formatSeconds(lastSeconds--),
                  });
              }, 1000))
            : Cookie.Create(stepName, null);
    }
    changeShowType({ target: { value } }) {
        Cookie.Create("ALBtype", value);
        this.setState({ showType: value });
    }
    payConfirm = (e) => {
        e.preventDefault();
        //选择支付方式
        if (!this.state.ChoicePayment) {
            this.setState({
                ChoicePayment: true,
            });
            return;
        }

        // 充值前置条件判定
        if (
            typeof this.props.depositStatusCheck(
                this.payTypeCode,
                this.state.bankCodeState,
            ) === "undefined"
        )
            return;

        const Paybank = this.props.currDepositDetail.bankAccounts.find(
            (v) => v.bankLogID === this.state.bankCodeState,
        );
        const isAutoAssign =
            this.props.currDepositDetail.setting &&
            this.props.currDepositDetail.setting.isAutoAssign;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                CommonPostPay(
                    {
                        accountHolderName: this.props.localMemberName, // 账户持有人姓名
                        accountNumber: "0", //帐号
                        amount: values.money,
                        bankName: isAutoAssign ? Paybank.bankName : "NIL", //银行名
                        language: "zh-cn",
                        paymentMethod: this.payTypeCode,
                        charges: 0,
                        transactionType: "Deposit",
                        domainName: ApiPort.LOCAL_HOST,
                        isMobile: false,
                        isSmallSet: false,
                        refNo: "0",
                        offlineDepositDate: "",
                        mgmtRefNo: "Fun88Desktop",
                        offlineRefNo: "0",
                        BankLogID: Paybank.bankLogID,
                        depositingBankName: !isAutoAssign
                            ? Paybank.enBankName
                            : "",
                        depositingBankAcctNum: "",
                        // depositingBankAcctNum: isAutoAssign
                        //     ? Paybank.accountNo
                        //     : "",
                        isPreferredWalletSet: false,
                        isMobile: false,
                        depositingWallet: this.state.targetValue, // 目标账户Code
                        bonusId: this.state.bonusVal,
                        bonusCoupon: values.bonusCode || "",
                        secondStepModel: null,
                        successUrl: ApiPort.LOCAL_HOST,
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
                        transferType: {
                            ID: 27,
                            Sorting: 2,
                            Name: "LocalBank",
                            CurrencyCode: "CNY",
                            Code: "LocalBank",
                            IsActive: true,
                        },
                    },
                    (res) => {
                        this.props.setLoading(false);
                        let resData = res;
                        res = resData.result;
                        res.isSuccess = resData.isSuccess;
                        if (res.isSuccess) {
                            Cookie.Create(
                                "dateTime",
                                res.submittedAt
                                    .split("T")
                                    .join(" ")
                                    .split(".")[0],
                                {
                                    expires: 30,
                                },
                            );
                            Cookie.Create("isAlbSecond", JSON.stringify(res), {
                                expires: 30,
                            });
                            this.collectionInfo = res;
                            this.setState({
                                lbStep: 2,
                            });
                            this.props.bonusApplication(res);
                            this.props.form.resetFields();
                            const tryOtherDialog = () => {
                                Modal.info({
                                    className: "confirm-modal-of-public",
                                    icon: <div />,
                                    okText: "知道了",
                                    cancelText: "刷新重试",
                                    title: "温馨提醒",
                                    closable: "",
                                    content: (
                                        <div>
                                            <p>
                                                很抱歉，目前暂无可存款的银行，请尝试其他存款方式。
                                            </p>
                                        </div>
                                    ),
                                    onOk: () => {
                                        this.props.setCurrentPayMethod("JDP");
                                        Cookie.Create("isAlbSecond", null);
                                        Cookie.Create("isAlbThird", null);
                                    },
                                });
                            };
                            // 当返回的isDummyBank为true 的情况下新增提示信息
                            if (res.isDummyBank) {
                                tryOtherDialog();
                            }
                        }
                    },
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_Localalipay_Deposit");
    };
    goRecord = () => {
        //this.goLbHome();
        this.props.onCancel();
        this.props.goUserCenter("records");
        typeof global.changeRecordFilterType === "function" &&
            global.changeRecordFilterType("deposit");
        Pushgtagdata &&
            Pushgtagdata(
                "Transaction Record",
                "View",
                "View_TransactionRecord_Deposit",
            );
    };
    copyEvent() {
        global.showColorResultModal("已复制", true);
    }
    render() {
        let { setting, bankAccounts } = this.props.currDepositDetail; // 当前支付方式的详情
        const { getFieldsError, getFieldDecorator, getFieldValue } =
            this.props.form;
        const {
            remainingTime,
            bankCodeState,
            showType,
            targetValue,
            bonusVal,
            lbStep,
            ChoicePayment,
        } = this.state;

        return (
            <React.Fragment>
                <USDTBanner />
                {/* 第一步骤 */}
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
                    />

                    {!ChoicePayment && (
                        <BankAccount
                            labelName="存款银行"
                            keyName={["bankName", "bankLogID"]}
                            isAutoAssign={setting && setting.isAutoAssign}
                            bankAccounts={bankAccounts}
                            bankCodeState={bankCodeState}
                            setBankCode={(v) => {
                                this.setState({ bankCodeState: v });
                            }}
                        />
                    )}

                    {ChoicePayment && (
                        <Item label="选择支付方式">
                            <Radio.Group
                                className="wallet-radio-wrap"
                                onChange={this.changeShowType}
                                value={this.state.showType}
                            >
                                <Radio
                                    className="ant-input ant-input-lg wallet-radio"
                                    value="1"
                                >
                                    显示二维码
                                </Radio>
                                <Radio
                                    className="ant-input ant-input-lg wallet-radio"
                                    value="2"
                                >
                                    显示银行账户
                                </Radio>
                            </Radio.Group>
                        </Item>
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
                                    Object.values(getFieldsError()).some(
                                        (v) => v !== undefined,
                                    ) || !getFieldValue("money")
                                }
                                size="large"
                                type="primary"
                                htmlType="submit"
                                block
                            >
                                {ChoicePayment ? "下一步" : "提交"}
                            </Button>
                        </div>
                    </Item>
                    {/* <div className="modal-prompt-info">
						您的款项, 将在15-30分钟内到账, 如有问题请联系<Button
							type="link"
							className="inline"
							onClick={global.PopUpLiveChat}
						>
							在线客服
						</Button>。
					</div> */}
                </Form>
                {/* 第二步骤 */}

                <SecondStep
                    lbStep={lbStep}
                    showType={showType}
                    startCountDown={this.startCountDown}
                    setLbStep={(v) => {
                        this.setState({ lbStep: v });
                    }}
                    setLoading={this.props.setLoading}
                    collectionInfo={this.collectionInfo}
                    remainingTime={remainingTime}
                    setGoThirdStep={(v) => {
                        this.goThirdStep = v;
                    }}
                />
                {/* 第三步骤 */}
                <div
                    className="lb-third-step-wrap"
                    style={{ display: lbStep === 3 ? "block" : "none" }}
                >
                    <div className="stepDone">
                        {/* <Icon type="check-circle" theme="filled" /> */}

                        <img
                            src="/cn/img/icons/icon-success.png"
                            width={"60px"}
                            className="iconstatus"
                        />
                        <div className="successtext">已成功提交</div>
                        <div className="StepsBox">
                            <Steps
                                current={0}
                                direction="vertical"
                                size="small"
                            >
                                <Step
                                    title="提交成功"
                                    description="处理中"
                                    icon={
                                        <BsCheckCircleFill
                                            color="#108ee9"
                                            size={17}
                                        />
                                    }
                                />
                                <Step
                                    title=""
                                    description={`预计${this.state.remainingTime}分钟到账`}
                                    icon={
                                        <BsCircle color="#999999" size={12} />
                                    }
                                />
                            </Steps>
                        </div>
                        <div className="DepositInfo">
                            <div className="list">
                                <span>存款金额</span>
                                <span className="bold">
                                    ¥{" "}
                                    {this.collectionInfo &&
                                        this.collectionInfo.uniqueAmount}
                                </span>
                            </div>
                            <div className="list">
                                <span>交易单号</span>
                                <span>
                                    {this.collectionInfo &&
                                        this.collectionInfo.transactionId}
                                    <CopyToClipboard
                                        text={
                                            this.collectionInfo &&
                                            this.collectionInfo.transactionId
                                        }
                                        onCopy={this.copyEvent}
                                    >
                                        <img
                                            style={{
                                                marginLeft: "0.4rem",
                                                cursor: "pointer",
                                            }}
                                            src={`/cn/img/icons/Copys.svg`}
                                        />
                                    </CopyToClipboard>
                                </span>
                            </div>
                        </div>
                        {/* <div className="check-success">
							<div className="cuccess">{this.state.remainingTime}</div>
						</div>
						<p>交易需要一段时间，请稍后再检查您的目标账户。</p> */}
                    </div>
                    <center>
                        <p className="note">
                            您可以回到首页继续投注，请等待10分钟以刷新金额，
                            如果有任何问题，请联系我们的在线客服
                        </p>
                    </center>
                    <div className="btn-wrap">
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            onClick={this.goRecord}
                            block
                        >
                            查看交易记录
                        </Button>

                        <Button
                            ghost
                            size="large"
                            type="primary"
                            htmlType="submit"
                            onClick={this.goLbHome}
                            block
                            style={{ marginTop: "15px" }}
                        >
                            回到首页
                        </Button>
                    </div>
                </div>
                {/* 温馨提示 */}
                <div
                    className="deposit-help-wrap"
                    style={{ display: lbStep == 1 ? "block" : "none" }}
                >
                    <h4>乐天使温馨提醒：</h4>
                    <ul>
                        <li>
                            存款后，点击【我已成功存款】耐心等待到账，为了保证及时到账，请勿重复提交存款信息。
                        </li>
                        <li>
                            请务必按照系统提示的银行及金额进行存款，否则您的存款将无法及时到账。
                        </li>
                        {/* <li>
							支付宝存款将会在 2 小时内到账。若 2 小时后仍然无法进行处理，请联系<Button type="link" onClick={global.PopUpLiveChat}>
								在线客服
							</Button>。
						</li> */}
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "ALB" })(ALB);
