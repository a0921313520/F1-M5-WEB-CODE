/**
 * 个人中心（me）页key对应的 page路由
 */
export const pathNameList = {
    userinfo: "account-info",
    bankaccount: "bank-account",
    securitycheck: "verifications",
    createsecuritycode: "security-code",
    uploadFiles: "upload-files",
    message: "notification",
    records: "transaction-record",
    betrecords: "betting-record",
    addresses: "shipment-address",
};

/**
 * OTP 验证对应的 serveraction
 */
export const otpServiceActionList = {
    "login-otp": "OTP", //login otp
    "login-otpPwd": "Revalidate", //login otp + 修改密码
    "memberProfile-otp": "ContactVerification", //个人资料页 / 个人中心账户验证页
    "cry-otp": "CryptoWallet", //添加usdt 钱包
    "recommendFriend-otp": "ContactVerification", //推荐好友
    "withdraw-otp": "WithdrawalVerification", //提款验证
};
