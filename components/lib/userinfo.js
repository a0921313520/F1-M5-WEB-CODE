import { get, put, patch } from "$SERVICES/TlcRequest";
import { ApiPort } from "$SERVICES/TLCAPI";
import { realyNameReg } from "$SERVICESreg";
import store from "../../redux/store";
import { userCenterActions } from "$STORE/userCenterSlice";

// 获取用户账户信息以及设置为LocalStorage
export function getMemberInfo(call, refresh) {
    const localMemberInfo = localStorage.getItem("memberInfo");
    let memberInfoIsLoad = [0, 0];
    let memberInfo = {};

    if (localMemberInfo === null || localMemberInfo === "" || refresh) {
        get(ApiPort.GETMemberlistAPI)
            .then((res) => {
                localStorage.setItem(
                    "memberCode",
                    res.result.memberInfo.memberCode
                );
                memberInfoIsLoad.splice(0, 1, 1);

                if (res && res.isSuccess) {
                    res.result.memberInfo.contacts.forEach((val) => {
                        res.result.memberInfo["isVerified" + val.contactType] =
                            [val.contact, val.status === "Verified"];
                    });

                    const { isVerifiedEmail, isVerifiedPhone } =
                        res.result.memberInfo;
                    /* 提款验证步骤 */
                    if (isVerifiedEmail && !isVerifiedEmail[1]) {
                        /* 第1步 邮箱验证 */
                        res.result.memberInfo.withdrawalVerifyStep = 1;
                    } else if (isVerifiedPhone && !isVerifiedPhone[1]) {
                        /* 第2步 手机验证 */
                        res.result.memberInfo.withdrawalVerifyStep = 2;
                    } else {
                        /* 提款验证完成 */
                        res.result.memberInfo.withdrawalVerifyStep = false;
                    }
                    Object.assign(
                        memberInfo,
                        res.result.memberInfo,
                        res.result.memberNewInfo
                    );
                }
                const memberInfoString = JSON.stringify(memberInfo);
                localStorage.setItem(
                    "memberInfo",
                    memberInfoString === "{}" ? "" : memberInfoString
                );
                store.dispatch(
                    userCenterActions.setMemberInfo(
                        memberInfoString === "{}" ? {} : memberInfo
                    )
                );
                if (typeof _paq === "object") {
                    _paq.push(["setUserId", memberInfo.memberCode]);
                }

                // if (checkIsRemoveShaba(memberInfo.registerDate)) {
                //     const updateHide = setGameHideAction("OWS");
                //     store.dispatch(updateHide);
                // }

                //首选钱包
                localStorage.setItem("PreferWallet", memberInfo.preferWallet);

                call(memberInfo);
            })
            .catch((error) => {
                console.log("getMemberInfo(GETMemberlistAPI) error:", error);
                return null;
            });
    } else {
        call(JSON.parse(localMemberInfo));
    }
}

// 设置用户真实姓名
export function setUserRealyName(name, call) {
    if (name === "") {
    }
    if (!realyNameReg.test(name)) {
        return;
    }

    patch(ApiPort.PATCHMemberlistAPI, {
        key: "FirstName",
        value1: name,
    })
        .then((res) => {
            if (res) {
                if (res.isSuccess == true) {
                } else if (res.isSuccess == false) {
                }
                call(res);
            }
        })
        .catch((error) => {
            console.log("setUserRealyName error:", error);
            return null;
        });
}

export function setMemberInfo(data, call) {
    patch(ApiPort.PUTMemberlistAPI, data)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("setMemberInfo error:", error);
            return null;
        });
}

// 获取密保问题
export function getQuestion(call) {
    get(ApiPort.GetQuestions)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("getQuestion error:", error);
            return null;
        });
}

/**
 * @description: 提交地址 生日 资料 提款验证
 * @param {*} userInfo
 * @param {*} call
 * @return {*}
 */
export function setMemberInfoPut(data, call) {
    put(ApiPort.PUTMemberlistAPI, data)
        .then((res) => {
            call(res);
        })
        .catch((error) => {
            console.log("setMemberInfo error:", error);
            return null;
        });
}
