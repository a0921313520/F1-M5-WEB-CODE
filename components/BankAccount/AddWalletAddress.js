import React from "react";
import { Modal, Button, Input, Form } from "antd";
import {translate} from "$ACTIONS/Translate";
const { Item } = Form;

function AddWalletAddress(props) {
    const {
        visibleExchangeRateWallet,
        leaveAddWallet,
        exchangeRateWalletTest,
        handleOk,
        addTDBBtnStatue,
        tDBName,
        tDBAddress,
        tDBAddressError,
        tDBNameError,
        tDBAddressError2,
        ctcMethod
    } = props;
    const isErc = ctcMethod === "USDT-ERC20";
    console.log("🚀 ~ file: AddWalletAddress.js:21 ~ AddWalletAddress ~ ctcMethod:", ctcMethod)
    return (
        <Modal
            title={translate("添加钱包") + ctcMethod}
            visible={visibleExchangeRateWallet}
            onCancel={leaveAddWallet}
            footer={null}
            className="modal-pubilc addExchangeRateWalletModal"
            width={400}
            centered={true}
        >
            <Form className="WalletModal-form-wrap">
                <Item label={translate("钱包名称")}>
                    <Input
                        size="large"
                        className="tlc-input-disabled"
                        placeholder={translate("请输入钱包名称")}
                        onChange={(e) => exchangeRateWalletTest(e, "name")}
                        maxLength={20}
                        value={tDBName}
                    />
                    <div className="modal-wallet-info">
                        <img
                            style={{ marginRight: "0.4rem" }}
                            src={`${process.env.BASE_PATH}/img/icon/${
                                !tDBNameError ? "redCross" : "greenTick"
                            }.svg`}
                        />
                        {translate("不包含特殊字符")}
                    </div>
                    <div className="modal-wallet-info">
                        <img
                            style={{ marginRight: "0.4rem" }}
                            src={`${process.env.BASE_PATH}/img/icon/${
                                !tDBName ? "redCross" : "greenTick"
                            }.svg`}
                        />
                        {translate("最多20个字符")}
                    </div>
                </Item>
                <Item label={translate("钱包地址")}>
                    <Input
                        size="large"
                        className="tlc-input-disabled"
                        placeholder={translate("请输入钱包地址")}
                        onChange={(e) =>
                            exchangeRateWalletTest(
                                e,
                                "address",
                                props.ctcMethod
                            )
                        }
                        maxLength={isErc ? 42 : 34}
                        value={tDBAddress}
                    />
                    <div className="modal-wallet-info">
                        <img
                            style={{ marginRight: "0.4rem" }}
                            src={`${process.env.BASE_PATH}/img/icon/${
                                !tDBAddressError2 ? "redCross" : "greenTick"
                            }.svg`}
                        />
                        {translate("请勿包含空格和特殊字符")}
                    </div>
                    <div className="modal-wallet-info">
                        <img
                            style={{ marginRight: "0.4rem" }}
                            src={`${process.env.BASE_PATH}/img/icon/${
                                !tDBAddressError ?  "redCross": "greenTick"
                            }.svg`}
                        />
                        {isErc
                            ? translate("由始终以“0x”开头的字符串组成，后跟 40 个字母“a-f”和数字“0-9”")
                            : translate('由以“T”开头的 34 个字母数字字符组成的字符串')}
                    </div>
                </Item>
                <Item>
                    <div className="btn-wrap">
                        <Button
                            size="large"
                            htmlType="submit"
                            block
                            onClick={handleOk}
                            disabled={!addTDBBtnStatue}
                            className={`${addTDBBtnStatue ? "active" : ""}`}
                        >
                            {translate("提交")}
                        </Button>
                    </div>
                </Item>
            </Form>
        </Modal>
    );
}

export default AddWalletAddress;
