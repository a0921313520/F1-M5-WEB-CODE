/*
 * @Author: Alan
 * @Date: 2023-01-12 09:46:43
 * @LastEditors: Alan
 * @LastEditTime: 2023-07-26 20:10:47
 * @Description: 存款银行列表
 * @FilePath: /F1-M1-WEB-Code/components/Wallet/depositComponents/BankAccount/index.js
 */
import React from "react";
import { Select, Input, Form } from "antd";
import OtherAccount from "./../OtherAccount";
import ABankList from "$DATA/bank.static";
const { Item } = Form;
const { Option } = Select;

class BankAccount extends React.Component {
    componentDidMount() {
        // 如果初始值存在，则设置第一个选项为默认值
        console.log(
            "this.props.bankAccounts===-------------------->",
            this.props.bankAccounts
        );
        Array.isArray(this.props.bankAccounts) &&
            this.props.bankAccounts.length &&
            this.props.setBankCode(
                this.props.bankAccounts[0][this.props.keyName[1]]
            );
    }
    componentDidUpdate(prevProps, prevState) {
        // 设置第一次进入充值的默认Code
        const { bankAccounts } = this.props;
        if (
            // 当前bank列表必须是数组并且必须有长度
            Array.isArray(bankAccounts) &&
            bankAccounts.length &&
            // 首次呼出钱包时的bank列表为undefined的情况
            (typeof prevProps.bankAccounts !== typeof bankAccounts ||
                // 银行长度不同或者第一个的code值不同（如果长度相同并且第一个值的code值相同还是不会设置默认值！！！）
                (Array.isArray(prevProps.bankAccounts) &&
                    (prevProps.bankAccounts.length !== bankAccounts.length ||
                        prevProps.bankAccounts[0][this.props.keyName[1]] !==
                            bankAccounts[0][this.props.keyName[1]])))
        ) {
            this.props.setBankCode(bankAccounts[0][this.props.keyName[1]]);
        }
    }
    render() {
        const {
            getFieldDecorator,
            isOtherAccount,
            IsPBCActive,
            setOtherAccountStatus,
            keyName,
            bankAccounts,
            bankCodeState,
            labelName,
            isAutoAssign,
        } = this.props;
        const localLabelName = labelName || "存款銀行";
        return isAutoAssign === false ? (
            Array.isArray(bankAccounts) ? (
                bankAccounts.length > 0 ? (
                    <React.Fragment>
                        <Item label={localLabelName}>
                            <div className="drop-area BankList">
                                <Select
                                    size="large"
                                    value={bankCodeState}
                                    onChange={this.props.setBankCode}
                                    getPopupContainer={() =>
                                        document.querySelector(".drop-area")
                                    }
                                    suffixIcon={
                                        <img src="/vn/img/icon/icon-dropdown.svg" />
                                    }
                                    disabled={bankAccounts.length == 1}
                                >
                                    {bankAccounts.map((value, index) => {
                                        let bankname = ABankList.find(
                                            (items) =>
                                                items.Name === value[keyName[0]]
                                        );
                                        return (
                                            <Option
                                                value={value[keyName[1]]}
                                                key={value[keyName[1]] + index}
                                            >
                                                <img
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        marginRight: 10,
                                                    }}
                                                    src={`/vn/img/bank/${
                                                        bankname && bankname.Img
                                                            ? bankname.Img
                                                            : "generic"
                                                    }.png`}
                                                />
                                                {value[keyName[0]]}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </Item>
                        {IsPBCActive ? (
                            <div className="modal-prompt-info">
                                中国人民银行正进行系统升级，部分服务功能将暂停使用。为避免交易延迟，建议您使用推荐的银行进行存款，并确保您的交易银行与该选项一致，或者尝试其他存款方式。
                            </div>
                        ) : null}
                        {/* <div className="modal-prompt-info">
            {IsPBCActive ? "中国人民银行正在进行系统升级，部分功能与服务将暂停使用。为了避免交易延迟，建议您使用以上推荐银行进行充值并选择同一个银行进行交易。您也可以选择其他充值方式。" : null}
            <OtherAccount
              getFieldDecorator={getFieldDecorator}
              isOtherAccount={isOtherAccount}
              setOtherAccountStatus={setOtherAccountStatus}
            />
          </div> */}
                    </React.Fragment>
                ) : (
                    <Item label={localLabelName}>
                        <Select
                            size="large"
                            value="暂无可存款的银行.请尝试其他存款方式"
                            disabled={true}
                        />
                    </Item>
                )
            ) : (
                <Item label={localLabelName}>
                    <Select
                        size="large"
                        value="加载中..."
                        disabled={true}
                        loading={true}
                    />
                </Item>
            )
        ) : null;
    }
}
export default BankAccount;
