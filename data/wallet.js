import { message, Modal } from "antd";
import { get, post, patch } from "$SERVICES/TlcRequest";
import { ApiPort, APISET, APISETS } from "$SERVICES/TLCAPI";

/**
 * 获取余额
 * @param {Function} call 回调函数
 * @param {Function} setLoadingStatus 设置Loading状态的函数
 * @returns {Promise} 返回Promise对象
 */
export async function GetAllBalance(call, setLoadingStatus) {
    try {
        setLoadingStatus && setLoadingStatus(true);
        const res = await get(ApiPort.GETBalance + APISETS);
        typeof call === "function" && call(res);
        return res;
    } catch (error) {
        console.log("GetAllBalance error:", error);
        return null;
    } finally {
        setLoadingStatus && setLoadingStatus(false);
    }
}

// 获取提款验证相关数据
export function GetWithdrawalVerification(call, setLoadingStatus) {
    setLoadingStatus && setLoadingStatus(true);
    get(ApiPort.WithdrawalVerification + APISET)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("GetWithdrawalVerification error:", error);
            return null;
        })
        .finally(() => {
            setLoadingStatus && setLoadingStatus(false);
        });
}

// 获取支付方式
export function GetPayList(call) {
    get(ApiPort.GETPaymentlistAPI)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("GetPayList error:", error);
            return null;
        });
}

/**
 * 获取支付渠道默认值
 * @param {object} payMethodsDetail 当前支付方式详情
 */
export function GetAvailableMethods(payMethodsDetail) {
    if (
        payMethodsDetail &&
        Array.isArray(payMethodsDetail.availableMethods) &&
        payMethodsDetail.availableMethods.length
    ) {
        if (
            payMethodsDetail.availableMethods.length >= 2 &&
            payMethodsDetail.code !== "CTC"
        ) {
            if (
                payMethodsDetail.availableMethods[0] == "DEFAULT" ||
                payMethodsDetail.availableMethods[0].methodCode == "DEFAULT"
            ) {
                return payMethodsDetail.availableMethods[1].methodCode;
            } else {
                return payMethodsDetail.availableMethods[0].methodCode;
            }
        } else {
            return payMethodsDetail.availableMethods[0].methodCode;
        }
    }
}

// 获取支付方式的详情
export function GetPayDetail(type, call, payListOrValue) {
    let MethodCode = "";
    if (Array.isArray(payListOrValue)) {
        const payMethodsDetail = payListOrValue.find(
            (item) => item.code === type,
        );
        MethodCode = GetAvailableMethods(payMethodsDetail) || "";
    } else if (typeof payListOrValue === "string") {
        MethodCode = payListOrValue;
    }

    const apa =
        ApiPort.GETDepositDetailsAPI +
        type +
        "&MethodCode=" +
        MethodCode +
        "&isMobile=" +
        (type === "BCM" ? "true" : "false") +
        "&hostName=" +
        ApiPort.LOCAL_HOST;

    get(
        ApiPort.GETDepositDetailsAPI +
            type +
            "&MethodCode=" +
            MethodCode +
            "&isMobile=" +
            (type === "BCM" ? "true" : "false") +
            "&hostName=" +
            ApiPort.LOCAL_HOST,
    )
        .then((res) => {
            call(res);
            console.log("bctype=====", type);
            console.log("apa===", apa);
        })
        .catch((error) => {
            console.log("GetPayDetail error:", error);
            return null;
        });
}

// 获取目标账户列表
export function GetWalletList(call) {
    const localWalletList = localStorage.getItem("walletList");
    localWalletList === null || localWalletList === ""
        ? get(ApiPort.GETWallets)
              .then((res) => {
                  if (res) {
                      localStorage.setItem("walletList", JSON.stringify(res));
                      call(res);
                  }
              })
              .catch((error) => {
                  console.log("GetWalletList error:", error);
                  return null;
              })
        : call(JSON.parse(localWalletList));
}

// 获取可申请优惠列表
export function GetWalletBonus(AccountType, call, transactionType) {
    get(
        ApiPort.GETBonuslistAPI +
            transactionType +
            "&" +
            "wallet=" +
            AccountType +
            APISETS,
    )
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("GetWalletBonus error:", error);
            return null;
        });
}

