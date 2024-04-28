import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Spin, Select, Form, message } from "antd";
import { mailConversion } from "$ACTIONS/util";
import { translate } from "$ACTIONS/Translate";
const { TextArea } = Input;
const { Option } = Select;

// 已申請資料Modal
export function AppliedDataModal(props) {
    const { isVisible, onCancel, appliedItem } = props;
    console.log("🚀 ~ file: Modal.js:11 ~ AppliedDataModal ~ appliedItem:", appliedItem)


    return (
        <Modal
            width={400}
            title={translate("奖励信息")}
            className="check-apply-data-container promotion-modal"
            visible={isVisible}
            onCancel={onCancel}
            footer={null}
            centered
        >
            {appliedItem && (
                <>
                    <h3>{appliedItem.promotionTitle}</h3>
                    {/* <div>
                        <Input
                            addonBefore="用户名"
                            defaultValue={localStorage.getItem("UserName")}
                            disabled
                        />
                        <div>
                            <Input
                                addonBefore="电子邮箱"
                                defaultValue={mailConversion(
                                    appliedItem.emailAddress
                                )}
                                disabled
                            />
                            <p>
                                如果您想更新电子邮箱，请联系我们的
                                <span onClick={popUpLiveChat}>在线客服</span>
                            </p>
                        </div>
                        <div>
                            <Input
                                addonBefore="联系电话"
                                defaultValue={`******${appliedItem.contactNo.slice(
                                    6
                                )}`}
                                disabled
                            />
                            <p>
                                如果您想更新联系电话，请联系我们的
                                <span onClick={popUpLiveChat}>在线客服</span>
                            </p>
                        </div>
                        <div className="ant-input-group-wrapper">
                            <label>留言</label>
                            <TextArea value={appliedItem.remarks} disabled />
                        </div>
                    </div> */}
                    <div>
                        <label>{translate("奖励地址")}</label>
                        <div className="ant-input-group-wrapper">
                            <h4>
                                {translate("电话及地址信息")}
                            </h4>
                            <p>+ {appliedItem.contactNo}</p>
                            <p>{}</p>
                        </div>
                        <label>{translate("备注")}</label>
                        <div className="ant-input-group-wrapper">
                            <p>{appliedItem.remarks}</p>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
}

export function TransferModal(props) {
    const {
        visible,
        onCancel,
        fromWalletList,
        currentMoneyList,
        toWalletName,
        onDepositSubmit,
        onTransferSubmit,
        WalletBonusProfile,
        selectedPromotionDetail,
        isOneClickTransfer,
        moneyModalLoading,
        isRefreshingBalance,
    } = props;

    const fromWalletListDetail = currentMoneyList.filter((wallet) => {
        return fromWalletList.some((w) => w.key === wallet.name);
    });

    const [fromWalletName, setFromWalletName] = useState(
        fromWalletListDetail[0].name
    );
    const [inputAmount, setInputAmount] = useState(null);

    const refInputAmount = useRef();
    const refToWalletInfo = useRef();
    const refButtonOneClickedTransfer = useRef();
    const refForm = useRef();

    const fromWalletDetail = currentMoneyList.find(
        (wallet) => wallet.name === fromWalletName
    );

    const toWalletDetail = currentMoneyList.find(
        (wallet) => wallet.localizedName === toWalletName
    );

    //最大滿足可得紅利
    const maxDepositAmount =
        selectedPromotionDetail.bonusMaxAmount / WalletBonusProfile.givingRate;

    const numberValidatorHandler = function (e) {
        const { value } = e.target;
        const regex1 = /[^0-9]/g;
        const regex2 = /[+*/e-]/g;
        let validValue = Number(
            String(value).replace(regex1, "").replace(regex2, "")
        );
        // if(validValue > selectedPromotionDetail.bonusMaxAmount){

        //   validValue=selectedPromotionDetail.bonusMaxAmount
        //   message.error("已達優惠申請金額上限")
        // }
        return setInputAmount(validValue);
    };

    useEffect(() => {
        setInputAmount(0);
        if (refInputAmount.current?.value || refToWalletInfo.current?.state) {
            refInputAmount.current.value = "";
            refToWalletInfo.current.state.value = `${toWalletName}  ¥ ${toWalletDetail.balance.toFixed(
                2
            )}`;

            console.log("refToWalletInfo", refToWalletInfo);
        }
    }, [toWalletDetail]);

    const closeModalHandler = function (e) {
        onCancel();
        refInputAmount.current.value = "";
        setFromWalletName(fromWalletListDetail[0].name);
        setInputAmount(null);
    };

    console.log("fromWalletName", fromWalletName);
    console.log("fromWalletList", fromWalletList);
    console.log("currentMoneyList", currentMoneyList);
    console.log("fromWalletListDetail", fromWalletListDetail);
    console.log("toWalletDetail", toWalletDetail);
    console.log("inputAmount", inputAmount);
    console.log("WalletBonusProfile", WalletBonusProfile);
    // 将输入金额设为默认值0
    const input = inputAmount || 0;

    // 获取当前钱包奖金配置中的给予率
    const bonusRate = WalletBonusProfile.givingRate;

    // 获取当前选择的优惠详情中的奖金最大值
    const maxBonusAmount = selectedPromotionDetail.bonusMaxAmount;

    // 获取当前钱包奖金配置中的释放价值
    const releaseValue = WalletBonusProfile.releaseValue;

    // 判断输入金额是否符合奖金资格
    const bonusEligible = input * bonusRate <= maxBonusAmount;

    // 根据是否符合奖金资格，计算出所需流水金额
    let amount = 0;

    if (
        !isNaN(input) &&
        !isNaN(bonusRate) &&
        !isNaN(maxBonusAmount) &&
        !isNaN(releaseValue)
    ) {
        // 验证数值的有效性
        if (bonusEligible) {
            amount = (input + input * bonusRate) * releaseValue;
        } else {
            amount =
                (maxDepositAmount + maxDepositAmount * bonusRate) *
                releaseValue;
        }
    }
    return (
        <Modal
            visible={visible}
            className="theme-modal Form-modal promotion-modal promotion-transfer-modal title-background"
            title={translate("资金转账")}
            width={400}
            footer={<></>}
            centered={true}
            onCancel={closeModalHandler}
        >
            <Spin
                spinning={moneyModalLoading || isRefreshingBalance}
                size="large"
                tip={translate("加载中")}
            >
                <Form className="transfer-box" ref={refForm}>
                    <div className="transfer-function-box">
                        {isOneClickTransfer && (
                            <div className="warm-reminder">
                                {translate("注：请点击“一键”图标将余额转至“主账户”，然后将资金转至目标账户以注册参加促销活动")}
                            </div>
                        )}
                        <div className="from-wallet-select-box">
                            <label>{translate("来源账户")}</label>
                            {isOneClickTransfer && (
                                <button
                                    className="button-transfer"
                                    ref={refButtonOneClickedTransfer}
                                    onClick={() => {
                                        const data = {
                                            fromWalletDetail: fromWalletDetail,
                                            toWalletName: toWalletDetail.name,
                                            inputAmount,
                                            selectedPromotionDetail,
                                            isOneClickTransfer: true,
                                        };
                                        onTransferSubmit(data);
                                    }}
                                >
                                    <img src={`${process.env.BASE_PATH}/img/wallet/transfericon.svg`} />
                                </button>
                            )}

                            <div id="tabSelect">
                                <Select
                                    id="wallet-select"
                                    size="large"
                                    placeholder=""
                                    onChange={(optionValue) => {
                                        setFromWalletName(optionValue);
                                    }}
                                    onDropdownVisibleChange={(status) =>
                                        !status
                                    }
                                    dropdownClassName="wallet-list-box"
                                    value={fromWalletName}
                                    defaultValue={fromWalletListDetail[0].name}
                                    getPopupContainer={() =>
                                        document.getElementById(
                                            "tabSelect"
                                        )
                                    }
                                >
                                    {fromWalletListDetail.map((wallet, i) => {
                                        return (
                                            <Option key={i} value={wallet.name}>
                                                <div className="option-item">
                                                    <p>{`${
                                                        wallet.localizedName
                                                    }  ¥ ${wallet.balance.toFixed(
                                                        2
                                                    )}`}</p>
                                                </div>
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label>{translate("目标账户")}</label>
                            <Input
                                disabled={true}
                                ref={refToWalletInfo}
                                className="input-transfer-to"
                                defaultValue={`${toWalletName}  ¥ ${toWalletDetail?.balance.toFixed(
                                    2
                                )}`}
                            />
                        </div>
                        <div>
                            <label>{translate("转账金额")}</label>
                            <input
                                ref={refInputAmount}
                                className="input-amount"
                                defaultValue={null}
                                value={inputAmount || ""}
                                size="large"
                                placeholder={translate("输入金额")}
                                onChange={numberValidatorHandler}
                                min={selectedPromotionDetail.bonusMinAmount}
                            />
                        </div>

                        <div className="promotion-info-box">
                            <p className="promotion-title">
                                {selectedPromotionDetail.promoTitle}
                            </p>
                            <div className="amount-box">
                                <div className="amount-item">
                                    <p className="title">{translate("申请金额")}</p>
                                    <p className="amount">{`¥ ${
                                        inputAmount || 0
                                    }`}</p>
                                </div>
                                <div className="amount-item">
                                    <p className="title">{translate("可得红利")}</p>
                                    <p className="amount">{`¥ ${
                                        (inputAmount || 0) *
                                            WalletBonusProfile.givingRate <=
                                        selectedPromotionDetail.bonusMaxAmount
                                            ? (inputAmount || 0) *
                                              WalletBonusProfile.givingRate
                                            : selectedPromotionDetail.bonusMaxAmount
                                    }`}</p>
                                </div>
                                <div className="amount-item">
                                    <p className="title">{translate("所需流水")}</p>
                                    {/* <p className="amount">
                                        
                                        {(inputAmount || 0) *
                                            WalletBonusProfile.givingRate <=
                                        selectedPromotionDetail.bonusMaxAmount
                                            ? ((inputAmount || 0) +
                                                  (inputAmount || 0) *
                                                      WalletBonusProfile.givingRate) *
                                              WalletBonusProfile.releaseValue
                                            : (maxDepositAmount +
                                                  maxDepositAmount *
                                                      WalletBonusProfile.givingRate) *
                                              WalletBonusProfile.releaseValue}
                                    </p> */}
                                    <p className="amount">{amount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ps_button" id="transfer-button-box">
                        <button
                            className="btn-submit-transfer"
                            disabled={Boolean(!inputAmount)}
                            onClick={() => {
                                const data = {
                                    fromWalletDetail: fromWalletDetail,
                                    toWalletName: toWalletDetail.name,
                                    inputAmount,
                                    selectedPromotionDetail,
                                    isOneClickTransfer: false,
                                };
                                onTransferSubmit(data);
                                Pushgtagdata(
                                    "Transfer",
                                    "Submit",
                                    `Transfer_${selectedPromotionDetail.promoId}`
                                );
                            }}
                        >
                            {translate("转移")}
                        </button>
                        <button
                            className="btn-go-deposit"
                            onClick={onDepositSubmit}
                        >
                            {translate("存款")}
                        </button>
                    </div>
                </Form>
            </Spin>
        </Modal>
    );
}
