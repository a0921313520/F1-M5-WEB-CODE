import React from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Spin,
    message,
    Row,
    Col,
    DatePicker,
    Button,
} from "antd";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import moment from "moment";
import { formatAmount, dateFormat } from "$ACTIONS/util";
import { translate } from "$ACTIONS/Translate";

const { Item } = Form;

class BankWithdrawalDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            startDate: moment()
                .day(moment().day() - 13)
                .format(),
            endDate: moment().format(),
            minTime: new Date(new Date().getTime() - 31536000000).getTime(), //一年
            maxTime: new Date().getTime(),
            username: "",
            BankName: "",
            Province: "",
            City: "",
            AccountNumber: "",
            Branch: "",
            LatestWithdrawalUpdateDate: "",
            TotalCountThreshold: 0,
            TotalAmountThreshold: 0,
            WithdrawalThresholdLimitCount: "",
            WithdrawalThresholdLimitAmount: "",
            startvalue: 0,
            endValue: 0,
            showStartDate: false,
            showEndDate: false,
            keyValue1: 1,
            keyValue2: 2,
        };
    }
    componentDidMount() {
        // get(ApiPort.GETMemberBanksfirst)
        //     .then((res) => {
        //         if (res && res.result && this.props.itemBankDetail) {
        //             const target = res.result.find((item) => {
        //                 return (
        //                     item.accountNumber ==
        //                     this.props.itemBankDetail.accountNumber
        //                 );
        //             });
        //             if (target) {
        //                 this.setState({
        //                     username: target.accountHolderName,
        //                     BankName: target.bankName,
        //                     Province: target.province,
        //                     City: target.city,
        //                     AccountNumber: target.accountNumber,
        //                     Branch: target.branch,
        //                 });
        //             }
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     }).finally(()=>{
        //         this.props.setIsLoading(false);
        //     })

        // get(ApiPort.GetWithdrawalThresholdLimit)
        //     .then((res) => {
        //         if (res && res.result) {
        //             this.setState({
        //                 WithdrawalThresholdLimitCount:
        //                     res.result.withdrawalThresholdLimitCount,
        //                 WithdrawalThresholdLimitAmount:
        //                     res.result.withdrawalThresholdLimitAmount,
        //             });
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
        // this.getWithdrawalThresholdHistory();
        this.renderBankDetail();
    }
    /**
     * 用props传递给来的详情,不用单独请求
     *
     * */
    renderBankDetail = () => {
        const { itemBankDetail } = this.props;
        console.log(
            "🚀 ~ file: BankWithdrawalDetails.js:103 ~ BankWithdrawalDetails ~ item:",
            itemBankDetail,
        );
        if (itemBankDetail) {
            this.setState({
                username: itemBankDetail.accountHolderName,
                BankName: itemBankDetail.bankName,
                AccountNumber: itemBankDetail.accountNumber,
            });
        }
    };

    getWithdrawalThresholdHistory = () => {
        this.setState({ isLoading: true });
        get(
            ApiPort.GetWithdrawalThresholdHistory +
                "?startDate=" +
                moment(this.state.startDate).format("YYYY-MM-DD") +
                "T00:00:00" +
                "&endDate=" +
                moment(this.state.endDate).format("YYYY-MM-DD") +
                "T23:59:59" +
                APISETS,
        )
            .then((res) => {
                this.setState({ isLoading: false });
                if (res && res.result) {
                    let item = res.result.find(
                        (ele) =>
                            ele.bankAccountNum ==
                            this.props.itemBankDetail.accountNumber,
                    );
                    if (item) {
                        this.setState({
                            TotalCountThreshold: item.totalCountThreshold,
                            TotalAmountThreshold: item.totalAmountThreshold,
                            LatestWithdrawalUpdateDate:
                                item.latestWithdrawalUpdateDate,
                        });
                    } else {
                        this.setState({
                            TotalCountThreshold: 0,
                            TotalAmountThreshold: 0,
                            LatestWithdrawalUpdateDate: "暂无更新",
                        });
                    }
                } else {
                    this.setState({
                        TotalCountThreshold: 0,
                        TotalAmountThreshold: 0,
                        LatestWithdrawalUpdateDate: "暂无更新",
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    disabledDate = (value) => {
        return (
            value &&
            (value.valueOf() < this.state.minTime ||
                value.valueOf() > this.state.maxTime)
        );
    };
    onStartChange = (v) => {
        this.setState({ showStartDate: true });
        let fourteenDays = 1209600000 - 8640000; //14天
        let srartdate = moment(v.valueOf()).format();
        if (
            this.state.endValue == 0 ||
            (v.valueOf() <= this.state.endValue &&
                v.valueOf() >= this.state.endValue - fourteenDays)
        ) {
            this.setState(
                {
                    startDate: srartdate,
                    startvalue: v.valueOf(),
                },
                () => {
                    if (this.state.showEndDate) {
                        this.getWithdrawalThresholdHistory();
                    }
                },
            );
        } else {
            if (this.state.endValue > 0 && this.state.showEndDate) {
                this.setState({
                    startDate: srartdate,
                    startvalue: v.valueOf(),
                });
                message.error("只能选择十四天以内的日期");
            }
        }
    };
    onEndChange = (v) => {
        this.setState({ showEndDate: true });
        let fourteenDays = 1209600000 - 8640000; //14天
        let endDate = moment(v.valueOf()).format();
        if (
            this.state.startvalue == 0 ||
            (v.valueOf() <= this.state.startvalue + fourteenDays &&
                v.valueOf() >= this.state.startvalue)
        ) {
            this.setState(
                {
                    endDate: endDate,
                    endValue: v.valueOf(),
                },
                () => {
                    this.getWithdrawalThresholdHistory();
                },
            );
        } else {
            this.setState({ endDate: endDate, endValue: v.valueOf() });
            message.error("只能选择十四天以内的日期");
        }
    };
    clearInputVlaue = (e) => {
        e.preventDefault();
        this.setState({
            showEndDate: false,
            showStartDate: false,
            keyValue1: new Date(),
            keyValue2: new Date(),
            endValue: 0,
        });
    };
    render() {
        const {
            username,
            BankName,
            Province,
            City,
            AccountNumber,
            Branch,
            LatestWithdrawalUpdateDate,
            WithdrawalThresholdLimitCount,
            WithdrawalThresholdLimitAmount,
            TotalCountThreshold,
            TotalAmountThreshold,
            minTime,
            maxTime,
            startDate,
            endDate,
        } = this.state;
        const { deleteCard, itemBankDetail } = this.props;
        return (
            <Modal
                title={translate("银行账户(大写)")}
                visible={this.props.visible}
                onCancel={() => this.props.closeModal(false)}
                closable={true}
                width={400}
                footer={[
                    <Button
                        size="large"
                        type="primary"
                        onClick={() => deleteCard(itemBankDetail.bankAccountID)}
                    >
                        {translate("删除")}
                    </Button>,
                ]}
                className="modal-pubilc bankDetailsModal"
                centered={true}
            >
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout}>
                        <Row>
                            <Col span={24}>
                                <div>
                                    <span>{translate("银行名称")}</span>
                                    <span>{BankName}</span>
                                </div>
                                <div>
                                    <span>{translate("银行账号")}</span>
                                    <span>
                                        {AccountNumber.replace(
                                            /\d(?=\d{3})/g,
                                            "*",
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <span>{translate("账户持有者全名")}</span>
                                    <span>{username}</span>
                                </div>
                                {/* <div>
                                    <span>省/自治区</span>
                                    <span>{Province}</span>
                                </div>
                                <div>
                                    <span>城市/城镇</span>
                                    <span>{City}</span>
                                </div>
                                <div>
                                    <span>分行</span>
                                    <span>{Branch}</span>
                                </div> */}
                            </Col>
                            {/* <Col span={12}>
                                <p className="text1">提款记录</p>
                                <p
                                    className="text2"
                                    style={{ color: "#b6b6b6" }}
                                >
                                    可查询一年之内 14 日期间的数据记录
                                </p>
                                <p className="text3">
                                    最近更新：{LatestWithdrawalUpdateDate}
                                </p>
                                <Item label="搜寻" className="startDate-Item">
                                    {(this.state.showStartDate ||
                                        this.state.showEndDate) && (
                                        <span
                                            className="clearItem"
                                            onClick={this.clearInputVlaue}
                                        >
                                            清除
                                        </span>
                                    )}
                                    <DatePicker
                                        size="large"
                                        showToday={false}
                                        allowClear={false}
                                        dropdownClassName="disabled-date"
                                        style={{ width: "100%" }}
                                        defaultPickerValue={
                                            this.state.showStartDate
                                                ? moment(minTime)
                                                : null
                                        }
                                        disabledDate={this.disabledDate}
                                        format="YYYY-MM-DD"
                                        placeholder="请选择开始日期"
                                        onChange={this.onStartChange}
                                        value={
                                            this.state.showStartDate
                                                ? moment(startDate)
                                                : null
                                        }
                                        key={this.state.keyValue1} //只用来清除input的值
                                    />
                                </Item>
                                <Item label="">
                                    <DatePicker
                                        size="large"
                                        showToday={false}
                                        allowClear={false}
                                        dropdownClassName="disabled-date"
                                        style={{ width: "100%" }}
                                        defaultPickerValue={
                                            this.state.showEndDate
                                                ? moment(maxTime)
                                                : null
                                        }
                                        disabledDate={this.disabledDate}
                                        format="YYYY-MM-DD"
                                        placeholder="请选择结束日期"
                                        onChange={this.onEndChange}
                                        value={
                                            this.state.showEndDate
                                                ? moment(endDate)
                                                : null
                                        }
                                        key={this.state.keyValue2} //只用来清除input的值
                                    />
                                </Item>
                                <p className="text4">
                                    <span>通过审核的提款总次数</span>
                                    <span>{TotalCountThreshold}次</span>
                                </p>
                                <p className="text5">
                                    <span>通过审核的提款总额</span>
                                    <span>
                                        ¥{formatAmount(TotalAmountThreshold)}
                                    </span>
                                </p>
                                <p className="text6">
                                    当您使用同一账户提款{" "}
                                    {WithdrawalThresholdLimitCount} 次或达到提款{" "}
                                    {WithdrawalThresholdLimitAmount}{" "}
                                    总额时，为了您银行账户安全起见，建议您更换或添加新的银行账户进行提款。
                                </p>
                            </Col> */}
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create({ name: "AddBankCard" })(BankWithdrawalDetails);
