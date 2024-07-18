import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import ImageWithFallback from "@/ImageWithFallback/";
import { isWebPSupported } from "$ACTIONS/helper";
import { translate } from "$ACTIONS/Translate";

export default function WelcomeBanne() {
    const [visible, setCheck] = useState(false);
    // const [userName, setUserName] = useState("");
    // const name = typeof window !=="undefined" && !!localStorage.getItem("UserName") && localStorage.getItem("UserName");
    // const registerEvent = typeof window !=="undefined" && !!sessionStorage.getItem("isRegisterEvent") && sessionStorage.getItem("isRegisterEvent");
    useEffect(() => {
        !localStorage.getItem(`WelcomeBanne`) &&
            // localStorage.getItem("access_token") &&
            // registerEvent &&
            setCheck(true);
        // setUserName(name);
    }, []);

    return (
        <Modal
            title=""
            closable={false}
            className="modal-pubilc WelcomeBanne"
            zIndex={2001}
            visible={visible}
            onOk={() => {
                setCheck(false);
            }}
            onCancel={() => {
                setCheck(false);
            }}
            width={600}
            footer={null}
            centered={true}
            maskClosable={false}
        >
            <ImageWithFallback
                src={`/vn/img/home/WelcomeBanner${
                    isWebPSupported() ? ".webp" : "jpg"
                }`}
                width={600}
                height={400}
                alt={"乐天堂FUN88全新升级"}
                fallbackSrc="/vn/img/logo/logo.svg"
                local={true}
            />
            <center>
                <Button
                    size="large"
                    type="primary"
                    style={{
                        width: "300px",
                        marginBottom: "30px",
                        marginTop: "30px",
                    }}
                    onClick={() => {
                        setCheck(false);
                        localStorage.setItem(`WelcomeBanne`, true);
                    }}
                >
                    {translate("立即体验")}
                </Button>
            </center>
        </Modal>
    );
}
