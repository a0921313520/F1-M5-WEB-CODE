/*
 * @Author: Alan
 * @Date: 2023-01-12 09:46:43
 * @LastEditors: Alan
 * @LastEditTime: 2023-06-29 08:56:37
 * @Description: 存款人姓名
 * @FilePath: /F1-M1-WEB-Code/components/RealyName/WalletName.js
 */
import React from "react";
import { Form, Input } from "antd";
import { realyNameReg } from "$ACTIONS/reg";

const { Item } = Form;
class WalletName extends React.Component {
    static defaultProps = {
        showDepositorNameField: false,
        prefillRegisteredName: false,
    };
    constructor(props) {
        super(props);
        this.state = {};

        this.accessAccountName = ["BC", "BCM", "OA", "WC", "PPB", "UP"];
    }
    componentDidMount() {}
    render() {
        const {
            payTypeCode,
            getFieldDecorator,
            showDepositorNameField,
            prefillRegisteredName,
        } = this.props;
        console.log(showDepositorNameField);
        return this.accessAccountName.includes(payTypeCode) &&
            (showDepositorNameField || prefillRegisteredName) ? (
            showDepositorNameField && prefillRegisteredName ? (
                <div>
                    <div
                        className="TextLightGrey modal-prompt-info"
                        style={{ lineHeight: "1.5715", marginBottom: 10 }}
                    >
                        请确保您的存款账户姓名与注册姓名一致，任何他人代付或转账将被拒绝且无法保证退款。
                    </div>
                    {/* <Item
					label={
						<div>
							存款人姓名<span className="theme-color"> *</span>
						</div>
					}
				/> */}
                </div>
            ) : showDepositorNameField ? (
                <div>
                    <Item
                        label={
                            <div>
                                存款人姓名
                                {/* <span className="theme-color"> *</span> */}
                            </div>
                        }
                    >
                        {getFieldDecorator("accountHolderName", {
                            rules: [
                                { required: true, message: "请输入姓名" },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value) {
                                            if (!realyNameReg.test(value)) {
                                                callback("格式不正确");
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        })(
                            <Input
                                size="large"
                                autoCapitalize="false"
                                placeholder="请输入姓名"
                            />,
                        )}
                    </Item>
                    <div className="modal-prompt-info">
                        请使用您本人账户进行转账，任何他人代付或转账将被拒绝且无法保证退款。
                    </div>
                </div>
            ) : null
        ) : null;
    }
}

export default WalletName;