// 提交充值 || 提交提款
export function CommonPostPay(data, call) {
    post(ApiPort.POSTApplications, data)
        .then((res) => {
            console.log("res==commonpostpaydata", data);
            console.log("res==commonpostpay", res);
            call(res);
            if (!res.isSuccess) {
                // call(res);
                //return data.transactionType !== "Withdrawal" && message.error(res.errorMessage || "数据异常，请联系在线客服！");
                /*let displayErrorMsg = res.errorMessage
      console.log("res",res)
      if (displayErrorMsg.indexOf("小同客服")>-1 && res.isPopup) {
        let errorMessageArr = displayErrorMsg.split("小同客服")
        displayErrorMsg = errorMessageArr.map((item, index) => {
          if (index != errorMessageArr.length-1) {
            return <><span className="content-text">{item}</span><a onClick={()=>{global.PopUpLiveChat()}} ><span style={{ fontWeight : "bold" }}>小同客服</span></a></>	
          } else {
            return <span>{item}</span>
          }
          
        });
      }*/
                let displayErrorMsg = res.errorMessage;
                if (res.isPopup) {
                    displayErrorMsg = (
                        <span>
                            抱歉，由于您还有未完成的充值记录，暂时无法重复提交。若您已转账成功，请
                            <a
                                onClick={() => {
                                    global.PopUpLiveChat();
                                }}
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    联系小同客服
                                </span>
                            </a>
                            。
                        </span>
                    );
                }
                if (res.errors) {
                    displayErrorMsg =
                        res.errors[0].description ||
                        res.errors[0].message ||
                        " 抱歉，系统忙碌中，建议您使用其他存款方式";
                }

                if (
                    data.transactionType !== "Withdrawal" &&
                    data.paymentMethod !== "SR" &&
                    data.paymentMethod !== "PPB" &&
                    res.errorCode !== "P101007"
                ) {
                    if (
                        (data.methodcode === "AliBnBQR" ||
                            data.methodcode === "WCBnBQR") &&
                        res.errorCode === "P101105"
                    ) {
                        Modal.confirm({
                            title: "温馨提示",
                            icon: null,
                            centered: true,
                            okText: "返回充值首页",
                            cancelText: "在线客服",
                            cancelButtonProps: {
                                type: "primary",
                                ghost: true,
                                onClick: () => {
                                    paybnbConfirm.destroy();
                                    global.PopUpLiveChat();
                                },
                            },
                            content: (
                                <div style={{ textAlign: "left" }}>
                                    {displayErrorMsg}
                                </div>
                            ),
                            onOk: () => {},
                            onCancel: () => {},
                        });
                    } else {
                        message.error(displayErrorMsg);
                        // Modal.info({

                        // 	className: 'confirm-modal-of-public',
                        // 	icon: <div />,
                        // 	okText: '关闭',
                        // 	title: <div style={{ textAlign: 'center' }}>温馨提示</div>,
                        // 	content: <div style={{ textAlign: 'center' }}>{<p>{displayErrorMsg}</p>}</div>
                        // });
                    }
                }
            }
            // else {
            //     call(res);
            // }
        })
        .catch((error) => {
            console.log("CommonPostPay error:", error);
            return null;
        });
}

// 提交充值确认
export function CommonPostConfirmPay(data, call) {
    post(
        ApiPort.POSTPaymentConfirmStep +
            "ConfirmStep" +
            APISET +
            `&transactionId=${data.transactionId}`,
        data,
    )
        .then((res) => {
            res && call(res);
            if (res.isSuccess) {
                message.success(
                    "订单成立！交易正在进行中，您的存款将在指定时间内到账，感谢您的耐心等待！",
                    5,
                );
            } else {
                message.error("输入的旧账号错误！");
            }
        })
        .catch((error) => {
            console.log("CommonPostConfirmPay error:", error);
            return null;
        });
}

// 提交转账
export function TransferSubmit(data, call) {
    post(ApiPort.POSTTransfer, data)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("TransferSubmit error:", error);
            return null;
        });
}

// 获取用户已绑定银行卡
export function GetMemberBanks(call) {
    get(ApiPort.GETMemberBanksfirst)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("GetMemberBanks error:", error);
            return null;
        });
}

// 获取提款方式
export function GetWithdrawalMethods(call) {
    get(ApiPort.GETCanWithdrawalPay)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("GetWithdrawalMethods error:", error);
            return null;
        });
}

//获取提现泰达币的汇率
export function GetWithdrawalExchangeRate(data, call) {
    get(
        ApiPort.GetExchangeRate +
            "?CurrencyFrom=" +
            data.CurrencyFrom +
            "&CurrencyTo=" +
            data.CurrencyTo +
            "&baseAmount=" +
            data.baseAmount +
            APISETS,
    )
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("GetWithdrawalExchangeRate error:", error);
            return null;
        });
}

// 获取某个方式的提款详情
export function GETWithdrawalDetails(data, type, call) {
    get(
        ApiPort.GETWithdrawalDetailsAPI +
            "&method=" +
            data +
            "&MethodCode=" +
            type +
            "&isMobile=false&hostName=" +
            ApiPort.LOCAL_HOST,
    )
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("GETWithdrawalDetails error:", error);
            return null;
        });
}

// 查询会员虚拟货币錢包
export function CheckExchangeRateWallet(data, call) {
    get(
        ApiPort.CheckExchangeRateWallet +
            "?cryptoCurrencyCode=" +
            data.CryptoCurrencyCode +
            APISETS,
    )
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("CheckExchangeRateWallet error:", error);
            return null;
        });
}

// 添加虚拟货币錢包
export function AddExchangeRateWallets(data, call) {
    post(ApiPort.AddExchangeRateWallet, data)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("AddExchangeRateWallet error:", error);
            return null;
        });
}

//设置默认钱包
export function setTDBDefaultWallet(data, call) {
    patch(`${ApiPort.setTDBDefaultWallet}${APISET}&walletId=${data.WalletID}`)
        .then((res) => {
            call(res);
        })
        .catch((erros) => {
            console.log("setTDBDefaultWallet error:", error);
            return null;
        });
}

//用户的提款户口达到了限制设定
export function getWithdrawalSetUp(data, call) {
    get(
        ApiPort.CheckWithdrawalThreshold +
            "?BankAccountNumber=" +
            data.BankAccountId +
            APISETS,
    )
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}
//虚例币支付二取消交易我已成功充值提交
export function InvoiceAutDeposit(data, call) {
    post(
        ApiPort.InvoiceAutCryptoDeposit +
            "?transactionID=" +
            data.transactionID +
            "&transactionHash=" +
            data.transactionHash +
            APISETS,
    )
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("InvoiceAutCryptoDeposit error:", error);
            return null;
        });
}

//虚例币支付二取消交易
export function CancelTheDealMethod(data, call) {
    post(
        ApiPort.InvoiceAutCancelTheDeal +
            "?transactionId=" +
            data.transactionId +
            APISETS,
    )
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("虚例币支付二取消交易:", error);
            return null;
        });
}

// 上传文件
export function PostUploadAttachment(data, call) {
    post(ApiPort.UploadAttachment, data)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("PostUploadAttachment error:", error);
            return null;
        });
}
