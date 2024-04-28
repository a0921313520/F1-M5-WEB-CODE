import React from "react";
import { Modal, Form, Input, Spin, Row, Col, Button } from "antd";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { patch } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import {showSmallResultModal} from "$ACTIONS/helper";
const { Item } = Form;

class BankAccountModals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            numberOfWithdrawals: "0", //提现次数
            withdrawalAmount: "0", //提现金额
            percentageLimit: "0", //限额百分比
            numberError: true,
            moneyError: true,
            limitError: true,
            btnStatus: false,
            isChanged: false,
        };
        this.numberOfWithdrawalsReg = /^[1-9]\d*$/;
        this.withdrawalAmountReg = /^[1-9]\d*$/;
        this.percentageLimitReg = /^([1-9]|[1-9]\d|100)$/;
    }
    componentDidMount() {}
    componentDidUpdate(prevProps, prevState) {
        const { numberOfWithdrawals, withdrawalAmount, percentageLimit } =
            this.props.memberWithdrawalThresho;
        if (
            prevProps.memberWithdrawalThresho.numberOfWithdrawals !==
            numberOfWithdrawals
        ) {
            this.initValueHandler("numberOfWithdrawals", numberOfWithdrawals);
        }
        if (
            prevProps.memberWithdrawalThresho.withdrawalAmount !==
            withdrawalAmount
        ) {
            this.initValueHandler("withdrawalAmount", withdrawalAmount);
        }
        if (
            prevProps.memberWithdrawalThresho.percentageLimit !==
            percentageLimit
        ) {
            this.initValueHandler("percentageLimit", percentageLimit);
        }
    }
    initValueHandler = (type, value) => {
        this.setState({ isChanged: false });
        if (type === "numberOfWithdrawals") {
            this.setState({
                numberOfWithdrawals: value,
            });
            if (this.numberOfWithdrawalsReg.test(value) === false) {
                this.setState({ numberError: true }, () => {
                    this.tetsBtnStatus();
                });
            } else {
                this.setState({ numberError: false }, () => {
                    this.tetsBtnStatus();
                });
            }
        }
        if (type === "withdrawalAmount") {
            this.setState({
                withdrawalAmount: value,
            });
            if (this.withdrawalAmountReg.test(value) === false) {
                this.setState({ moneyError: true }, () => {
                    this.tetsBtnStatus();
                });
            } else {
                this.setState({ moneyError: false }, () => {
                    this.tetsBtnStatus();
                });
            }
        }
        if (type === "percentageLimit") {
            this.setState({
                percentageLimit: value,
            });
            if (this.percentageLimitReg.test(value) === false) {
                this.setState({ limitError: true }, () => {
                    this.tetsBtnStatus();
                });
            } else {
                this.setState({ limitError: false }, () => {
                    this.tetsBtnStatus();
                });
            }
        }
    };
    onSubmit = () => {
        this.setState({ isLoading: true });
        const storageMemberInfo = localStorage.getItem("memberInfo");
        // let MemberCode = storageMemberInfo ? JSON.parse(storageMemberInfo).memberCode : '';
        let data = {
            withdrawalThresholdAmount: this.state.withdrawalAmount,
            withdrawalThresholdCount: this.state.numberOfWithdrawals,
            threshold: this.state.percentageLimit,
            updatedBy: "username", // TODO
        };
        patch(ApiPort.SetWithdrawalLimit, data)
            .then((res) => {
                this.setState({ isLoading: false });
                if (res.isSuccess) {
                    this.props.closeModal(false);
                    this.props.getMemberWithdrawalThresho();
                    showSmallResultModal(true,"更新成功");
                } else {
                    this.props.closeModal(false);
                    showSmallResultModal(false, res.description || "保存失败");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    changeNumberTest = (e, v) => {
        e.preventDefault();
        this.setState({ isChanged: true });
        if (v === "numberOfWithdrawals") {
            this.setState({
                numberOfWithdrawals: e.target.value,
            });
            if (this.numberOfWithdrawalsReg.test(e.target.value) === false) {
                this.setState({ numberError: true }, () => {
                    this.tetsBtnStatus();
                });
            } else {
                this.setState({ numberError: false }, () => {
                    this.tetsBtnStatus();
                });
            }
        }
        if (v === "withdrawalAmount") {
            this.setState({
                withdrawalAmount: e.target.value,
            });
            if (this.withdrawalAmountReg.test(e.target.value) === false) {
                this.setState({ moneyError: true }, () => {
                    this.tetsBtnStatus();
                });
            } else {
                this.setState({ moneyError: false }, () => {
                    this.tetsBtnStatus();
                });
            }
        }
        if (v === "percentageLimit") {
            this.setState({
                percentageLimit: e.target.value,
            });
            if (this.percentageLimitReg.test(e.target.value) === false) {
                this.setState({ limitError: true }, () => {
                    this.tetsBtnStatus();
                });
            } else {
                this.setState({ limitError: false }, () => {
                    this.tetsBtnStatus();
                });
            }
        }
    };
    tetsBtnStatus = () => {
        let {
            numberError,
            moneyError,
            limitError,
            numberOfWithdrawals,
            percentageLimit,
            withdrawalAmount,
            isChanged,
        } = this.state;
        if (
            numberError == false &&
            moneyError == false &&
            limitError == false &&
            numberOfWithdrawals &&
            percentageLimit &&
            withdrawalAmount &&
            isChanged
        ) {
            this.setState({ btnStatus: true });
        } else {
            this.setState({ btnStatus: false });
        }
    };
    render() {
        const {
            numberOfWithdrawals,
            percentageLimit,
            withdrawalAmount,
            numberError,
            moneyError,
            limitError,
            btnStatus,
        } = this.state;
        const {} = this.props;
        return (
            <Modal
                title="银行账户限额设置"
                visible={this.props.visible}
                onCancel={() =>
                    this.props.closeModal(false, () => {
                        // "closeModal resetValue"
                        this.initValueHandler(
                            "numberOfWithdrawals",
                            this.props.memberWithdrawalThresho
                                .numberOfWithdrawals
                        );
                        this.initValueHandler(
                            "withdrawalAmount",
                            this.props.memberWithdrawalThresho.withdrawalAmount
                        );
                        this.initValueHandler(
                            "percentageLimit",
                            this.props.memberWithdrawalThresho.percentageLimit
                        );
                    })
                }
                closable={true}
                width={800}
                footer={null}
                className={"bankAccountModals"}
                centered={true}
            >
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout}>
                        <div className="line-distance"></div>
                        {/* <div className='iconTip'>
                            <img src={`${process.env.BASE_PATH}/img/wallet/icon-tooltip.png`} />
                            <div className='hoverShow'>
                                <p>限额设置适用于所有提现银行账户。例：</p>
                                <p>提现次数= 50 </p>
                                <p>提现金额= 100,000 </p>
                                <p>限额百分比= 50％</p>
                                <p> ，当您成功提现25笔或达到提现总额50,000元人民币至同一个银行账户时， 系统将会提醒您注意账户安全并建议您添加或更换新的银行账户。</p>
                                <span></span>
                            </div>
                        </div> */}
                        <Row gutter={100}>
                            <Col span={12}>
                                <Item label="提款次数">
                                    <Input
                                        size="large"
                                        maxLength={9}
                                        autoComplete="off"
                                        placeholder=""
                                        value={numberOfWithdrawals}
                                        onChange={(e) =>
                                            this.changeNumberTest(
                                                e,
                                                "numberOfWithdrawals"
                                            )
                                        }
                                    />
                                </Item>
                                {/* <p style={{color:'#f00',display:numberOfWithdrawals!==''&&numberError!=''?'block':'none'}}>{numberError}</p> */}
                                {console.log(numberError)}
                                <div className="settingRequirement">
                                    <img
                                        style={{ marginRight: "0.4rem" }}
                                        src={`${process.env.BASE_PATH}/img/icon/${
                                            numberError
                                                ? "greyTick"
                                                : "greenTick"
                                        }.svg`}
                                    />
                                    只许使用数字1-999,999,999
                                </div>
                            </Col>
                            <Col span={12}>
                                <Item label="提款金额">
                                    <Input
                                        size="large"
                                        maxLength={9}
                                        autoComplete="off"
                                        placeholder=""
                                        value={withdrawalAmount}
                                        onChange={(e) =>
                                            this.changeNumberTest(
                                                e,
                                                "withdrawalAmount"
                                            )
                                        }
                                    />
                                    {/* <i className='money-icon'>¥</i> */}
                                </Item>
                                {/* <p style={{color:'#f00',display:withdrawalAmount!==''&&moneyError!=''?'block':'none'}}>{moneyError}</p> */}
                                <div className="settingRequirement">
                                    <img
                                        style={{ marginRight: "0.4rem" }}
                                        src={`${process.env.BASE_PATH}/img/icon/${
                                            moneyError
                                                ? "greyTick"
                                                : "greenTick"
                                        }.svg`}
                                    />
                                    只许使用数字1-999,999,999
                                </div>
                            </Col>
                            <Col span={12}>
                                <Item label="限额百分比(%)">
                                    <Input
                                        size="large"
                                        maxLength={9}
                                        autoComplete="off"
                                        placeholder=""
                                        value={percentageLimit}
                                        onChange={(e) =>
                                            this.changeNumberTest(
                                                e,
                                                "percentageLimit"
                                            )
                                        }
                                    />
                                    {/* <i className='baifen-icon'>%</i> */}
                                </Item>
                                {/* <p style={{color:'#f00',display:percentageLimit!==''&&limitError!=''?'block':'none'}}>{limitError}</p> */}
                                <div className="settingRequirement">
                                    <img
                                        style={{ marginRight: "0.4rem" }}
                                        src={`${process.env.BASE_PATH}/img/icon/${
                                            limitError
                                                ? "greyTick"
                                                : "greenTick"
                                        }.svg`}
                                    />
                                    只许使用数字1-100%
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="settingRequirement">
                                    限额设置适用于所有提款银行账户。例： <br />
                                    提款次数= 50, <br />
                                    提款金额= 100,000 <br />
                                    限额百分比= 50％ <br />
                                    当您成功提款25笔或提款总额达50,000元人民币至同一银行账户时,
                                    系统将会提醒您注意账户安全，建议您添加或更换新的银行账户。
                                </div>
                            </Col>
                        </Row>
                        <Row
                            gutter={100}
                            className="btnRow-wrap"
                            style={{ marginTop: "3rem" }}
                        >
                            <Button
                                size="large"
                                htmlType="submit"
                                onClick={this.onSubmit}
                                block
                                disabled={!btnStatus}
                                className={`${
                                    btnStatus ? "btnactive" : "btnnoactive"
                                }`}
                            >
                                保存
                            </Button>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create({ name: "AddBankCard" })(BankAccountModals);
