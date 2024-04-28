import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal } from "antd";
import { translate } from "$ACTIONS/Translate";
import {
    getPromotionCategories,
    getPromotionList,
} from "$ACTIONS/promotionRequest";
import { post } from "$ACTIONS/TlcRequest";
import {ApiPort} from "$ACTIONS/TLCAPI";

export default function RegisterBonus() {
    const [visible, setVisible] = useState(false);
    const [check, setCheck] = useState(false);
    const [promotions, setPromotion] = useState(
        [
            {promoId:"",promoTitle:"Thưởng Đăng Ký 100% Thể Thao/ E-sports"},
            {promoId:"",promoTitle:"Thưởng Đăng Ký 100% Mọi Sảnh Casino"},
            {promoId:"",promoTitle:"Thưởng Đăng Ký 100% Tất Cả Trò Chơi Slot"}
        ]
    );
    const [bonusId, setBonusId] = useState("-99");
    const [currentIndex, setCurrentIndex] = useState(-1);
    const PROMITION_TYPE = "New member"; //新注册会员的优惠类型
    const registerEvent = typeof window !=="undefined" && !!sessionStorage.getItem("isRegisterEvent") && sessionStorage.getItem("isRegisterEvent");
    useEffect(async () => {
        const isRegisterEvent =
            registerEvent &&
            localStorage.getItem("access_token") &&
            !sessionStorage.getItem("depositLater");
        if (!isRegisterEvent) return;

        // 注册优惠暂时写死,这个API获取用不到了，先保留
        // const [promotions, appliedHistories] = await Promise.all([
        //     getPromotionList(),
        //     getPromotionCategories(),
        // ]);
        // if (promotions && appliedHistories) {
            setVisible(true);
        // }
        // let categories, data;
        // if (
        //     appliedHistories &&
        //     Array.isArray(appliedHistories) &&
        //     appliedHistories.length
        // ) {
        //     categories = appliedHistories.filter(
        //         (item) => item.PromoCatCode === PROMITION_TYPE
        //     );
        // }
        // if (promotions && Array.isArray(promotions) && promotions.length) {
        //     data = promotions.filter((item) =>
        //         item.category.includes(PROMITION_TYPE)
        //     );
        // }
        // categories && setPromotion(data);
    }, [registerEvent]);

    const navigationPage = () => {
        let key = 'wallet:{"type": "deposit"}';
        if(Number(bonusId) > 0){
            key = 'wallet:{"type": "deposit", "bonusId":  '+ bonusId + "}";
        }
        global.showDialog({
            key
        });
        setVisible(false);
        welcomeCall();
        sessionStorage.setItem("depositLater",true)
    };
    const welcomeCall =()=>{
        post(ApiPort.PostWelcomeCall + "&isWelcomeCall=" + check)
            .then((res)=>{
                console.log(res)
            })
    }
    const disabled = Number(bonusId) > 0 || promotions && !promotions.length;
    return (
        <Modal
            visible={visible}
            centered={true}
            closable={false}
            className="modal-pubilc RegisterBonus-modal"
            width={500}
            footer={[
                <Button
                    size="large"
                    type="primary"
                    onClick={() => {
                        navigationPage();
                    }}
                    block
                    // disabled={!disabled}
                >
                    {translate("立即存款")}
                </Button>,
                <Button
                    size="large"
                    type="link"
                    onClick={() => {
                        setVisible(false);
                        welcomeCall();
                        sessionStorage.setItem("depositLater",true)
                    }}
                    block
                >
                    {translate("稍后存款")}
                </Button>,
            ]}
        >
            <Row type="flex" align="middle" justify="center">
                <Col className="headtext">
                    {/* {translate("欢迎FUN88新会员")}
                    <br />
                    {translate("极具吸引力的充值促销高达 8,888,888 VND")} */}
                </Col>
                {promotions.length ? (
                    promotions.map((item, index) => {
                        if (index === 3) return;
                        return (
                            <Col
                                key={item.promoId+index}
                                span={18}
                                className={`havePromotion 
                                    ${
                                        currentIndex === index ? "active" : ""
                                    }
                                `}
                                // onClick={() => {
                                //     setBonusId(item.promoId);
                                //     setCurrentIndex(index);
                                // }}
                            >
                                {item.promoTitle}
                            </Col>
                        );
                    })
                ) : (
                    <Col span={18}></Col>
                )}

                <Col span={18} className="check-box">
                    <div
                        className="ant-checkbox-group ant-checkbox-group-outline"
                    >
                        <div className="ant-checkbox-wrapper ant-checkbox-wrapper-checked">
                            <span id="usdt_with_hint" className={`ant-checkbox ${check ? "ant-checkbox-checked" :""}`}>
                                <input
                                    type="checkbox"
                                    className="ant-checkbox-input"
                                    onClick={() => setCheck(!check)}
                                />
                                <span
                                    className="ant-checkbox-inner"
                                    style={{ borderRadius: "5px" }}
                                />
                            </span>
                            <span>{translate("我同意接听咨询电话")}</span>
                        </div>
                    </div>
                </Col>
                {check && (
                    <Col span={18}>
                        {translate(
                            "我们的客户服务部门将在接下来的24小时内通过您注册的电话号码+852或00852与您联系。谢谢！"
                        )}
                    </Col>
                )}
            </Row>
        </Modal>
    );
}
