import React, { useState, useEffect } from "react";
import { Steps, Spin, Modal } from "antd";
import EmailVerify from "./WithdrawalVerify/EmailVerify";
import PhoneVerify from "./WithdrawalVerify/PhoneVerify";
import ExceedVerify from "@/OTP/ExceedVerify";
import {translate} from "$ACTIONS/Translate";

const { Step } = Steps;
function OtpPopUp({
    otpVisible,
    otpModal,
    otpParam,
    memberInfo,
    getMemberData,
    readStep,
    coloseVisible,
}) {
    const [attemptRemaining, setAttemptRemaining] = useState(5); // 电话剩餘次數
    const [emailattemptRemaining, setEmailAttemptRemaining] = useState(5); // 邮箱剩餘次數
    const [exceedVisible,setExceedVisible] = useState(false);   // otp 超過驗證次數判斷

    const prams = {
        // 引用參數
        memberInfo: memberInfo && memberInfo,
        otpParam: otpParam,
        attemptRemaining: attemptRemaining,
        setAttemptRemaining: setAttemptRemaining,
        emailattemptRemaining: emailattemptRemaining,
        setEmailAttemptRemaining: setEmailAttemptRemaining,
        otpModal: otpModal,
    };
    const title = readStep == 1 ? translate("认证方式电子邮件") : translate("电话号码认证");
    return (
        <React.Fragment>
            <Modal
                title={title}
                className={`modal-pubilc modal-otpVerification`}
                visible={otpVisible}
                closable={true}
                centered={true}
                width={400}
                footer={null}
                onCancel={() => {
                    otpModal();
                }}
            >
                <div className="WithdrawalVerification">
                    <div className="VerificationSteps">
                        <Steps current={readStep - 1}>
                            <Step />
                            <Step />
                        </Steps>
                    </div>
                    {/* 邮箱验证 */}
                    {readStep == 1 && (
                        <EmailVerify
                            {...prams}
                            getMemberData={()=>{getMemberData()}}
                            setExceedVisible={()=>{setExceedVisible(true),this.props.coloseVisible()}}
                        />
                    )}
                    {/* 手机验证 */}
                    {readStep == 2 && (
                        <PhoneVerify
                            {...prams}
                            getMemberData={()=>{getMemberData()}}
                            setExceedVisible={()=>{setExceedVisible(true),this.props.coloseVisible()}}
                        />
                    )}
                </div>
            </Modal>

            {/* otp 超過次數彈窗 */}
            {exceedVisible && <ExceedVerify 
                exceedVisible={exceedVisible}
                onCancel={() => {
                    setExceedVisible(false);
                    setTimeout(() => {
                        global.globalExit();
                    }, 1500);
                }}
                setExceedVisible={()=>{setExceedVisible(true),this.props.coloseVisible()}}
            />}
        </React.Fragment>
    );
}

export default OtpPopUp;
