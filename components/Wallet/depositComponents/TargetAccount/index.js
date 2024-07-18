/*
 * @Author: Alan
 * @Date: 2023-02-21 16:54:35
 * @LastEditors: Alan
 * @LastEditTime: 2023-03-30 19:28:10
 * @Description: 头部注释
 * @FilePath: \F1-M1-WEB-Code\components\Wallet\depositComponents\TargetAccount\index.js
 */
import React from "react";
import { Select, Form, Input } from "antd";
import { GetWalletList } from "$DATA/wallet";
import BonusList from "./BonusList";
import { connect } from "react-redux";

const { Item } = Form;
const { Option } = Select;

class TargetAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toWalletList: [], // 目标账户列表
        };

        this.getDepositWallet = this.getDepositWallet.bind(this); // 获取目标账户列表
        this.setTargetName = this.setTargetName.bind(this); // 设置当前选中的目标账户名称和目标账户值
        this.defaultToWallet = "MAIN";
    }
    componentDidMount() {
        this.getDepositWallet(); // Get目标账户

        const PREFER_WALLET = localStorage.getItem("PreferWallet");
        PREFER_WALLET && (this.defaultToWallet = PREFER_WALLET);
    }
    componentDidUpdate(prevProps, prevState) {
        // 设置第一次进入目标账户的默认Code
        if (prevState.toWalletList.length !== this.state.toWalletList.length) {
            const { toWalletList } = this.state; // 当前支付方式的详情
            if (toWalletList.length) {
                const targetAccount =
                    this.props.targetAccount || this.defaultToWallet;
                let targetVal = toWalletList[0].key,
                    targetName = toWalletList[0].name;
                // 父级传递默认目标账户修改默认目标账户
                if (targetAccount) {
                    let toWalletListAggregation = toWalletList.find(
                        (val) => val.key === targetAccount,
                    );
                    (targetVal = targetAccount),
                        (targetName = toWalletListAggregation.name);
                }
                this.props.setTargetValue(targetVal, targetName);
            }
        }
    }
    setTargetName(v) {
        const currVal = this.state.toWalletList.find((val) => val.key === v);
        this.props.setTargetValue(v, currVal && currVal.name);
    }
    // 获取目标账户列表
    getDepositWallet() {
        GetWalletList((res) => {
            this.setState({
                toWalletList: res.result.fromWallet,
            });
        });
    }
    render() {
        const {
            getFieldDecorator,
            getFieldValue,
            targetAccount,
            targetValue,
            setBonusValue,
            bonusId,
            bonusVal,
        } = this.props;
        const { toWalletList } = this.state;
        console.log("targetAccount", targetAccount);
        console.log("targetValue", targetValue, this.props.selectedBonus);
        console.log("this.props.depositMethod", this.props.depositMethod);
        return (
            <React.Fragment>
                {/* <Item label="目标账户">
          {toWalletList.length ? <div className="drop-area"><Select size="large" value={targetValue} onChange={this.setTargetName} getPopupContainer={() => document.querySelector('.drop-area')}>
            {toWalletList.map((value, index) => {
              return (
                <Option value={value.key} key={value.key + index}>{value.name}</Option>
              );
            })}
          </Select></div> : <Select size="large" value="加载中..." disabled={true} loading={true}></Select>}
        </Item>
        {this.props.depositMethod!=='CHANNEL' && this.props.depositMethod !== 'INVOICE'&&this.props.depositMethod !== 'INVOICE_AUT'&& this.props.depositMethod!=="SR"&&
          <BonusList
            setLoading={this.props.setLoading}
            getFieldDecorator={getFieldDecorator}
            getFieldValue={getFieldValue}
            bonusId={bonusId}
            bonusVal={bonusVal}
            setBonusValue={setBonusValue}
            targetValue={this.props.selectedBonus?.account || targetValue}
            targetAccount={targetAccount}
            transactionType='Deposit'
            depositMethod={this.props.depositMethod?this.props.depositMethod:''}//OTC充值用的，别的充值用不到
          />
        } */}
            </React.Fragment>
        );
    }
}
function mapStateToProps(state) {
    return {
        selectedBonus: state.promotion.selectedBonus,
    };
}
export default connect(mapStateToProps)(TargetAccount);
