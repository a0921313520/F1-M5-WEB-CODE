/*
 * @Author: Alan
 * @Date: 2023-03-30 19:27:33
 * @LastEditors: Alan
 * @LastEditTime: 2023-04-05 11:04:54
 * @Description: 头部注释
 * @FilePath: \F1-M1-WEB-Code\components\Wallet\depositComponents\OtherAccount\index.js
 */
import React from "react";
import { Input, Form, Button } from "antd";
import { sixLastNumReg } from "$ACTIONS/reg";

const { Item } = Form;

class OtherAccount extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { getFieldDecorator, isOtherAccount, setOtherAccountStatus } =
            this.props;
        return (
            <div className="other-account-wrap">
                {/* <div className="gray-color"> ，您已充值到旧银行账户？<Button type="link" className="inline" onClick={setOtherAccountStatus}>请点击这里</Button></div> */}
                <Button
                    size="large"
                    type="link"
                    onClick={setOtherAccountStatus}
                    block
                >
                    <center>糟了! 我存到旧账号了</center>
                </Button>
                {/* <Item className="other-account clear-margin-bottom clear-padding" label="输入该账号最后6位号码" style={{ "display": isOtherAccount ? "block" : "none" }}> */}
                <Item
                    className="other-account"
                    label="输入该账号最后6位号码"
                    style={{ display: isOtherAccount ? "block" : "none" }}
                >
                    {getFieldDecorator("lastSixNum", {
                        rules: [
                            // { required: true, message: '请输入最后6位号码！' },
                            {
                                validator: (rule, value, callback) => {
                                    // const { form } = this.props;
                                    if (value && !sixLastNumReg.test(value)) {
                                        callback("请输入正确的6位号码！");
                                    }
                                    callback();
                                },
                            },
                        ],
                    })(<Input autoComplete="off" maxLength={6} />)}
                </Item>
            </div>
        );
    }
}
export default OtherAccount;
