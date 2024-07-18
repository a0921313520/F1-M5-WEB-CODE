/*
 * @Author: Alan
 * @Date: 2023-03-22 14:34:19
 * @LastEditors: Alan
 * @LastEditTime: 2023-03-28 11:44:16
 * @Description: 超过验证次数
 * @FilePath: \F1-M1-WEB-Code\components\OTP\ExceedVerify.js
 */
import React from "react";
import { Row, Col, Button, Modal } from "antd";
import { translate } from "$ACTIONS/Translate";

function ExceedVerify({ exceedVisible, onCancel }) {
    return (
        <Modal
            title={translate("验证次数超出")}
            className="modal-pubilc exceed-modal"
            visible={exceedVisible}
            closable={false}
            onCancel={onCancel}
            centered={true}
            width={400}
            zIndex={1600}
            keyboard={false}
            maskClosable={false}
            footer={[
                <Button
                    size="large"
                    onClick={() => {
                        onCancel();
                    }}
                >
                    {translate("关闭")}
                </Button>,
                <Button
                    size="large"
                    type="primary"
                    onClick={() => global.PopUpLiveChat()}
                >
                    {translate("在线客服")}
                </Button>,
            ]}
        >
            <Row>
                <Col span={24}>
                    <img
                        className="otp-warn"
                        src={`${process.env.BASE_PATH}/img/icons/icon-warn.svg`}
                        alt="icon-warn"
                    />
                    <h3 className="otp-modal-title">
                        {translate("你超过了允许的验证次数")}
                    </h3>
                    <div className="otp-cs-tip-exceed">
                        {translate(
                            "您的验证尝试次数已超过 5 次。 请在 24 小时后重试或联系在线聊天",
                        )}
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}

export default ExceedVerify;
