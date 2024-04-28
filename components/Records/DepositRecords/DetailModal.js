import React from "react";
import {
    Modal,
    Spin
} from "antd";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { formatAmount } from "$ACTIONS/util";
import {translate} from "$ACTIONS/Translate";

class DepositRecordsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false
        }
    }
    componentDidMount(){
        this.GetTransactionDetail()
    }
    GetTransactionDetail = () => {
        this.props.setLoading(true);
        const recordItem = this.props.data;
        get(
            ApiPort.GetTransactionDetail +
                "&transactionID=" +
                recordItem.transactionId +
                "&transactionType=Deposit"
        )
            .then((res) => {
                this.props.setLoading(false);
                if (res && res.result) {
                    const { result } = res;
                    Modal.info({
                        icon: null,
                        centered: true,
                        title: translate("交易明细"),
                        className: "confirm-modal-of-public oneButton dont-show-close-button",
                        content: (
                            <ul className="t-resubmit-list">
                                {["MMO","VP"].some((item)=>item === recordItem.paymentMethodId) && (
                                    <div>
                                        <li>
                                            <div>{translate("金额")}</div>
                                            <div>{formatAmount(result.amount)} đ</div>
                                        </li>
                                        <li>
                                            <div>{translate("实际到账金额")}</div>
                                            <div>{formatAmount(result.actualAmount)} đ</div>
                                        </li>
                                    </div>
                                )}
                                {("PHC" === recordItem.paymentMethodId) && (
                                    <div>
                                        <li>
                                            <div>{translate("刮刮卡面值")}</div>
                                            <div>{formatAmount(result.amount)} đ</div>
                                        </li>
                                        <li>
                                            <div>{translate("实际到账金额")}</div>
                                            <div> {formatAmount(result.actualAmount)} đ </div>
                                        </li>
                                    </div>
                                )}
                                {("CC" === recordItem.paymentMethodId) && (
                                    <div>
                                        <li>
                                            <div>{translate("现金卡序列号")}</div>
                                            <div>{result.serialNo}</div>
                                        </li>
                                        <li>
                                            <div>{translate("金额")}</div>
                                            <div> {formatAmount(result.amount)} đ</div>
                                        </li>
                                    </div>
                                )}
                                {("FP" === recordItem.paymentMethodId) && (
                                    <div>
                                        <li>
                                            <div>{translate("银行")}</div>
                                            <div>{result.bankName}</div>
                                        </li>
                                        <li>
                                            <div>{translate("付款方式")}</div>
                                            <div> {result.method}</div>
                                        </li>
                                        <li>
                                            <div>{translate("金额")}</div>
                                            <div> {formatAmount(result.amount)} đ</div>
                                        </li>
                                    </div>
                                )}
                                {["BQR","QD"].some((item)=>item === recordItem.paymentMethodId) && (
                                    <div>
                                        <li>
                                            <div>{translate("账户持有者姓名")}</div>
                                            <div>{result.accountHolderName}</div>
                                        </li>
                                        <li>
                                            <div>{translate("付款方式")}</div>
                                            <div> {result.methodOriName}</div>
                                        </li>
                                        <li>
                                            <div>{translate("金额")}</div>
                                            <div>{formatAmount(result.amount)} đ</div>
                                        </li>
                                    </div>
                                )}
                                {("LB" === recordItem.paymentMethodId) && (
                                    <div>
                                        <li>
                                            <div>{translate("账户持有者姓名")}</div>
                                            <div>{result.accountHolderName}</div>
                                        </li>
                                        <li>
                                            <div>{translate("付款方式")}</div>
                                            <div>{result.methodOriName}</div>
                                        </li>
                                        {/* <li>
                                            <div>{translate("银行账户")}</div>
                                            <div>{result.bankInType}</div>
                                        </li> */}
                                        <li>
                                            <div>{translate("金额")}</div>
                                            <div>{formatAmount(result.amount)} đ</div>
                                        </li>
                                    </div>
                                )}
                                {("CTC" === recordItem.paymentMethodId) && (
                                    <div>
                                        <li>
                                            <div>{translate("金额")}</div>
                                            <div>{formatAmount(result.amount)} đ</div>
                                        </li>
                                        <li className="exchangeRate">
                                            <div>{translate("汇率")}</div>
                                            <div>{"1 USDT-ERC20 = xxx,xxx.xx VND"}</div>
                                        </li>
                                        <li className="gray">
                                            {translate("汇率")}: 1000 VND = XXXX USDT-TRC20 <br/>
                                            {translate("汇率仅供参考，交易将按交易时的实际汇率计算。")}
                                        </li>
                                        <li className="line"></li>
                                        <li className="exchangeRate">
                                            <div>{translate("钱包地址")}</div>
                                            <div>{result.walletAddress}</div>
                                        </li>
                                        <li className="gray">
                                            <ul className="list2">
                                                <li>{translate("最低一次性存款")}: 1000 VND = XXXX USDT-TRC20</li>
                                                <li>{translate("该钱包地址是为您保留的，可以多次使用。")}</li>
                                            </ul>
                                        </li>
                                        <li className="line"></li>
                                    </div>
                                )}
                                {("LBQR"  === recordItem.paymentMethodId) &&
                                    <div>
                                        <li>
                                            <div>{translate("金额")}</div>
                                            <div>{formatAmount(result.amount)} đ</div>
                                        </li>
                                        <li>
                                            <div>{translate("银行")}</div>
                                            <div>{result.bankName}</div>
                                        </li>
                                    </div>
                                }
                            </ul>
                        ),
                        okText: translate("关闭"),
                        onOk: () => {
                            this.props.closeModal()
                        }
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            }).finally(()=>{
                this.props.setLoading(false);
            })
    };
    render(){
        const {
            loading
        } = this.state;
        return(
            <Spin  tip={translate("加载中")} spinning={loading}/>
        )
    }
}

export default DepositRecordsDetail