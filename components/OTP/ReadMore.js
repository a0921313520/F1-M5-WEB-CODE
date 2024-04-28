/*
 * @Author: Alan
 * @Date: 2023-02-16 15:34:36
 * @LastEditors: Alan
 * @LastEditTime: 2023-02-21 09:28:48
 * @Description: 头部注释
 * @FilePath: \F1-M1-WEB-Code\components\OTP\ReadMore.js
 */
import React from "react";
import { Row, Col, Button } from "antd";
import {translate} from "$ACTIONS/Translate";

function ReadMore({ setReadStep }) {
    return (
        <React.Fragment>
            <Row>
                <Col span={24}>
                    {/* <img
                        className="otp-modal-banner"
                        src="/vn/img/user/otpVerify/otp-banner.jpg"
                        alt=""
                    /> */}
                    <div className="otp-modal-description">
                        <div>{translate("尊敬的会员")},</div>
                        <br />
                        <div>
                            {translate("Fun88始终以最优质的服务标准为目标。 为了打造一个有信誉、安全的游乐场所，Fun88不断完善会员的信息安全体系。 因此，Fun88鼓励会员验证电子邮箱和电话号码，以增强账户安全。 会员登录后，Fun88将通过电子邮件或短信发送确认码。")}
                        </div>
                        <br />
                        <p style={{ margin: 0 }}>
                            {translate("如果会员对确认码有疑问，请联系在线支持。")}
                        </p>
                        <br />
                        <p>
                            {translate("Fun88 一直在不断改进，以提供流畅、安全的游戏体验。 衷心感谢会员们长期以来的配合与陪伴。")}
                        </p>
                        <p style={{ margin: 0 }}>{translate("FUN88")}</p>
                    </div>
                </Col>
            </Row>

            <Button
                size="large"
                className="otpBtn readMore securityAnnouncement"
                onClick={() => {
                    setReadStep(0);
                    Pushgtagdata("Back_loginOTP");
                }}
                block
            >
                {translate("立即验证")}
            </Button>
        </React.Fragment>
    );
}

export default ReadMore;
